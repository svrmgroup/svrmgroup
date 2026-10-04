import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImagePlus, Star, Trash2, ChevronLeft, ChevronRight, Upload, Search, RefreshCw, Loader2 } from "lucide-react";
import { signedUrl, uploadItineraryImage } from "@/lib/itineraryImages";
import { IMAGE_CATEGORIES, type ItImage } from "@/lib/itinerary";

export const inputCls = "w-full bg-background border border-border/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary";

export const Thumb = ({ path, className = "" }: { path: string; className?: string }) => {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => { let on = true; signedUrl(path).then((u) => on && setUrl(u)); return () => { on = false; }; }, [path]);
  return url ? <img src={url} alt="" className={`object-cover ${className}`} /> : <div className={`bg-surface-raised animate-pulse ${className}`} />;
};

interface LibRow { id: string; path: string; title: string | null; category: string; tags: string[] }

/** Upload new or choose from the SVRM image library. Returns storage paths. */
export const ImagePicker = ({ open, onClose, onPick, multiple = true }: { open: boolean; onClose: () => void; onPick: (paths: string[]) => void; multiple?: boolean }) => {
  const [tab, setTab] = useState<"upload" | "library">("upload");
  const [category, setCategory] = useState("Experiences");
  const [rows, setRows] = useState<LibRow[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [sel, setSel] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const { data } = await (supabase as any).from("itinerary_images").select("*").order("created_at", { ascending: false }).limit(500);
    setRows(data || []);
  };
  useEffect(() => { if (open) { setSel([]); load(); } }, [open]);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      const paths: string[] = [];
      for (const f of Array.from(files)) paths.push(await uploadItineraryImage(f, category));
      toast.success(`${paths.length} photo${paths.length > 1 ? "s" : ""} added`);
      onPick(multiple ? paths : paths.slice(0, 1)); onClose();
    } catch (e: any) { toast.error(e.message || "Upload failed"); }
    setBusy(false);
  };

  const saveMeta = async (r: LibRow, patch: Partial<LibRow>) => {
    setRows((rs) => rs.map((x) => x.id === r.id ? { ...x, ...patch } : x));
    await (supabase as any).from("itinerary_images").update(patch).eq("id", r.id);
  };

  const filtered = rows.filter((r) => (cat === "All" || r.category === cat) &&
    (!q || `${r.title} ${r.category} ${(r.tags || []).join(" ")}`.toLowerCase().includes(q.toLowerCase())));

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[88vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-serif">Add photos</DialogTitle></DialogHeader>
        <div className="flex gap-2 mb-4">
          {(["upload", "library"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-xs uppercase tracking-[0.2em] border ${tab === t ? "border-primary text-primary" : "border-border/60 text-muted-foreground"}`}>
              {t === "upload" ? "Upload new photo" : "Choose from SVRM library"}
            </button>
          ))}
        </div>
        {tab === "upload" ? (
          <div className="space-y-4">
            <label className="block text-xs text-muted-foreground">Library category
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls + " mt-1"}>
                {IMAGE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <button disabled={busy} onClick={() => fileRef.current?.click()} className="w-full border border-dashed border-primary/60 py-12 flex flex-col items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              {busy ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : <Upload className="h-6 w-6 text-primary" />}
              {busy ? "Uploading…" : "Tap to choose photos"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" multiple={multiple} hidden onChange={(e) => upload(e.target.files)} />
            <p className="text-[11px] text-muted-foreground">Uploads are saved to your library so you can reuse them on future itineraries.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="h-4 w-4 absolute left-3 top-2.5 text-muted-foreground" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search library…" className={inputCls + " pl-9"} />
              </div>
              <select value={cat} onChange={(e) => setCat(e.target.value)} className={inputCls + " w-40"}>
                <option>All</option>{IMAGE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            {filtered.length === 0 && <p className="text-sm text-muted-foreground py-8 text-center">No photos yet — upload some first.</p>}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filtered.map((r) => {
                const on = sel.includes(r.path);
                return (
                  <div key={r.id} className={`border ${on ? "border-primary" : "border-border/40"}`}>
                    <button className="block w-full" onClick={() => setSel((s) => on ? s.filter((x) => x !== r.path) : multiple ? [...s, r.path] : [r.path])}>
                      <Thumb path={r.path} className="w-full aspect-[4/3]" />
                    </button>
                    <div className="p-2 space-y-1">
                      <input defaultValue={r.title || ""} onBlur={(e) => saveMeta(r, { title: e.target.value })} className="w-full bg-transparent text-xs text-foreground focus:outline-none" placeholder="Title" />
                      <div className="flex gap-1">
                        <select value={r.category} onChange={(e) => saveMeta(r, { category: e.target.value })} className="bg-transparent text-[10px] text-muted-foreground">
                          {IMAGE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                        </select>
                        <input defaultValue={(r.tags || []).join(", ")} onBlur={(e) => saveMeta(r, { tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} placeholder="tags" className="flex-1 min-w-0 bg-transparent text-[10px] text-muted-foreground focus:outline-none" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="sticky bottom-0 bg-background pt-3 flex justify-end">
              <button disabled={!sel.length} onClick={() => { onPick(sel); onClose(); }} className="btn-gold disabled:opacity-40 px-5 py-2 text-xs uppercase tracking-[0.2em] bg-primary text-primary-foreground">
                Add {sel.length || ""} selected
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

/** Editable image strip: main image, caption, reorder (drag or arrows), replace, remove. */
export const ImageStrip = ({ images, onChange, label = "Add photos" }: { images: ItImage[]; onChange: (imgs: ItImage[]) => void; label?: string }) => {
  const [picker, setPicker] = useState<null | { replace?: number }>(null);
  const [drag, setDrag] = useState<number | null>(null);
  const move = (i: number, j: number) => {
    if (j < 0 || j >= images.length) return;
    const n = [...images]; const [x] = n.splice(i, 1); n.splice(j, 0, x); onChange(n);
  };
  return (
    <div>
      {images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <div key={img.path + i} draggable onDragStart={() => setDrag(i)} onDragOver={(e) => e.preventDefault()}
              onDrop={() => { if (drag !== null) move(drag, i); setDrag(null); }}
              className={`w-36 shrink-0 border ${img.main ? "border-primary" : "border-border/40"} bg-background`}>
              <div className="relative">
                <Thumb path={img.path} className="w-36 h-24" />
                <div className="absolute inset-x-0 top-0 flex justify-between p-1">
                  <button title="Main image" onClick={() => onChange(images.map((x, k) => ({ ...x, main: k === i })))} className="bg-black/60 p-1"><Star className={`h-3 w-3 ${img.main ? "fill-primary text-primary" : "text-white"}`} /></button>
                  <div className="flex gap-1">
                    <button title="Replace" onClick={() => setPicker({ replace: i })} className="bg-black/60 p-1"><RefreshCw className="h-3 w-3 text-white" /></button>
                    <button title="Remove" onClick={() => onChange(images.filter((_, k) => k !== i))} className="bg-black/60 p-1"><Trash2 className="h-3 w-3 text-white" /></button>
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 flex justify-between p-1">
                  <button onClick={() => move(i, i - 1)} className="bg-black/60 p-0.5"><ChevronLeft className="h-3 w-3 text-white" /></button>
                  <button onClick={() => move(i, i + 1)} className="bg-black/60 p-0.5"><ChevronRight className="h-3 w-3 text-white" /></button>
                </div>
              </div>
              <input value={img.caption || ""} onChange={(e) => onChange(images.map((x, k) => k === i ? { ...x, caption: e.target.value } : x))} placeholder="Caption (optional)" className="w-full bg-transparent px-2 py-1 text-[11px] focus:outline-none" />
            </div>
          ))}
        </div>
      )}
      <button onClick={() => setPicker({})} className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-primary hover:opacity-80">
        <ImagePlus className="h-3.5 w-3.5" /> {label}
      </button>
      <ImagePicker open={!!picker} multiple={picker?.replace === undefined} onClose={() => setPicker(null)}
        onPick={(paths) => {
          if (picker?.replace !== undefined) onChange(images.map((x, k) => k === picker.replace ? { ...x, path: paths[0] } : x));
          else onChange([...images, ...paths.map((p) => ({ path: p }))]);
        }} />
    </div>
  );
};
