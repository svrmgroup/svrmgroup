import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
};
const MAX = 10 * 1024 * 1024;

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return json({ error: "No file provided" }, 400);
    const ext = TYPES[file.type];
    if (!ext) return json({ error: "Only JPG, PNG, WEBP or HEIC images are allowed" }, 400);
    if (file.size <= 0 || file.size > MAX) return json({ error: "Images must be under 10MB" }, 400);

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await admin.storage.from("partner-photos").upload(path, file, { contentType: file.type });
    if (error) {
      console.error("upload failed", error.message);
      return json({ error: "Upload failed" }, 500);
    }
    return json({ path });
  } catch (e) {
    console.error("upload error", (e as Error).message);
    return json({ error: "Upload failed" }, 500);
  }
});
