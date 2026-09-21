// Generates a personalised chauffeured Cape Town itinerary + vehicle recommendation.
// Public function (no auth) — used by the /chauffeur planner on the website.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface Body {
  startDate?: string;
  endDate?: string;
  days?: number;
  groupSize?: number;
  interests?: string[];
  pickup?: string;
  dropoff?: string;
  luggage?: string;
  notes?: string;
  fleet?: { name: string; tier: string; fromZAR: number; seats?: number; tagline?: string }[];
}

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "vehicle", "days", "notes"],
  properties: {
    summary: { type: "string", description: "2-3 sentence overview of the trip." },
    vehicle: {
      type: "object",
      additionalProperties: false,
      required: ["name", "why", "alternative"],
      properties: {
        name: { type: "string" },
        why: { type: "string" },
        alternative: { type: ["string", "null"] },
      },
    },
    days: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["day", "date", "title", "description", "highlights"],
        properties: {
          day: { type: "number" },
          date: { type: ["string", "null"] },
          title: { type: "string" },
          description: { type: "string" },
          highlights: { type: "array", items: { type: "string" } },
        },
      },
    },
    notes: { type: "array", items: { type: "string" } },
  },
} as const;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const b = (await req.json()) as Body;
    const days = Math.max(1, Math.min(21, Number(b.days) || 7));

    const fleetList = (b.fleet ?? [])
      .map((v) => `- ${v.name} (${v.tier}${v.seats ? `, ${v.seats} seats` : ""}) — R${v.fromZAR}/day chauffeured`)
      .join("\n");

    const prompt = [
      `Build a ${days}-day chauffeured Cape Town itinerary for these guests.`,
      b.startDate ? `Arrival: ${b.startDate}` : null,
      b.endDate ? `Departure: ${b.endDate}` : null,
      `Group size: ${b.groupSize ?? "not stated"}`,
      b.interests?.length ? `Interests: ${b.interests.join(", ")}` : null,
      b.pickup ? `Pickup: ${b.pickup}` : null,
      b.dropoff ? `Drop-off: ${b.dropoff}` : null,
      b.luggage ? `Luggage: ${b.luggage}` : null,
      b.notes ? `Extra notes: ${b.notes}` : null,
      "",
      "SVRM Group fleet to recommend from (recommend exactly one vehicle by name, plus one alternative):",
      fleetList || "Mercedes-Maybach S-Class, Mercedes S-Class, Mercedes GLS, Mercedes V-Class, Range Rover",
      "",
      "Rules: one day object per day, in order. Use real Cape Town and Western Cape places (Atlantic Seaboard,",
      "Cape Peninsula & Cape Point, Boulders Beach, Stellenbosch/Franschhoek Winelands, Table Mountain,",
      "Kirstenbosch, Bo-Kaap, V&A Waterfront, Aquila Big Five safari, Hermanus whales in season).",
      "Match the vehicle to group size and luggage. Never invent prices, discounts or bookings —",
      "say pricing is confirmed on enquiry. Keep the tone calm, discreet and premium. 3-5 highlights per day.",
    ]
      .filter(Boolean)
      .join("\n");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        stream: true,
        reasoning: { effort: "low" },
        instructions:
          "You are SVRM Group's Cape Town travel designer. You plan private chauffeur-driven itineraries.",
        input: prompt,
        text: { format: { type: "json_schema", name: "itinerary", strict: true, schema } },
      }),
    });

    if (!res.ok || !res.body) {
      const detail = await res.text().catch(() => "");
      console.error("gateway error", res.status, detail.slice(0, 500));
      const message =
        res.status === 429
          ? "Our planner is busy right now — please try again in a moment."
          : res.status === 402
            ? "The planner is temporarily unavailable. Please send us your brief on WhatsApp."
            : "We couldn't build that itinerary. Please try again.";
      return new Response(JSON.stringify({ error: message }), {
        status: res.status === 429 ? 429 : 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Read the SSE stream and accumulate the output text.
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let text = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const evt = JSON.parse(payload);
          if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
            text += evt.delta;
          } else if (evt.type === "response.completed" && evt.response?.output_text) {
            const full = Array.isArray(evt.response.output_text)
              ? evt.response.output_text.join("")
              : String(evt.response.output_text);
            if (full.length > text.length) text = full;
          }
        } catch {
          // ignore keep-alives / partial frames
        }
      }
    }

    let itinerary: unknown;
    try {
      itinerary = JSON.parse(text);
    } catch {
      console.error("unparseable model output", text.slice(0, 500));
      return new Response(
        JSON.stringify({ error: "The planner returned an unexpected result. Please try again." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ itinerary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("ai-itinerary failed", err);
    return new Response(JSON.stringify({ error: "Something went wrong. Please try again." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
