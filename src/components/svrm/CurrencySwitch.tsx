import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check, Coins } from "lucide-react";
import { useCurrency, CURRENCY_LIST } from "@/lib/currency";

const CurrencySwitch = ({ className = "" }: { className?: string }) => {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const active = CURRENCY_LIST.find((c) => c.code === currency)!;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 border border-border/60 px-2.5 py-1 text-[11px] tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors notranslate"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Coins className="h-3.5 w-3.5" />
        <span>{active.code}</span>
        <ChevronDown className="h-3 w-3 opacity-70" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-48 max-h-80 overflow-y-auto bg-surface-deep/95 backdrop-blur-md border border-border/60 shadow-lg notranslate">
          {CURRENCY_LIST.map((c) => (
            <button
              key={c.code}
              onClick={() => {
                setCurrency(c.code);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-[11px] uppercase tracking-[0.18em] transition-colors ${
                currency === c.code
                  ? "text-gold bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="w-6 text-gold">{c.symbol}</span>
                <span>{c.code}</span>
              </span>
              {currency === c.code && <Check className="h-3 w-3" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencySwitch;
