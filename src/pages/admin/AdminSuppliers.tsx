import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, MessageCircle, Trash2, Check } from "lucide-react";

interface Supplier {
  id: string;
  name: string;
  category: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  notes: string | null;
}
interface Payout {
  id: string;
  supplier_id: string;
  amount: number;
  currency: string;
  due_date: string | null;
  status: string;
  paid_at: string | null;
  note: string | null;
  manual_booking_id: string | null;
}

const CATS = ["owner", "driver", "guide", "cleaner", "chef", "photographer", "other"];

const AdminSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", category: "owner", phone: "", whatsapp: "", email: "", notes: "" });
  const [payForm, setPayForm] = useState({ amount: "", currency: "ZAR", due_date: "", note: "" });

  const load = async () => {
    const [{ data: s }, { data: p }] = await Promise.all([
      supabase.from("suppliers").select("*").order("name"),
      supabase.from("supplier_payouts").select("*").order("created_at", { ascending: false }),
    ]);
    setSuppliers((s as any) || []);
    setPayouts((p as any) || []);
  };
  useEffect(() => { load(); }, []);

  const balanceBySupplier = useMemo(() => {
    const m = new Map<string, number>();
    payouts.forEach((p) => {
      if (p.status === "pending") m.set(p.supplier_id, (m.get(p.supplier_id) || 0) + Number(p.amount));
    });
    return m;
  }, [payouts]);

  const selectedSupplier = suppliers.find((s) => s.id === selected);
  const selectedPayouts = payouts.filter((p) => p.supplier_id === selected);

  const addSupplier = async () => {
    if (!form.name.trim()) return toast.error("Name required");
    const { error } = await supabase.from("suppliers").insert({
      name: form.name.trim(), category: form.category,
      phone: form.phone || null, whatsapp: form.whatsapp || form.phone || null,
      email: form.email || null, notes: form.notes || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Supplier added");
    setForm({ name: "", category: "owner", phone: "", whatsapp: "", email: "", notes: "" });
    setShowNew(false);
    load();
  };

  const addPayout = async () => {
    if (!selected) return;
    if (!payForm.amount || Number(payForm.amount) <= 0) return toast.error("Enter amount");
    const { error } = await supabase.from("supplier_payouts").insert({
      supplier_id: selected,
      amount: Number(payForm.amount),
      currency: payForm.currency,
      due_date: payForm.due_date || null,
      note: payForm.note || null,
      status: "pending",
    });
    if (error) return toast.error(error.message);
    setPayForm({ amount: "", currency: "ZAR", due_date: "", note: "" });
    load();
  };

  const markPaid = async (id: string) => {
    const { error } = await supabase.from("supplier_payouts").update({ status: "paid", paid_at: new Date().toISOString() }).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const deletePayout = async (id: string) => {
    if (!confirm("Delete payout?")) return;
    await supabase.from("supplier_payouts").delete().eq("id", id);
    load();
  };

  const waLink = (phone: string | null | undefined, msg: string) => {
    if (!phone) return "#";
    const clean = phone.replace(/[^0-9]/g, "");
    return `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="space-y-8">
      <header className="flex items-baseline justify-between">
        <div>
          <p className="eyebrow">Partners</p>
          <h1 className="font-serif text-3xl md:text-4xl mt-2">Suppliers &amp; payouts</h1>
        </div>
        <button onClick={() => setShowNew(!showNew)} className="btn-luxury text-xs flex items-center gap-2">
          <Plus className="h-3.5 w-3.5" /> New supplier
        </button>
      </header>

      {showNew && (
        <div className="card-luxury p-5 grid md:grid-cols-3 gap-3">
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-luxury text-sm" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-luxury text-sm capitalize">
            {CATS.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-luxury text-sm" />
          <input placeholder="WhatsApp (defaults to phone)" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className="input-luxury text-sm" />
          <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-luxury text-sm" />
          <input placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-luxury text-sm" />
          <button onClick={addSupplier} className="btn-luxury text-xs md:col-span-3">Save supplier</button>
        </div>
      )}

      <div className="grid md:grid-cols-[300px_1fr] gap-6">
        <div className="card-luxury overflow-hidden">
          {suppliers.length === 0 ? <p className="p-4 text-xs text-muted-foreground">No suppliers yet</p> :
            suppliers.map((s) => {
              const owed = balanceBySupplier.get(s.id) || 0;
              return (
                <button key={s.id} onClick={() => setSelected(s.id)}
                  className={`w-full text-left px-4 py-3 border-b border-border/40 hover:bg-surface-raised/50 ${selected === s.id ? "bg-surface-raised" : ""}`}>
                  <p className="text-sm">{s.name}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-0.5">{s.category}</p>
                  {owed > 0 && <p className="text-xs text-gold mt-1 font-mono">Owed: R {owed.toLocaleString()}</p>}
                </button>
              );
            })
          }
        </div>

        <div>
          {selectedSupplier ? (
            <div className="space-y-5">
              <div className="card-luxury p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-2xl">{selectedSupplier.name}</h2>
                    <p className="text-xs text-muted-foreground uppercase tracking-[0.24em] mt-1">{selectedSupplier.category}</p>
                    <div className="mt-3 text-sm space-y-1 text-muted-foreground">
                      {selectedSupplier.phone && <p>📞 {selectedSupplier.phone}</p>}
                      {selectedSupplier.email && <p>✉ {selectedSupplier.email}</p>}
                      {selectedSupplier.notes && <p className="italic">{selectedSupplier.notes}</p>}
                    </div>
                  </div>
                  {(selectedSupplier.whatsapp || selectedSupplier.phone) && (
                    <a href={waLink(selectedSupplier.whatsapp || selectedSupplier.phone, `Hi ${selectedSupplier.name}, this is SVRM.`)}
                      target="_blank" rel="noreferrer" className="btn-ghost text-xs flex items-center gap-2">
                      <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                    </a>
                  )}
                </div>
              </div>

              <div className="card-luxury p-5 space-y-3">
                <p className="eyebrow">Log a payout</p>
                <div className="grid md:grid-cols-4 gap-2">
                  <input type="number" placeholder="Amount" value={payForm.amount} onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })} className="input-luxury text-sm" />
                  <select value={payForm.currency} onChange={(e) => setPayForm({ ...payForm, currency: e.target.value })} className="input-luxury text-sm">
                    <option>ZAR</option><option>USD</option><option>EUR</option><option>GBP</option>
                  </select>
                  <input type="date" value={payForm.due_date} onChange={(e) => setPayForm({ ...payForm, due_date: e.target.value })} className="input-luxury text-sm" />
                  <input placeholder="Note" value={payForm.note} onChange={(e) => setPayForm({ ...payForm, note: e.target.value })} className="input-luxury text-sm" />
                </div>
                <button onClick={addPayout} className="btn-luxury text-xs">Add payout</button>
              </div>

              <div className="card-luxury overflow-hidden">
                {selectedPayouts.length === 0 ? <p className="p-4 text-xs text-muted-foreground">No payouts recorded</p> :
                  <table className="w-full text-sm">
                    <thead className="bg-surface-deep text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      <tr>
                        <th className="px-4 py-2 text-left">Due</th>
                        <th className="px-4 py-2 text-left">Note</th>
                        <th className="px-4 py-2 text-right">Amount</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPayouts.map((p) => (
                        <tr key={p.id} className="border-t border-border/40">
                          <td className="px-4 py-2 text-muted-foreground">{p.due_date || "—"}</td>
                          <td className="px-4 py-2 text-muted-foreground">{p.note || "—"}</td>
                          <td className="px-4 py-2 text-right font-mono">{p.currency} {Number(p.amount).toLocaleString()}</td>
                          <td className="px-4 py-2">
                            <span className={`text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 rounded border ${p.status === "paid" ? "border-green-500/40 text-green-300" : "border-yellow-500/40 text-yellow-300"}`}>{p.status}</span>
                          </td>
                          <td className="px-4 py-2 text-right space-x-2 whitespace-nowrap">
                            {p.status === "pending" && (
                              <button onClick={() => markPaid(p.id)} className="text-gold hover:opacity-80" title="Mark paid">
                                <Check className="h-3.5 w-3.5 inline" />
                              </button>
                            )}
                            <button onClick={() => deletePayout(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5 inline" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                }
              </div>
            </div>
          ) : <p className="text-xs text-muted-foreground">Select a supplier to view details</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminSuppliers;
