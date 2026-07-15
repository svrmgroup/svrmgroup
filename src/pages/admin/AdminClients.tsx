import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star, StarOff, Search } from "lucide-react";
import AdminModal from "@/components/admin/AdminModal";

interface Client {
  id: string; full_name: string; email: string | null; phone: string | null; whatsapp: string | null;
  country: string | null; status: string; vip: boolean; source: string | null; tags: string[];
  notes: string | null; last_contacted_at: string | null; total_spend: number; created_at: string;
}

const STATUSES = ["lead","client","vip","archived"] as const;
const empty = (): Partial<Client> => ({ full_name: "", status: "lead", tags: [], vip: false });

const AdminClients = () => {
  const [rows, setRows] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState<string>("all");
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<Partial<Client>>(empty());
  const [tagsInput, setTagsInput] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("clients" as any).select("*")
      .order("vip", { ascending: false }).order("created_at", { ascending: false });
    setLoading(false);
    if (error) return toast.error(error.message);
    setRows((data as any) || []);
  };
  useEffect(() => { load(); }, []);

  const importLeads = async () => {
    const [{ data: e }, { data: r }] = await Promise.all([
      supabase.from("enquiries").select("name, email, phone, source_page, created_at"),
      supabase.from("rental_requests").select("name, email, phone, created_at"),
    ]);
    const existing = new Set(rows.map(r => (r.email || "").toLowerCase()));
    const toAdd: any[] = [];
    for (const x of [...(e || []), ...(r || [])] as any[]) {
      if (!x.email) continue;
      const key = x.email.toLowerCase();
      if (existing.has(key)) continue;
      existing.add(key);
      toAdd.push({ full_name: x.name || x.email, email: x.email, phone: x.phone, source: x.source_page || "rental", status: "lead" });
    }
    if (!toAdd.length) return toast.info("No new leads to import");
    const { error } = await supabase.from("clients" as any).insert(toAdd);
    if (error) return toast.error(error.message);
    toast.success(`Imported ${toAdd.length} leads`);
    load();
  };

  const filtered = useMemo(() => rows.filter(c => {
    if (statusF !== "all" && c.status !== statusF) return false;
    if (search) {
      const q = search.toLowerCase();
      const hay = [c.full_name, c.email, c.phone, c.country, (c.tags || []).join(" "), c.notes].filter(Boolean).join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  }), [rows, search, statusF]);

  const openNew = () => { setEditing(empty()); setTagsInput(""); setShow(true); };
  const openEdit = (c: Client) => { setEditing({ ...c }); setTagsInput((c.tags || []).join(", ")); setShow(true); };

  const save = async () => {
    if (!editing.full_name?.trim()) return toast.error("Name required");
    const payload: any = {
      full_name: editing.full_name!.trim(), email: editing.email || null, phone: editing.phone || null,
      whatsapp: editing.whatsapp || null, country: editing.country || null,
      status: editing.status || "lead", vip: !!editing.vip, source: editing.source || null,
      tags: tagsInput.split(",").map(s => s.trim()).filter(Boolean),
      notes: editing.notes || null,
    };
    const { error } = editing.id
      ? await supabase.from("clients" as any).update(payload).eq("id", editing.id)
      : await supabase.from("clients" as any).insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved"); setShow(false); load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete client?")) return;
    await supabase.from("clients" as any).delete().eq("id", id);
    load();
  };

  const toggleVip = async (c: Client) => {
    await supabase.from("clients" as any).update({ vip: !c.vip }).eq("id", c.id);
    load();
  };

  return (
    <div className="space-y-6">
      <header className="flex items-baseline justify-between flex-wrap gap-3">
        <div>
          <p className="eyebrow">CRM</p>
          <h1 className="font-serif text-3xl md:text-4xl mt-2">Clients</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={importLeads} className="btn-ghost text-xs">Import leads from enquiries</button>
          <button onClick={openNew} className="btn-luxury text-xs flex items-center gap-2"><Plus className="h-3.5 w-3.5"/> New client</button>
        </div>
      </header>

      <div className="card-luxury p-4 flex gap-3 flex-wrap">
        <label className="relative flex-1 min-w-[200px]">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" className="input-luxury text-sm w-full pl-9"/>
        </label>
        <select value={statusF} onChange={e => setStatusF(e.target.value)} className="input-luxury text-sm capitalize">
          <option value="all">All statuses</option>{STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="card-luxury overflow-hidden">
        {loading ? <p className="p-6 text-xs text-muted-foreground">Loading…</p> : filtered.length === 0 ? (
          <p className="p-6 text-xs text-muted-foreground">No clients.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-surface-deep text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                <tr><th className="px-3 py-3 w-8"></th><th className="px-3 py-3 text-left">Name</th><th className="px-3 py-3 text-left">Contact</th><th className="px-3 py-3 text-left">Country</th><th className="px-3 py-3 text-left">Status</th><th className="px-3 py-3 text-left">Source</th><th className="px-3 py-3 text-right">Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} className="border-t border-border/40 hover:bg-surface-raised/30">
                    <td className="px-3 py-3">
                      <button onClick={() => toggleVip(c)}>{c.vip ? <Star className="h-4 w-4 fill-primary text-primary"/> : <StarOff className="h-4 w-4 text-muted-foreground/50"/>}</button>
                    </td>
                    <td className="px-3 py-3"><p className="font-medium">{c.full_name}</p>{c.tags?.length > 0 && <p className="text-[10px] text-muted-foreground mt-0.5">{c.tags.join(" · ")}</p>}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{c.email}<br/>{c.phone}</td>
                    <td className="px-3 py-3 text-xs">{c.country || "—"}</td>
                    <td className="px-3 py-3"><span className="text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 border border-border/40">{c.status}</span></td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{c.source || "—"}</td>
                    <td className="px-3 py-3 text-right whitespace-nowrap space-x-2">
                      <button onClick={() => openEdit(c)} className="text-muted-foreground hover:text-foreground"><Pencil className="h-3.5 w-3.5"/></button>
                      <button onClick={() => del(c.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5"/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AdminModal
        open={show}
        onClose={() => setShow(false)}
        title={editing.id ? "Edit client" : "New client"}
        maxWidth="xl"
        footer={
          <>
            <button onClick={() => setShow(false)} className="btn-ghost text-xs">Cancel</button>
            <button onClick={save} className="btn-luxury text-xs">{editing.id ? "Save" : "Add"}</button>
          </>
        }
      >
        <div className="p-5 grid md:grid-cols-2 gap-3">
          <label className="md:col-span-2"><span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Full name *</span><input value={editing.full_name || ""} onChange={e => setEditing({ ...editing, full_name: e.target.value })} className="input-luxury text-sm w-full mt-1"/></label>
          <label><span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Email</span><input value={editing.email || ""} onChange={e => setEditing({ ...editing, email: e.target.value })} className="input-luxury text-sm w-full mt-1"/></label>
          <label><span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Phone</span><input value={editing.phone || ""} onChange={e => setEditing({ ...editing, phone: e.target.value })} className="input-luxury text-sm w-full mt-1"/></label>
          <label><span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">WhatsApp</span><input value={editing.whatsapp || ""} onChange={e => setEditing({ ...editing, whatsapp: e.target.value })} className="input-luxury text-sm w-full mt-1"/></label>
          <label><span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Country</span><input value={editing.country || ""} onChange={e => setEditing({ ...editing, country: e.target.value })} className="input-luxury text-sm w-full mt-1"/></label>
          <label><span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Status</span><select value={editing.status || "lead"} onChange={e => setEditing({ ...editing, status: e.target.value })} className="input-luxury text-sm w-full mt-1 capitalize">{STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select></label>
          <label><span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Source</span><input value={editing.source || ""} onChange={e => setEditing({ ...editing, source: e.target.value })} className="input-luxury text-sm w-full mt-1"/></label>
          <label className="flex items-end pb-2 gap-2"><input type="checkbox" checked={!!editing.vip} onChange={e => setEditing({ ...editing, vip: e.target.checked })}/><span className="text-xs">VIP</span></label>
          <label className="md:col-span-2"><span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Tags (comma separated)</span><input value={tagsInput} onChange={e => setTagsInput(e.target.value)} className="input-luxury text-sm w-full mt-1"/></label>
          <label className="md:col-span-2"><span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Notes</span><textarea rows={4} value={editing.notes || ""} onChange={e => setEditing({ ...editing, notes: e.target.value })} className="input-luxury text-sm w-full mt-1"/></label>
        </div>
      </AdminModal>
    </div>
  );
};

export default AdminClients;
