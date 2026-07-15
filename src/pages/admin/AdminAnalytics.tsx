import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { subDays, format, startOfDay, differenceInDays } from "date-fns";
import { Download } from "lucide-react";

type RangeKey = "today" | "7d" | "30d" | "quarter" | "year" | "all" | "custom";
const PRESETS: { key: RangeKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7d" },
  { key: "30d", label: "30d" },
  { key: "quarter", label: "Quarter" },
  { key: "year", label: "Year" },
  { key: "all", label: "All time" },
  { key: "custom", label: "Custom" },
];

function rangeToDates(range: RangeKey, custom: { from: string; to: string }): { from: Date | null; to: Date } {
  const now = new Date();
  const to = now;
  switch (range) {
    case "today": return { from: startOfDay(now), to };
    case "7d": return { from: subDays(now, 7), to };
    case "30d": return { from: subDays(now, 30), to };
    case "quarter": return { from: subDays(now, 90), to };
    case "year": return { from: subDays(now, 365), to };
    case "all": return { from: null, to };
    case "custom": return { from: custom.from ? new Date(custom.from) : null, to: custom.to ? new Date(custom.to) : now };
  }
}

const AdminAnalytics = () => {
  const [range, setRange] = useState<RangeKey>("all");
  const [custom, setCustom] = useState({ from: "", to: "" });
  const [loading, setLoading] = useState(true);

  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [rentals, setRentals] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [wa, setWa] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);

  const { from, to } = rangeToDates(range, custom);

  useEffect(() => { load(); }, [range, custom.from, custom.to]);

  const load = async () => {
    setLoading(true);
    const gte = from ? from.toISOString() : "1900-01-01";
    const lte = to.toISOString();

    const [e, r, b, ex, w, l, s] = await Promise.all([
      supabase.from("enquiries").select("*").gte("created_at", gte).lte("created_at", lte),
      supabase.from("rental_requests").select("*").gte("created_at", gte).lte("created_at", lte),
      supabase.from("manual_bookings").select("*").gte("created_at", gte).lte("created_at", lte),
      supabase.from("expenses").select("*").gte("date", from ? format(from, "yyyy-MM-dd") : "1900-01-01").lte("date", format(to, "yyyy-MM-dd")),
      supabase.from("whatsapp_clicks").select("*").gte("created_at", gte).lte("created_at", lte),
      supabase.from("b2b_leads").select("*"),
      supabase.from("suppliers_directory" as any).select("id, company_name"),
    ]);
    setEnquiries(e.data || []); setRentals(r.data || []); setBookings(b.data || []);
    setExpenses(ex.data || []); setWa(w.data || []); setLeads(l.data || []); setSuppliers((s.data as any) || []);
    setLoading(false);
  };

  const totalRevenue = useMemo(() => bookings.reduce((s, x: any) => s + Number(x.subtotal || 0), 0), [bookings]);
  const totalExpenses = useMemo(() => expenses.reduce((s, x: any) => s + Number(x.amount || 0), 0), [expenses]);
  const netProfit = totalRevenue - totalExpenses;

  const days = from ? Math.max(1, differenceInDays(to, from) + 1) : 365;
  const timeSeries = useMemo(() => {
    const map = new Map<string, { rev: number; exp: number }>();
    const step = days > 365 ? 30 : days > 90 ? 7 : 1;
    for (let i = 0; i < Math.min(days, 60); i++) {
      const d = format(subDays(to, i * step), step === 1 ? "MMM d" : "MMM yy");
      map.set(d, { rev: 0, exp: 0 });
    }
    bookings.forEach((b: any) => {
      const d = format(new Date(b.created_at), step === 1 ? "MMM d" : "MMM yy");
      const v = map.get(d); if (v) v.rev += Number(b.subtotal || 0);
    });
    expenses.forEach((e: any) => {
      const d = format(new Date(e.date), step === 1 ? "MMM d" : "MMM yy");
      const v = map.get(d); if (v) v.exp += Number(e.amount || 0);
    });
    return Array.from(map.entries()).reverse().map(([label, v]) => ({ label, ...v }));
  }, [bookings, expenses, days, to]);

  const byCategory = useMemo(() => {
    const m = new Map<string, number>();
    [...enquiries, ...rentals].forEach((e: any) => {
      const cat = e.subject || e.vehicle_name?.split(" ")[0] || "Other";
      m.set(cat, (m.get(cat) || 0) + 1);
    });
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [enquiries, rentals]);

  const byCountry = useMemo(() => {
    const m = new Map<string, number>();
    [...enquiries, ...rentals, ...bookings].forEach((e: any) => {
      const c = e.country || e.client_country || "Unknown";
      m.set(c, (m.get(c) || 0) + 1);
    });
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [enquiries, rentals, bookings]);

  const topSuppliers = useMemo(() => {
    const m = new Map<string, number>();
    expenses.forEach((e: any) => {
      if (!e.supplier_id) return;
      m.set(e.supplier_id, (m.get(e.supplier_id) || 0) + Number(e.amount || 0));
    });
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8)
      .map(([sid, val]) => ({ name: suppliers.find((s: any) => s.id === sid)?.company_name || "Unknown", val }));
  }, [expenses, suppliers]);

  const exportCsv = () => {
    const rows = [
      ["Metric","Value"],
      ["Range", range === "custom" ? `${custom.from} → ${custom.to}` : range],
      ["Enquiries", String(enquiries.length)],
      ["Rental requests", String(rentals.length)],
      ["Manual bookings", String(bookings.length)],
      ["Revenue booked", String(totalRevenue)],
      ["Expenses", String(totalExpenses)],
      ["Net profit", String(netProfit)],
      ["WhatsApp clicks", String(wa.length)],
    ];
    const csv = rows.map(r => r.map(v => /[,"\n]/.test(v) ? `"${v.replace(/"/g,'""')}"` : v).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `svrm-analytics-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const maxTS = Math.max(1, ...timeSeries.map(d => Math.max(d.rev, d.exp)));

  return (
    <div className="space-y-6">
      <header className="flex items-baseline justify-between flex-wrap gap-3">
        <div>
          <p className="eyebrow">Overview</p>
          <h1 className="font-serif text-3xl md:text-4xl mt-2">Analytics</h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex flex-wrap">
            {PRESETS.map(p => (
              <button key={p.key} onClick={() => setRange(p.key)}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] border ${range === p.key ? "border-primary bg-primary/10 text-gold" : "border-border/40 text-muted-foreground hover:text-foreground"}`}>
                {p.label}
              </button>
            ))}
          </div>
          <button onClick={exportCsv} className="btn-ghost text-xs flex items-center gap-2"><Download className="h-3.5 w-3.5"/> CSV</button>
        </div>
      </header>

      {range === "custom" && (
        <div className="card-luxury p-3 flex gap-3 items-end">
          <label className="text-xs">From <input type="date" value={custom.from} onChange={e => setCustom({...custom, from: e.target.value})} className="input-luxury text-sm ml-2" /></label>
          <label className="text-xs">To <input type="date" value={custom.to} onChange={e => setCustom({...custom, to: e.target.value})} className="input-luxury text-sm ml-2" /></label>
        </div>
      )}

      {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="Enquiries" value={enquiries.length} />
            <Stat label="Rental requests" value={rentals.length} />
            <Stat label="Bookings" value={bookings.length} />
            <Stat label="WhatsApp clicks" value={wa.length} />
            <Stat label="Revenue" value={`R ${totalRevenue.toLocaleString()}`} />
            <Stat label="Expenses" value={`R ${totalExpenses.toLocaleString()}`} />
            <Stat label="Net profit" value={`R ${netProfit.toLocaleString()}`} accent={netProfit >= 0 ? "text-gold" : "text-destructive"} />
            <Stat label="Active leads" value={leads.filter(l => l.status !== "signed" && l.status !== "declined").length} />
          </div>

          <Card title="Revenue vs expenses over time">
            {timeSeries.length === 0 ? <p className="text-xs text-muted-foreground">No data.</p> : (
              <div className="flex items-end gap-1 h-48">
                {timeSeries.map(d => (
                  <div key={d.label} className="flex-1 flex flex-col gap-0.5 justify-end min-w-0">
                    <div className="w-full flex gap-0.5 items-end" style={{ height: "100%" }}>
                      <div className="flex-1 bg-primary/60" style={{ height: `${(d.rev / maxTS) * 100}%` }} title={`Revenue: R ${d.rev.toLocaleString()}`}/>
                      <div className="flex-1 bg-destructive/60" style={{ height: `${(d.exp / maxTS) * 100}%` }} title={`Expenses: R ${d.exp.toLocaleString()}`}/>
                    </div>
                    <span className="text-[8px] text-muted-foreground truncate">{d.label}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-4 text-[10px] mt-3 text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-primary/60"/> Revenue</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-destructive/60"/> Expenses</span>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card title="Requests by category"><BarList items={byCategory} /></Card>
            <Card title="Clients by country"><BarList items={byCountry} /></Card>
          </div>

          <Card title="Top suppliers by spend">
            {topSuppliers.length === 0 ? <p className="text-xs text-muted-foreground">No supplier-linked expenses.</p> :
              <BarList items={topSuppliers.map(s => [s.name, s.val] as [string, number])} formatValue={v => `R ${v.toLocaleString()}`} />
            }
          </Card>
        </>
      )}
    </div>
  );
};

const Stat = ({ label, value, accent }: { label: string; value: string | number; accent?: string }) => (
  <div className="border border-border/40 bg-surface-raised p-4">
    <p className="text-[9px] uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
    <p className={`font-serif text-2xl mt-2 ${accent || "text-foreground"}`}>{value}</p>
  </div>
);

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="card-luxury p-5">
    <p className="eyebrow mb-4">{title}</p>
    {children}
  </div>
);

const BarList = ({ items, formatValue }: { items: [string, number][]; formatValue?: (n: number) => string }) => {
  const max = Math.max(1, ...items.map(([, v]) => v));
  return (
    <div className="space-y-2">
      {items.length === 0 ? <p className="text-xs text-muted-foreground">No data.</p> : items.map(([name, v]) => (
        <div key={name} className="flex items-center gap-3 text-xs">
          <span className="w-40 truncate text-muted-foreground">{name}</span>
          <div className="flex-1 h-2 bg-border/30 relative"><div className="absolute inset-y-0 left-0 bg-gold" style={{ width: `${(v/max)*100}%` }}/></div>
          <span className="w-20 text-right text-gold">{formatValue ? formatValue(v) : v}</span>
        </div>
      ))}
    </div>
  );
};

export default AdminAnalytics;
