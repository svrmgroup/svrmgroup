// Turns pasted itinerary text (WhatsApp, email, booking notes) into structured days.
// Admin-only: requires a signed-in admin.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const nstr = { type: ["string", "null"] } as const;
const schema = {
  type: "object",
  additionalProperties: false,
  required: ["client_name", "guests", "accommodation", "vehicle", "destination", "days", "notes"],
  properties: {
    client_name: nstr,
    guests: nstr,
    accommodation: nstr,
    vehicle: nstr,
    destination: nstr,
    notes: { type: "array", items: { type: "string" } },
    days: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["date", "title", "activities"],
        properties: {
          date: { type: ["string", "null"], description: "ISO date YYYY-MM-DD if known" },
          title: { type: "string", description: "Short elegant day title, e.g. ARRIVAL IN CAPE TOWN" },
          activities: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["time", "title", "description", "pickup", "dropoff", "venue", "vehicle", "confirmation"],
              properties: {
                time: { type: ["string", "null"], description: "24h HH:MM" },
                title: { type: "string" },
                description: { type: "string" },
                pickup: nstr, dropoff: nstr, venue: nstr, vehicle: nstr,
                confirmation: { type: ["string", "null"], description: "flight number or booking ref" },
              },
            },
          },
        },
      },
    },
  },
} as const;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const auth = req.headers.get("Authorization") ?? "";
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: auth } },
    });
    const { data: u } = await sb.auth.getUser();
    if (!u?.user) return json({ error: "Please sign in again." }, 401);
    const { data: role } = await sb.from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
    if (!role) return json({ error: "Admins only." }, 403);

    const body = await req.json().catch(() => ({}));
    const text = typeof body.text === "string" ? body.text.slice(0, 20000) : "";
    const context = typeof body.context === "string" ? body.context.slice(0, 2000) : "";
    if (text.trim().length < 5) return json({ error: "Paste some itinerary text first." }, 400);

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "AI is not configured." }, 500);

    const year = new Date().getFullYear();
    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "fetch" },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        stream: true,
        store: false,
        reasoning: { effort: "low" },
        instructions:
          "You are SVRM Group's concierge. Convert travel notes into a structured luxury itinerary for Cape Town. " +
          "Group items by day in chronological order, sort activities by time. Use only facts present in the text — never invent " +
          "times, flights, prices or venues. Write short polished titles (e.g. 'Private Chauffeur Collection') and one-sentence " +
          `descriptions in a calm premium tone. If a year is missing assume ${year}. Day titles in UPPERCASE.`,
        input: [context ? `Context:\n${context}` : "", `Itinerary text:\n${text}`].filter(Boolean).join("\n\n"),
        text: { format: { type: "json_schema", name: "itinerary", strict: true, schema } },
      }),
    });

    if (!res.ok || !res.body) {
      const detail = await res.text().catch(() => "");
      console.error("gateway", res.status, detail.slice(0, 400));
      const msg = res.status === 429 ? "AI is busy — try again in a moment."
        : res.status === 402 ? "AI credits have run out. Top up in Settings → Plans & credits."
        : "Couldn't structure that text. Please try again.";
      return json({ error: msg }, res.status === 429 || res.status === 402 || res.status === 403 ? res.status : 502);
    }

    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "", out = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const p = line.slice(5).trim();
        if (!p || p === "[DONE]") continue;
        try {
          const e = JSON.parse(p);
          if (e.type === "response.output_text.delta" && typeof e.delta === "string") out += e.delta;
        } catch { /* ignore */ }
      }
    }
    try {
      return json({ result: JSON.parse(out) });
    } catch {
      console.error("bad output", out.slice(0, 300));
      return json({ error: "The AI returned an unexpected result. Please try again." }, 502);
    }
  } catch (e) {
    console.error(e);
    return json({ error: "Something went wrong." }, 500);
  }
});
