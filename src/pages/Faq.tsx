import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PageHero from "@/components/svrm/PageHero";
import { Seo } from "@/components/Seo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  buildWhatsAppUrl,
  CONCIERGE_EMAIL,
  WHATSAPP_NUMBER,
  INSTAGRAM_URL,
  TIKTOK_URL,
  SOCIAL_HANDLE,
} from "@/lib/whatsapp";

type FaqItem = { q: string; a: string };
type FaqGroup = { id: string; title: string; items: FaqItem[] };

const groups: FaqGroup[] = [
  {
    id: "general",
    title: "About SVRM",
    items: [
      {
        q: "What is SVRM?",
        a: "SVRM is a Cape Town–based luxury lifestyle management and concierge service. We curate transport, tours, stays, security and bespoke experiences for private clients and businesses — locally and across South Africa.",
      },
      {
        q: "Where are you based and where do you operate?",
        a: "We are headquartered in Cape Town. Our chauffeured travel, tours, security and stays operate across the Western Cape as standard, and nationally on request. International planning and onward arrangements can be coordinated through our partner network.",
      },
      {
        q: "Do you work with businesses as well as private clients?",
        a: "Yes. We support corporate visits, executive transport, roadshows, conference logistics, group travel, private events and ongoing retainers. Speak to the concierge for a tailored proposal.",
      },
      {
        q: "Is SVRM discreet? Will my booking be private?",
        a: "Discretion is fundamental. Our team is NDA-bound, our vehicles are unbranded, and we do not publish client names, itineraries or images without written consent.",
      },
    ],
  },
  {
    id: "booking",
    title: "Booking & Pricing",
    items: [
      {
        q: "How do I make a booking?",
        a: "The quickest route is WhatsApp on +27 73 064 1481. You can also email concierge@svrm.group or use the enquiry form on the Contact page. We typically reply the same day.",
      },
      {
        q: "Why don't you publish prices?",
        a: "Every itinerary is composed for the guest — vehicle, route, wait time, season, party size and discretion all shape the rate. A published number would be wrong for almost everyone, so we send a written quote within 24 hours instead.",
      },
      {
        q: "Which currencies can I be quoted in?",
        a: "We quote in ZAR by default and can present the same quote in GBP or USD. The site has a currency switcher in the top navigation.",
      },
      {
        q: "How do I pay? Is a deposit required?",
        a: "We accept EFT, card and international wire. A deposit is typically required to confirm; the balance is settled before or on the day of service. Specific terms are on every written quote.",
      },
      {
        q: "What is your cancellation policy?",
        a: "Terms are set per booking and clearly stated on the quote. As a general guide, cancellations made well in advance are refundable; short-notice cancellations may be partially or non-refundable, especially for tours, charters and seasonal stays.",
      },
      {
        q: "How far in advance should I book?",
        a: "For peak season (December–February and Easter) we recommend 4–8 weeks. Off-peak we can often arrange transport, tours and stays within 24–72 hours.",
      },
    ],
  },
  {
    id: "travel",
    title: "Travel & Chauffeur",
    items: [
      {
        q: "What does your chauffeured travel include?",
        a: "A professional, NDA-bound chauffeur, the vehicle of your choice, fuel, tolls, water on board and in-trip support from the concierge. Wait time, child seats and additional stops are arranged on request.",
      },
      {
        q: "Do you offer airport transfers?",
        a: "Yes — to and from Cape Town International, private FBOs and regional airports. Flight tracking is standard so we adjust automatically for early or delayed arrivals.",
      },
      {
        q: "Can I hire a vehicle without a chauffeur?",
        a: "Yes. Self-drive hire is available through the Rentals page and is priced lower than the chauffeured equivalent. A valid licence, ID/passport and a refundable deposit are required.",
      },
      {
        q: "Do you offer private jets, helicopters or yachts?",
        a: "Yes — through trusted partners. We arrange private jet charter, scenic and transfer helicopters, and motor or sailing yachts from the V&A Waterfront. See the Travel page categories.",
      },
      {
        q: "Do you offer group transport?",
        a: "Yes. 16-seater Sprinters, 22-seater midibuses, 32-seater touring buses and full luxury coaches for weddings, corporate groups and tours.",
      },
    ],
  },
  {
    id: "tours",
    title: "Tours & Experiences",
    items: [
      {
        q: "What kinds of tours do you offer?",
        a: "Safari, marine and wildlife, Garden Route road trips, aerial and scenic flights, culinary experiences, wellness retreats, photography tours, cultural and adventure days, and fully custom itineraries.",
      },
      {
        q: "Are your tours private?",
        a: "Yes — every SVRM tour is private to your party. We do not run shared or group-with-strangers tours.",
      },
      {
        q: "Can you build a custom itinerary?",
        a: "Yes. Use the Tour Builder on the Tours page or message the concierge with dates, party size and the feeling you want from the trip. We return a first sketch within a day.",
      },
      {
        q: "Do you offer wine tours?",
        a: "No. We do not offer alcohol-led tours. We do offer culinary experiences, vineyard landscapes and Cape Winelands scenery where alcohol is not the focus.",
      },
    ],
  },
  {
    id: "stays",
    title: "Stays & Property",
    items: [
      {
        q: "What types of stays do you arrange?",
        a: "Private villas, serviced apartments, boutique hotels and long-term residences across Cape Town and the Cape Peninsula. Short-term, long-term and seasonal options are all available.",
      },
      {
        q: "Can you find a stay that fits my specific budget?",
        a: "Yes. Use the Custom Stay bar on the Stays page — tell us dates, party, neighbourhood and budget, and we return a curated shortlist.",
      },
      {
        q: "Do you help with buying or selling property?",
        a: "Yes. We facilitate residential sales, off-market introductions and long-term lease negotiations in partnership with vetted Cape Town agents.",
      },
      {
        q: "Can I add a chef, housekeeper or chauffeur to my stay?",
        a: "Yes — see the Stay Extras options. Private chefs, housekeeping, in-residence trainers, chauffeurs on call and security can all be arranged.",
      },
    ],
  },
  {
    id: "security",
    title: "Security",
    items: [
      {
        q: "What security services do you offer?",
        a: "Armoured vehicle transport (BMW 7 Series, X5, Mercedes G63), armed and unarmed close protection, residential security, event security and secure airport transfers.",
      },
      {
        q: "Is your security team licensed?",
        a: "Yes — our protection partners operate under PSiRA-registered firms with vetted personnel. Specifics for any deployment are confirmed in writing before service.",
      },
      {
        q: "Can security be added to any booking?",
        a: "Yes. Close protection, secure transport and venue advance work can be layered onto any travel, tour, stay or event.",
      },
    ],
  },
  {
    id: "scope",
    title: "What we don't offer",
    items: [
      {
        q: "Is there anything SVRM won't arrange?",
        a: "We do not arrange anything illegal, unsafe or in conflict with the wellbeing of guests, staff or wildlife. We do not run alcohol-led tours, we do not work with unlicensed operators, and we do not accept bookings we cannot deliver to our standard.",
      },
      {
        q: "Do you offer hunting tours?",
        a: "We facilitate ethical, legally licensed game experiences only. We do not arrange any activity that contravenes South African wildlife or firearms law.",
      },
      {
        q: "Do you sell tickets to public events?",
        a: "We don't operate as a ticket agency. We do arrange private access, hospitality and transport around major Cape Town events when capacity allows.",
      },
    ],
  },
  {
    id: "policies",
    title: "Privacy, Data & Policies",
    items: [
      {
        q: "How do you handle my personal information?",
        a: "We collect only what is needed to deliver the service you have requested — contact details, travel details and any preferences you share. Information is shared with the specific vendors required to deliver your booking, under confidentiality.",
      },
      {
        q: "Will my booking appear on social media?",
        a: "No — never without your explicit written consent. Our default is full discretion.",
      },
      {
        q: "Who do I contact about a data or privacy request?",
        a: "Email concierge@svrm.group with the subject 'Privacy request' and we will respond within a reasonable period.",
      },
    ],
  },
  {
    id: "contact",
    title: "Contact",
    items: [
      {
        q: "What is the best way to reach you?",
        a: "WhatsApp is fastest — +27 73 064 1481. For longer briefs, email concierge@svrm.group. Social: @SVRMGROUP on Instagram and TikTok.",
      },
      {
        q: "What are your hours?",
        a: "Concierge support runs 07:00–22:00 SAST seven days a week. Active bookings (transport, security, ongoing itineraries) are supported 24/7 by the on-duty team.",
      },
    ],
  },
];

