import { useState } from "react";
import { format, differenceInCalendarDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { z } from "zod";
import { CalendarIcon, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { formatDate, formatDateRange } from "@/lib/locale";
import { useCurrency } from "@/lib/currency";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().max(1500).optional().or(z.literal("")),
});

export type BookingKind = "stay" | "vehicle" | "tour";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kind: BookingKind;
  /** Public display name, e.g. "Camps Bay Villa" or "Rolls-Royce Phantom" */
  name: string;
  /** Small line under the title (area, tier, tagline). */
  subtitle?: string;
  /** Rough starter rate in ZAR per unit. Adjust per item. */
  rateZAR: number;
  /** Unit label */
  unit: "night" | "day" | "person";
  /** Slug for the item, saved with the enquiry */
  slug: string;
}

const unitCopy: Record<Props["unit"], string> = {
  night: "per night",
  day: "per day",
  person: "per person",
};

const BookingSheet = ({
  open,
  onOpenChange,
  kind,
  name,
  subtitle,
  rateZAR,
  unit,
  slug,
}: Props) => {
  const { format: fmt } = useCurrency();
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const days =
    range?.from && range?.to
      ? Math.max(1, differenceInCalendarDays(range.to, range.from))
      : 0;

  const units = unit === "person" ? guests : days;
  const estimate = rateZAR && units > 0 ? rateZAR * units : 0;

  const reset = () => {
    setRange(undefined);
    setGuests(2);
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  const buildSummary = () => {
    const parts: string[] = [];
    if (range?.from && range?.to) {
      parts.push(
        formatDateRange(range.from, range.to, {
          day: "numeric",
          month: "short",
          year: "numeric",
        }) + ` (${days} ${unit === "night" ? "night" : "day"}${days > 1 ? "s" : ""})`,
      );
    }
    if (kind !== "vehicle") parts.push(`${guests} guest${guests > 1 ? "s" : ""}`);
    return parts.join(" · ");
  };

  const summary = buildSummary();
  const subject =
    kind === "stay"
      ? `Stay booking — ${name}`
      : kind === "vehicle"
        ? `Chauffeur booking — ${name}`
        : `Tour booking — ${name}`;

  const composedMessage = [
    summary,
    estimate ? `Indicative estimate ${fmt(estimate)} (${fmt(rateZAR)} ${unitCopy[unit]}).` : "",
    form.message?.trim() || "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const waMessage = `${subject}${summary ? " · " + summary : ""}${form.message ? " · " + form.message : ""}`;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!range?.from || !range?.to) {
      toast.error("Please select your dates.");
      return;
    }
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error("Please add a name and valid email.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("enquiries").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      subject,
      message: composedMessage || summary || name,
      source_page: `/${kind}/${slug}`,
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="bg-surface-deep border-l border-border/60 w-full sm:max-w-lg overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="font-serif text-3xl text-foreground">Book {name}</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            {subtitle ? subtitle + " — " : ""}Pick your dates. We confirm availability
            personally.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <div>
            <p className="eyebrow">Dates</p>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "mt-3 w-full flex items-center justify-between gap-3 border border-border/60 bg-transparent text-left px-4 py-3 text-sm",
                    !range && "text-muted-foreground",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <CalendarIcon className="h-4 w-4" />
                    {range?.from
                      ? range.to
                        ? formatDateRange(range.from, range.to, {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : formatDate(range.from, {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                      : `Select ${unit === "night" ? "check-in & check-out" : "start & end"} dates`}
                  </span>
                  {days > 0 && (
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gold">
                      {days} {unit === "night" ? "night" : "day"}
                      {days > 1 ? "s" : ""}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-surface-raised border-border/60"
                align="start"
              >
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

          {kind !== "vehicle" && (
            <div>
              <p className="eyebrow">{kind === "tour" ? "Travellers" : "Guests"}</p>
              <div className="mt-3 flex items-center justify-between border border-border/60 px-4 py-3">
                <span className="flex items-center gap-3 text-sm">
                  <Users className="h-4 w-4" />
                  {guests}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setGuests((n) => Math.max(1, n - 1))}
                    className="w-8 h-8 border border-border/60 text-gold hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label="Fewer"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    onClick={() => setGuests((n) => Math.min(30, n + 1))}
                    className="w-8 h-8 border border-border/60 text-gold hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label="More"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

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
            placeholder="Anything else? (preferences, arrival time, occasion)"
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            className="w-full bg-transparent border-b border-border/60 py-3 text-sm min-h-[80px] resize-none focus:border-primary focus:outline-none"
            maxLength={1500}
          />

          <div className="border border-border/60 p-4 flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                Indicative
              </p>
              <p className="font-serif text-2xl text-gold mt-1">
                {estimate ? fmt(estimate) : "On request"}
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 mt-1">
                {fmt(rateZAR)} {unitCopy[unit]}
              </p>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80 text-right max-w-[180px]">
              {units > 0
                ? `Personal quote confirmed within hours.`
                : "Personal quote confirmed within hours."}
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
      </SheetContent>
    </Sheet>
  );
};

export default BookingSheet;
