import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import RelatedLinks from "@/components/svrm/RelatedLinks";
import PageHero from "@/components/svrm/PageHero";
import KenBurnsImage from "@/components/svrm/KenBurnsImage";
import { Seo } from "@/components/Seo";
import { securityOfferings, securityCategories } from "@/data/security";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { ShieldCheck, MessageCircle } from "lucide-react";
import heroVideo from "@/assets/videos/security.mp4.asset.json";
import bmw7 from "@/assets/security/bmw7-armored.jpg";

const Security = () => {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <Seo
        title={"Security Services Cape Town | VIP & Executive Protection"}
        description={"VIP security and executive protection in Cape Town — close protection, armoured vehicles and residential security across South Africa."}
        path="/security"
        keywords="security services Cape Town, VIP security Cape Town, executive security Cape Town, executive protection Cape Town, private security Cape Town, close protection Cape Town, luxury travel security South Africa, armed close protection Cape Town, bodyguard Cape Town, executive protection South Africa, armoured vehicle hire, bullet proof BMW 7 Series, armoured BMW X5, Mercedes G63 convoy, residential security Cape Town, event security, secure airport transfer, PSiRA security, VIP protection South Africa"
        image={bmw7}
        jsonLd={{ "@context": "https://schema.org", "@type": "Service", serviceType: "Executive Protection & Armoured Transport", provider: { "@type": "Organization", name: "SVRM Group", url: "https://svrm.group/" }, areaServed: { "@type": "Country", name: "South Africa" } }}
      />
      <Nav />

      <PageHero
        eyebrow="Security · Armed Close Protection & Armoured Transport"
        title="VIP Security & Executive Protection Cape Town"
        subtitle="VIP security, executive protection and travel security in Cape Town and across South Africa — vetted close protection officers, armoured vehicles, residential and event coverage, coordinated end-to-end by SVRM."
        videoSrc={heroVideo.url}
      />

      <section className="pb-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-raised border border-border/40 p-6">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-gold" />
            <span>All security pricing is confidential and provided on request after a brief.</span>
          </div>
          <a
            href={buildWhatsAppUrl("Security enquiry")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] px-4 py-3 bg-primary text-primary-foreground hover:bg-primary-glow transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Request a brief
          </a>
        </div>
      </section>

      {securityCategories.map((category) => {
        const items = securityOfferings.filter((o) => o.category === category);
        if (!items.length) return null;
        return (
          <section key={category} id={category.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")} className="pb-20 scroll-mt-24">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-end justify-between mb-8">
                <h2 className="font-serif text-3xl md:text-4xl text-foreground">{category}</h2>
                <div className="gold-divider w-16" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {items.map((o, i) => (
                  <article key={o.slug} className="group bg-surface-raised border border-border/40 flex flex-col">
                    <KenBurnsImage
                      src={o.image}
                      alt={o.name}
                      className="aspect-[16/10]"
                      direction={(i % 4) as 0 | 1 | 2 | 3}
                    />
                    <div className="p-6 flex-1 flex flex-col">
                      <p className="eyebrow">{o.category}</p>
                      <h3 className="font-serif text-2xl mt-2 text-foreground">{o.name}</h3>
                      <p className="text-sm text-muted-foreground mt-2">{o.tagline}</p>
                      <ul className="mt-4 space-y-1.5 text-sm text-foreground/85 flex-1">
                        {o.highlights.map((h) => (
                          <li key={h} className="flex gap-2"><span className="text-gold">·</span><span>{h}</span></li>
                        ))}
                      </ul>
                      <div className="mt-6 flex items-end justify-between gap-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70">From</p>
                          <p className="font-serif text-xl text-gold">Price on request</p>
                        </div>
                        <a
                          href={buildWhatsAppUrl(`${o.name} — security enquiry`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] uppercase tracking-[0.24em] px-4 py-3 border border-primary/60 text-gold hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          Enquire
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <RelatedLinks
        links={[
          { to: "/travel?cat=cars", label: "Chauffeur service" },
          { to: "/travel?cat=cars", label: "Mercedes-Maybach S-Class" },
          { to: "/airport-transfers", label: "Secure airport transfers" },
          { to: "/experiences", label: "Luxury concierge" },
          { to: "/stays", label: "Villas & stays" },
          { to: "/tours/cape-peninsula", label: "Cape Peninsula tour" },
        ]}
      />

      <Footer />
    </main>
  );
};

export default Security;
