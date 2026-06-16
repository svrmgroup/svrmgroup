import { Link } from "react-router-dom";
import Logo from "./Logo";
import { buildWhatsAppUrl, CONCIERGE_EMAIL } from "@/lib/whatsapp";

const explore = [
  { to: "/travel", label: "Travel" },
  { to: "/lifestyle", label: "Lifestyle" },
  { to: "/stays", label: "Stays & Residences" },
  { to: "/tours", label: "Tours" },
  { to: "/experiences", label: "Custom Experiences" },
  { to: "/blog", label: "Journal" },
  { to: "/contact", label: "Contact" },
];

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
            <a href={`mailto:${CONCIERGE_EMAIL}`} className="hover:text-gold transition-colors break-all">
              {CONCIERGE_EMAIL}
            </a>
          </li>
          <li>
            <a
              href={buildWhatsAppUrl()}
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
      <div className="max-w-7xl mx-auto px-6 py-6 text-xs uppercase tracking-[0.28em] text-muted-foreground/70 flex flex-col sm:flex-row gap-2 justify-between">
        <span>© {new Date().getFullYear()} SVRM Group</span>
        <span className="text-gold/60">Curated, without compromise.</span>
      </div>
    </div>
  </footer>
);

export default Footer;
