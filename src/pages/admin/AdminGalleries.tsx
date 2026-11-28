import { useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, ExternalLink, Replace, Star, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { vehicles } from "@/data/vehicles";
import { stays } from "@/data/stays";
import { tours } from "@/data/tours";
import { stayListing, vehicleListing, stayPath, vehiclePath } from "@/data/listings";
import { LISTING_PHOTO_BUCKET, useListingPhotoRows, type ListingKind } from "@/hooks/useListingPhotos";

type Option = { kind: ListingKind; slug: string; name: string; path: string; existing: number };

const SERVICES: Option[] = [
  { kind: "service", slug: "airport-transfer", name: "Airport transfers", path: "/airport-transfers", existing: 0 },
  { kind: "service", slug: "yacht-charter", name: "Yacht charters", path: "/lifestyle", existing: 0 },
  { kind: "service", slug: "secure-transport", name: "Secure transport", path: "/security", existing: 0 },
];

const options: Option[] = [
  ...vehicles.map((v) => ({ kind: "vehicle" as const, slug: v.slug, name: v.name, path: vehiclePath(v.slug), existing: vehicleListing(v).photos.length })),
  ...stays.map((s) => ({ kind: "stay" as const, slug: s.slug, name: s.name, path: stayPath(s), existing: stayListing(s).photos.length })),
  ...tours.filter((t) => t.slug !== "builder").map((t) => ({ kind: "tour" as const, slug: t.slug, name: t.label, path: `/tours/${t.slug}`, existing: 1 + t.packages.filter((p) => p.image).length })),
  ...SERVICES,
];

/** Downscale to at most 2400px wide WebP so phones load photos quickly; originals are not needed on the site. */
async function optimise(file: File): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 2400 / Math.max(bmp.width, bmp.height));
    if (scale === 1 && file.size < 1_500_000) return file;
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    return await new Promise<Blob>((res) => c.toBlob((b) => res(b ?? file), "image/webp", 0.86));
  } catch { return file; }
}

