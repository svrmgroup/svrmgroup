import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Download } from "lucide-react";

const CATEGORIES = ["fuel", "cleaning", "supplier", "marketing", "staff", "commission", "maintenance", "utilities", "software", "insurance", "other"];

interface Expense {
  id: string; date: string; category: string; amount: number; currency: string;
  note: string | null; manual_booking_id: string | null; supplier_id: string | null;
}
interface Supplier { id: string; company_name: string; }
interface Booking { id: string; booking_code: string; client_name: string; }

const AdminExpenses = () => {
  const [rows, setRows] = useState<Expense[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<"month" | "year" | "all">("month");
  const [monthFilter, setMonthFilter] = useState(new Date().toISOString().slice(0, 7));
  const [yearFilter, setYearFilter] = useState(String(new Date().getFullYear()));
  const [catFilter, setCatFilter] = useState<string>("all");
  const [supplierFilter, setSupplierFilter] = useState<string>("all");

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    category: "fuel", amount: "", currency: "ZAR", note: "",
    manual_booking_id: "", supplier_id: "",
  });

  const load = async () => {
    setLoading(true);
    const [{ data: exp, error }, { data: mb }, { data: sup }] = await Promise.all([
      supabase.from("expenses").select("*").order("date", { ascending: false }).limit(2000),
      supabase.from("manual_bookings").select("id, booking_code, client_name").order("created_at", { ascending: false }).limit(300),
      supabase.from("suppliers_directory" as any).select("id, company_name").order("company_name"),
    ]);
    if (error) toast.error(error.message);
    setRows((exp as any) || []); setBookings((mb as any) || []); setSuppliers((sup as any) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => rows.filter(r => {
    if (range === "month" && !r.date.startsWith(monthFilter)) return false;
    if (range === "year" && !r.date.startsWith(yearFilter)) return false;
    if (catFilter !== "all" && r.category !== catFilter) return false;
    if (supplierFilter !== "all" && r.supplier_id !== supplierFilter) return false;
    return true;
  }), [rows, range, monthFilter, yearFilter, catFilter, supplierFilter]);

  const total = filtered.reduce((s, r) => s + Number(r.amount), 0);
  const byCat = useMemo(() => {
    const m = new Map<string, number>();
    filtered.forEach(r => m.set(r.category, (m.get(r.category) || 0) + Number(r.amount)));
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [filtered]);

  const add = async () => {
    if (!form.amount || Number(form.amount) <= 0) return toast.error("Enter amount");
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from("expenses").insert({
      date: form.date, category: form.category, amount: Number(form.amount),
      currency: form.currency, note: form.note || null,
      manual_booking_id: form.manual_booking_id || null,
      supplier_id: form.supplier_id || null,
      created_by: userData.user?.id ?? null,
    });
    if (error) return toast.error(error.message);
    toast.success("Expense added");
    setForm({ ...form, amount: "", note: "", manual_booking_id: "", supplier_id: "" });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete expense?")) return;
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const exportCsv = () => {
    const header = "date,category,amount,currency,supplier,note\n";
    const supName = (id: string | null) => suppliers.find(s => s.id === id)?.company_name || "";
    const body = filtered.map(r => [r.date, r.category, r.amount, r.currency, `"${supName(r.supplier_id)}"`, `"${(r.note || "").replace(/"/g, '""')}"`].join(",")).join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `expenses-${range === "month" ? monthFilter : range === "year" ? yearFilter : "all"}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-baseline justify-between gap-4 flex-wrap">
        <div>
          <p className="eyebrow">Money out</p>
          <h1 className="font-serif text-3xl md:text-4xl mt-2">Expenses</h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select value={range} onChange={e => setRange(e.target.value as any)} className="input-luxury text-sm">
            <option value="month">Month</option><option value="year">Year</option><option value="all">All time</option>
          </select>
          {range === "month" && <input type="month" value={monthFilter} onChange={e => setMonthFilter(e.target.value)} className="input-luxury text-sm" />}
          {range === "year" && <input type="number" value={yearFilter} onChange={e => setYearFilter(e.target.value)} className="input-luxury text-sm w-24" />}
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="input-luxury text-sm capitalize">
            <option value="all">All categories</option>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={supplierFilter} onChange={e => setSupplierFilter(e.target.value)} className="input-luxury text-sm">
            <option value="all">All suppliers</option>{suppliers.map(s => <option key={s.id} value={s.id}>{s.company_name}</option>)}
          </select>
          <button onClick={exportCsv} className="btn-ghost text-xs flex items-center gap-2"><Download className="h-3.5 w-3.5"/> CSV</button>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card-luxury p-5">
          <p className="eyebrow">Total</p>
          <p className="font-serif text-3xl mt-2">R {total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          <p className="text-xs text-muted-foreground mt-1">{filtered.length} entries</p>
        </div>
        <div className="card-luxury p-5 md:col-span-2">
          <p className="eyebrow mb-3">By category</p>
          {byCat.length === 0 ? <p className="text-xs text-muted-foreground">No expenses.</p> :
            <div className="space-y-2">
              {byCat.map(([name, v]) => {
                const max = Math.max(...byCat.map(([, x]) => x));
                return (
                  <div key={name} className="flex items-center gap-3 text-xs">
                    <span className="w-24 capitalize text-muted-foreground">{name}</span>
                    <div className="flex-1 h-2 bg-border/30 relative"><div className="absolute inset-y-0 left-0 bg-gold" style={{ width: `${(v/max)*100}%` }}/></div>
                    <span className="w-24 text-right font-mono text-gold">R {v.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          }
        </div>
      </div>

      <div className="card-luxury p-5 space-y-4">
        <p className="eyebrow">Add expense</p>
        <div className="grid md:grid-cols-4 gap-3">
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input-luxury text-sm" />
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-luxury text-sm capitalize">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="number" step="0.01" placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="input-luxury text-sm" />
          <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} className="input-luxury text-sm">
            <option>ZAR</option><option>USD</option><option>EUR</option><option>GBP</option>
          </select>
          <select value={form.supplier_id} onChange={e => setForm({ ...form, supplier_id: e.target.value })} className="input-luxury text-sm">
            <option value="">No supplier</option>{suppliers.map(s => <option key={s.id} value={s.id}>{s.company_name}</option>)}
          </select>
          <select value={form.manual_booking_id} onChange={e => setForm({ ...form, manual_booking_id: e.target.value })} className="input-luxury text-sm">
            <option value="">Not linked to booking</option>{bookings.map(b => <option key={b.id} value={b.id}>{b.booking_code} — {b.client_name}</option>)}
          </select>
          <input placeholder="Note" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} className="input-luxury text-sm md:col-span-2" />
        </div>
        <button onClick={add} className="btn-luxury text-xs flex items-center gap-2"><Plus className="h-3.5 w-3.5"/> Add expense</button>
      </div>

      <div className="card-luxury overflow-hidden">
        {loading ? <p className="p-6 text-xs text-muted-foreground">Loading…</p> : filtered.length === 0 ? (
          <p className="p-6 text-xs text-muted-foreground">No expenses for this filter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead className="bg-surface-deep text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Supplier</th>
                  <th className="px-4 py-3 text-left">Note</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className="border-t border-border/40 hover:bg-surface-raised/50">
                    <td className="px-4 py-3 text-muted-foreground">{r.date}</td>
                    <td className="px-4 py-3 capitalize">{r.category}</td>
                    <td className="px-4 py-3 text-muted-foreground">{suppliers.find(s => s.id === r.supplier_id)?.company_name || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.note || "—"}</td>
                    <td className="px-4 py-3 text-right font-mono">{r.currency} {Number(r.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-right"><button onClick={() => remove(r.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5"/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminExpenses;
