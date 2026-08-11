import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import Logo from "./Logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CurrencySwitch from "./CurrencySwitch";
import LanguageSwitch from "./LanguageSwitch";
import { whatsappUrlFor } from "@/lib/whatsappMessages";
import WhatsAppGlyph from "./WhatsAppGlyph";

type SubLink = { to: string; label: string };
type NavItem = { to: string; label: string; sub?: SubLink[] };

const links: NavItem[] = [
  { to: "/", label: "Home" },
  {
    to: "/travel",
    label: "Travel",
    sub: [
      { to: "/travel?cat=cars", label: "Chauffeur & Fleet" },
      { to: "/airport-transfers", label: "Airport Transfers" },
      { to: "/travel?cat=jets", label: "Private Jets" },
      { to: "/travel?cat=helicopters", label: "Helicopters" },
      { to: "/travel?cat=yachts", label: "Yachts" },
    ],
  },
  {
    to: "/rentals",
    label: "Rentals",
    sub: [
      { to: "/rentals?cat=Signature", label: "Signature" },
      { to: "/rentals?cat=Premium SUV", label: "Premium SUV" },
      { to: "/rentals?cat=Executive", label: "Executive" },
      { to: "/rentals?cat=Everyday", label: "Everyday" },
      { to: "/rentals?cat=Budget", label: "Budget" },
      { to: "/rentals?cat=Custom", label: "Custom Request" },
    ],
  },
  {
    to: "/stays",
    label: "Stays",
    sub: [
      { to: "/stays?cat=short", label: "Short-Term Villas" },
      { to: "/stays?cat=long", label: "Long-Term Rentals" },
      { to: "/stays?cat=buysell", label: "Buy & Sell Property" },
    ],
  },
  {
    to: "/tours",
    label: "Tours",
    sub: [
      { to: "/tours/cape-peninsula", label: "Cape Peninsula" },
      { to: "/tours/safari", label: "Safari" },
      { to: "/tours/aquila-safari", label: "Aquila Safari" },
      { to: "/tours/marine", label: "Marine & Wildlife" },
      { to: "/tours/garden-route", label: "Garden Route" },
      { to: "/tours/aerial", label: "Helicopter & Aerial" },
      { to: "/tours/culinary", label: "Wine & Culinary" },
      { to: "/tours/cultural", label: "Cultural & Heritage" },
      { to: "/tours/wellness", label: "Wellness" },
      { to: "/tours/builder", label: "Build Your Own Tour" },
    ],
  },
  { to: "/security", label: "Security" },
  {
    to: "/experiences",
    label: "Custom",
    sub: [
      { to: "/honeymoon-cape-town", label: "Honeymoon" },
      { to: "/anniversary-cape-town", label: "Anniversary" },
      { to: "/lifestyle", label: "Lifestyle & Events" },
      { to: "/experiences", label: "Bespoke Concierge" },
    ],
  },
  { to: "/blog", label: "Journal" },
  { to: "/contact", label: "Contact" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-[11px] uppercase tracking-[0.24em] transition-colors duration-300 pb-1 border-b ${
    isActive
      ? "text-foreground border-primary"
      : "text-muted-foreground border-transparent hover:text-foreground"
  }`;


const Nav = () => {
  const { pathname } = useLocation();
  const waHref = whatsappUrlFor(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-[background,backdrop-filter,border-color] duration-500 ${
        scrolled
          ? "bg-surface-deep/85 backdrop-blur-md border-b border-border/60"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10 h-20">
        <Link to="/" aria-label="SVRM home" className="block">
          <Logo size="sm" />
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {links.map((l) => (
            <div key={l.to} className="relative group py-6">
              <NavLink to={l.to} className={linkClass} end={l.to === "/"}>
                {l.label}
              </NavLink>
              {l.sub && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 focus-within:opacity-100 focus-within:visible transition-all duration-200">
                  <div className="min-w-56 bg-surface-deep/95 backdrop-blur-md border border-border/60 py-2 shadow-xl">
                    {l.sub.map((s) => (
                      <Link
                        key={s.to + s.label}
                        to={s.to}
                        className="block px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-gold hover:bg-primary/5 transition-colors whitespace-nowrap"
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>



        <div className="flex items-center gap-3">
          <LanguageSwitch className="hidden md:block" />
          <CurrencySwitch className="hidden md:block" />

          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with SVRM on WhatsApp"
            className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-black transition-all hover:brightness-95 shadow-[0_4px_14px_-4px_rgba(37,211,102,0.55)]"
          >
            <WhatsAppGlyph className="h-4 w-4" />
          </a>

          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block text-[11px] uppercase tracking-[0.28em] text-gold border border-primary/60 px-4 py-2.5 hover:bg-primary hover:text-primary-foreground transition-colors duration-500"
          >
            Enquire
          </a>


          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className="lg:hidden p-2 text-foreground"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-surface-deep border-l border-border/60 w-80">
              <div className="flex items-center gap-4 mt-2">
                <Logo size="sm" />
                <span className="font-serif text-xl text-foreground">SVRM Group</span>
              </div>
              <div className="mt-10 flex flex-col gap-6 overflow-y-auto max-h-[70vh] pr-2">
                {links.map((l) => (
                  <div key={l.to} className="flex flex-col gap-3">
                    <NavLink
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `text-sm uppercase tracking-[0.28em] ${
                          isActive ? "text-gold" : "text-foreground"
                        }`
                      }
                      end={l.to === "/"}
                    >
                      {l.label}
                    </NavLink>
                    {l.sub && (
                      <div className="flex flex-col gap-2.5 pl-4 border-l border-border/60">
                        {l.sub.map((s) => (
                          <Link
                            key={s.to + s.label}
                            to={s.to}
                            onClick={() => setOpen(false)}
                            className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-gold transition-colors"
                          >
                            {s.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <div className="pt-2 flex flex-col gap-3"><LanguageSwitch /><CurrencySwitch /></div>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-2 text-center text-xs uppercase tracking-[0.28em] text-black bg-[#25D366] px-5 py-4 hover:brightness-95 transition"
                >
                  <WhatsAppGlyph className="h-4 w-4" />
                  Enquire on WhatsApp
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Nav;
