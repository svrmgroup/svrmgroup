import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, X, Eye, EyeOff } from "lucide-react";

type CmsKind = "tours" | "vehicles" | "stays";

interface Row { id: string; slug: string; title: string; summary: string | null; image_url: string | null; published: boolean; sort_order: number; }

const AdminCMS = () => {
  const [kind, setKind] = useState<CmsKind>("tours");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<any>({});
  const table = `cms_${kind}`;

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from(table as any).select("*").order("sort_order").order("title");
    setLoading(false);
    if (error) return toast.error(error.message);
    setRows((data as any) || []);
  };
  useEffect(() => { load(); }, [kind]);

  const openNew = () => { setEditing({ published: true, sort_order: 0, currency: "ZAR" }); setShow(true); };
  const openEdit = (r: Row) => { setEditing({ ...r }); setShow(true); };

  const uploadImage = async (file: File) => {
    const ext = file.name.split(".").pop();
    const path = `${kind}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("cms-media").upload(path, file);
    if (error) return toast.error(error.message);
    const { data } = supabase.storage.from("cms-media").getPublicUrl(path);
    setEditing((e: any) => ({ ...e, image_url: data.publicUrl }));
  };

  const save = async () => {
    if (!editing.title?.trim() || !editing.slug?.trim()) return toast.error("Title & slug required");
    const payload = { ...editing };
    delete payload.created_at; delete payload.updated_at;
    const { error } = editing.id
      ? await supabase.from(table as any).update(payload).eq("id", editing.id)
      : await supabase.from(table as any).insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setShow(false); load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete listing?")) return;
    await supabase.from(table as any).delete().eq("id", id);
    load();
  };

  const togglePub = async (r: Row) => {
    await supabase.from(table as any).update({ published: !r.published }).eq("id", r.id);
    load();
  };

  return (
    <div className="space-y-6">
      <header className="flex items-baseline justify-between flex-wrap gap-3">
        <div>
          <p className="eyebrow">Content</p>
          <h1 className="font-serif text-3xl md:text-4xl mt-2">CMS</h1>
          <p className="text-xs text-muted-foreground mt-2">Add or hide listings. Existing catalog stays in code — DB entries merge in at runtime.</p>
        </div>
        <div className="flex gap-2">
          {(["tours","vehicles","stays"] as CmsKind[]).map(k => (
            <button key={k} onClick={() => setKind(k)} className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] border capitalize ${kind === k ? "border-primary bg-primary/10 text-gold" : "border-border/40 text-muted-foreground"}`}>{k}</button>
          ))}
          <button onClick={openNew} className="btn-luxury text-xs flex items-center gap-2"><Plus className="h-3.5 w-3.5"/> New</button>
        </div>
      </header>

      <div className="card-luxury overflow-hidden">
        {loading ? <p className="p-6 text-xs text-muted-foreground">Loading…</p> : rows.length === 0 ? (
          <p className="p-6 text-xs text-muted-foreground">No CMS overrides yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
            {rows.map(r => (
              <div key={r.id} className="border border-border/40 overflow-hidden">
                {r.image_url && <img src={r.image_url} alt={r.title} className="w-full h-32 object-cover"/>}
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{r.title}</p>
                      <p className="text-[10px] text-muted-foreground truncate">/{r.slug}</p>
                    </div>
                    <button onClick={() => togglePub(r)}>{r.published ? <Eye className="h-4 w-4 text-gold"/> : <EyeOff className="h-4 w-4 text-muted-foreground"/>}</button>
                  </div>
                  {r.summary && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{r.summary}</p>}
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => openEdit(r)} className="btn-ghost text-[10px]"><Pencil className="h-3 w-3 inline mr-1"/>Edit</button>
                    <button onClick={() => del(r.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5"/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {show && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-start md:items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-deep border border-border/60 w-full max-w-xl my-8">
            <div className="p-5 border-b border-border/40 flex items-center justify-between">
              <h2 className="font-serif text-2xl capitalize">{editing.id ? "Edit" : "New"} {kind.slice(0,-1)}</h2>
              <button onClick={() => setShow(false)}><X className="h-5 w-5 text-muted-foreground"/></button>
            </div>
            <div className="p-5 space-y-3">
              <F l="Title *"><input value={editing.title || ""} onChange={e => setEditing({ ...editing, title: e.target.value })} className="input-luxury text-sm w-full"/></F>
              <F l="Slug *"><input value={editing.slug || ""} onChange={e => setEditing({ ...editing, slug: e.target.value.toLowerCase().replace(/\s+/g,"-") })} className="input-luxury text-sm w-full"/></F>
              <F l="Summary"><textarea rows={2} value={editing.summary || ""} onChange={e => setEditing({ ...editing, summary: e.target.value })} className="input-luxury text-sm w-full"/></F>
              {kind === "tours" && <F l="Description"><textarea rows={4} value={editing.description || ""} onChange={e => setEditing({ ...editing, description: e.target.value })} className="input-luxury text-sm w-full"/></F>}
              <div className="grid grid-cols-2 gap-3">
                {kind === "tours" && <F l="Price from"><input type="number" value={editing.price_from || ""} onChange={e => setEditing({ ...editing, price_from: Number(e.target.value) || null })} className="input-luxury text-sm w-full"/></F>}
                {kind === "vehicles" && <F l="Price / day"><input type="number" value={editing.price_per_day || ""} onChange={e => setEditing({ ...editing, price_per_day: Number(e.target.value) || null })} className="input-luxury text-sm w-full"/></F>}
                {kind === "stays" && <F l="Price / night"><input type="number" value={editing.price_per_night || ""} onChange={e => setEditing({ ...editing, price_per_night: Number(e.target.value) || null })} className="input-luxury text-sm w-full"/></F>}
                <F l="Currency"><input value={editing.currency || "ZAR"} onChange={e => setEditing({ ...editing, currency: e.target.value })} className="input-luxury text-sm w-full"/></F>
              </div>
              {kind === "tours" && <F l="Duration"><input value={editing.duration || ""} onChange={e => setEditing({ ...editing, duration: e.target.value })} className="input-luxury text-sm w-full"/></F>}
              {kind === "vehicles" && <F l="Category"><input value={editing.category || ""} onChange={e => setEditing({ ...editing, category: e.target.value })} className="input-luxury text-sm w-full"/></F>}
              {kind === "stays" && <div className="grid grid-cols-2 gap-3">
                <F l="Bedrooms"><input type="number" value={editing.bedrooms || ""} onChange={e => setEditing({ ...editing, bedrooms: Number(e.target.value) || null })} className="input-luxury text-sm w-full"/></F>
                <F l="Location"><input value={editing.location || ""} onChange={e => setEditing({ ...editing, location: e.target.value })} className="input-luxury text-sm w-full"/></F>
              </div>}
              <F l="Image">
                <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f); }} className="text-xs"/>
                {editing.image_url && <img src={editing.image_url} alt="" className="mt-2 h-24 object-cover"/>}
              </F>
              <div className="grid grid-cols-2 gap-3">
                <F l="Sort order"><input type="number" value={editing.sort_order || 0} onChange={e => setEditing({ ...editing, sort_order: Number(e.target.value) })} className="input-luxury text-sm w-full"/></F>
                <label className="flex items-end pb-2 gap-2"><input type="checkbox" checked={!!editing.published} onChange={e => setEditing({ ...editing, published: e.target.checked })}/><span className="text-xs">Published</span></label>
              </div>
            </div>
            <div className="p-5 border-t border-border/40 flex justify-end gap-2">
              <button onClick={() => setShow(false)} className="btn-ghost text-xs">Cancel</button>
              <button onClick={save} className="btn-luxury text-xs">{editing.id ? "Save" : "Add"}</button>
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
