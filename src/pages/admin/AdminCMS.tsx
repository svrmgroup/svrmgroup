import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, X, Eye, EyeOff } from "lucide-react";

// ---- Kind configuration ---------------------------------------------------

type LegacyKind = "tours" | "vehicles" | "stays";
type UnifiedKind =
  | "offers"
  | "blogs"
  | "aviation"
  | "yachts"
  | "security"
  | "experiences"
  | "home_hero"
  | "home_intro";
type Kind = LegacyKind | UnifiedKind;

interface KindConfig {
  key: Kind;
  label: string;
  group: "Catalog" | "Marketing" | "Home";
  /** Which fields to expose on the editor form. */
  fields: {
    eyebrow?: boolean;
    summary?: boolean;
    description?: boolean;
    image?: boolean;
    price?: boolean;
    originalPrice?: boolean;
    priceUnit?: boolean; // prefix + suffix
    cta?: boolean;
    category?: boolean;
    categoryOptions?: string[];
    location?: boolean; // stays only
    duration?: boolean; // tours only
    bedrooms?: boolean; // stays only
  };
}

const KINDS: KindConfig[] = [
  { key: "tours", label: "Tours", group: "Catalog", fields: { summary: true, description: true, image: true, price: true, duration: true } },
  { key: "vehicles", label: "Vehicles", group: "Catalog", fields: { summary: true, image: true, price: true, category: true, categoryOptions: ["Signature","Premium SUV","Executive","Everyday","Budget","Group Travel"] } },
  { key: "stays", label: "Stays", group: "Catalog", fields: { summary: true, description: true, image: true, price: true, bedrooms: true, location: true } },
  { key: "aviation", label: "Aviation", group: "Catalog", fields: { summary: true, description: true, image: true, price: true, category: true, categoryOptions: ["Jet","Helicopter"] } },
  { key: "yachts", label: "Yachts", group: "Catalog", fields: { summary: true, description: true, image: true, price: true } },
  { key: "security", label: "Security", group: "Catalog", fields: { summary: true, description: true, image: true, price: true, category: true, categoryOptions: ["Armoured Transport","Close Protection","Residential","Events"] } },
  { key: "experiences", label: "Experiences", group: "Catalog", fields: { summary: true, description: true, image: true, price: true } },
  { key: "offers", label: "Special Offers", group: "Marketing", fields: { eyebrow: true, summary: true, image: true, price: true, originalPrice: true, priceUnit: true, cta: true } },
  { key: "blogs", label: "Blog Posts", group: "Marketing", fields: { eyebrow: true, summary: true, description: true, image: true, category: true, categoryOptions: ["Travel","Tours","Lifestyle","Properties","Insights"] } },
  { key: "home_hero", label: "Home · Hero", group: "Home", fields: { eyebrow: true, summary: true, image: true, cta: true } },
  { key: "home_intro", label: "Home · Intro Blocks", group: "Home", fields: { eyebrow: true, summary: true, description: true, image: true, cta: true } },
];

const isLegacy = (k: Kind): k is LegacyKind => k === "tours" || k === "vehicles" || k === "stays";

// ---- Component ------------------------------------------------------------

interface AnyRow { id: string; slug: string; title: string; summary: string | null; image_url: string | null; published: boolean; sort_order: number; [k: string]: any }

