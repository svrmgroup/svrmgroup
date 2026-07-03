import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Event {
  date: string; // yyyy-mm-dd
  label: string;
  kind: "pickup" | "return" | "enquiry";
  id: string;
}

const AdminCalendar = () => {
  const [today] = useState(new Date());
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    (async () => {
      const [{ data: rentals }, { data: enq }] = await Promise.all([
        supabase.from("rental_requests").select("id, vehicle_name, pickup_date, return_date, name"),
        supabase.from("enquiries").select("id, subject, booking_date, name").not("booking_date", "is", null),
      ]);
      const evs: Event[] = [];
      (rentals || []).forEach((r: any) => {
        evs.push({ date: r.pickup_date, label: `↑ ${r.vehicle_name} — ${r.name}`, kind: "pickup", id: r.id });
        evs.push({ date: r.return_date, label: `↓ ${r.vehicle_name}`, kind: "return", id: r.id + "-r" });
      });
      (enq || []).forEach((e: any) => {
        evs.push({ date: e.booking_date, label: `${e.subject} — ${e.name}`, kind: "enquiry", id: e.id });
      });
      setEvents(evs);
    })();
  }, []);

  const days = useMemo(() => {
    const first = new Date(month);
    const startPad = (first.getDay() + 6) % 7; // Mon-first
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

  const fmt = (d: Date) => d.toISOString().split("T")[0];
  const monthLabel = month.toLocaleString(undefined, { month: "long", year: "numeric" });
  const isToday = (d: Date) =>
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();

  return (
    <div>
      <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
        <div>
          <p className="eyebrow">Schedule</p>
          <h1 className="font-serif text-3xl md:text-4xl mt-2">Calendar</h1>
        </div>
        <div className="flex items-center gap-3">
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
          if (!d) return <div key={i} className="min-h-[100px] border-b border-r border-border/20 bg-background/30" />;
          const key = fmt(d);
          const dayEvents = byDate[key] || [];
          return (
            <div key={i} className={`min-h-[100px] p-2 border-b border-r border-border/20 ${isToday(d) ? "bg-primary/5" : ""}`}>
              <p className={`text-xs mb-1 ${isToday(d) ? "text-gold font-semibold" : "text-muted-foreground"}`}>{d.getDate()}</p>
              <div className="space-y-1">
                {dayEvents.map((e) => (
                  <div key={e.id} className={`text-[10px] px-1.5 py-1 truncate ${
                    e.kind === "pickup" ? "bg-green-500/15 text-green-300" :
                    e.kind === "return" ? "bg-blue-500/15 text-blue-300" :
                    "bg-primary/20 text-gold"
                  }`} title={e.label}>{e.label}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex gap-4 flex-wrap text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        <span className="flex items-center gap-2"><span className="w-3 h-3 bg-green-500/40" /> Rental pickup</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-500/40" /> Rental return</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 bg-primary/40" /> Enquiry booking</span>
      </div>
    </div>
  );
};

export default AdminCalendar;
