import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { whatsappUrlFor } from "@/lib/whatsappMessages";
import WhatsAppGlyph from "./WhatsAppGlyph";
import { useCurrentListing } from "@/lib/currentListing";
import { enquiryWhatsAppUrl } from "@/lib/listingEnquiry";

const WhatsAppFab = () => {
  const { pathname } = useLocation();
  const [showLabel, setShowLabel] = useState(true);
  const listing = useCurrentListing();
  const onListing = listing && listing.path === pathname;
  const href = onListing
    ? enquiryWhatsAppUrl(`Hi SVRM Group, I'd like to check availability for the ${listing.name}${listing.kind === "chauffeur" ? " with chauffeur" : listing.kind === "self-drive" ? " as a self-drive rental" : ""}. Could you help?\n\n${listing.url}`)
    : whatsappUrlFor(pathname);

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
    <div className={`fixed z-40 flex items-center gap-3 ${onListing ? "bottom-2.5 right-4 lg:bottom-6 lg:right-6" : "bottom-6 right-6"}`}>
      <span
        className={`hidden md:inline-flex items-center rounded-full border border-black/10 bg-[#25D366] px-4 py-2 font-sans text-xs uppercase tracking-[0.24em] text-black shadow-[0_10px_30px_-8px_rgba(0,0,0,0.55)] transition-opacity duration-500 motion-reduce:transition-none ${
          showLabel ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      >
        Chat with us
      </span>
      <a
        href={href}
        data-wa-source={onListing ? `fab:${listing.id}` : undefined}
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
