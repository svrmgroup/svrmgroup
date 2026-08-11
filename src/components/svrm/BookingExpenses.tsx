import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CATEGORIES = ["fuel", "cleaning", "supplier", "marketing", "staff", "commission", "maintenance", "utilities", "software", "insurance", "other"];

interface Row {
  id: string;
  date: string;
  category: string;
  amount: number;
  currency: string;
  note: string | null;
}

/** Inline expense tracker attached to a single manual booking. */
export default function BookingExpenses({ bookingId, currency = "ZAR" }: { bookingId: string; currency?: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    category: "supplier",
    amount: "",
    currency,
    note: "",
  });

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("expenses")
      .select("id, date, category, amount, currency, note")
      .eq("manual_booking_id", bookingId)
      .order("date", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [bookingId]);

  const total = rows.reduce((s, r) => s + Number(r.amount || 0), 0);

  const add = async () => {
    const amount = Number(form.amount);
    if (!amount) return toast.error("Enter an amount");
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from("expenses").insert({
      date: form.date,
      category: form.category,
      amount,
      currency: form.currency,
      note: form.note.trim() || null,
      manual_booking_id: bookingId,
      created_by: userData.user?.id ?? null,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Expense added");
    setForm((f) => ({ ...f, amount: "", note: "" }));
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this expense?")) return;
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setRows((r) => r.filter((x) => x.id !== id));
  };

  const inputCls = "w-full bg-background border border-border/60 px-3 py-2 text-sm focus:border-primary focus:outline-none";

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Expenses</p>
        <p className="text-xs text-muted-foreground">
          Total: <span className="text-gold">{currency} {total.toLocaleString()}</span>
        </p>
      </div>

      {loading ? (
        <p className="text-xs text-muted-foreground">Loading…</p>
      ) : rows.length > 0 ? (
        <div className="space-y-1.5 mb-3">
          {rows.map((r) => (
            <div key={r.id} className="flex items-center gap-3 text-xs border border-border/40 px-3 py-2">
              <span className="text-muted-foreground w-24 shrink-0">{r.date}</span>
              <span className="capitalize w-24 shrink-0">{r.category}</span>
              <span className="flex-1 min-w-0 truncate text-muted-foreground">{r.note || "—"}</span>
              <span className="shrink-0">{r.currency} {Number(r.amount).toLocaleString()}</span>
              <button onClick={() => remove(r.id)} className="text-destructive hover:text-destructive/80 shrink-0">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground mb-3">No expenses logged for this booking yet.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 items-center">
        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputCls} />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={`${inputCls} capitalize`}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className={inputCls} />
        <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className={inputCls}>
          <option>ZAR</option><option>USD</option><option>EUR</option><option>GBP</option>
        </select>
        <input placeholder="Note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className={`${inputCls} md:col-span-1`} />
        <button
          onClick={add}
          disabled={saving}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground text-[10px] uppercase tracking-[0.2em] hover:bg-primary-glow transition-colors disabled:opacity-50"
        >
          <Plus className="h-3 w-3" /> Add
        </button>
      </div>
    </div>
  );
}
