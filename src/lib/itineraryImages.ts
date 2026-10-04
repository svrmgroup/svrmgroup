import { supabase } from "@/integrations/supabase/client";

const BUCKET = "cms-media";
const urlCache = new Map<string, { url: string; exp: number }>();
const blobCache = new Map<string, Promise<Blob | null>>();
const cropCache = new Map<string, Promise<string | null>>();

export async function uploadItineraryImage(file: File, category = "Experiences", title?: string) {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `itinerary/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  await (supabase as any).from("itinerary_images").insert({ path, category, title: title || file.name.replace(/\.[^.]+$/, ""), tags: [] });
  return path;
}

/** Short-lived signed URL for displaying private images in the admin. */
export async function signedUrl(path: string): Promise<string | null> {
  if (/^https?:|^\//.test(path)) return path;
  const c = urlCache.get(path);
  if (c && c.exp > Date.now()) return c.url;
  const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600);
  if (!data?.signedUrl) return null;
  urlCache.set(path, { url: data.signedUrl, exp: Date.now() + 50 * 60_000 });
  return data.signedUrl;
}

function getBlob(path: string) {
  if (!blobCache.has(path)) {
    blobCache.set(path, (async () => {
      try {
        if (/^https?:|^\//.test(path)) { const r = await fetch(path); return r.ok ? await r.blob() : null; }
        const { data } = await supabase.storage.from(BUCKET).download(path);
        return data ?? null;
      } catch { return null; }
    })());
  }
  return blobCache.get(path)!;
}

/**
 * Cover-crop an image to the requested aspect (w/h) without stretching, and
 * return a JPEG data URL sized for print. Optional `dark` overlay for covers.
 */
export function croppedDataUrl(path: string, aspect: number, maxW = 1600, dark = 0): Promise<string | null> {
  const key = `${path}|${aspect.toFixed(3)}|${maxW}|${dark}`;
  if (!cropCache.has(key)) {
    cropCache.set(key, (async () => {
      const blob = await getBlob(path);
      if (!blob) return null;
      try {
        const bmp = await createImageBitmap(blob);
        const srcA = bmp.width / bmp.height;
        let sw = bmp.width, sh = bmp.height, sx = 0, sy = 0;
        if (srcA > aspect) { sw = bmp.height * aspect; sx = (bmp.width - sw) / 2; }
        else { sh = bmp.width / aspect; sy = (bmp.height - sh) / 2; }
        const outW = Math.min(maxW, Math.round(sw));
        const outH = Math.round(outW / aspect);
        const c = document.createElement("canvas");
        c.width = outW; c.height = outH;
        const ctx = c.getContext("2d")!;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(bmp, sx, sy, sw, sh, 0, 0, outW, outH);
        if (dark > 0) { ctx.fillStyle = `rgba(14,12,10,${dark})`; ctx.fillRect(0, 0, outW, outH); }
        return c.toDataURL("image/jpeg", 0.86);
      } catch { return null; }
    })());
  }
  return cropCache.get(key)!;
}
