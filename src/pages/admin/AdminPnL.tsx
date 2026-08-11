import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Download } from "lucide-react";

type Period = "month" | "last_month" | "quarter" | "ytd" | "all" | "custom";

const PERIODS: { key: Period; label: string }[] = [
  { key: "month", label: "This month" },
  { key: "last_month", label: "Last month" },
  { key: "quarter", label: "This quarter" },
  { key: "ytd", label: "Year to date" },
  { key: "all", label: "All time" },
  { key: "custom", label: "Custom" },
];

const iso = (d: Date) => d.toISOString().slice(0, 10);

/** Returns [startDate, endDateExclusive] as YYYY-MM-DD, or nulls for all-time. */
function rangeFor(period: Period, month: string, from: string, to: string): [string | null, string | null] {
  const now = new Date();
  if (period === "all") return [null, null];
  if (period === "custom") return [from || null, to ? iso(new Date(new Date(to).getTime() + 864e5)) : null];
  if (period === "ytd") return [`${now.getFullYear()}-01-01`, iso(new Date(now.getFullYear() + 1, 0, 1))];
  if (period === "quarter") {
    const q = Math.floor(now.getMonth() / 3);
    return [iso(new Date(now.getFullYear(), q * 3, 1)), iso(new Date(now.getFullYear(), q * 3 + 3, 1))];
  }
  if (period === "last_month") {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return [iso(start), iso(new Date(now.getFullYear(), now.getMonth(), 1))];
  }
  // explicit month picker
  const start = `${month}-01`;
  const s = new Date(start);
  return [start, iso(new Date(s.getFullYear(), s.getMonth() + 1, 1))];
}

