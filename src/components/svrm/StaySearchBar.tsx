import { useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import { Users, BedDouble, Sparkles, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { formatDateRange } from "@/lib/locale";
import TwoStepDateRange from "./TwoStepDateRange";

const StaySearchBar = () => {
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [flexible, setFlexible] = useState(false);

  const nights =
    range?.from && range?.to ? Math.max(1, differenceInCalendarDays(range.to, range.from)) : 0;

  const dateLabel = range?.from
    ? range.to
      ? formatDateRange(range.from, range.to, { day: "numeric", month: "short", year: "numeric" })
      : formatDate(range.from, { day: "numeric", month: "short", year: "numeric" })
    : "Select dates";

  const buildMessage = () => {
    const parts = [
      "Stay enquiry",
      range?.from && range?.to
        ? `${formatDateRange(range.from, range.to, { day: "numeric", month: "short", year: "numeric" })} (${nights} night${nights > 1 ? "s" : ""})`
        : "Dates: flexible",
      `${guests} guest${guests > 1 ? "s" : ""}`,
      `${rooms} room${rooms > 1 ? "s" : ""}`,
      flexible ? "Flexible dates (±3 days)" : null,
    ].filter(Boolean);
    return parts.join(" · ");
  };


  const Stepper = ({
    icon: Icon,
    label,
    value,
    onChange,
    min = 1,
    max = 30,
  }: {
    icon: typeof Users;
    label: string;
    value: number;
    onChange: (n: number) => void;
    min?: number;
    max?: number;
  }) => (
    <div className="flex items-center justify-between gap-3 border border-border/60 px-4 py-3">
      <div className="flex items-center gap-3 text-sm text-foreground">
        <Icon className="h-4 w-4 text-gold" />
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
          <p className="text-base font-serif">{value}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="h-7 w-7 border border-border/60 text-foreground hover:border-primary hover:text-gold transition-colors"
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="h-7 w-7 border border-border/60 text-foreground hover:border-primary hover:text-gold transition-colors"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-surface-raised border border-border/50 p-5 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex items-center justify-between gap-3 border border-border/60 px-4 py-3 text-left text-sm",
                !range && "text-muted-foreground"
              )}
            >
              <span className="flex items-center gap-3">
                <CalendarIcon className="h-4 w-4 text-gold" />
                <span>
                  <span className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Check-in → Check-out
                  </span>
                  <span className="block text-base font-serif text-foreground">{dateLabel}</span>
                </span>
              </span>
              {nights > 0 && (
                <span className="text-[10px] uppercase tracking-[0.2em] text-gold">
                  {nights} night{nights > 1 ? "s" : ""}
                </span>
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

        <Stepper icon={Users} label="Guests" value={guests} onChange={setGuests} max={40} />
        <Stepper icon={BedDouble} label="Rooms" value={rooms} onChange={setRooms} max={15} />

        <button
          type="button"
          onClick={() => setFlexible((f) => !f)}
          className={cn(
            "flex items-center justify-between gap-3 border px-4 py-3 text-left text-sm transition-colors",
            flexible
              ? "border-primary bg-primary/10 text-gold"
              : "border-border/60 text-foreground hover:border-primary/60"
          )}
          aria-pressed={flexible}
        >
          <span className="flex items-center gap-3">
            <Sparkles className="h-4 w-4 text-gold" />
            <span>
              <span className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Flexibility
              </span>
              <span className="block text-base font-serif">
                {flexible ? "Flexible ±3 days" : "Exact dates"}
              </span>
            </span>
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">Toggle</span>
        </button>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:justify-end">
        <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground/80 sm:mr-auto">
          We hand-match every stay. Indicative availability — concierge confirms within hours.
        </p>
        <a
          href={buildWhatsAppUrl(buildMessage())}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-[11px] uppercase tracking-[0.28em] hover:bg-primary-glow transition-colors shadow-[var(--shadow-gold)]"
        >
          <Search className="h-3.5 w-3.5" />
          Check availability
        </a>
      </div>
    </div>
  );
};

export default StaySearchBar;
