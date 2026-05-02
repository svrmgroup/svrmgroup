const Footer = () => (
  <footer className="bg-background border-t border-border/60">
    <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
      <div className="md:col-span-2">
        <p className="font-serif text-3xl tracking-[0.4em] text-gold">SVRM</p>
        <p className="mt-4 text-muted-foreground text-sm max-w-sm leading-relaxed">
          A lifestyle management service for those who would rather live the moment than
          arrange it. Cape Town — and wherever you are next.
        </p>
      </div>
      <div>
        <p className="eyebrow">Contact</p>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li><a href="mailto:concierge@svrm.co.za" className="hover:text-gold transition-colors">concierge@svrm.co.za</a></li>
          <li><a href="https://wa.me/27000000000" className="hover:text-gold transition-colors">WhatsApp concierge</a></li>
        </ul>
      </div>
      <div>
        <p className="eyebrow">Based in</p>
        <p className="mt-4 text-sm text-muted-foreground">Cape Town<br />South Africa</p>
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
