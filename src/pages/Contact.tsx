import { useMemo, useState } from "react";
import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import PageHero from "@/components/svrm/PageHero";
import EnquiryForm from "@/components/svrm/EnquiryForm";
import { buildWhatsAppUrlRaw, CONCIERGE_EMAIL } from "@/lib/whatsapp";
import { Seo } from "@/components/Seo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { faqGroups, faqJsonLd, type FaqItem } from "@/data/faq";

const SYNONYMS: Record<string, string[]> = {
  pay: ["payment", "deposit", "eft", "card", "wire", "price", "cost", "quote"],
  payment: ["pay", "deposit", "eft", "card", "wire"],
  price: ["cost", "rate", "quote", "pricing", "pay"],
  cost: ["price", "rate", "quote", "pricing"],
  book: ["booking", "reserve", "enquiry", "reservation"],
  booking: ["book", "reserve", "enquiry", "reservation"],
  cancel: ["cancellation", "refund", "non-refundable", "forfeit"],
  cancellation: ["cancel", "refund", "non-refundable"],
  refund: ["cancel", "cancellation", "money back", "payment fees"],
  car: ["vehicle", "chauffeur", "driver", "transport", "bmw", "mercedes"],
  vehicle: ["car", "chauffeur", "driver", "transport"],
  airport: ["transfer", "pickup", "flight", "ctia"],
  transfer: ["airport", "pickup", "drop off", "transport"],
  tour: ["itinerary", "safari", "garden route", "experience"],
  stay: ["accommodation", "villa", "hotel", "apartment", "residence"],
  security: ["bodyguard", "close protection", "armoured", "psira"],
  privacy: ["data", "confidential", "nda", "personal information"],
  hours: ["24/7", "open", "support", "availability"],
  whatsapp: ["message", "chat", "contact", "+27 73 064 1481"],
  contact: ["email", "whatsapp", "phone", "message", "reach"],
};

const STOP_WORDS = new Set(["a", "an", "the", "is", "are", "do", "does", "can", "i", "you", "we", "your", "my", "how", "what", "where", "when", "why", "to", "of", "in", "on", "for", "with", "and", "or", "if", "it", "this", "that", "be", "me", "us"]);

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^\w\s\-/]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

function expandTokens(tokens: string[]): string[] {
  const expanded = new Set(tokens);
  tokens.forEach((t) => {
    SYNONYMS[t]?.forEach((s) => expanded.add(s));
  });
  return Array.from(expanded);
}

interface ScoredItem extends FaqItem {
  groupId: string;
  groupTitle: string;
  score: number;
  matchedTokens: string[];
}

function scoreItem(item: FaqItem, groupTitle: string, query: string, tokens: string[], expanded: string[]): ScoredItem | null {
  const haystack = `${item.q} ${item.a} ${(item.keywords || []).join(" ")} ${groupTitle}`.toLowerCase();
  const qLower = query.toLowerCase().trim();

  let score = 0;
  const matched = new Set<string>();

  // Exact phrase match — highest signal
  if (qLower.length > 2 && haystack.includes(qLower)) {
    score += 20;
    tokenize(qLower).forEach((t) => matched.add(t));
  }

  // Question-only exact phrase gets extra boost
  const questionLower = item.q.toLowerCase();
  if (qLower.length > 2 && questionLower.includes(qLower)) {
    score += 10;
  }

  // Token matching
  tokens.forEach((t) => {
    if (haystack.includes(t)) {
      score += 4;
      matched.add(t);
    }
  });

  // Expanded synonym matching
  expanded.forEach((t) => {
    if (!tokens.includes(t) && haystack.includes(t)) {
      score += 1.5;
      matched.add(t);
    }
  });

  // Keyword field boost
  const keywordText = (item.keywords || []).join(" ").toLowerCase();
  tokens.forEach((t) => {
    if (keywordText.includes(t)) score += 3;
  });

  if (score === 0) return null;

  return {
    ...item,
    groupId: "",
    groupTitle,
    score,
    matchedTokens: Array.from(matched),
  };
}

