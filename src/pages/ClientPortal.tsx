import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Seo } from "@/components/Seo";
import Logo from "@/components/svrm/Logo";

interface Booking {
  id: string; booking_code: string; client_name: string;
  start_date: string | null; end_date: string | null;
  currency: string; subtotal: number; deposit_amount: number; balance_due: number;
  line_items: Array<{ label: string; qty?: number; unit?: string; amount: number }>;
  status: string; notes: string | null;
}

const ClientPortal = () => {
  const { token } = useParams<{ token: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ guests: "", start_date: "", end_date: "", pickup: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { (async () => {
    if (!token) return;
    const { data, error } = await supabase.from("manual_bookings").select("*").eq("client_token", token).maybeSingle();
    setLoading(false);
    if (error || !data) return toast.error("Booking not found");
    setBooking(data as any);
  })(); }, [token]);

  const submit = async () => {
    if (!booking) return;
    setSubmitting(true);
    const changes: Record<string, string> = {};
    if (form.guests) changes.guests = form.guests;
    if (form.start_date) changes.start_date = form.start_date;
    if (form.end_date) changes.end_date = form.end_date;
    if (form.pickup) changes.pickup = form.pickup;
    if (form.notes) changes.notes = form.notes;
    const { error } = await supabase.from("booking_change_requests" as any).insert({
      booking_id: booking.id,
      requested_by_name: booking.client_name,
      changes: changes as any,
      message: form.notes || null,
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    setSubmitted(true); setShowForm(false);
    toast.success("Request submitted. Our concierge will get back to you.");
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground text-xs uppercase tracking-[0.3em]">Loading…</div>;
  if (!booking) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Booking not found or link expired.</div>;

  const past = booking.start_date ? new Date(booking.start_date) < new Date() : false;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Seo title={`Your SVRM booking · ${booking.booking_code}`} description="Your SVRM concierge booking details" path={`/booking/${token}`} />
      <div className="max-w-2xl mx-auto p-6 md:p-10">
        <div className="flex items-center gap-3 mb-8">
          <Logo size="md"/>
          <div>
            <p className="eyebrow">SVRM</p>
            <p className="font-serif text-xl">Concierge</p>
          </div>
        </div>

        <div className="card-luxury p-8">
          <p className="eyebrow">Booking confirmed</p>
          <h1 className="font-serif text-3xl md:text-4xl mt-2">Thank you, {booking.client_name.split(" ")[0]}.</h1>
          <p className="text-sm text-muted-foreground mt-3">Your reference: <span className="text-gold font-mono">{booking.booking_code}</span></p>

          <div className="mt-8 grid md:grid-cols-2 gap-4 text-sm">
            <div><p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Dates</p><p className="mt-1">{booking.start_date} {booking.end_date && `→ ${booking.end_date}`}</p></div>
            <div><p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Status</p><p className="mt-1 capitalize">{booking.status.replace("_"," ")}</p></div>
          </div>

          {booking.line_items?.length > 0 && (
            <div className="mt-8">
              <p className="eyebrow mb-3">Included</p>
              <div className="space-y-2 text-sm">
                {booking.line_items.map((it, i) => (
                  <div key={i} className="flex justify-between border-b border-border/30 py-2">
                    <span>{it.label}{it.qty ? ` × ${it.qty}${it.unit ? ` ${it.unit}` : ""}` : ""}</span>
                    <span className="font-mono">{booking.currency} {Number(it.amount).toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 text-gold">
                  <span>Balance due</span>
                  <span className="font-mono">{booking.currency} {Number(booking.balance_due).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {!past && (
            <div className="mt-8">
              {submitted ? (
                <p className="text-sm text-gold">Change request received — the concierge team will be in touch shortly.</p>
              ) : !showForm ? (
                <button onClick={() => setShowForm(true)} className="btn-ghost text-xs">Request a change</button>
              ) : (
                <div className="border border-border/40 p-5 space-y-3">
                  <p className="eyebrow">Request a change</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <label className="text-xs">Guests<input value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })} className="input-luxury text-sm w-full mt-1"/></label>
                    <label className="text-xs">Pickup / location<input value={form.pickup} onChange={e => setForm({ ...form, pickup: e.target.value })} className="input-luxury text-sm w-full mt-1"/></label>
                    <label className="text-xs">New start date<input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} className="input-luxury text-sm w-full mt-1"/></label>
                    <label className="text-xs">New end date<input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} className="input-luxury text-sm w-full mt-1"/></label>
                  </div>
                  <label className="block text-xs">Notes<textarea rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="input-luxury text-sm w-full mt-1"/></label>
                  <div className="flex gap-2">
                    <button onClick={() => setShowForm(false)} className="btn-ghost text-xs">Cancel</button>
                    <button onClick={submit} disabled={submitting} className="btn-luxury text-xs">{submitting ? "Sending…" : "Submit request"}</button>
                  </div>
                </div>
              )}
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-10">Questions? Contact concierge@svrm.group or +27 73 064 1481.</p>
        </div>
      </div>
    </main>
  );
};

export default ClientPortal;
