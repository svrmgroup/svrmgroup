import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { whatsappUrlFor } from "@/lib/whatsappMessages";
import WhatsAppGlyph from "./WhatsAppGlyph";

const WhatsAppFab = () => {
  const { pathname } = useLocation();
  const [showLabel, setShowLabel] = useState(true);

  useEffect(() => {
    setShowLabel(true);
    const timer = window.setTimeout(() => setShowLabel(false), 3500);
    const onScroll = () => setShowLabel(false);
    window.addEventListener("scroll", onScroll, { passive: true, once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      <span
        className={`hidden md:inline-flex items-center rounded-full border border-black/10 bg-[#25D366] px-4 py-2 font-sans text-xs uppercase tracking-[0.24em] text-black shadow-[0_10px_30px_-8px_rgba(0,0,0,0.55)] transition-opacity duration-500 motion-reduce:transition-none ${
          showLabel ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      >
        Chat with us
      </span>
      <a
        href={whatsappUrlFor(pathname)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with SVRM on WhatsApp"
        className="group flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-[#25D366] text-black shadow-[0_10px_30px_-8px_rgba(0,0,0,0.55)] transition-all duration-300 hover:brightness-95 hover:shadow-[0_0_0_4px_rgba(37,211,102,0.25),0_10px_30px_-8px_rgba(0,0,0,0.6)]"
      >
        <WhatsAppGlyph className="h-6 w-6 md:h-7 md:w-7" />
      </a>
    </div>
  );
};

export default WhatsAppFab;
