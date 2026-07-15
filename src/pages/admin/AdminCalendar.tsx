import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Plus, Trash2, X } from "lucide-react";
import StaffAssigner, { type PendingAssignment } from "@/components/svrm/StaffAssigner";

interface Event {
  date: string;
  label: string;
  kind: "pickup" | "return" | "enquiry" | "manual";
  id: string;
  bookingId?: string;
}

interface AdminBooking {
  id: string;
  title: string;
  category: string;
  start_date: string;
  end_date: string;
  guest_name: string | null;
  guest_contact: string | null;
  location: string | null;
  notes: string | null;
  status: string;
}

const CATEGORIES = ["rental", "stay", "tour", "yacht", "aviation", "other"] as const;
const STATUSES = ["confirmed", "tentative", "cancelled"] as const;

const fmt = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const AdminCalendar = () => {
  const [today] = useState(new Date());
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [rentals, setRentals] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminBooking | null>(null);
  const [form, setForm] = useState({
    title: "",
    category: "rental" as string,
    start_date: fmt(today),
    end_date: fmt(today),
    guest_name: "",
    guest_contact: "",
    location: "",
    notes: "",
    status: "confirmed" as string,
  });
  const [saving, setSaving] = useState(false);
  const [pendingStaff, setPendingStaff] = useState<PendingAssignment[]>([]);

  const load = async () => {
    const [{ data: r }, { data: e }, { data: b }] = await Promise.all([
      supabase.from("rental_requests").select("id, vehicle_name, pickup_date, return_date, name"),
      supabase.from("enquiries").select("id, subject, booking_date, name").not("booking_date", "is", null),
      supabase.from("admin_bookings").select("*").order("start_date", { ascending: true }),
    ]);
    setRentals(r || []);
    setEnquiries(e || []);
    setBookings((b as AdminBooking[]) || []);
  };

  useEffect(() => { load(); }, []);

  const events = useMemo<Event[]>(() => {
    const evs: Event[] = [];
    rentals.forEach((r: any) => {
      evs.push({ date: r.pickup_date, label: `↑ ${r.vehicle_name} — ${r.name}`, kind: "pickup", id: r.id });
      evs.push({ date: r.return_date, label: `↓ ${r.vehicle_name}`, kind: "return", id: r.id + "-r" });
    });
    enquiries.forEach((e: any) => {
      evs.push({ date: e.booking_date, label: `${e.subject} — ${e.name}`, kind: "enquiry", id: e.id });
    });
    bookings.forEach((b) => {
      const start = new Date(b.start_date);
      const end = new Date(b.end_date);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        evs.push({
          date: fmt(d),
          label: `${b.title}${b.guest_name ? ` — ${b.guest_name}` : ""}`,
          kind: "manual",
          id: `${b.id}-${fmt(d)}`,
          bookingId: b.id,
        });
      }
    });
    return evs;
  }, [rentals, enquiries, bookings]);

  const days = useMemo(() => {
    const first = new Date(month);
    const startPad = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startPad; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(month.getFullYear(), month.getMonth(), d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [month]);

  const byDate = useMemo(() => {
    const m: Record<string, Event[]> = {};
    for (const e of events) (m[e.date] ||= []).push(e);
    return m;
  }, [events]);

  const monthLabel = month.toLocaleString(undefined, { month: "long", year: "numeric" });
  const isToday = (d: Date) =>
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();

  const openNew = (date?: string) => {
    setEditing(null);
    setPendingStaff([]);
    setForm({
      title: "",
      category: "rental",
      start_date: date || fmt(today),
      end_date: date || fmt(today),
      guest_name: "",
      guest_contact: "",
      location: "",
      notes: "",
      status: "confirmed",
    });
    setDialogOpen(true);
  };

  const openEdit = (b: AdminBooking) => {
    setEditing(b);
    setPendingStaff([]);
    setForm({
      title: b.title,
      category: b.category,
      start_date: b.start_date,
      end_date: b.end_date,
      guest_name: b.guest_name || "",
      guest_contact: b.guest_contact || "",
      location: b.location || "",
      notes: b.notes || "",
      status: b.status,
    });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    if (form.end_date < form.start_date) return toast.error("End date must be after start date");
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      category: form.category,
      start_date: form.start_date,
      end_date: form.end_date,
      guest_name: form.guest_name.trim() || null,
      guest_contact: form.guest_contact.trim() || null,
      location: form.location.trim() || null,
      notes: form.notes.trim() || null,
      status: form.status,
    };
    const { data: saved, error } = editing
      ? await supabase.from("admin_bookings").update(payload).eq("id", editing.id).select().single()
      : await supabase.from("admin_bookings").insert(payload).select().single();
    if (error) { setSaving(false); return toast.error(error.message); }

    if (!editing && saved && pendingStaff.length) {
      const { data: userData } = await supabase.auth.getUser();
      const rows = pendingStaff.map((p) => ({
        booking_id: (saved as any).id,
        staff_id: p.staff_id,
        role: p.role || null,
        created_by: userData.user?.id ?? null,
      }));
      const { error: aErr } = await supabase.from("booking_assignments" as any).insert(rows);
      if (aErr) toast.error(`Booking saved, staff assignment failed: ${aErr.message}`);
    }

    setSaving(false);
    toast.success(editing ? "Booking updated" : "Booking created");
    setDialogOpen(false);
    load();
  };

  const remove = async () => {
    if (!editing) return;
    if (!confirm("Delete this booking?")) return;
    const { error } = await supabase.from("admin_bookings").delete().eq("id", editing.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    setDialogOpen(false);
    load();
  };

  const upcoming = useMemo(
    () => [...bookings].sort((a, b) => a.start_date.localeCompare(b.start_date)).slice(0, 8),
    [bookings]
  );

  return (
    <div>
      <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
        <div>
          <p className="eyebrow">Schedule</p>
          <h1 className="font-serif text-3xl md:text-4xl mt-2">Calendar</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => openNew()} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-[10px] uppercase tracking-[0.24em] hover:bg-primary-glow transition-colors">
            <Plus className="h-3.5 w-3.5" /> New booking
          </button>
          <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="p-2 border border-border/60 hover:border-primary transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p className="font-serif text-lg w-40 text-center">{monthLabel}</p>
          <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="p-2 border border-border/60 hover:border-primary transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border border-border/40 bg-surface-raised">
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
          <div key={d} className="px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground border-b border-border/40">{d}</div>
        ))}
        {days.map((d, i) => {
          if (!d) return <div key={i} className="min-h-[110px] border-b border-r border-border/20 bg-background/30" />;
          const key = fmt(d);
          const dayEvents = byDate[key] || [];
          return (
            <button
              key={i}
              onClick={() => openNew(key)}
              className={`min-h-[110px] p-2 border-b border-r border-border/20 text-left hover:bg-primary/5 transition-colors ${isToday(d) ? "bg-primary/5" : ""}`}
            >
              <p className={`text-xs mb-1 ${isToday(d) ? "text-gold font-semibold" : "text-muted-foreground"}`}>{d.getDate()}</p>
              <div className="space-y-1">
                {dayEvents.slice(0, 4).map((e) => (
                  <div
                    key={e.id}
                    onClick={(ev) => {
                      if (e.bookingId) {
                        ev.stopPropagation();
                        const b = bookings.find((x) => x.id === e.bookingId);
                        if (b) openEdit(b);
                      }
                    }}
                    className={`text-[10px] px-1.5 py-1 truncate ${
                      e.kind === "pickup" ? "bg-green-500/15 text-green-300" :
                      e.kind === "return" ? "bg-blue-500/15 text-blue-300" :
                      e.kind === "manual" ? "bg-gold/20 text-gold hover:bg-gold/30" :
                      "bg-primary/20 text-gold"
                    }`}
                    title={e.label}
                  >
                    {e.label}
                  </div>
                ))}
                {dayEvents.length > 4 && (
                  <p className="text-[9px] text-muted-foreground">+{dayEvents.length - 4} more</p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex gap-4 flex-wrap text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        <span className="flex items-center gap-2"><span className="w-3 h-3 bg-gold/50" /> Manual booking</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 bg-green-500/40" /> Rental pickup</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-500/40" /> Rental return</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 bg-primary/40" /> Enquiry booking</span>
      </div>

      <div className="mt-12">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-serif text-2xl">Manual bookings</h2>
          <p className="text-xs text-muted-foreground">{bookings.length} total</p>
        </div>
        {upcoming.length === 0 ? (
          <div className="border border-border/40 p-8 text-center text-sm text-muted-foreground">
            No manual bookings yet. Click any day or "New booking" to add one.
          </div>
        ) : (
          <div className="border border-border/40 bg-surface-raised divide-y divide-border/40">
            {upcoming.map((b) => (
              <button key={b.id} onClick={() => openEdit(b)} className="w-full text-left p-4 flex items-center gap-4 hover:bg-primary/5 transition-colors">
                <span className="px-2 py-1 text-[9px] uppercase tracking-[0.2em] border border-gold/40 bg-gold/10 text-gold">
                  {b.category}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-base truncate">{b.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {new Date(b.start_date).toLocaleDateString()} → {new Date(b.end_date).toLocaleDateString()}
                    {b.guest_name ? ` · ${b.guest_name}` : ""}
                  </p>
                </div>
                <span className={`text-[9px] uppercase tracking-[0.2em] ${
                  b.status === "confirmed" ? "text-green-300" :
                  b.status === "tentative" ? "text-blue-300" : "text-muted-foreground"
                }`}>{b.status}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {dialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setDialogOpen(false)}>
          <div className="bg-surface-raised border border-border/40 w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="eyebrow">{editing ? "Edit" : "New"}</p>
                <h2 className="font-serif text-2xl mt-1">Booking</h2>
              </div>
              <button onClick={() => setDialogOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <Field label="Title *">
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder="Villa booking — Camps Bay" />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Category">
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Status">
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputCls}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Start date">
                  <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className={inputCls} />
                </Field>
                <Field label="End date">
                  <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className={inputCls} />
                </Field>
              </div>

              <Field label="Guest name">
                <input value={form.guest_name} onChange={(e) => setForm({ ...form, guest_name: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Contact (email or phone)">
                <input value={form.guest_contact} onChange={(e) => setForm({ ...form, guest_contact: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Location">
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Notes">
                <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={inputCls} />
              </Field>
            </div>

            <div className="mt-8 flex items-center justify-between gap-3">
              {editing ? (
                <button onClick={remove} className="flex items-center gap-2 text-xs text-destructive hover:underline">
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              ) : <span />}
              <div className="flex gap-3">
                <button onClick={() => setDialogOpen(false)} className="px-5 py-3 text-xs uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground">
                  Cancel
                </button>
                <button onClick={save} disabled={saving} className="px-6 py-3 bg-primary text-primary-foreground text-xs uppercase tracking-[0.24em] hover:bg-primary-glow transition-colors disabled:opacity-60">
                  {saving ? "…" : editing ? "Save" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const inputCls = "mt-2 w-full bg-background border border-border/60 px-3 py-2.5 text-sm focus:border-primary focus:outline-none";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</span>
    {children}
  </label>
);

export default AdminCalendar;
