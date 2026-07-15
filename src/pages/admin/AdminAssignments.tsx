import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, AlertTriangle } from "lucide-react";

const STATUSES = ["assigned","confirmed","en_route","in_progress","completed","cancelled"] as const;

interface Assignment {
  id: string; booking_id: string; staff_id: string; role: string | null;
  status: string; start_at: string | null; end_at: string | null; notes: string | null;
}
interface Booking { id: string; booking_code: string; client_name: string; start_date: string | null; end_date: string | null; }
interface Staff { id: string; full_name: string; role: string; }

const AdminAssignments = () => {
  const [rows, setRows] = useState<Assignment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ booking_id: "", staff_id: "", role: "", start_at: "", end_at: "", notes: "" });
  const [view, setView] = useState<"list" | "roster">("list");
  const [rosterDate, setRosterDate] = useState(new Date().toISOString().slice(0, 10));

  const load = async () => {
    setLoading(true);
    const [a, b, s] = await Promise.all([
      supabase.from("booking_assignments" as any).select("*").order("start_at", { ascending: false }),
      supabase.from("manual_bookings").select("id, booking_code, client_name, start_date, end_date").order("created_at", { ascending: false }).limit(500),
      supabase.from("staff" as any).select("id, full_name, role").order("full_name"),
    ]);
    setRows((a.data as any) || []); setBookings((b.data as any) || []); setStaff((s.data as any) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const overlap = useMemo(() => {
    if (!form.staff_id || !form.start_at || !form.end_at) return null;
    const s = new Date(form.start_at).getTime(); const e = new Date(form.end_at).getTime();
    return rows.find(r => r.staff_id === form.staff_id && r.status !== "cancelled" && r.start_at && r.end_at
      && new Date(r.start_at).getTime() < e && new Date(r.end_at).getTime() > s);
  }, [rows, form]);

  const add = async () => {
    if (!form.booking_id || !form.staff_id) return toast.error("Booking & staff required");
    if (overlap && !confirm("This staff has an overlapping assignment. Continue?")) return;
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from("booking_assignments" as any).insert({
      booking_id: form.booking_id, staff_id: form.staff_id, role: form.role || null,
      start_at: form.start_at || null, end_at: form.end_at || null, notes: form.notes || null,
      created_by: userData.user?.id ?? null,
    });
    if (error) return toast.error(error.message);
    toast.success("Assigned. Remember to notify staff.");
    setForm({ booking_id: "", staff_id: "", role: "", start_at: "", end_at: "", notes: "" });
    load();
  };

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("booking_assignments" as any).update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Remove assignment?")) return;
    await supabase.from("booking_assignments" as any).delete().eq("id", id);
    load();
  };

  const rosterFor = useMemo(() => {
    const day = new Date(rosterDate);
    const dayStart = day.getTime(); const dayEnd = dayStart + 86400000;
    const byStaff = new Map<string, Assignment[]>();
    staff.forEach(s => byStaff.set(s.id, []));
    rows.forEach(r => {
      if (!r.start_at) return;
      const t = new Date(r.start_at).getTime();
      if (t >= dayStart && t < dayEnd) byStaff.get(r.staff_id)?.push(r);
    });
    return byStaff;
  }, [rows, staff, rosterDate]);

  return (
    <div className="space-y-6">
      <header className="flex items-baseline justify-between flex-wrap gap-3">
        <div>
          <p className="eyebrow">Operations</p>
          <h1 className="font-serif text-3xl md:text-4xl mt-2">Assignments</h1>
          <p className="text-xs text-muted-foreground mt-2">Assign staff to bookings and track the day.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView("list")} className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] border ${view==="list"?"border-primary bg-primary/10 text-gold":"border-border/40 text-muted-foreground"}`}>List</button>
          <button onClick={() => setView("roster")} className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] border ${view==="roster"?"border-primary bg-primary/10 text-gold":"border-border/40 text-muted-foreground"}`}>Day roster</button>
        </div>
      </header>

      <div className="card-luxury p-5 space-y-3">
        <p className="eyebrow">New assignment</p>
        <div className="grid md:grid-cols-6 gap-3">
          <select value={form.booking_id} onChange={e => setForm({ ...form, booking_id: e.target.value })} className="input-luxury text-sm md:col-span-2">
            <option value="">Select booking…</option>
            {bookings.map(b => <option key={b.id} value={b.id}>{b.booking_code} — {b.client_name}</option>)}
          </select>
          <select value={form.staff_id} onChange={e => setForm({ ...form, staff_id: e.target.value })} className="input-luxury text-sm">
            <option value="">Select staff…</option>
            {staff.map(s => <option key={s.id} value={s.id}>{s.full_name} ({s.role})</option>)}
          </select>
          <input placeholder="Role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="input-luxury text-sm"/>
          <input type="datetime-local" value={form.start_at} onChange={e => setForm({ ...form, start_at: e.target.value })} className="input-luxury text-sm"/>
          <input type="datetime-local" value={form.end_at} onChange={e => setForm({ ...form, end_at: e.target.value })} className="input-luxury text-sm"/>
          <input placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="input-luxury text-sm md:col-span-5"/>
          <button onClick={add} className="btn-luxury text-xs flex items-center justify-center gap-2"><Plus className="h-3.5 w-3.5"/> Assign</button>
        </div>
        {overlap && (
          <div className="flex items-center gap-2 text-xs text-yellow-400"><AlertTriangle className="h-3.5 w-3.5"/> Overlap detected with an existing assignment for this staff.</div>
        )}
      </div>

      {view === "list" ? (
        <div className="card-luxury overflow-hidden">
          {loading ? <p className="p-6 text-xs text-muted-foreground">Loading…</p> : rows.length === 0 ? (
            <p className="p-6 text-xs text-muted-foreground">No assignments yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead className="bg-surface-deep text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  <tr><th className="px-3 py-3 text-left">When</th><th className="px-3 py-3 text-left">Booking</th><th className="px-3 py-3 text-left">Staff</th><th className="px-3 py-3 text-left">Role</th><th className="px-3 py-3 text-left">Status</th><th></th></tr>
                </thead>
                <tbody>
                  {rows.map(r => {
                    const b = bookings.find(x => x.id === r.booking_id);
                    const s = staff.find(x => x.id === r.staff_id);
                    return (
                      <tr key={r.id} className="border-t border-border/40">
                        <td className="px-3 py-3 text-xs text-muted-foreground">{r.start_at ? new Date(r.start_at).toLocaleString() : "—"}</td>
                        <td className="px-3 py-3">{b?.booking_code || "—"}<p className="text-[11px] text-muted-foreground">{b?.client_name}</p></td>
                        <td className="px-3 py-3">{s?.full_name || "—"}</td>
                        <td className="px-3 py-3 text-xs text-muted-foreground">{r.role || "—"}</td>
                        <td className="px-3 py-3">
                          <select value={r.status} onChange={e => setStatus(r.id, e.target.value)} className="input-luxury text-xs">
                            {STATUSES.map(s => <option key={s} value={s}>{s.replace("_"," ")}</option>)}
                          </select>
                        </td>
                        <td className="px-3 py-3 text-right"><button onClick={() => del(r.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5"/></button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <input type="date" value={rosterDate} onChange={e => setRosterDate(e.target.value)} className="input-luxury text-sm"/>
          <div className="grid gap-3">
            {staff.map(s => {
              const jobs = rosterFor.get(s.id) || [];
              return (
                <div key={s.id} className="card-luxury p-4">
                  <p className="text-sm font-medium">{s.full_name}<span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-2">{s.role}</span></p>
                  {jobs.length === 0 ? <p className="text-xs text-muted-foreground mt-2">Free</p> :
                    <div className="mt-2 space-y-1">{jobs.map(j => {
                      const b = bookings.find(x => x.id === j.booking_id);
                      return <p key={j.id} className="text-xs">• {j.start_at ? new Date(j.start_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""} — {b?.booking_code} — {j.role || "—"} <span className="text-muted-foreground">({j.status})</span></p>;
                    })}</div>
                  }
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAssignments;