const Faq = () => {
  const [query, setQuery] = useState("");

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (i) => i.q.toLowerCase().includes(q) || i.a.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [query]);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: groups.flatMap((g) =>
      g.items.map((i) => ({
        "@type": "Question",
        name: i.q,
        acceptedAnswer: { "@type": "Answer", text: i.a },
      }))
    ),
  };

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Seo
        title="FAQ — SVRM | Cape Town Luxury Concierge Questions Answered"
        description="Frequently asked questions about SVRM — Cape Town luxury concierge. Booking, pricing, chauffeur travel, private tours, stays, security, what we offer and what we don't."
        path="/faq"
        jsonLd={faqSchema}
      />
      <Nav />

      <PageHero
        eyebrow="FAQ · Everything you might want to ask"
        title="Questions, answered."
        subtitle="Booking, pricing, what we offer, what we don't, and how to reach a real person at SVRM."
      />

      <section className="pb-28">
        <div className="max-w-3xl mx-auto px-6">
          {/* Search */}
          <div className="mb-12">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the FAQ…"
              className="bg-surface-deep border-border/60 h-12 text-base"
              aria-label="Search FAQ"
            />
          </div>

          {/* Quick contact strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16 border-y border-border/40 py-8">
            <a
              href={buildWhatsAppUrl("Hello SVRM — I have a question.")}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <p className="eyebrow text-gold">WhatsApp</p>
              <p className="font-serif text-lg mt-2 group-hover:text-gold transition-colors">
                +27 73 064 1481
              </p>
            </a>
            <a href={`mailto:${CONCIERGE_EMAIL}`} className="block group">
              <p className="eyebrow text-gold">Email</p>
              <p className="font-serif text-lg mt-2 group-hover:text-gold transition-colors">
                {CONCIERGE_EMAIL}
              </p>
            </a>
            <div>
              <p className="eyebrow text-gold">Social</p>
              <p className="font-serif text-lg mt-2">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors"
                >
                  {SOCIAL_HANDLE}
                </a>
                <span className="text-muted-foreground text-sm ml-2">
                  · IG /{" "}
                  <a
                    href={TIKTOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gold transition-colors"
                  >
                    TikTok
                  </a>
                </span>
              </p>
            </div>
          </div>

          {/* Groups */}
          {filteredGroups.length === 0 && (
            <p className="text-center text-muted-foreground py-16">
              No matches. Try a different word, or message the concierge directly.
            </p>
          )}

          <div className="space-y-16">
            {filteredGroups.map((group) => (
              <div key={group.id} id={group.id}>
                <p className="eyebrow text-gold mb-2">{group.title}</p>
                <div className="h-px bg-border/50 mb-6" />
                <Accordion type="multiple" className="w-full">
                  {group.items.map((item, idx) => (
                    <AccordionItem
                      key={idx}
                      value={`${group.id}-${idx}`}
                      className="border-border/40"
                    >
                      <AccordionTrigger className="text-left font-serif text-lg md:text-xl text-foreground hover:text-gold hover:no-underline py-5">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-[1.85] text-base pb-6">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {/* Closing CTA */}
          <div className="mt-24 text-center border-t border-border/40 pt-16">
            <p className="eyebrow text-gold">Still have a question?</p>
            <h2 className="font-serif text-3xl md:text-4xl mt-4">
              Speak directly to the concierge.
            </h2>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <a
                  href={buildWhatsAppUrl("Hello SVRM — I'd like to ask a question.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp the concierge
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary/60 text-gold hover:bg-primary/10">
                <Link to="/contact">Contact page</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-8 max-w-md mx-auto">
              This page is maintained by SVRM to answer common questions about our services.
              It reflects our current practice and is not legal or regulatory certification.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Faq;
