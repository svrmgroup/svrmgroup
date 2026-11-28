import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Photo } from "@/data/listings";

export type ListingKind = "vehicle" | "stay" | "tour" | "service";
export const LISTING_PHOTO_BUCKET = "listing-photos";

export interface ListingPhotoRow {
  id: string; listing_kind: string; listing_slug: string; storage_path: string;
  caption: string | null; alt_text: string | null; sort_order: number; is_cover: boolean;
}

/** Signed view URLs for admin-managed photos (the bucket is private but publicly readable). */
export async function signPhotoPaths(paths: string[]): Promise<Record<string, string>> {
  if (!paths.length) return {};
  const { data } = await supabase.storage.from(LISTING_PHOTO_BUCKET).createSignedUrls(paths, 60 * 60 * 24);
  const out: Record<string, string> = {};
  for (const d of data ?? []) if (d.path && d.signedUrl) out[d.path] = d.signedUrl;
  return out;
}

export function useListingPhotoRows(kind: ListingKind, slug: string) {
  return useQuery({
    queryKey: ["listing-photos", kind, slug],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_listing_photos", { _kind: kind, _slug: slug });
      if (error) throw error;
      const rows = (data ?? []) as ListingPhotoRow[];
      const urls = await signPhotoPaths(rows.map((r) => r.storage_path));
      return rows.map((r) => ({ ...r, url: urls[r.storage_path] })).filter((r) => r.url);
    },
    staleTime: 5 * 60 * 1000,
  });
}

/** Admin photos first (cover leading), then the existing approved photos; empty slots never render. */
export function useListingPhotos(kind: ListingKind, slug: string, fallback: Photo[], name: string): Photo[] {
  const { data } = useListingPhotoRows(kind, slug);
  const managed: Photo[] = [...(data ?? [])]
    .sort((a, b) => Number(b.is_cover) - Number(a.is_cover) || a.sort_order - b.sort_order)
    .map((r, i) => ({ src: r.url, fullSrc: r.url, alt: r.alt_text || `${name} — photo ${i + 1}`, caption: r.caption ?? undefined }));
  const seen = new Set(managed.map((p) => p.src));
  return [...managed, ...fallback.filter((p) => p.src && !seen.has(p.src))];
}
