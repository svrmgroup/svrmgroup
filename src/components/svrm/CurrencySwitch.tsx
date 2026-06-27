import { useCurrency, Currency } from "@/lib/currency";

const options: { code: Currency; label: string }[] = [
  { code: "ZAR", label: "R" },
  { code: "GBP", label: "£" },
  { code: "USD", label: "$" },
];

const CurrencySwitch = ({ className = "" }: { className?: string }) => {
  const { currency, setCurrency } = useCurrency();
  return (
    <div
      className={`inline-flex items-center border border-border/60 ${className}`}
      role="group"
      aria-label="Currency selector"
    >
      {options.map((o) => (
        <button
          key={o.code}
          onClick={() => setCurrency(o.code)}
          className={`px-2.5 py-1 text-[11px] tracking-[0.18em] transition-colors ${
            currency === o.code
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-pressed={currency === o.code}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
};

export default CurrencySwitch;
