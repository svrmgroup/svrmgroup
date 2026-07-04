import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const SKIP_DOMAINS = ["sentry.io", "wixpress.com", "example.com", "email.com", "domain.com"];
const SKIP_EXT = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
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

    const { website } = await req.json();
    if (!website) return json({ error: "website required" }, 400);

    const FIRECRAWL_KEY = Deno.env.get("FIRECRAWL_API_KEY")!;

    // Try main page + /contact
    const urls = [website, `${website.replace(/\/$/, "")}/contact`];
    const found = new Set<string>();

    for (const url of urls) {
      try {
        const r = await fetch("https://api.firecrawl.dev/v2/scrape", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${FIRECRAWL_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url,
            formats: ["markdown", "links"],
            onlyMainContent: false,
          }),
        });
        const data = await r.json();
        if (!r.ok) continue;
        const text = (data.data?.markdown || data.markdown || "") + " " + JSON.stringify(data.data?.links || data.links || []);
        const matches = text.match(EMAIL_RE) || [];
        for (const m of matches) {
          const lower = m.toLowerCase();
          if (SKIP_DOMAINS.some((d) => lower.endsWith("@" + d) || lower.includes("@" + d))) continue;
          if (SKIP_EXT.some((e) => lower.endsWith(e))) continue;
          if (lower.length > 100) continue;
          found.add(lower);
        }
        if (found.size > 0 && url === website) break; // enough
      } catch { /* skip page */ }
    }

    return json({ emails: Array.from(found) });
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