const AdminGalleries = () => {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const key = params.get("item") ?? `${options[0].kind}:${options[0].slug}`;
  const selected = options.find((o) => `${o.kind}:${o.slug}` === key) ?? options[0];
  const filtered = useMemo(() => options.filter((o) => o.name.toLowerCase().includes(q.toLowerCase())), [q]);
  const { data: rows = [], isLoading, error } = useListingPhotoRows(selected.kind, selected.slug);
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);
  const [replacing, setReplacing] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { caption: string; alt_text: string }>>({});
  const invalidate = () => qc.invalidateQueries({ queryKey: ["listing-photos", selected.kind, selected.slug] });

  const upload = async (file: File) => {
    const blob = await optimise(file);
    const ext = blob.type === "image/webp" ? "webp" : (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${selected.kind}/${selected.slug}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from(LISTING_PHOTO_BUCKET).upload(path, blob, { contentType: blob.type || file.type });
    if (error) throw error;
    return path;
  };

  const add = useMutation({
    mutationFn: async (files: File[]) => {
      let order = rows.length ? Math.max(...rows.map((r) => r.sort_order)) + 1 : 0;
      for (const f of files) {
        const path = await upload(f);
        const { error } = await supabase.from("listing_photos").insert({ listing_kind: selected.kind, listing_slug: selected.slug, storage_path: path, sort_order: order++, alt_text: `${selected.name} in Cape Town` });
        if (error) throw error;
      }
    },
    onSuccess: () => { toast.success("Photos added"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Record<string, unknown> }) => {
      const { error } = await supabase.from("listing_photos").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (row: { id: string; storage_path: string }) => {
      const { error } = await supabase.from("listing_photos").delete().eq("id", row.id);
      if (error) throw error;
      await supabase.storage.from(LISTING_PHOTO_BUCKET).remove([row.storage_path]);
    },
    onSuccess: () => { toast.success("Photo removed"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const replace = useMutation({
    mutationFn: async ({ row, file }: { row: { id: string; storage_path: string }; file: File }) => {
      const path = await upload(file);
      const { error } = await supabase.from("listing_photos").update({ storage_path: path }).eq("id", row.id);
      if (error) throw error;
      await supabase.storage.from(LISTING_PHOTO_BUCKET).remove([row.storage_path]);
    },
    onSuccess: () => { toast.success("Photo replaced"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const setCover = useMutation({
    mutationFn: async (id: string) => {
      const { error: e1 } = await supabase.from("listing_photos").update({ is_cover: false }).eq("listing_kind", selected.kind).eq("listing_slug", selected.slug);
      if (e1) throw e1;
      const { error } = await supabase.from("listing_photos").update({ is_cover: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Cover photo set"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const move = async (i: number, dir: -1 | 1) => {
    const a = rows[i], b = rows[i + dir];
    if (!a || !b) return;
    const ao = a.sort_order === b.sort_order ? i : a.sort_order;
    const bo = a.sort_order === b.sort_order ? i + dir : b.sort_order;
    await update.mutateAsync({ id: a.id, patch: { sort_order: bo } });
    await update.mutateAsync({ id: b.id, patch: { sort_order: ao } });
  };

  const busy = add.isPending || replace.isPending;
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl">Listing photos</h1>
        <p className="text-sm text-muted-foreground mt-1">Add photos to any vehicle, stay, tour or service. Your photos show first on the public page, followed by the photos already on the site.</p>
      </header>
      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="space-y-3 min-w-0">
          <Input placeholder="Search listings" value={q} onChange={(e) => setParams((p) => { const n = new URLSearchParams(p); n.set("q", e.target.value); return n; }, { replace: true })} />
          <ul className="max-h-[60vh] overflow-y-auto border border-border/50 divide-y divide-border/40">
            {filtered.map((o) => {
              const k = `${o.kind}:${o.slug}`;
              return (
                <li key={k}>
                  <button type="button" onClick={() => setParams((p) => { const n = new URLSearchParams(p); n.set("item", k); return n; })}
                    className={`w-full text-left px-3 py-2 text-sm ${k === key ? "bg-primary/15 text-foreground" : "hover:bg-muted/40 text-muted-foreground"}`}>
                    <span className="block truncate">{o.name}</span>
                    <span className="text-[10px] uppercase tracking-[0.18em]">{o.kind} · {o.existing} site photo{o.existing === 1 ? "" : "s"}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>
        <section className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-serif text-2xl truncate">{selected.name}</h2>
              <Link to={selected.path} target="_blank" className="text-xs text-gold inline-flex items-center gap-1">{selected.path} <ExternalLink className="h-3 w-3" /></Link>
            </div>
            <Button onClick={() => fileRef.current?.click()} disabled={busy}><Upload className="h-4 w-4 mr-2" />{busy ? "Uploading…" : "Add photos"}</Button>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple hidden aria-label="Add photos"
              onChange={(e) => { const f = Array.from(e.target.files ?? []); e.target.value = ""; if (f.length) add.mutate(f); }} />
            <input ref={replaceRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" hidden aria-label="Replace photo"
              onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; const row = rows.find((r) => r.id === replacing); if (f && row) replace.mutate({ row, file: f }); }} />
          </div>
          {isLoading && <p className="text-sm text-muted-foreground">Loading photos…</p>}
          {error && <p className="text-sm text-destructive">Couldn't load photos: {(error as Error).message}</p>}
          {!isLoading && !rows.length && <p className="text-sm text-muted-foreground border border-dashed border-border/60 p-6">No added photos yet — the page shows its {selected.existing} existing photo{selected.existing === 1 ? "" : "s"}. Use “Add photos” to upload more.</p>}
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {rows.map((r, i) => {
              const d = drafts[r.id] ?? { caption: r.caption ?? "", alt_text: r.alt_text ?? "" };
              const dirty = d.caption !== (r.caption ?? "") || d.alt_text !== (r.alt_text ?? "");
              return (
                <li key={r.id} className="border border-border/50 bg-surface-raised">
                  <div className="relative aspect-[4/3] bg-muted">
                    <img src={r.url} alt={r.alt_text ?? ""} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                    {r.is_cover && <span className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-0.5 text-[10px] uppercase tracking-[0.18em]">Cover</span>}
                  </div>
                  <div className="p-3 space-y-2">
                    <Input placeholder="Caption (optional)" maxLength={300} value={d.caption} onChange={(e) => setDrafts((p) => ({ ...p, [r.id]: { ...d, caption: e.target.value } }))} />
                    <Input placeholder="Alt text (describe the photo)" maxLength={300} value={d.alt_text} onChange={(e) => setDrafts((p) => ({ ...p, [r.id]: { ...d, alt_text: e.target.value } }))} />
                    {dirty && <Button size="sm" className="w-full" onClick={() => update.mutate({ id: r.id, patch: { caption: d.caption.trim() || null, alt_text: d.alt_text.trim() || null } }, { onSuccess: () => toast.success("Saved") })}>Save text</Button>}
                    <div className="flex flex-wrap gap-1">
                      <Button size="icon" variant="outline" aria-label="Move earlier" disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp className="h-4 w-4" /></Button>
                      <Button size="icon" variant="outline" aria-label="Move later" disabled={i === rows.length - 1} onClick={() => move(i, 1)}><ArrowDown className="h-4 w-4" /></Button>
                      <Button size="icon" variant="outline" aria-label="Set as cover" disabled={r.is_cover} onClick={() => setCover.mutate(r.id)}><Star className="h-4 w-4" /></Button>
                      <Button size="icon" variant="outline" aria-label="Replace photo" onClick={() => { setReplacing(r.id); replaceRef.current?.click(); }}><Replace className="h-4 w-4" /></Button>
                      <Button size="icon" variant="outline" aria-label="Remove photo" onClick={() => { if (confirm("Remove this photo?")) remove.mutate(r); }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
};
export default AdminGalleries;
