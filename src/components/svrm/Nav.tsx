import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import Wordmark from "./Wordmark";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const links = [
  { to: "/services", label: "Services" },
  { to: "/business", label: "Business" },
  { to: "/concierge", label: "Concierge" },
  { to: "/about", label: "About" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-xs uppercase tracking-[0.28em] transition-colors duration-300 pb-1 border-b ${
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
          ? "bg-surface-deep/80 backdrop-blur-md border-b border-border/60"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10 h-20">
        <Link to="/" aria-label="SVRM home" className="block">
          <Wordmark />
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block text-xs uppercase tracking-[0.28em] text-gold border border-primary/60 px-5 py-3 hover:bg-primary hover:text-primary-foreground transition-colors duration-500"
          >
            Enquire
          </a>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className="md:hidden p-2 text-foreground"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-surface-deep border-l border-border/60 w-72">
              <div className="mt-12 flex flex-col gap-8">
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
                    end
                  >
                    {l.label}
                  </NavLink>
                ))}
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 text-center text-xs uppercase tracking-[0.28em] text-primary-foreground bg-primary px-5 py-4"
                >
                  Enquire
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
