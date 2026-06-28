import { useMemo, useState } from "react";
import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PageHero from "@/components/svrm/PageHero";
import EnquiryForm from "@/components/svrm/EnquiryForm";
import { buildWhatsAppUrl, CONCIERGE_EMAIL } from "@/lib/whatsapp";
import { Seo } from "@/components/Seo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { faqGroups, faqJsonLd } from "@/data/faq";

const Contact = () => {
  const [query, setQuery] = useState("");

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqGroups;
    return faqGroups
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (i) => i.q.toLowerCase().includes(q) || i.a.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [query]);

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Seo
        title={"Contact SVRM | Cape Town Luxury Concierge — Enquiries & FAQ"}
        description={"Contact SVRM, Cape Town's luxury concierge. WhatsApp +27 73 064 1481 or concierge@svrm.group. Includes a complete FAQ on bookings, pricing, travel, tours, stays and security."}
        path="/contact"
        jsonLd={faqJsonLd}
      />
      <Nav />
      <PageHero
        eyebrow="Contact · Luxury Concierge Cape Town"
        title="Begin a conversation."
        subtitle="Booking is by request. Tell us what you need — a single Cape Town transfer or a complete itinerary — and our concierge team will respond personally, within hours."
      />

      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
          <aside className="lg:col-span-2 space-y-10">
            <div>
              <p className="eyebrow">Concierge</p>
              <a
                href={`mailto:${CONCIERGE_EMAIL}`}
                className="block font-serif text-2xl md:text-3xl mt-3 text-foreground hover:text-gold transition-colors break-all"
              >
                {CONCIERGE_EMAIL}
              </a>
            </div>
            <div>
              <p className="eyebrow">WhatsApp</p>
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-serif text-2xl md:text-3xl mt-3 text-foreground hover:text-gold transition-colors"
              >
                Message the concierge →
              </a>
              <p className="text-xs text-muted-foreground/70 mt-3 tracking-wide">
                Personally answered, within hours.
              </p>
            </div>
            <div>
              <p className="eyebrow">Location</p>
              <p className="mt-3 text-muted-foreground">Cape Town, South Africa.<br />By appointment.</p>
            </div>
            <div>
              <p className="eyebrow">Hours</p>
              <p className="mt-3 text-muted-foreground">
                Concierge 07:00–22:00 SAST, daily.<br />Active bookings supported 24/7.
              </p>
            </div>
            <div className="border-t border-border/40 pt-8">
              <a href="#faq" className="text-xs uppercase tracking-[0.24em] text-gold border-b border-primary/40 pb-1">
                Jump to FAQ ↓
              </a>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <EnquiryForm subject="General enquiry" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="pb-28 border-t border-border/40 pt-20 scroll-mt-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="eyebrow text-gold">FAQ</p>
            <h2 className="font-serif text-3xl md:text-5xl mt-4">Questions, answered.</h2>
            <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
              Booking, pricing, what we offer, what we don't, and how to reach a real person at SVRM.
            </p>
          </div>

          <div className="mb-12">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the FAQ…"
              className="bg-surface-deep border-border/60 h-12 text-base"
              aria-label="Search FAQ"
            />
          </div>

          {filteredGroups.length === 0 && (
            <p className="text-center text-muted-foreground py-16">
              No matches. Message the concierge directly and we will answer personally.
            </p>
          )}

          <div className="space-y-14">
            {filteredGroups.map((group) => (
              <div key={group.id} id={group.id}>
                <p className="eyebrow text-gold mb-2">{group.title}</p>
                <div className="h-px bg-border/50 mb-4" />
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

          <p className="text-xs text-muted-foreground/70 text-center mt-16 max-w-md mx-auto leading-relaxed">
            This FAQ is maintained by SVRM to answer common questions about our services.
            It reflects our current practice and is not legal or regulatory certification.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Contact;
