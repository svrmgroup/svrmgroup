import { useEffect } from "react";
import { Link } from "react-router-dom";
import ServiceFaq from "./ServiceFaq";
import { completeFaq, faqSchema } from "@/lib/faq";
import type { Faq, RelatedLink } from "@/data/listings";
import { SITE_URL } from "@/data/listings";
import { setCurrentListing } from "@/lib/currentListing";
import { trackListingView } from "@/lib/listingAnalytics";
import type { EnquiryListing } from "@/lib/listingEnquiry";

export interface Crumb { label: string; to: string }

export const Breadcrumbs = ({ items }: { items: Crumb[] }) => (
  <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
    <ol className="flex flex-wrap items-center gap-1.5">
      {items.map((c, i) => (
        <li key={c.to} className="flex items-center gap-1.5">
          {i > 0 && <span aria-hidden>/</span>}
          {i === items.length - 1 ? <span aria-current="page" className="text-foreground">{c.label}</span> : <Link to={c.to} className="hover:text-foreground">{c.label}</Link>}
        </li>
      ))}
    </ol>
  </nav>
);

export const breadcrumbSchema = (items: Crumb[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: `${SITE_URL}${c.to}` })),
});

/** Visible FAQ answers and FAQ search data come from the same enriched answers. */
export const enrichFaqs = (faqs: Faq[]) => faqs.map((f, i) => completeFaq(f, i));
export const listingFaqSchema = (faqs: Faq[]) => faqSchema(enrichFaqs(faqs));

export const FactList = ({ facts }: { facts: [string, string][] }) => (
  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border/40 border border-border/40">
    {facts.map(([k, v]) => (
      <div key={k} className="bg-background p-4">
        <dt className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{k}</dt>
        <dd className="mt-1 text-sm text-foreground">{v}</dd>
      </div>
    ))}
  </dl>
);

export const ListingFaqs = ({ faqs, title }: { faqs: Faq[]; title: string }) => (
  <section aria-labelledby="faq-heading">
    <h2 id="faq-heading" className="font-serif text-2xl">{title}</h2>
    <div className="mt-2"><ServiceFaq items={enrichFaqs(faqs)} /></div>
  </section>
);

export const RelatedLinks = ({ links }: { links: RelatedLink[] }) => links.length ? (
  <section aria-labelledby="related-heading">
    <h2 id="related-heading" className="font-serif text-2xl">You may also like</h2>
    <ul className="mt-4 grid gap-3 sm:grid-cols-3">
      {links.map((l) => (
        <li key={l.to}><Link to={l.to} className="block border border-border/50 p-4 text-sm hover:border-primary/60 hover:text-gold transition-colors">{l.label} →</Link></li>
      ))}
    </ul>
  </section>
) : null;

/** Registers the listing for the floating WhatsApp button and records one view per listing. */
export function useListingPage(listing: EnquiryListing & { path: string }, category: string) {
  useEffect(() => {
    setCurrentListing(listing);
    trackListingView(listing.id, category, listing.kind);
    return () => setCurrentListing(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing.id]);
}
