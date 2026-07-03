import { Link } from "react-router-dom";
import Logo from "./Logo";
import { Instagram } from "lucide-react";
import { buildWhatsAppUrlRaw, CONCIERGE_EMAIL, INSTAGRAM_URL, TIKTOK_URL, SOCIAL_HANDLE } from "@/lib/whatsapp";

const explore = [
  { to: "/travel", label: "Travel" },
  { to: "/lifestyle", label: "Lifestyle" },
  { to: "/stays", label: "Stays & Residences" },
  { to: "/tours", label: "Tours" },
  { to: "/experiences", label: "Custom Experiences" },
  { to: "/blog", label: "Journal" },
  { to: "/contact", label: "Contact" },
];

// Lucide doesn't ship a TikTok icon — small inline SVG instead.
const TikTokIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.69a8.16 8.16 0 0 0 4.77 1.52V6.79a4.85 4.85 0 0 1-1.84-.1z"/>
  </svg>
);

const Footer = () => (
  <footer className="bg-background border-t border-border/60">
    <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
      <div className="md:col-span-2">
        <div className="flex items-center gap-4">
          <Logo size="md" />
          <span className="font-serif text-2xl text-foreground tracking-wide">SVRM Group</span>
        </div>
        <p className="mt-6 text-muted-foreground text-sm max-w-sm leading-relaxed">
          Curated luxury across South Africa. Lifestyle management for those who would rather
          live the moment than arrange it.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="SVRM Group on Instagram"
            className="h-10 w-10 border border-border/60 flex items-center justify-center text-muted-foreground hover:text-gold hover:border-primary transition-colors"
          >
            <Instagram className="h-4 w-4" />
          </a>
          <a
            href={TIKTOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="SVRM Group on TikTok"
            className="h-10 w-10 border border-border/60 flex items-center justify-center text-muted-foreground hover:text-gold hover:border-primary transition-colors"
          >
            <TikTokIcon className="h-4 w-4" />
          </a>
          <span className="ml-2 text-xs uppercase tracking-[0.24em] text-muted-foreground/80">{SOCIAL_HANDLE}</span>
        </div>
      </div>
      <div>
        <p className="eyebrow">Explore</p>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          {explore.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="hover:text-gold transition-colors">{l.label}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="eyebrow">Concierge</p>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li>
            <a href={`mailto:${CONCIERGE_EMAIL}`} className="notranslate hover:text-gold transition-colors break-all" translate="no">
              {CONCIERGE_EMAIL}
            </a>
          </li>
          <li>
            <a
              href={buildWhatsAppUrlRaw("Hi SVRM Group, I'd like to speak to the concierge. Please assist me with my request.")}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors"
            >
              WhatsApp the concierge
            </a>
          </li>
          <li className="text-muted-foreground/70">Cape Town, South Africa</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border/60">
      <div className="max-w-7xl mx-auto px-6 py-5 text-[11px] leading-relaxed text-muted-foreground/70 text-center">
        Every price on this site is a rough guide only — a starting point, not a final figure. Request a quote and the number is often lower than what you see here, tailored to your dates, party size and the specifics of your brief. Final pricing is confirmed by us in writing before anything is booked.
      </div>
    </div>
    <div className="border-t border-border/60">
      <div className="max-w-7xl mx-auto px-6 py-6 text-xs uppercase tracking-[0.28em] text-muted-foreground/70 flex flex-col sm:flex-row gap-2 justify-between">
        <span>© {new Date().getFullYear()} SVRM Group</span>
        <span className="text-gold/60">Curated, without compromise.</span>
      </div>
    </div>

  </footer>
);

export default Footer;
