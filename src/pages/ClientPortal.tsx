import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Seo } from "@/components/Seo";
import Logo from "@/components/svrm/Logo";
import { FileDown, MessageCircle, Clock, CheckCircle2 } from "lucide-react";
import { downloadInvoicePdf, downloadConfirmationPdf, downloadThankYouPdf } from "@/lib/invoicePdf";

interface Booking {
  id: string; booking_code: string; client_name: string;
  client_email: string | null; client_phone: string | null;
  start_date: string | null; end_date: string | null;
  currency: string; subtotal: number; deposit_amount: number; balance_due: number;
  line_items: Array<{ label: string; qty?: number; unit?: string; amount: number }>;
  status: string; notes: string | null; created_at?: string;
  portal_expires_at: string | null; portal_completed_at: string | null;
}

interface Settings {
  company_whatsapp?: string; company_email?: string; company_phone?: string;
}

const ClientPortal = () => {
  const { token } = useParams<{ token: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { (async () => {
    if (!token) return;
    const [{ data: bRows }, { data: s }] = await Promise.all([
      supabase.rpc("get_booking_by_token" as any, { _token: token }),
      supabase.rpc("get_public_settings" as any),
    ]);
    setLoading(false);
    const b = Array.isArray(bRows) ? bRows[0] : bRows;
    if (!b) return toast.error("Booking not found");
    setBooking(b as any);
    const row = Array.isArray(s) ? s[0] : s;
    setSettings((row as any) || {});
  })(); }, [token]);

  const submit = async () => {
    if (!booking) return;
    if (!message.trim()) return toast.error("Please describe your requested change.");
    setSubmitting(true);
    const { error } = await supabase.from("booking_change_requests" as any).insert({
      booking_id: booking.id,
      requested_by_name: booking.client_name,
      requested_by_email: booking.client_email,
      changes: {} as any,
      message: message.trim().slice(0, 2000),
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    setSubmitted(true); setShowForm(false);
    toast.success("Request submitted. Our concierge will get back to you shortly.");
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground text-xs uppercase tracking-[0.3em]">Loading…</div>;
  if (!booking) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Booking not found or link expired.</div>;

  const now = new Date();
  const expired = booking.portal_expires_at ? new Date(booking.portal_expires_at) < now : false;
  const completed = !!booking.portal_completed_at;
  const daysLeft = booking.portal_expires_at
    ? Math.max(0, Math.ceil((new Date(booking.portal_expires_at).getTime() - now.getTime()) / 86400000))
    : null;

  if (completed || expired) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <Logo size="md" />
          <CheckCircle2 className="h-12 w-12 text-gold mx-auto"/>
          <h1 className="font-serif text-3xl">Thank you — your journey is complete.</h1>
          <p className="text-sm text-muted-foreground">
            This private link has {completed ? "been marked complete" : "expired"}. We hope you enjoyed your time with SVRM.
          </p>
          {settings.company_email && (
            <p className="text-xs text-muted-foreground pt-4">Get in touch anytime: {settings.company_email}</p>
          )}
        </div>
      </main>
    );
  }

  const wa = (settings.company_whatsapp || "").replace(/\D/g, "");

  return (
    <main className="min-h-screen bg-background text-foreground pb-safe">
      <Seo title={`Your SVRM booking · ${booking.booking_code}`} description="Your SVRM concierge booking" path={`/portal/${token}`} />
      <div className="max-w-2xl mx-auto p-6 md:p-10">
        <div className="flex items-center gap-3 mb-8">
          <Logo size="md"/>
          <div>
            <p className="eyebrow">SVRM</p>
            <p className="font-serif text-xl">Concierge</p>
          </div>
        </div>

        {daysLeft !== null && (
          <div className="mb-6 flex items-center gap-2 px-4 py-2.5 bg-primary/5 border border-primary/20 rounded-md text-xs">
            <Clock className="h-3.5 w-3.5 text-gold flex-shrink-0"/>
            <span className="text-muted-foreground">
              Your private link expires in <span className="text-gold font-medium">{daysLeft} {daysLeft === 1 ? "day" : "days"}</span> — {new Date(booking.portal_expires_at!).toLocaleDateString()}.
            </span>
          </div>
        )}

        <div className="card-luxury p-6 md:p-8">
          <p className="eyebrow">Booking confirmed</p>
          <h1 className="font-serif text-3xl md:text-4xl mt-2">Thank you, {booking.client_name.split(" ")[0]}.</h1>
          <p className="text-sm text-muted-foreground mt-3">Your reference: <span className="text-gold font-mono">{booking.booking_code}</span></p>

          <div className="mt-8 grid md:grid-cols-2 gap-4 text-sm">
            <div><p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Dates</p><p className="mt-1">{booking.start_date} {booking.end_date && `→ ${booking.end_date}`}</p></div>
            <div><p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Status</p><p className="mt-1 capitalize">{booking.status.replace("_"," ")}</p></div>
          </div>

          <div className="mt-6 border-t border-border/30 pt-6">
            <p className="eyebrow mb-3">Your details</p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Name</p>
                <p className="mt-1">{booking.client_name}</p>
              </div>
              {booking.client_email && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Email</p>
                  <p className="mt-1 break-all">{booking.client_email}</p>
                </div>
              )}
              {booking.client_phone && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Phone</p>
                  <p className="mt-1">{booking.client_phone}</p>
                </div>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground mt-3">If any of these look wrong, use "Request a change" below and we'll update them.</p>
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

          {/* Downloadable PDFs */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button onClick={() => downloadInvoicePdf(booking as any, token)} className="btn-ghost text-xs flex items-center justify-center gap-2"><FileDown className="h-3.5 w-3.5"/>Invoice PDF</button>
            <button onClick={() => downloadConfirmationPdf(booking as any, token)} className="btn-ghost text-xs flex items-center justify-center gap-2"><FileDown className="h-3.5 w-3.5"/>Confirmation</button>
            <button onClick={() => downloadThankYouPdf(booking as any, token)} className="btn-ghost text-xs flex items-center justify-center gap-2"><FileDown className="h-3.5 w-3.5"/>Thank-you note</button>
          </div>

          {wa && (
            <a href={`https://wa.me/${wa}?text=${encodeURIComponent("Hi SVRM, regarding booking " + booking.booking_code + "...")}`} target="_blank" rel="noopener noreferrer"
               className="mt-3 flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary/10 border border-primary/40 text-gold text-xs uppercase tracking-[0.24em] hover:bg-primary/20 transition-colors rounded-md">
              <MessageCircle className="h-4 w-4"/> WhatsApp your concierge
            </a>
          )}

          <div className="mt-8">
            {submitted ? (
              <p className="text-sm text-gold">Change request received — our team will be in touch shortly.</p>
            ) : !showForm ? (
              <button onClick={() => setShowForm(true)} className="btn-ghost text-xs">Request a change</button>
            ) : (
              <div className="border border-border/40 p-5 space-y-3 rounded-md">
                <p className="eyebrow">Request a change</p>
                <p className="text-xs text-muted-foreground">Every booking is different — tell us in your own words what you'd like adjusted (dates, guests, add-ons, pickup, anything else).</p>
                <label className="block text-xs">
                  Your request
                  <textarea
                    autoFocus
                    rows={6}
                    value={message}
                    onChange={e => setMessage(e.target.value.slice(0, 2000))}
                    placeholder="e.g. Could we push our pickup to 2pm on Friday and add a car seat for a 2-year-old?"
                    className="input-luxury text-sm w-full mt-1"
                    maxLength={2000}
                  />
                  <span className="mt-1 block text-[10px] text-muted-foreground text-right">{message.length}/2000</span>
                </label>
                <div className="flex gap-2">
                  <button onClick={() => setShowForm(false)} className="btn-ghost text-xs">Cancel</button>
                  <button onClick={submit} disabled={submitting || !message.trim()} className="btn-luxury text-xs">{submitting ? "Sending…" : "Submit request"}</button>
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground mt-10">
            Questions? {settings.company_email || "concierge@svrm.group"} · {settings.company_phone || "+27 73 064 1481"}
          </p>
        </div>
      </div>
    </main>
  );
};

export default ClientPortal;