const AdminPnL = () => {
  const [period, setPeriod] = useState<Period>("month");
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [currency, setCurrency] = useState("ZAR");
  const [bookings, setBookings] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [start, end] = useMemo(() => rangeFor(period, month, from, to), [period, month, from, to]);

  const periodLabel = period === "all"
    ? "all time"
    : period === "custom"
      ? `${from || "start"} → ${to || "today"}`
      : period === "month"
        ? month
        : PERIODS.find((p) => p.key === period)!.label.toLowerCase();

  useEffect(() => {
    (async () => {
      setLoading(true);
      let bq = supabase
        .from("manual_bookings")
        .select("id, booking_code, client_name, subtotal, amount_paid, currency, start_date, created_at, status")
        .eq("currency", currency);
      let eq = supabase
        .from("expenses")
        .select("id, amount, currency, category, manual_booking_id, date")
        .eq("currency", currency);
      if (start) { bq = bq.gte("created_at", start); eq = eq.gte("date", start); }
      if (end) { bq = bq.lt("created_at", end + "T00:00:00Z"); eq = eq.lt("date", end); }
      const [{ data: mb }, { data: ex }] = await Promise.all([bq, eq]);
      setBookings(mb || []);
      setExpenses(ex || []);
      setLoading(false);
    })();
  }, [currency, start, end]);

  const revenue = bookings.reduce((s, b) => s + Number(b.amount_paid || 0), 0);
  const booked = bookings.reduce((s, b) => s + Number(b.subtotal || 0), 0);
  const outstanding = Math.max(0, booked - revenue);
  const expensesTotal = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const net = revenue - expensesTotal;
  const margin = revenue > 0 ? (net / revenue) * 100 : 0;

  const byCategory = useMemo(() => {
    const m = new Map<string, number>();
    expenses.forEach((e) => m.set(e.category, (m.get(e.category) || 0) + Number(e.amount)));
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  const perBooking = useMemo(() => bookings.map((b) => {
    const linked = expenses.filter((e) => e.manual_booking_id === b.id).reduce((s, e) => s + Number(e.amount), 0);
    return { ...b, expenses: linked, paid: Number(b.amount_paid || 0), profit: Number(b.amount_paid || 0) - linked };
  }), [bookings, expenses]);

  const fmt = (n: number) => `${currency} ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;


  const exportCsv = () => {
    const lines = [
      ["Section", "Label", "Amount"].join(","),
      ["Summary", "Revenue (paid)", revenue].join(","),
      ["Summary", "Booked value", booked].join(","),
      ["Summary", "Outstanding", outstanding].join(","),
      ["Summary", "Expenses", expensesTotal].join(","),
      ["Summary", "Net profit", net].join(","),
      ["Summary", "Margin %", margin.toFixed(2)].join(","),
      "",
      "Expenses by category,,",
      ...byCategory.map(([c, v]) => ["", c, v].join(",")),
      "",
      "Per booking,,,",
      ["Code", "Client", "Booked", "Paid", "Expenses", "Profit"].join(","),
      ...perBooking.map((b) => [b.booking_code, b.client_name, b.subtotal, b.paid, b.expenses, b.profit].join(",")),
    ].join("\n");
    const blob = new Blob([lines], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `pnl-${currency}-${period === "month" ? month : period}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8">
      <header className="flex items-baseline justify-between gap-4 flex-wrap">
        <div>
          <p className="eyebrow">Money in / money out</p>
          <h1 className="font-serif text-3xl md:text-4xl mt-2">Profit &amp; Loss</h1>
          <p className="text-xs text-muted-foreground mt-2">Showing {periodLabel}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select value={period} onChange={(e) => setPeriod(e.target.value as Period)} className="input-luxury text-sm">
            {PERIODS.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
          </select>
          {period === "month" && (
            <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="input-luxury text-sm" />
          )}
          {period === "custom" && (
            <>
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="input-luxury text-sm" />
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="input-luxury text-sm" />
            </>
          )}
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="input-luxury text-sm">
            <option>ZAR</option><option>USD</option><option>EUR</option><option>GBP</option>
          </select>
          <button onClick={exportCsv} className="btn-ghost text-xs flex items-center gap-2">
            <Download className="h-3.5 w-3.5" /> CSV
          </button>
        </div>
      </header>

      {loading ? <p className="text-xs text-muted-foreground">Loading…</p> : (
        <>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="card-luxury p-5"><p className="eyebrow">Revenue</p><p className="font-serif text-2xl mt-2">{fmt(revenue)}</p></div>
            <div className="card-luxury p-5"><p className="eyebrow">Expenses</p><p className="font-serif text-2xl mt-2 text-destructive/80">{fmt(expensesTotal)}</p></div>
            <div className="card-luxury p-5"><p className="eyebrow">Net profit</p><p className={`font-serif text-2xl mt-2 ${net >= 0 ? "text-gold" : "text-destructive"}`}>{fmt(net)}</p></div>
            <div className="card-luxury p-5"><p className="eyebrow">Margin</p><p className="font-serif text-2xl mt-2">{margin.toFixed(1)}%</p></div>
          </div>

          <section>
            <p className="eyebrow mb-3">Expenses by category</p>
            <div className="card-luxury p-5 space-y-2">
              {byCategory.length === 0 ? <p className="text-xs text-muted-foreground">No expenses</p> :
                byCategory.map(([c, v]) => (
                  <div key={c} className="flex items-center justify-between text-sm">
                    <span className="capitalize text-muted-foreground">{c}</span>
                    <span className="font-mono">{fmt(v)}</span>
                  </div>
                ))
              }
            </div>
          </section>

          <section>
            <p className="eyebrow mb-3">Per-booking profit</p>
            <div className="card-luxury overflow-hidden">
              {perBooking.length === 0 ? <p className="p-6 text-xs text-muted-foreground">No bookings for {periodLabel}</p> : (
                <table className="w-full text-sm">
                  <thead className="bg-surface-deep text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 text-left">Code</th>
                      <th className="px-4 py-3 text-left">Client</th>
                      <th className="px-4 py-3 text-right">Revenue</th>
                      <th className="px-4 py-3 text-right">Expenses</th>
                      <th className="px-4 py-3 text-right">Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {perBooking.map((b) => (
                      <tr key={b.id} className="border-t border-border/40">
                        <td className="px-4 py-3 font-mono text-xs">{b.booking_code}</td>
                        <td className="px-4 py-3">{b.client_name}</td>
                        <td className="px-4 py-3 text-right font-mono">{fmt(Number(b.subtotal))}</td>
                        <td className="px-4 py-3 text-right font-mono text-destructive/80">{fmt(b.expenses)}</td>
                        <td className={`px-4 py-3 text-right font-mono ${b.profit >= 0 ? "text-gold" : "text-destructive"}`}>{fmt(b.profit)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default AdminPnL;
