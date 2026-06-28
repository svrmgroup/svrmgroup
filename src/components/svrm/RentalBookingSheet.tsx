import { useState } from "react";
import { format, differenceInCalendarDays } from "date-fns";
import { formatDate, formatDateRange } from "@/lib/locale";
import { DateRange } from "react-day-picker";
import { z } from "zod";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Vehicle, rentalRate } from "@/data/vehicles";
import { rentalExtras, pickupLocations } from "@/data/extras";
import { useCurrency } from "@/lib/currency";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ExtrasPicker from "./ExtrasPicker";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

interface Props {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RentalBookingSheet = ({ vehicle, open, onOpenChange }: Props) => {
  const { currency } = useCurrency();
  const [range, setRange] = useState<DateRange | undefined>();
  const [pickup, setPickup] = useState(pickupLocations[0]);
  const [extras, setExtras] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const days =
    range?.from && range?.to ? Math.max(1, differenceInCalendarDays(range.to, range.from)) : 0;
  const estimatedZAR = vehicle && days > 0 ? rentalRate(vehicle) * days : 0;

  const toggleExtra = (id: string) =>
    setExtras((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const reset = () => {
    setRange(undefined);
    setExtras([]);
    setForm({ name: "", email: "", phone: "", message: "" });
    setPickup(pickupLocations[0]);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle) return;
    if (!range?.from || !range?.to) {
      toast.error("Please select pickup and return dates.");
      return;
    }
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error("Please add a name and valid email.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("rental_requests").insert({
      vehicle_slug: vehicle.slug,
      vehicle_name: vehicle.name,
      pickup_date: format(range.from, "yyyy-MM-dd"),
      return_date: format(range.to, "yyyy-MM-dd"),
      pickup_location: pickup,
      extras,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      message: parsed.data.message || null,
      currency,
      estimated_total: estimatedZAR,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Couldn't send. Please try WhatsApp instead.");
      return;
    }
    toast.success("Booking request received. We'll confirm availability within hours.");
    onOpenChange(false);
    reset();
  };

  const waMessage = vehicle
    ? `${vehicle.name} self-drive · ${range?.from ? format(range.from, "d MMM") : "?"} → ${range?.to ? format(range.to, "d MMM") : "?"} · pickup ${pickup}${extras.length ? ` · extras: ${extras.join(", ")}` : ""}`
    : "rental";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="bg-surface-deep border-l border-border/60 w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-serif text-3xl text-foreground">
            {vehicle ? `Book ${vehicle.name}` : "Book a rental"}
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Choose your dates, pickup and add-ons. We confirm availability personally.
          </SheetDescription>
        </SheetHeader>

        {vehicle && (
          <form onSubmit={onSubmit} className="mt-8 space-y-6">
            <div>
              <p className="eyebrow">Dates</p>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "mt-3 w-full flex items-center justify-between gap-3 border border-border/60 bg-transparent text-left px-4 py-3 text-sm",
                      !range && "text-muted-foreground"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <CalendarIcon className="h-4 w-4" />
                      {range?.from
                        ? range.to
                          ? `${format(range.from, "d MMM yyyy")} → ${format(range.to, "d MMM yyyy")}`
                          : format(range.from, "d MMM yyyy")
                        : "Select pickup & return dates"}
                    </span>
                    {days > 0 && (
                      <span className="text-[10px] uppercase tracking-[0.2em] text-gold">{days} day{days > 1 ? "s" : ""}</span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-surface-raised border-border/60" align="start">
                  <Calendar
                    mode="range"
                    selected={range}
                    onSelect={setRange}
                    numberOfMonths={1}
                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <p className="eyebrow">Pickup</p>
              <select
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="mt-3 w-full bg-transparent border border-border/60 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                {pickupLocations.map((p) => (
                  <option key={p} value={p} className="bg-surface-deep">{p}</option>
                ))}
              </select>
            </div>

            <ExtrasPicker extras={rentalExtras} selected={extras} onToggle={toggleExtra} label="Add-ons" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full bg-transparent border-b border-border/60 py-3 text-sm focus:border-primary focus:outline-none"
                maxLength={100}
              />
              <input
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full bg-transparent border-b border-border/60 py-3 text-sm focus:border-primary focus:outline-none"
                maxLength={255}
              />
            </div>
            <input
              placeholder="Phone (optional)"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="w-full bg-transparent border-b border-border/60 py-3 text-sm focus:border-primary focus:outline-none"
              maxLength={40}
            />
            <textarea
              placeholder="Anything else?"
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className="w-full bg-transparent border-b border-border/60 py-3 text-sm min-h-[80px] resize-none focus:border-primary focus:outline-none"
              maxLength={2000}
            />

            <div className="border border-border/60 p-4 flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Pricing</p>
                <p className="font-serif text-2xl text-gold mt-1">On request</p>
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80 text-right max-w-[180px]">
                {days > 0 ? `${days} day${days > 1 ? "s" : ""} · quote sent back personally.` : "Quote sent back personally."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-4 bg-primary text-primary-foreground text-xs uppercase tracking-[0.28em] hover:bg-primary-glow transition-colors disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Request booking"}
              </button>
              <a
                href={buildWhatsAppUrl(waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center px-6 py-4 border border-primary/60 text-gold text-xs uppercase tracking-[0.28em] hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Or WhatsApp
              </a>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default RentalBookingSheet;
