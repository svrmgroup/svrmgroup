import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Download } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  currency: string;
  note: string | null;
  manual_booking_id: string | null;
}

const CATEGORIES = ["fuel", "cleaning", "supplier", "marketing", "staff", "commission", "maintenance", "other"];
const COLORS = ["#c9a961", "#b8935a", "#8a8478", "#6c5f4a", "#4a4034", "#7a6a52", "#a89676", "#5c4f3c"];

const AdminExpenses = () => {
  const [rows, setRows] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<{ id: string; booking_code: string; client_name: string }[]>([]);
  const [monthFilter, setMonthFilter] = useState(new Date().toISOString().slice(0, 7));
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    category: "fuel",
    amount: "",
    currency: "ZAR",
    note: "",
    manual_booking_id: "",
  });

  const load = async () => {
    setLoading(true);
    const [{ data: exp, error }, { data: mb }] = await Promise.all([
      supabase.from("expenses").select("*").order("date", { ascending: false }).limit(500),
      supabase.from("manual_bookings").select("id, booking_code, client_name").order("created_at", { ascending: false }).limit(200),
    ]);
    if (error) toast.error(error.message);
    setRows((exp as any) || []);
    setBookings((mb as any) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => rows.filter((r) => r.date.startsWith(monthFilter)), [rows, monthFilter]);
  const monthTotal = filtered.reduce((s, r) => s + Number(r.amount), 0);
  const byCategory = useMemo(() => {
    const m = new Map<string, number>();
    filtered.forEach((r) => m.set(r.category, (m.get(r.category) || 0) + Number(r.amount)));
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const add = async () => {
    if (!form.amount || Number(form.amount) <= 0) return toast.error("Enter amount");
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from("expenses").insert({
      date: form.date,
      category: form.category,
      amount: Number(form.amount),
      currency: form.currency,
      note: form.note || null,
      manual_booking_id: form.manual_booking_id || null,
      created_by: userData.user?.id ?? null,
    });
    if (error) return toast.error(error.message);
    toast.success("Expense added");
    setForm({ ...form, amount: "", note: "", manual_booking_id: "" });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete expense?")) return;
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const exportCsv = () => {
    const header = "date,category,amount,currency,note\n";
    const body = filtered.map((r) =>
      [r.date, r.category, r.amount, r.currency, `"${(r.note || "").replace(/"/g, '""')}"`].join(","),
    ).join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses-${monthFilter}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <header className="flex items-baseline justify-between gap-4 flex-wrap">
        <div>
          <p className="eyebrow">Money out</p>
          <h1 className="font-serif text-3xl md:text-4xl mt-2">Expenses</h1>
        </div>
        <div className="flex items-center gap-2">
          <input type="month" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}
            className="input-luxury text-sm" />
          <button onClick={exportCsv} className="btn-ghost text-xs flex items-center gap-2">
            <Download className="h-3.5 w-3.5" /> CSV
          </button>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card-luxury p-5">
          <p className="eyebrow">Month total</p>
          <p className="font-serif text-3xl mt-2">R {monthTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          <p className="text-xs text-muted-foreground mt-1">{filtered.length} entries</p>
        </div>
        <div className="card-luxury p-5 md:col-span-2 h-56">
          {byCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byCategory} dataKey="value" nameKey="name" outerRadius={70} innerRadius={40}>
                  {byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#1f1b18", border: "1px solid #3a342c", color: "#e9e2d5" }} />
                <Legend wrapperStyle={{ fontSize: 11, color: "#8a8478" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-xs text-muted-foreground">No expenses this month</p>}
        </div>
      </div>

      <div className="card-luxury p-5 space-y-4">
        <p className="eyebrow">Add expense</p>
        <div className="grid md:grid-cols-6 gap-3">
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-luxury text-sm" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-luxury text-sm capitalize">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="number" step="0.01" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="input-luxury text-sm" />
          <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="input-luxury text-sm">
            <option>ZAR</option><option>USD</option><option>EUR</option><option>GBP</option>
          </select>
          <select value={form.manual_booking_id} onChange={(e) => setForm({ ...form, manual_booking_id: e.target.value })} className="input-luxury text-sm">
            <option value="">Not linked to booking</option>
            {bookings.map((b) => <option key={b.id} value={b.id}>{b.booking_code} — {b.client_name}</option>)}
          </select>
          <input placeholder="Note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="input-luxury text-sm" />
        </div>
        <button onClick={add} className="btn-luxury text-xs flex items-center gap-2">
          <Plus className="h-3.5 w-3.5" /> Add expense
        </button>
      </div>

      <div className="card-luxury overflow-hidden">
        {loading ? <p className="p-6 text-xs text-muted-foreground">Loading…</p> : filtered.length === 0 ? (
          <p className="p-6 text-xs text-muted-foreground">No expenses in {monthFilter}</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface-deep text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Note</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-border/40 hover:bg-surface-raised/50">
                  <td className="px-4 py-3 text-muted-foreground">{r.date}</td>
                  <td className="px-4 py-3 capitalize">{r.category}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.note || "—"}</td>
                  <td className="px-4 py-3 text-right font-mono">{r.currency} {Number(r.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => remove(r.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminExpenses;