function highlight(text: string, tokens: string[]): (string | JSX.Element)[] {
  if (!tokens.length) return [text];
  const pattern = new RegExp(
    `(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "gi"
  );
  const parts = text.split(pattern);
  return parts.map((part, i) =>
    tokens.some((t) => part.toLowerCase() === t.toLowerCase()) ? (
      <mark key={i} className="bg-gold/20 text-foreground rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

const Contact = () => {
  const [query, setQuery] = useState("");

  const { groupedResults, rankedResults, hasQuery, tokens } = useMemo(() => {
    const q = query.trim();
    const hasQuery = q.length > 0;
    const tokens = tokenize(q);
    const expanded = expandTokens(tokens);

    if (!hasQuery) {
      return { groupedResults: faqGroups, rankedResults: [], hasQuery: false, tokens: [] };
    }

    const scored: ScoredItem[] = [];
    faqGroups.forEach((g) => {
      g.items.forEach((item) => {
        const result = scoreItem(item, g.title, q, tokens, expanded);
        if (result) {
          result.groupId = g.id;
          result.groupTitle = g.title;
          scored.push(result);
        }
      });
    });

    scored.sort((a, b) => b.score - a.score);
    return { groupedResults: [], rankedResults: scored, hasQuery: true, tokens };
  }, [query]);

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Seo
        title={"Contact SVRM | Cape Town Luxury Concierge — Enquiries & FAQ"}
        description={"Contact SVRM, Cape Town's luxury concierge. WhatsApp +27 73 064 1481. Includes a complete FAQ on bookings, pricing, travel, tours, stays and security."}
        path="/contact"
        keywords="contact SVRM, SVRM concierge contact, Cape Town concierge WhatsApp, luxury concierge enquiry, lifestyle management Cape Town contact, FAQ luxury services, concierge phone number Cape Town"
        jsonLd={faqJsonLd}
      />
      <Nav />
      <PageHero
        eyebrow="Contact · Luxury Concierge Cape Town"
        title="Contact SVRM Concierge & FAQ"
        subtitle="Booking is by request. Tell us what you need — a single Cape Town transfer or a complete itinerary — and our concierge team will respond personally, within hours."
      />

      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
          <aside className="lg:col-span-2 space-y-10">
            <div>
              <p className="eyebrow">Concierge</p>
              <a
                href={`mailto:${CONCIERGE_EMAIL}`}
                className="notranslate block font-serif text-2xl md:text-3xl mt-3 text-foreground hover:text-gold transition-colors break-all"
                translate="no"
              >
                {CONCIERGE_EMAIL}
              </a>
            </div>
            <div>
              <p className="eyebrow">WhatsApp</p>
              <a
                href={buildWhatsAppUrlRaw("Hi SVRM Group, I'd like to speak to the concierge. Please assist me with my request.")}
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
                Concierge 24/7.<br />Active bookings supported 24/7.
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

          <div className="mb-4 relative">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the FAQ… e.g. payment, refund, airport, Maybach"
              className="bg-surface-deep border-border/60 h-12 text-base pr-10"
              aria-label="Search FAQ"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-sm"
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>

          {hasQuery && (
            <p className="text-sm text-muted-foreground mb-8">
              {rankedResults.length === 0
                ? "No matches for your search."
                : `${rankedResults.length} result${rankedResults.length === 1 ? "" : "s"} found`}
            </p>
          )}

          {rankedResults.length === 0 && hasQuery && (
            <div className="text-center text-muted-foreground py-16 space-y-4">
              <p>No matches. Message the concierge directly and we will answer personally.</p>
              <a
                href={buildWhatsAppUrlRaw("Hi SVRM Group, I have a question that wasn't answered in your FAQ. Can you help?")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#25D366] text-white rounded-md font-medium hover:bg-[#128C7E] transition-colors"
              >
                Ask on WhatsApp
              </a>
            </div>
          )}

          {!hasQuery && (
            <div className="space-y-14">
              {groupedResults.map((group) => (
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
                        <AccordionContent className="text-muted-foreground leading-[1.85] text-base pb-6 whitespace-pre-wrap">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          )}

          {hasQuery && rankedResults.length > 0 && (
            <div className="space-y-6">
              <Accordion type="multiple" className="w-full">
                {rankedResults.map((item, idx) => (
                  <AccordionItem
                    key={`${item.groupId}-${idx}`}
                    value={`${item.groupId}-${idx}`}
                    className="border-border/40"
                  >
                    <AccordionTrigger className="text-left font-serif text-lg md:text-xl text-foreground hover:text-gold hover:no-underline py-5">
                      {highlight(item.q, tokens)}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-[1.85] text-base pb-6 whitespace-pre-wrap">
                      <p className="eyebrow text-gold text-xs mb-3">{item.groupTitle}</p>
                      {highlight(item.a, tokens)}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

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
