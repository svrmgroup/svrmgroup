import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import Logo from "./Logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CurrencySwitch from "./CurrencySwitch";
import LanguageSwitch from "./LanguageSwitch";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

import { navCategories } from "@/lib/navCategories";

const links = [
  { to: "/", label: "Home" },
  { to: "/travel", label: "Travel" },
  { to: "/rentals", label: "Rentals" },
  { to: "/stays", label: "Stays" },
  { to: "/tours", label: "Tours" },
  { to: "/security", label: "Security" },
  { to: "/experiences", label: "Custom" },
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
          {links.map((l) => {
            const subs = navCategories[l.to];
            if (subs && subs.length > 0) {
              return (
                <div key={l.to} className="relative group">
                  <NavLink to={l.to} className={linkClass} end={l.to === "/"}>
                    {l.label}
                  </NavLink>
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="bg-surface-deep/95 backdrop-blur-md border border-border/60 min-w-[200px] py-1">
                      {subs.map((s) => (
                        <Link
                          key={s.to}
                          to={s.to}
                          className="block px-5 py-3 text-[11px] uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors whitespace-nowrap"
                        >
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === "/"}>
                {l.label}
              </NavLink>
            );
          })}
        </nav>


        <div className="flex items-center gap-3">
          <CurrencySwitch className="hidden md:inline-flex" />
          <a
            href={buildWhatsAppUrl()}
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
              <div className="mt-12 flex flex-col gap-7">
                {links.map((l) => (
                  <NavLink
                    key={l.to}
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
                ))}
                <div className="pt-2"><CurrencySwitch /></div>
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 text-center text-xs uppercase tracking-[0.28em] text-primary-foreground bg-primary px-5 py-4"
                >
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
