import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const GATEWAY = "https://connector-gateway.lovable.dev/google_maps";
// Bias suggestions to greater Cape Town / Winelands.
const CAPE_TOWN_BIAS = { circle: { center: { latitude: -33.95, longitude: 18.6 }, radius: 50000 } };

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

async function gw(path: string, init: RequestInit & { mask?: string }) {
  const res = await fetch(`${GATEWAY}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      "X-Connection-Api-Key": Deno.env.get("GOOGLE_MAPS_API_KEY")!,
      "Content-Type": "application/json",
      ...(init.mask ? { "X-Goog-FieldMask": init.mask } : {}),
    },
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`Maps gateway [${res.status}]: ${text}`);
    let hint = "Google Maps request failed";
    if (res.status === 403) {
      if (text.includes("API_KEY_HTTP_REFERRER_BLOCKED")) hint = "Your Google Maps key is restricted to websites. Set its application restriction to None or IP addresses in Google Cloud.";
      else if (text.includes("API_KEY_SERVICE_BLOCKED")) hint = "Your Google Maps key doesn't allow this API. Enable Places API (New) and Routes API for the key in Google Cloud.";
    }
    throw { status: res.status, body: { error: hint, details: text } };
  }
  return JSON.parse(text);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "unauthorized" }, 401);
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return json({ error: "unauthorized" }, 401);
    const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
    if (!role) return json({ error: "forbidden" }, 403);

    const body = await req.json();
    const token = typeof body.sessionToken === "string" ? body.sessionToken.slice(0, 64) : undefined;

    if (body.action === "autocomplete") {
      const input = String(body.input ?? "").trim().slice(0, 200);
      if (input.length < 3) return json({ suggestions: [] });
      const d = await gw("/places/v1/places:autocomplete", {
        method: "POST",
        mask: "suggestions.placePrediction.placeId,suggestions.placePrediction.text.text",
        body: JSON.stringify({ input, sessionToken: token, locationBias: CAPE_TOWN_BIAS }),
      });
      return json({
        suggestions: (d.suggestions ?? []).filter((s: any) => s.placePrediction).slice(0, 6)
          .map((s: any) => ({ placeId: s.placePrediction.placeId, text: s.placePrediction.text.text })),
      });
    }

    if (body.action === "details") {
      const id = String(body.placeId ?? "");
      if (!/^[\w-]{10,300}$/.test(id)) return json({ error: "bad placeId" }, 400);
      const d = await gw(`/places/v1/places/${id}${token ? `?sessionToken=${encodeURIComponent(token)}` : ""}`, {
        method: "GET", mask: "id,displayName,formattedAddress",
      });
      const name = d.displayName?.text ?? "";
      const addr = d.formattedAddress ?? "";
      return json({ label: name && !addr.startsWith(name) ? `${name}, ${addr}` : addr || name });
    }

    if (body.action === "route") {
      const o = String(body.origin ?? "").trim().slice(0, 300);
      const t = String(body.destination ?? "").trim().slice(0, 300);
      if (o.length < 3 || t.length < 3) return json({ error: "origin and destination required" }, 400);
      const d = await gw("/routes/directions/v2:computeRoutes", {
        method: "POST", mask: "routes.distanceMeters,routes.duration",
        body: JSON.stringify({ origin: { address: o }, destination: { address: t }, travelMode: "DRIVE", routingPreference: "TRAFFIC_AWARE" }),
      });
      const r = d.routes?.[0];
      if (!r || !r.duration) return json({ error: "No driving route found" }, 404);
      return json({ distanceMeters: r.distanceMeters ?? 0, durationSeconds: parseFloat(r.duration) });
    }
    return json({ error: "unknown action" }, 400);
  } catch (e: any) {
    if (e?.status) return json(e.body, e.status);
    console.error(e);
    return json({ error: String(e?.message ?? e) }, 500);
  }
});
