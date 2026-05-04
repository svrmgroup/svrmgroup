import { Link } from "react-router-dom";
import Wordmark from "./Wordmark";
import { buildWhatsAppUrl, WHATSAPP_NUMBER } from "@/lib/whatsapp";

const navLinks = [
  { to: "/services", label: "Services" },
  { to: "/business", label: "Business" },
  { to: "/concierge", label: "Concierge" },
  { to: "/about", label: "About" },
];

const Footer = () => (
  <footer className="bg-background border-t border-border/60">
    <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
      <div className="md:col-span-2">
        <Wordmark size="lg" />
        <p className="mt-6 text-muted-foreground text-sm max-w-sm leading-relaxed">
          A lifestyle management service for those who would rather live the moment than
          arrange it. Cape Town — and wherever you are next.
        </p>
      </div>
      <div>
        <p className="eyebrow">Explore</p>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          {navLinks.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="hover:text-gold transition-colors">{l.label}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="eyebrow">Contact</p>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li><a href="mailto:concierge@svrm.co.za" className="hover:text-gold transition-colors">concierge@svrm.co.za</a></li>
          <li>
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors"
            >
              WhatsApp concierge
            </a>
          </li>
          <li className="text-muted-foreground/70">Cape Town, South Africa</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border/60">
      <div className="max-w-7xl mx-auto px-6 py-6 text-xs uppercase tracking-[0.28em] text-muted-foreground/70 flex justify-between">
        <span>© {new Date().getFullYear()} SVRM</span>
        <span className="text-gold/60">Curated, without compromise.</span>
      </div>
    </div>
  </footer>
);

export default Footer;
