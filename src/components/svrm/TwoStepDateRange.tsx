import { forwardRef, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDate } from "@/lib/locale";

export interface TwoStepDateRangeProps {
  from?: Date;
  to?: Date;
  onChange: (range: { from?: Date; to?: Date }) => void;
  /** Labels for the two steps. */
  firstLabel: string;
  secondLabel: string;
  /** Unit for the days indicator. */
  unit?: "night" | "day";
  /** Layout: stacked (default) or two columns. */
  columns?: 1 | 2;
  /** Compact/nested styling used in search bars. */
  compact?: boolean;
}

const startOfToday = () => new Date(new Date().setHours(0, 0, 0, 0));

const TwoStepDateRange = ({
  from,
  to,
  onChange,
  firstLabel,
  secondLabel,
  unit = "day",
  columns = 2,
  compact = false,
}: TwoStepDateRangeProps) => {
  const [openStep, setOpenStep] = useState<"from" | "to" | null>(null);

  const days = from && to ? Math.max(1, differenceInCalendarDays(to, from)) : 0;

  const fmtShort = (d: Date) => formatDate(d, { day: "numeric", month: "short", year: "numeric" });

  const handleFrom = (d?: Date) => {
    if (!d) {
      onChange({ from: undefined, to: undefined });
      return;
    }
    // If existing end date is before the new start, clear it.
    const nextTo = to && to < d ? undefined : to;
    onChange({ from: d, to: nextTo });
    setOpenStep(null);
    // Auto-advance to second step for guided flow.
    if (!nextTo) setTimeout(() => setOpenStep("to"), 120);
  };

  const handleTo = (d?: Date) => {
    if (!d) return;
    if (from && d < from) {
      // Guard: shouldn't happen because disabled, but ignore just in case.
      return;
    }
    onChange({ from, to: d });
    setOpenStep(null);
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ from: undefined, to: undefined });
    setOpenStep(null);
  };

  const StepButton = ({
    label,
    value,
    active,
    onOpen,
    disabled,
  }: {
    label: string;
    value?: Date;
    active: boolean;
    onOpen: () => void;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      onClick={onOpen}
      disabled={disabled}
      className={cn(
        "flex items-center justify-between gap-3 border text-left px-4 py-3 text-sm transition-colors",
        active ? "border-primary" : "border-border/60 hover:border-primary/60",
        disabled && "opacity-60 cursor-not-allowed",
      )}
    >
      <span className="flex items-center gap-3 min-w-0">
        <CalendarIcon className="h-4 w-4 text-gold shrink-0" />
        <span className="min-w-0">
          <span className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
          <span className={cn("block text-base font-serif truncate", !value && "text-muted-foreground")}>
            {value ? fmtShort(value) : "Select"}
          </span>
        </span>
      </span>
    </button>
  );

  return (
    <div className={cn("space-y-2", compact && "space-y-2")}>
      <div className={cn("grid gap-3", columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1")}>
        <Popover open={openStep === "from"} onOpenChange={(o) => setOpenStep(o ? "from" : null)}>
          <PopoverTrigger asChild>
            <StepButton
              label={firstLabel}
              value={from}
              active={openStep === "from"}
              onOpen={() => setOpenStep("from")}
            />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-surface-raised border-border/60" align="start">
            <Calendar
              mode="single"
              selected={from}
              onSelect={handleFrom}
              defaultMonth={from ?? startOfToday()}
              disabled={(d) => d < startOfToday()}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>

        <Popover open={openStep === "to"} onOpenChange={(o) => setOpenStep(o ? "to" : null)}>
          <PopoverTrigger asChild>
            <StepButton
              label={secondLabel}
              value={to}
              active={openStep === "to"}
              onOpen={() => setOpenStep("to")}
              disabled={!from}
            />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-surface-raised border-border/60" align="start">
            <Calendar
              mode="single"
              selected={to}
              onSelect={handleTo}
              defaultMonth={to ?? from ?? startOfToday()}
              disabled={(d) => (from ? d <= from : d < startOfToday())}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>

      {(from || to) && (
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em]">
          <span className="text-gold">
            {days > 0 ? `${days} ${unit}${days > 1 ? "s" : ""}` : from ? "Pick a second date" : ""}
          </span>
          <button
            type="button"
            onClick={clear}
            className="flex items-center gap-1 text-muted-foreground hover:text-gold transition-colors"
          >
            <X className="h-3 w-3" /> Clear dates
          </button>
        </div>
      )}
    </div>
  );
};

export default TwoStepDateRange;
