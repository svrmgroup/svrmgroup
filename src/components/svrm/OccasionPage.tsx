import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PageHero from "@/components/svrm/PageHero";
import EnquiryForm from "@/components/svrm/EnquiryForm";
import SmartImage from "@/components/svrm/SmartImage";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export interface OccasionPillar {
  title: string;
  body: string;
}

export interface OccasionLink {
  to: string;
  label: string;
}

interface Props {
  eyebrow: string;
  h1: string;
  intro: string;
  heroImage: string;
  heroAlt: string;
  /** Optional looping background video for the hero section. */
  heroVideo?: string;
  lede: string;
  pillars: OccasionPillar[];
  itineraryTitle: string;
  itinerary: string[];
  links: OccasionLink[];
  enquirySubject: string;
  enquiryDefault: string;
  whatsAppMessage: string;
  ctaLabel: string;
}

/**
 * Shared editorial layout for the honeymoon and anniversary concierge pages.
 * Keeps the existing black/gold treatment — no new design language.
 */
const OccasionPage = ({
  eyebrow,
  h1,
  intro,
  heroImage,
  heroAlt,
  lede,
  pillars,
  itineraryTitle,
  itinerary,
  links,
  enquirySubject,
  enquiryDefault,
  whatsAppMessage,
  ctaLabel,
}: Props) => (
  <>
    <Nav />
    <PageHero eyebrow={eyebrow} title={h1} subtitle={intro} posterSrc={heroImage} />

    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-raised">
          <SmartImage
            src={heroImage}
            alt={heroAlt}
            wrapperClassName="absolute inset-0 w-full h-full"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="eyebrow">SVRM handles the details</p>
          <div className="gold-divider w-16 mt-6" />
          <p className="text-muted-foreground leading-relaxed mt-6">{lede}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#enquire"
              className="text-[10px] uppercase tracking-[0.24em] px-6 py-4 bg-primary text-primary-foreground hover:bg-primary-glow transition-colors"
            >
              {ctaLabel}
            </a>
            <a
              href={buildWhatsAppUrl(whatsAppMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] px-6 py-4 border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-black transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>

    <section className="py-16 md:py-20 bg-surface-raised/40 border-y border-border/40">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-serif text-3xl md:text-5xl text-foreground">
          What we arrange
        </h2>
        <div className="gold-divider w-16 mt-6 mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((p) => (
            <article
              key={p.title}
              className="bg-background border border-border/50 p-7 hover:border-primary/60 transition-colors"
            >
              <h3 className="font-serif text-2xl text-foreground">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                {p.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="font-serif text-3xl md:text-5xl text-foreground">
          {itineraryTitle}
        </h2>
        <div className="gold-divider w-16 mt-6 mb-8" />
        <ul className="space-y-4">
          {itinerary.map((line) => (
            <li key={line} className="flex items-start gap-3 text-muted-foreground">
              <span className="mt-2 w-1.5 h-1.5 bg-primary shrink-0" />
              <span className="leading-relaxed">{line}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground/80 mt-8">
          Nothing here is fixed. Tell us the dates and the feeling you're after and
          we build the rest around it.
        </p>
      </div>
    </section>

    <section className="pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <p className="eyebrow">Continue</p>
        <div className="flex flex-wrap gap-3 mt-5">
          {links.map((l) => (
            <Link
              key={l.to + l.label}
              to={l.to}
              className="text-[11px] uppercase tracking-[0.2em] px-4 py-3 border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </section>

    <section id="enquire" className="pb-24 scroll-mt-24">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">
          {ctaLabel}
        </h2>
        <EnquiryForm subject={enquirySubject} defaultMessage={enquiryDefault} />
      </div>
    </section>

    <Footer />
  </>
);

export default OccasionPage;
