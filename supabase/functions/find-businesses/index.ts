import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY = "https://connector-gateway.lovable.dev/google_maps";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "unauthorized" }, 401);
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return json({ error: "unauthorized" }, 401);
    const { data: role } = await supabase
      .from("user_roles").select("role").eq("user_id", userData.user.id).eq("role", "admin").maybeSingle();
    if (!role) return json({ error: "forbidden" }, 403);

    const { query, location, radius } = await req.json();
    if (!query || typeof query !== "string") return json({ error: "query required" }, 400);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
    const GMAPS_KEY = Deno.env.get("GOOGLE_MAPS_API_KEY")!;

    const body: Record<string, unknown> = { textQuery: query, pageSize: 20 };
    if (location?.lat && location?.lng) {
      body.locationBias = {
        circle: {
          center: { latitude: location.lat, longitude: location.lng },
          radius: radius || 5000,
        },
      };
    }

    const res = await fetch(`${GATEWAY}/places/v1/places:searchText`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": GMAPS_KEY,
        "Content-Type": "application/json",
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.primaryTypeDisplayName,places.location",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) return json({ error: data.error?.message || "Places API failed", details: data }, res.status);

    const results = (data.places || []).map((p: any) => ({
      place_id: p.id,
      name: p.displayName?.text || "",
      address: p.formattedAddress || "",
      phone: p.internationalPhoneNumber || p.nationalPhoneNumber || null,
      website: p.websiteUri || null,
      rating: p.rating || null,
      review_count: p.userRatingCount || 0,
      category: p.primaryTypeDisplayName?.text || null,
      lat: p.location?.latitude || null,
      lng: p.location?.longitude || null,
    }));

    return json({ results });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
