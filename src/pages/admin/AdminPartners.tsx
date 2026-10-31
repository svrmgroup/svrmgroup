import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, Phone, ChevronDown, Trash2 } from "lucide-react";

type Status = "new" | "reviewing" | "approved" | "declined";
interface Row {
  id: string; full_name: string; business_name: string | null; email: string; phone: string; location: string;
  category: string; description: string; proposed_rates: string; availability: string;
  details: Record<string, string>; photo_paths: string[]; status: Status; admin_notes: string | null; created_at: string;
}
const STATUS: Record<Status, string> = { new: "New", reviewing: "Reviewing", approved: "Approved", declined: "Declined" };
const CAT: Record<string, string> = { vehicle: "Vehicle", property: "Property", experience: "Experience", professional: "Professional" };
const fmt = (iso: string) => new Date(iso).toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg", dateStyle: "medium", timeStyle: "short" });

const Photos = ({ paths }: { paths: string[] }) => {
  const [urls, setUrls] = useState<string[]>([]);
  useEffect(() => {
    if (!paths.length) return;
    supabase.storage.from("partner-photos").createSignedUrls(paths, 3600).then(({ data }) =>
      setUrls((data || []).map((d) => d.signedUrl).filter(Boolean) as string[]));
  }, [paths]);
  if (!paths.length) return <p className="text-xs text-muted-foreground">No photos</p>;
  return <div className="flex flex-wrap gap-2">{urls.map((u) => <a key={u} href={u} target="_blank" rel="noreferrer"><img src={u} alt="" className="h-24 w-24 object-cover border border-border/40" /></a>)}</div>;
};

const AdminPartners = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("partner_applications").select("*").order("created_at", { ascending: false }).then(({ data, error }) => {
      if (error) toast.error(error.message);
      setRows((data as unknown as Row[]) || []);
      setLoading(false);
    });
  }, []);

  const update = async (id: string, patch: Partial<Row>) => {
    const { error } = await supabase.from("partner_applications").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this application?")) return;
    const { error } = await supabase.from("partner_applications").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setRows((r) => r.filter((x) => x.id !== id));
  };

  const shown = useMemo(() => rows.filter((r) => (filter === "all" || r.status === filter) &&
    (!q || `${r.full_name} ${r.business_name ?? ""} ${r.email} ${r.phone} ${r.location} ${r.description}`.toLowerCase().includes(q.toLowerCase()))), [rows, filter, q]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Partner applications</h1>
        <p className="text-sm text-muted-foreground">Suppliers applying via /contact/partners. Private — admins only.</p>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        {(["all", "new", "reviewing", "approved", "declined"] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 text-xs border ${filter === s ? "border-primary text-primary" : "border-border/40 text-muted-foreground"}`}>
            {s === "all" ? "All" : STATUS[s]} ({s === "all" ? rows.length : rows.filter((r) => r.status === s).length})
          </button>
        ))}
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="ml-auto min-w-0 w-full sm:w-64 bg-transparent border border-border/40 px-3 py-1.5 text-sm" />
      </div>
      {loading ? <p className="text-muted-foreground">Loading…</p> : shown.length === 0 ? <p className="text-muted-foreground">No applications yet.</p> : (
        <div className="space-y-3">
          {shown.map((r) => (
            <div key={r.id} className="border border-border/40">
              <button className="w-full flex items-center gap-3 p-4 text-left" onClick={() => setOpenId(openId === r.id ? null : r.id)}>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{r.full_name}{r.business_name ? ` · ${r.business_name}` : ""}</p>
                  <p className="text-xs text-muted-foreground">{CAT[r.category] ?? r.category} · {r.location} · {fmt(r.created_at)}</p>
                </div>
                <span className="text-xs border border-primary/40 text-primary px-2 py-0.5">{STATUS[r.status]}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${openId === r.id ? "rotate-180" : ""}`} />
              </button>
              {openId === r.id && (
                <div className="border-t border-border/40 p-4 space-y-4 text-sm">
                  <div className="flex flex-wrap gap-4">
                    <a href={`https://wa.me/${r.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-primary"><Phone className="h-4 w-4" />{r.phone}</a>
                    <a href={`mailto:${r.email}`} className="flex items-center gap-1 text-primary break-all"><Mail className="h-4 w-4" />{r.email}</a>
                  </div>
                  <div><p className="text-xs uppercase text-muted-foreground">Offering</p><p className="whitespace-pre-wrap">{r.description}</p></div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div><p className="text-xs uppercase text-muted-foreground">Proposed rates</p><p className="whitespace-pre-wrap">{r.proposed_rates}</p></div>
                    <div><p className="text-xs uppercase text-muted-foreground">Availability</p><p className="whitespace-pre-wrap">{r.availability}</p></div>
                    {Object.entries(r.details || {}).map(([k, v]) => (
                      <div key={k}><p className="text-xs uppercase text-muted-foreground">{k.replace(/_/g, " ")}</p><p>{v}</p></div>
                    ))}
                  </div>
                  <Photos paths={r.photo_paths} />
                  <div className="flex flex-wrap gap-2 items-center">
                    <select value={r.status} onChange={(e) => update(r.id, { status: e.target.value as Status })} className="bg-background border border-border/40 px-2 py-1.5">
                      {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                    <button onClick={() => remove(r.id)} className="ml-auto flex items-center gap-1 text-destructive text-xs"><Trash2 className="h-4 w-4" />Delete</button>
                  </div>
                  <textarea defaultValue={r.admin_notes ?? ""} placeholder="Admin notes" onBlur={(e) => e.target.value !== (r.admin_notes ?? "") && update(r.id, { admin_notes: e.target.value })}
                    className="w-full bg-transparent border border-border/40 p-2 min-h-[80px]" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default AdminPartners;