const AdminCMS = () => {
  const [kind, setKind] = useState<Kind>("tours");
  const [rows, setRows] = useState<AnyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<any>({});

  const config = KINDS.find(k => k.key === kind)!;
  const legacyTable = isLegacy(kind) ? `cms_${kind}` : null;

  const load = async () => {
    setLoading(true);
    let data: any[] | null = null;
    let error: any = null;
    if (legacyTable) {
      const r = await (supabase as any).from(legacyTable).select("*").order("sort_order").order("title");
      data = r.data; error = r.error;
    } else {
      const r = await (supabase as any).from("cms_items").select("*").eq("kind", kind).order("sort_order").order("title");
      data = r.data; error = r.error;
    }
    setLoading(false);
    if (error) return toast.error(error.message);
    setRows((data as any) || []);
  };
  useEffect(() => { load(); }, [kind]);

  const openNew = () => {
    setEditing(legacyTable
      ? { published: true, sort_order: 0, currency: "ZAR" }
      : { published: true, sort_order: 0, kind });
    setShow(true);
  };
  const openEdit = (r: AnyRow) => { setEditing({ ...r }); setShow(true); };

  const uploadImage = async (file: File) => {
    const ext = file.name.split(".").pop();
    const path = `${kind}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("cms-media").upload(path, file);
    if (error) return toast.error(error.message);
    const { data } = supabase.storage.from("cms-media").getPublicUrl(path);
    setEditing((e: any) => ({ ...e, image_url: data.publicUrl }));
    toast.success("Image uploaded");
  };

  const save = async () => {
    if (!editing.title?.trim() || !editing.slug?.trim()) return toast.error("Title & slug required");
    const payload: any = { ...editing };
    delete payload.created_at; delete payload.updated_at;

    let error: any;
    if (legacyTable) {
      const r = editing.id
        ? await (supabase as any).from(legacyTable).update(payload).eq("id", editing.id)
        : await (supabase as any).from(legacyTable).insert(payload);
      error = r.error;
    } else {
      payload.kind = kind;
      const r = editing.id
        ? await (supabase as any).from("cms_items").update(payload).eq("id", editing.id)
        : await (supabase as any).from("cms_items").insert(payload);
      error = r.error;
    }
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setShow(false); load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete listing?")) return;
    const table = legacyTable ?? "cms_items";
    await (supabase as any).from(table).delete().eq("id", id);
    load();
  };

  const togglePub = async (r: AnyRow) => {
    const table = legacyTable ?? "cms_items";
    await (supabase as any).from(table).update({ published: !r.published }).eq("id", r.id);
    load();
  };

  const grouped = KINDS.reduce<Record<string, KindConfig[]>>((acc, k) => {
    (acc[k.group] ||= []).push(k); return acc;
  }, {});

  return (
    <div className="space-y-6">
      <header className="flex items-baseline justify-between flex-wrap gap-3">
        <div>
          <p className="eyebrow">Content</p>
          <h1 className="font-serif text-3xl md:text-4xl mt-2">CMS</h1>
          <p className="text-xs text-muted-foreground mt-2">Manage every editable section of the site. New items are merged with the built-in catalog at runtime.</p>
        </div>
        <button onClick={openNew} className="btn-luxury text-xs flex items-center gap-2"><Plus className="h-3.5 w-3.5"/> New {config.label.replace(/s$/,"")}</button>
      </header>

      <div className="space-y-2">
        {Object.entries(grouped).map(([group, kinds]) => (
          <div key={group} className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground w-24">{group}</span>
            {kinds.map(k => (
              <button
                key={k.key}
                onClick={() => setKind(k.key)}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] border ${kind === k.key ? "border-primary bg-primary/10 text-gold" : "border-border/40 text-muted-foreground hover:border-primary/40"}`}
              >{k.label}</button>
            ))}
          </div>
        ))}
      </div>

      <div className="card-luxury overflow-hidden">
        {loading ? <p className="p-6 text-xs text-muted-foreground">Loading…</p> : rows.length === 0 ? (
          <p className="p-6 text-xs text-muted-foreground">No entries yet. Click “New” to add one.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
            {rows.map(r => (
              <div key={r.id} className="border border-border/40 overflow-hidden bg-background/50">
                {r.image_url && <img src={r.image_url} alt={r.title} className="w-full h-32 object-cover"/>}
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{r.title}</p>
                      <p className="text-[10px] text-muted-foreground truncate">/{r.slug}</p>
                    </div>
                    <button onClick={() => togglePub(r)} title={r.published ? "Published" : "Hidden"}>
                      {r.published ? <Eye className="h-4 w-4 text-gold"/> : <EyeOff className="h-4 w-4 text-muted-foreground"/>}
                    </button>
                  </div>
                  {r.summary && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{r.summary}</p>}
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => openEdit(r)} className="btn-ghost text-[10px]"><Pencil className="h-3 w-3 inline mr-1"/>Edit</button>
                    <button onClick={() => del(r.id)} className="text-muted-foreground hover:text-destructive ml-auto"><Trash2 className="h-3.5 w-3.5"/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {show && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-start md:items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-deep border border-border/60 w-full max-w-2xl my-8">
            <div className="p-5 border-b border-border/40 flex items-center justify-between">
              <h2 className="font-serif text-2xl">{editing.id ? "Edit" : "New"} {config.label}</h2>
              <button onClick={() => setShow(false)}><X className="h-5 w-5 text-muted-foreground"/></button>
            </div>
            <div className="p-5 space-y-3">
              <F l="Title *"><input value={editing.title || ""} onChange={e => setEditing({ ...editing, title: e.target.value })} className="input-luxury text-sm w-full"/></F>
              <F l="Slug *"><input value={editing.slug || ""} onChange={e => setEditing({ ...editing, slug: e.target.value.toLowerCase().replace(/\s+/g,"-") })} className="input-luxury text-sm w-full"/></F>

              {config.fields.eyebrow && <F l="Eyebrow / Badge"><input value={editing.eyebrow || ""} onChange={e => setEditing({ ...editing, eyebrow: e.target.value })} className="input-luxury text-sm w-full" placeholder="e.g. Special Offer · Self-drive"/></F>}

              {config.fields.summary && <F l="Summary"><textarea rows={2} value={editing.summary || ""} onChange={e => setEditing({ ...editing, summary: e.target.value })} className="input-luxury text-sm w-full"/></F>}

              {config.fields.description && <F l="Description (long)"><textarea rows={5} value={editing.description || ""} onChange={e => setEditing({ ...editing, description: e.target.value })} className="input-luxury text-sm w-full"/></F>}

              {(config.fields.price || config.fields.originalPrice) && (
                <div className="grid grid-cols-2 gap-3">
                  {config.fields.price && (kind === "tours" ? (
                    <F l="Price from (ZAR)"><input type="number" value={editing.price_from ?? ""} onChange={e => setEditing({ ...editing, price_from: e.target.value === "" ? null : Number(e.target.value) })} className="input-luxury text-sm w-full"/></F>
                  ) : kind === "vehicles" ? (
                    <F l="Price / day (ZAR)"><input type="number" value={editing.price_per_day ?? ""} onChange={e => setEditing({ ...editing, price_per_day: e.target.value === "" ? null : Number(e.target.value) })} className="input-luxury text-sm w-full"/></F>
                  ) : kind === "stays" ? (
                    <F l="Price / night (ZAR)"><input type="number" value={editing.price_per_night ?? ""} onChange={e => setEditing({ ...editing, price_per_night: e.target.value === "" ? null : Number(e.target.value) })} className="input-luxury text-sm w-full"/></F>
                  ) : (
                    <F l="Price (ZAR)"><input type="number" value={editing.price_zar ?? ""} onChange={e => setEditing({ ...editing, price_zar: e.target.value === "" ? null : Number(e.target.value) })} className="input-luxury text-sm w-full" placeholder="Leave blank for On request"/></F>
                  ))}
                  {config.fields.originalPrice && !isLegacy(kind) && (
                    <F l="Original price (strike-through)"><input type="number" value={editing.original_price_zar ?? ""} onChange={e => setEditing({ ...editing, original_price_zar: e.target.value === "" ? null : Number(e.target.value) })} className="input-luxury text-sm w-full"/></F>
                  )}
                  {(kind === "tours" || kind === "vehicles" || kind === "stays") && (
                    <F l="Currency"><input value={editing.currency || "ZAR"} onChange={e => setEditing({ ...editing, currency: e.target.value })} className="input-luxury text-sm w-full"/></F>
                  )}
                </div>
              )}

              {config.fields.priceUnit && !isLegacy(kind) && (
                <div className="grid grid-cols-2 gap-3">
                  <F l="Price prefix"><input value={editing.price_prefix || ""} onChange={e => setEditing({ ...editing, price_prefix: e.target.value })} className="input-luxury text-sm w-full" placeholder="From "/></F>
                  <F l="Price suffix"><input value={editing.price_suffix || ""} onChange={e => setEditing({ ...editing, price_suffix: e.target.value })} className="input-luxury text-sm w-full" placeholder="/ day"/></F>
                </div>
              )}

              {config.fields.duration && kind === "tours" && <F l="Duration"><input value={editing.duration || ""} onChange={e => setEditing({ ...editing, duration: e.target.value })} className="input-luxury text-sm w-full"/></F>}

              {config.fields.category && (
                <F l="Category">
                  {config.fields.categoryOptions ? (
                    <select value={editing.category || ""} onChange={e => setEditing({ ...editing, category: e.target.value })} className="input-luxury text-sm w-full">
                      <option value="">—</option>
                      {config.fields.categoryOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input value={editing.category || ""} onChange={e => setEditing({ ...editing, category: e.target.value })} className="input-luxury text-sm w-full"/>
                  )}
                </F>
              )}

              {config.fields.bedrooms && kind === "stays" && (
                <div className="grid grid-cols-2 gap-3">
                  <F l="Bedrooms"><input type="number" value={editing.bedrooms ?? ""} onChange={e => setEditing({ ...editing, bedrooms: e.target.value === "" ? null : Number(e.target.value) })} className="input-luxury text-sm w-full"/></F>
                  <F l="Location"><input value={editing.location || ""} onChange={e => setEditing({ ...editing, location: e.target.value })} className="input-luxury text-sm w-full"/></F>
                </div>
              )}

              {config.fields.cta && !isLegacy(kind) && (
                <div className="grid grid-cols-2 gap-3">
                  <F l="CTA label"><input value={editing.cta_label || ""} onChange={e => setEditing({ ...editing, cta_label: e.target.value })} className="input-luxury text-sm w-full" placeholder="Reserve now"/></F>
                  <F l="CTA link (path)"><input value={editing.cta_href || ""} onChange={e => setEditing({ ...editing, cta_href: e.target.value })} className="input-luxury text-sm w-full" placeholder="/rentals"/></F>
                </div>
              )}

              {config.fields.image && (
                <F l="Image">
                  <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f); }} className="text-xs"/>
                  {editing.image_url && <img src={editing.image_url} alt="" className="mt-2 h-32 object-cover"/>}
                  <input value={editing.image_url || ""} onChange={e => setEditing({ ...editing, image_url: e.target.value })} placeholder="Or paste an image URL" className="input-luxury text-xs w-full mt-2"/>
                </F>
              )}

              <div className="grid grid-cols-2 gap-3">
                <F l="Sort order"><input type="number" value={editing.sort_order || 0} onChange={e => setEditing({ ...editing, sort_order: Number(e.target.value) })} className="input-luxury text-sm w-full"/></F>
                <label className="flex items-end pb-2 gap-2"><input type="checkbox" checked={!!editing.published} onChange={e => setEditing({ ...editing, published: e.target.checked })}/><span className="text-xs">Published</span></label>
              </div>
            </div>
            <div className="p-5 border-t border-border/40 flex justify-end gap-2">
              <button onClick={() => setShow(false)} className="btn-ghost text-xs">Cancel</button>
              <button onClick={save} className="btn-luxury text-xs">{editing.id ? "Save changes" : "Add"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const F = ({ l, children }: { l: string; children: React.ReactNode }) => (
  <label className="block"><span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{l}</span><div className="mt-1">{children}</div></label>
);

export default AdminCMS;
