import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Check, Trash2, RotateCcw } from "lucide-react";

interface Task {
  id: string;
  title: string;
  due_date: string | null;
  status: "todo" | "doing" | "done";
  assignee: string | null;
  notes: string | null;
  manual_booking_id: string | null;
}

const AdminTasks = () => {
  const [rows, setRows] = useState<Task[]>([]);
  const [bookings, setBookings] = useState<{ id: string; booking_code: string; client_name: string }[]>([]);
  const [form, setForm] = useState({ title: "", due_date: "", assignee: "", notes: "", manual_booking_id: "" });

  const load = async () => {
    const [{ data: t }, { data: mb }] = await Promise.all([
      supabase.from("booking_tasks").select("*").order("due_date", { ascending: true, nullsFirst: false }),
      supabase.from("manual_bookings").select("id, booking_code, client_name").order("created_at", { ascending: false }).limit(100),
    ]);
    setRows((t as any) || []);
    setBookings((mb as any) || []);
  };
  useEffect(() => { load(); }, []);

  const today = new Date().toISOString().slice(0, 10);
  const overdue = useMemo(() => rows.filter((r) => r.status !== "done" && r.due_date && r.due_date < today), [rows, today]);
  const todaysTasks = useMemo(() => rows.filter((r) => r.status !== "done" && r.due_date === today), [rows, today]);
  const upcoming = useMemo(() => rows.filter((r) => r.status !== "done" && r.due_date && r.due_date > today), [rows, today]);
  const nodate = useMemo(() => rows.filter((r) => r.status !== "done" && !r.due_date), [rows]);
  const done = useMemo(() => rows.filter((r) => r.status === "done").slice(0, 20), [rows]);

  const add = async () => {
    if (!form.title.trim()) return toast.error("Title required");
    const { error } = await supabase.from("booking_tasks").insert({
      title: form.title.trim(),
      due_date: form.due_date || null,
      assignee: form.assignee || null,
      notes: form.notes || null,
      manual_booking_id: form.manual_booking_id || null,
    });
    if (error) return toast.error(error.message);
    setForm({ title: "", due_date: "", assignee: "", notes: "", manual_booking_id: "" });
    load();
  };

  const setStatus = async (id: string, status: Task["status"]) => {
    const { error } = await supabase.from("booking_tasks").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete task?")) return;
    await supabase.from("booking_tasks").delete().eq("id", id);
    load();
  };

  const bookingLabel = (id: string | null) => {
    if (!id) return null;
    const b = bookings.find((x) => x.id === id);
    return b ? `${b.booking_code} — ${b.client_name}` : null;
  };

  const Card = ({ t }: { t: Task }) => (
    <div className="card-luxury p-3 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm">{t.title}</p>
        <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
          {t.due_date && <span>📅 {t.due_date}</span>}
          {t.assignee && <span>👤 {t.assignee}</span>}
          {bookingLabel(t.manual_booking_id) && <span className="text-gold/80">🔗 {bookingLabel(t.manual_booking_id)}</span>}
        </div>
        {t.notes && <p className="text-xs text-muted-foreground mt-2 italic">{t.notes}</p>}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {t.status !== "done" ? (
          <button onClick={() => setStatus(t.id, "done")} className="text-gold hover:opacity-80" title="Mark done">
            <Check className="h-4 w-4" />
          </button>
        ) : (
          <button onClick={() => setStatus(t.id, "todo")} className="text-muted-foreground hover:text-foreground" title="Reopen">
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
        <button onClick={() => remove(t.id)} className="text-muted-foreground hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const Section = ({ title, list, className = "" }: { title: string; list: Task[]; className?: string }) => (
    <section>
      <p className={`eyebrow mb-3 ${className}`}>{title} <span className="text-muted-foreground/60">({list.length})</span></p>
      <div className="space-y-2">
        {list.length === 0 ? <p className="text-xs text-muted-foreground">Nothing here</p> : list.map((t) => <Card key={t.id} t={t} />)}
      </div>
    </section>
  );

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Operations</p>
        <h1 className="font-serif text-3xl md:text-4xl mt-2">Tasks &amp; checklist</h1>
      </header>

      <div className="card-luxury p-5 space-y-3">
        <p className="eyebrow">Add task</p>
        <div className="grid md:grid-cols-5 gap-2">
          <input placeholder="What needs doing?" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-luxury text-sm md:col-span-2" />
          <input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} className="input-luxury text-sm" />
          <input placeholder="Assignee" value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })} className="input-luxury text-sm" />
          <select value={form.manual_booking_id} onChange={(e) => setForm({ ...form, manual_booking_id: e.target.value })} className="input-luxury text-sm">
            <option value="">No booking</option>
            {bookings.map((b) => <option key={b.id} value={b.id}>{b.booking_code}</option>)}
          </select>
          <input placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-luxury text-sm md:col-span-4" />
          <button onClick={add} className="btn-luxury text-xs flex items-center justify-center gap-2">
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Section title="Overdue" list={overdue} className="text-destructive" />
        <Section title="Today" list={todaysTasks} />
        <Section title="Upcoming" list={upcoming} />
        <Section title="No date" list={nodate} />
      </div>

      <Section title="Recently completed" list={done} />
    </div>
  );
};

export default AdminTasks;
