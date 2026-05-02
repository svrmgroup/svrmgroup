import { useEffect, useState } from "react";

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
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
        <a href="#top" className="font-serif text-2xl tracking-[0.4em] text-gold">
          SVRM
        </a>
        <a
          href="#enquire"
          className="text-xs uppercase tracking-[0.28em] text-gold border border-primary/60 px-5 py-3 hover:bg-primary hover:text-primary-foreground transition-colors duration-500"
        >
          Enquire
        </a>
      </div>
    </header>
  );
};

export default Nav;
