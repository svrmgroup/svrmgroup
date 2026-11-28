import { useEffect, useMemo, useState } from "react";
import { Copy, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import WhatsAppGlyph from "./WhatsAppGlyph";
import { CONCIERGE_EMAIL } from "@/lib/whatsapp";
import {
  buildEnquiryMessage, enquiryFields, enquiryWhatsAppUrl, todayIso, validateEnquiry,
  type EnquiryErrors, type EnquiryInput, type EnquiryListing,
} from "@/lib/listingEnquiry";
import { trackListingHandoff } from "@/lib/listingAnalytics";

interface Props { listing: EnquiryListing; category: string; vehicleOptions?: string[] }

const Field = ({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label htmlFor={id} className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</Label>
    {children}
    {error && <p className="text-xs text-destructive" role="alert">{error}</p>}
  </div>
);

/** Date-and-party form that opens a WhatsApp draft about this exact listing. Never confirms a booking. */
function EnquiryFormBody({ listing, category, vehicleOptions, idPrefix }: Props & { idPrefix: string }) {
  const f = enquiryFields(listing.kind);
  const [input, setInput] = useState<EnquiryInput>({ guests: 2, direction: "arrival", occasion: listing.detail });
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [failed, setFailed] = useState(false);
  // A second listing must never inherit the first one's selections.
  useEffect(() => { setInput({ guests: 2, direction: "arrival", occasion: listing.detail }); setErrors({}); setFailed(false); }, [listing.id, listing.detail]);
  const today = todayIso();
  const check = useMemo(() => validateEnquiry(listing.kind, input, today), [listing.kind, input, today]);
  const message = buildEnquiryMessage(listing, input);
  const set = (k: keyof EnquiryInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setInput((p) => ({ ...p, [k]: e.target.type === "number" ? (e.target.value === "" ? undefined : Number(e.target.value)) : e.target.value }));
  const id = (k: string) => `${idPrefix}-${k}`;

  const onWhatsApp = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (Object.keys(check.errors).length) { e.preventDefault(); setErrors(check.errors); return; }
    setErrors({});
    trackListingHandoff(listing.id, category, listing.kind, "whatsapp");
    // If WhatsApp can't open (blocked pop-up), offer copy and email.
    window.setTimeout(() => setFailed(true), 1500);
  };
  const onCopy = async () => {
    if (Object.keys(check.errors).length) { setErrors(check.errors); return; }
    try { await navigator.clipboard.writeText(message); toast.success("Enquiry copied"); trackListingHandoff(listing.id, category, listing.kind, "copy"); }
    catch { toast.error("Couldn't copy — please select the text manually."); }
  };
  const mailHref = `mailto:${CONCIERGE_EMAIL}?subject=${encodeURIComponent(`Enquiry: ${listing.name}`)}&body=${encodeURIComponent(message)}`;
  const startLabel = listing.kind === "stay" ? "Check-in" : listing.kind === "airport" ? "Date" : f.range ? "Start date" : listing.kind === "tour" ? "Tour date" : "Preferred date";
  const endLabel = listing.kind === "stay" ? "Check-out" : "End date (multi-day, optional)";
  const guestLabel = listing.kind === "stay" ? "Adults" : listing.kind === "security" ? "Party size" : f.luggage ? "Passengers" : "Guests";

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground"><span className="text-foreground">{listing.name}</span> · {category}</p>
      {f.direction && (
        <Field id={id("dir")} label="Arrival or departure">
          <select id={id("dir")} value={input.direction} onChange={set("direction")} className="h-10 w-full border border-input bg-background px-3 text-sm">
            <option value="arrival">Arrival (airport → you)</option>
            <option value="departure">Departure (you → airport)</option>
          </select>
        </Field>
      )}
      <div className={`grid gap-3 ${f.range || f.time ? "grid-cols-2" : "grid-cols-1"}`}>
        <Field id={id("start")} label={startLabel} error={errors.startDate}>
          <Input id={id("start")} type="date" min={today} value={input.startDate ?? ""} onChange={set("startDate")} />
        </Field>
        {f.range && (
          <Field id={id("end")} label={endLabel} error={errors.endDate}>
            <Input id={id("end")} type="date" min={input.startDate || today} value={input.endDate ?? ""} onChange={set("endDate")} />
          </Field>
        )}
        {f.time && (
          <Field id={id("time")} label={listing.kind === "airport" ? "Flight time" : "Time (optional)"}>
            <Input id={id("time")} type="time" value={input.time ?? ""} onChange={set("time")} />
          </Field>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id={id("flex")} checked={!!input.flexible} onCheckedChange={(v) => setInput((p) => ({ ...p, flexible: v === true }))} />
        <Label htmlFor={id("flex")} className="text-sm">My dates are flexible</Label>
      </div>
      {check.sameDay && <p className="text-xs text-gold">Same-day request — we'll do our best; WhatsApp is the fastest way to confirm.</p>}
      <div className={`grid gap-3 ${f.children ? "grid-cols-2" : "grid-cols-1"}`}>
        <Field id={id("guests")} label={guestLabel} error={errors.guests}>
          <Input id={id("guests")} type="number" min={1} max={500} inputMode="numeric" value={input.guests ?? ""} onChange={set("guests")} />
        </Field>
        {f.children && (
          <Field id={id("kids")} label="Children (optional)">
            <Input id={id("kids")} type="number" min={0} max={50} inputMode="numeric" value={input.children ?? ""} onChange={set("children")} />
          </Field>
        )}
      </div>
      {f.pickup && (
        <Field id={id("pickup")} label={listing.kind === "airport" ? "Pickup" : listing.kind === "self-drive" ? "Delivery area (optional)" : "Pickup area (optional)"} error={errors.pickup}>
          <Input id={id("pickup")} maxLength={120} placeholder={listing.kind === "airport" ? (input.direction === "departure" ? "e.g. Camps Bay villa" : "Cape Town International") : "e.g. Camps Bay"} value={input.pickup ?? ""} onChange={set("pickup")} />
        </Field>
      )}
      {f.destination && (
        <Field id={id("dest")} label="Destination" error={errors.destination}>
          <Input id={id("dest")} maxLength={120} placeholder={input.direction === "departure" ? "Cape Town International" : "e.g. V&A Waterfront hotel"} value={input.destination ?? ""} onChange={set("destination")} />
        </Field>
      )}
      {f.flightNumber && (
        <Field id={id("flight")} label="Flight number (optional)">
          <Input id={id("flight")} maxLength={20} value={input.flightNumber ?? ""} onChange={set("flightNumber")} />
        </Field>
      )}
      {f.luggage && (
        <Field id={id("lug")} label="Luggage (optional)">
          <Input id={id("lug")} maxLength={120} placeholder="e.g. 3 large suitcases" value={input.luggage ?? ""} onChange={set("luggage")} />
        </Field>
      )}
      {f.vehiclePreference && (
        <Field id={id("veh")} label="Vehicle preference (optional)">
          <select id={id("veh")} value={input.vehiclePreference ?? ""} onChange={set("vehiclePreference")} className="h-10 w-full border border-input bg-background px-3 text-sm">
            <option value="">No preference</option>
            {(vehicleOptions ?? ["Mercedes V-Class", "Maybach V-Class", "Mercedes-Maybach S-Class", "Range Rover Autobiography", "Mercedes Sprinter"]).map((v) => <option key={v}>{v}</option>)}
          </select>
        </Field>
      )}
      {f.route && (
        <Field id={id("route")} label="Route or idea (optional)">
          <Input id={id("route")} maxLength={160} value={input.route ?? ""} onChange={set("route")} />
        </Field>
      )}
      {f.occasion && (
        <Field id={id("occ")} label="Occasion">
          <select id={id("occ")} value={input.occasion ?? ""} onChange={set("occasion")} className="h-10 w-full border border-input bg-background px-3 text-sm">
            {["Honeymoon", "Anniversary", "Proposal", "Birthday", "Other celebration"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </Field>
      )}
      {f.requests && (
        <Field id={id("req")} label={listing.kind === "security" ? "General service requested (optional)" : "Requests (optional)"}>
          <Textarea id={id("req")} maxLength={300} rows={2} value={input.requests ?? ""} onChange={set("requests")} placeholder={listing.kind === "security" ? "e.g. secure airport transfer — share sensitive details privately" : ""} />
        </Field>
      )}
      <a
        href={enquiryWhatsAppUrl(message)}
        target="_blank"
        rel="noopener noreferrer"
        data-wa-source={`listing:${listing.id}`}
        onClick={onWhatsApp}
        className="flex w-full items-center justify-center gap-2 bg-[#25D366] px-4 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-black hover:brightness-95"
      >
        <WhatsAppGlyph className="h-4 w-4" /> Check availability on WhatsApp
      </a>
      <p className="text-[11px] text-muted-foreground">Opens a WhatsApp draft for you to send. This is an enquiry — not a confirmed booking.</p>
      <div className={`grid grid-cols-2 gap-2 ${failed ? "" : "opacity-90"}`}>
        <Button type="button" variant="outline" size="sm" onClick={onCopy}><Copy className="h-3.5 w-3.5 mr-1.5" /> Copy enquiry</Button>
        <Button asChild variant="outline" size="sm"><a href={mailHref} onClick={() => trackListingHandoff(listing.id, category, listing.kind, "email")}><Mail className="h-3.5 w-3.5 mr-1.5" /> Email instead</a></Button>
      </div>
      {failed && <p className="text-[11px] text-muted-foreground">WhatsApp didn't open? Copy the enquiry or email us instead.</p>}
    </div>
  );
}

/** Inline form on desktop plus a sticky mobile "Check availability" button that opens the same form. */
const ListingEnquiry = (props: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="hidden lg:block border border-border/50 bg-surface-raised p-6">
        <p className="eyebrow mb-4">Check availability</p>
        <EnquiryFormBody {...props} idPrefix="enq" />
      </div>
      <div className="lg:hidden border border-border/50 bg-surface-raised p-5">
        <p className="eyebrow mb-2">Check availability</p>
        <p className="text-sm text-muted-foreground mb-4">Send your dates and party size — we reply with availability and a quote.</p>
        <Button className="w-full" onClick={() => setOpen(true)}>Check availability</Button>
      </div>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-border/60 bg-background/95 p-3 pr-20 backdrop-blur">
        <Button className="w-full" onClick={() => setOpen(true)} data-testid="sticky-check-availability">Check availability</Button>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="max-h-[92dvh] overflow-y-auto">
          <SheetHeader><SheetTitle className="font-serif text-2xl text-left">Check availability</SheetTitle></SheetHeader>
          <div className="mt-4"><EnquiryFormBody {...props} idPrefix="enq-m" /></div>
        </SheetContent>
      </Sheet>
    </>
  );
};
export default ListingEnquiry;
