import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Upload, AlertTriangle } from "lucide-react";

const ROLES = [
  "founder","manager","operations","concierge","sales","guide","driver",
  "security","chef","host","pilot","captain","photographer","both","other",
] as const;
const STATUSES = ["active","on_leave","inactive"] as const;

interface Staff {
  id: string; full_name: string; role: string; photo_url: string | null;
  phone: string | null; whatsapp: string | null; email: string | null; status: string;
  license_number: string | null; pdp_expiry_date: string | null; license_expiry_date: string | null;
  assigned_vehicle: string | null; languages_spoken: string[]; specialties: string[];
  hourly_rate: number | null; currency: string | null; notes: string | null;
  role_description: string | null; custom_role_title: string | null;
}

const empty = (): Partial<Staff> => ({
  full_name: "", role: "driver", status: "active",
  languages_spoken: [], specialties: [], currency: "ZAR",
});

const AdminStaff = () => {
  const [rows, setRows] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<Partial<Staff>>(empty());
  const [langs, setLangs] = useState("");
  const [specs, setSpecs] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("staff" as any).select("*").order("full_name");
    setLoading(false);
    if (error) return toast.error(error.message);
    setRows((data as any) || []);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(empty()); setLangs(""); setSpecs(""); setShow(true); };
  const openEdit = (s: Staff) => {
    setEditing({ ...s });
    setLangs((s.languages_spoken || []).join(", "));
    setSpecs((s.specialties || []).join(", "));
    setShow(true);
  };

  const uploadPhoto = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("staff-photos").upload(path, file, { upsert: false });
    if (error) { setUploading(false); return toast.error(error.message); }
    const { data } = supabase.storage.from("staff-photos").getPublicUrl(path);
    setEditing(e => ({ ...e, photo_url: data.publicUrl }));
    setUploading(false);
  };

  const save = async () => {
    if (!editing.full_name?.trim()) return toast.error("Name required");
    const payload: any = {
      full_name: editing.full_name!.trim(), role: editing.role || "driver",
      photo_url: editing.photo_url || null,
      phone: editing.phone || null, whatsapp: editing.whatsapp || editing.phone || null,
      email: editing.email || null, status: editing.status || "active",
      license_number: editing.license_number || null,
      pdp_expiry_date: editing.pdp_expiry_date || null,
      license_expiry_date: editing.license_expiry_date || null,
      assigned_vehicle: editing.assigned_vehicle || null,
      languages_spoken: langs.split(",").map(s => s.trim()).filter(Boolean),
      specialties: specs.split(",").map(s => s.trim()).filter(Boolean),
      hourly_rate: editing.hourly_rate ?? null, currency: editing.currency || "ZAR",
      notes: editing.notes || null,
      role_description: editing.role_description || null,
      custom_role_title: editing.custom_role_title || null,
    };
    const { error } = editing.id
      ? await supabase.from("staff" as any).update(payload).eq("id", editing.id)
      : await supabase.from("staff" as any).insert(payload);
    if (error) return toast.error(error.message);
    toast.success(editing.id ? "Updated" : "Added");
    setShow(false); load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete staff member?")) return;
    const { error } = await supabase.from("staff" as any).delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const expiring = useMemo(() => rows.filter(s => {
    const now = Date.now();
    const soon = now + 30 * 86400000;
    const test = (d: string | null) => d && new Date(d).getTime() < soon;
    return test(s.pdp_expiry_date) || test(s.license_expiry_date);
  }), [rows]);

  return (
    <div className="space-y-6">
      <header className="flex items-baseline justify-between flex-wrap gap-3">
        <div>
          <p className="eyebrow">Team</p>
          <h1 className="font-serif text-3xl md:text-4xl mt-2">Staff</h1>
          <p className="text-xs text-muted-foreground mt-2">Drivers, concierge, guides and security.</p>
        </div>
        <button onClick={openNew} className="btn-luxury text-xs flex items-center gap-2"><Plus className="h-3.5 w-3.5"/> New staff</button>
      </header>

      {expiring.length > 0 && (
        <div className="card-luxury p-4 border-l-2 border-yellow-500/60 flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5"/>
          <div className="text-xs">
            <p className="font-medium text-yellow-300">{expiring.length} staff with licence/PDP expiring within 30 days</p>
            <p className="text-muted-foreground mt-1">{expiring.map(s => s.full_name).join(", ")}</p>
          </div>
        </div>
      )}

      <div className="card-luxury overflow-hidden">
        {loading ? <p className="p-6 text-xs text-muted-foreground">Loading…</p> : rows.length === 0 ? (
          <p className="p-6 text-xs text-muted-foreground">No staff yet.</p>
        ) : (
          <div className="grid gap-3 p-4 md:grid-cols-2">
            {rows.map(s => (
              <div key={s.id} className="border border-border/40 p-4 flex gap-4">
                <div className="w-14 h-14 rounded-full bg-surface-deep overflow-hidden shrink-0">
                  {s.photo_url ? <img src={s.photo_url} alt={s.full_name} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">{s.full_name[0]}</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium truncate">{s.full_name}</p>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{s.role} · {s.status}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(s)} className="text-muted-foreground hover:text-foreground"><Pencil className="h-3.5 w-3.5"/></button>
                      <button onClick={() => del(s.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5"/></button>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground space-y-0.5">
                    {s.phone && <p>📞 {s.phone}</p>}
                    {s.email && <p>✉ {s.email}</p>}
                    {s.assigned_vehicle && <p>🚗 {s.assigned_vehicle}</p>}
                    {s.pdp_expiry_date && <p className={new Date(s.pdp_expiry_date) < new Date(Date.now() + 30*86400000) ? "text-yellow-400" : ""}>PDP → {s.pdp_expiry_date}</p>}
                    {s.languages_spoken.length > 0 && <p className="text-[10px]">🗣 {s.languages_spoken.join(", ")}</p>}
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
              <h2 className="font-serif text-2xl">{editing.id ? "Edit staff" : "New staff"}</h2>
              <button onClick={() => setShow(false)}><X className="h-5 w-5 text-muted-foreground"/></button>
            </div>
            <div className="p-5 grid md:grid-cols-2 gap-3">
              <div className="md:col-span-2 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-surface-raised overflow-hidden">
                  {editing.photo_url ? <img src={editing.photo_url} className="w-full h-full object-cover" alt=""/> : <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">Photo</div>}
                </div>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => { const f = e.target.files?.[0]; if (f) uploadPhoto(f); }}/>
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-ghost text-xs flex items-center gap-2">
                  <Upload className="h-3.5 w-3.5"/> {uploading ? "Uploading…" : "Upload photo"}
                </button>
              </div>
              <Input label="Full name *" value={editing.full_name || ""} onChange={v => setEditing({ ...editing, full_name: v })} className="md:col-span-2"/>
              <Select label="Role" value={editing.role || "driver"} onChange={v => setEditing({ ...editing, role: v })} options={ROLES.map(r => ({ value: r, label: r }))}/>
              <Select label="Status" value={editing.status || "active"} onChange={v => setEditing({ ...editing, status: v })} options={STATUSES.map(s => ({ value: s, label: s }))}/>
              <Input label="Phone" value={editing.phone || ""} onChange={v => setEditing({ ...editing, phone: v })}/>
              <Input label="WhatsApp" value={editing.whatsapp || ""} onChange={v => setEditing({ ...editing, whatsapp: v })}/>
              <Input label="Email" value={editing.email || ""} onChange={v => setEditing({ ...editing, email: v })}/>
              <Input label="Assigned vehicle" value={editing.assigned_vehicle || ""} onChange={v => setEditing({ ...editing, assigned_vehicle: v })}/>
              <Input label="License #" value={editing.license_number || ""} onChange={v => setEditing({ ...editing, license_number: v })}/>
              <Input type="date" label="License expiry" value={editing.license_expiry_date || ""} onChange={v => setEditing({ ...editing, license_expiry_date: v })}/>
              <Input type="date" label="PDP expiry" value={editing.pdp_expiry_date || ""} onChange={v => setEditing({ ...editing, pdp_expiry_date: v })}/>
              <Input type="number" label="Hourly rate" value={String(editing.hourly_rate ?? "")} onChange={v => setEditing({ ...editing, hourly_rate: v ? Number(v) : null })}/>
              <Input label="Languages (comma separated)" value={langs} onChange={setLangs} className="md:col-span-2"/>
              <Input label="Specialties (comma separated)" value={specs} onChange={setSpecs} className="md:col-span-2"/>
              <label className="md:col-span-2"><span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Notes</span>
                <textarea rows={3} value={editing.notes || ""} onChange={e => setEditing({ ...editing, notes: e.target.value })} className="input-luxury text-sm w-full mt-1"/>
              </label>
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

const Input = ({ label, value, onChange, type = "text", className = "" }: { label: string; value: string; onChange: (v: string) => void; type?: string; className?: string }) => (
  <label className={className}>
    <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</span>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} className="input-luxury text-sm w-full mt-1"/>
  </label>
);
const Select = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) => (
  <label>
    <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</span>
    <select value={value} onChange={e => onChange(e.target.value)} className="input-luxury text-sm w-full mt-1 capitalize">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </label>
);

export default AdminStaff;
