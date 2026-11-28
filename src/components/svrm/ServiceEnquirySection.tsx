import { useLocation } from "react-router-dom";
import ListingEnquiry from "./ListingEnquiry";
import { useListingPage } from "./ListingSections";
import type { EnquiryKind } from "@/lib/listingEnquiry";

/** Item-aware availability form for a service page (airport, charters, occasions, security). */
const ServiceEnquirySection = ({ id, name, kind, detail, intro }: { id: string; name: string; kind: EnquiryKind; detail?: string; intro?: string }) => {
  const { pathname } = useLocation();
  const listing = { id: `service:${id}`, name, kind, detail, url: `https://svrm.group${pathname}`, path: pathname };
  useListingPage(listing, "service");
  return (
    <section className="py-16 md:py-20 border-t border-border/40 pb-28 lg:pb-20">
      <div className="max-w-xl mx-auto px-6">
        <p className="eyebrow text-center">Check availability</p>
        <h2 className="font-serif text-3xl md:text-4xl mt-3 text-center">{name}</h2>
        {intro && <p className="mt-3 text-center text-sm text-muted-foreground">{intro}</p>}
        <div className="mt-8"><ListingEnquiry listing={listing} category="service" /></div>
      </div>
    </section>
  );
};
export default ServiceEnquirySection;
