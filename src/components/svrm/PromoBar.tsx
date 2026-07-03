import { useEffect, useState } from "react";
import { X, Sparkles } from "lucide-react";
import { useCurrency } from "@/lib/currency";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const DISMISS_KEY = "svrm-promo-x3-dismissed";

/**
 * Slim, high-contrast promo strip pinned above the nav on every page.
 * Announces the current featured offer and links to it. Dismissible;
 * dismissal persists in localStorage.
 */
const PromoBar = () => {
  const [visible, setVisible] = useState(false);
  const { format } = useCurrency();

  useEffect(() => {
    if (typeof window === "undefined") return;
    setVisible(localStorage.getItem(DISMISS_KEY) !== "1");
  }, []);

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Special offer"
      className="relative z-[60] bg-primary text-primary-foreground"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 flex items-center justify-center gap-3 text-[11px] md:text-xs tracking-[0.14em] uppercase font-medium">
        <Sparkles className="h-3.5 w-3.5 shrink-0 hidden sm:block" />
        <span className="text-center leading-snug">
          <span className="hidden sm:inline">Special offer · </span>
          <a
            href={buildWhatsAppUrl("the BMW X3 self-drive special")}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 decoration-primary-foreground/50 hover:decoration-primary-foreground transition"
          >
            BMW X3 self-drive — {format(2000)} / day · Enquire on WhatsApp
          </a>
        </span>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem(DISMISS_KEY, "1");
            setVisible(false);
          }}
          aria-label="Dismiss offer"
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default PromoBar;
