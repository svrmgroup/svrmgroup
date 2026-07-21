import { useSearchParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import PageHero from "@/components/svrm/PageHero";
import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import { whatsappUrlFor } from "@/lib/whatsappMessages";
import { MessageCircle } from "lucide-react";

type Size = "small" | "medium" | "large";

const OPTIONS: Array<{ id: Size; title: string; blurb: string; seats: string }> = [
  {
    id: "small",
    title: "Small",
    blurb: "Sedan or executive saloon. Ideal for one to three travellers with hand luggage.",
    seats: "1–3 guests · 2–3 bags",
  },
  {
    id: "medium",
    title: "Medium",
    blurb: "Premium SUV or people-mover. Room for family groups and full luggage.",
    seats: "4–6 guests · 4–6 bags",
  },
  {
    id: "large",
    title: "Large / Van",
    blurb: "Sprinter-class van for larger parties, event groups and extra luggage.",
    seats: "7–14 guests · Full luggage",
  },
];

const AirportTransfers = () => {
  const [params] = useSearchParams();
  const requested = (params.get("size") as Size | null) ?? null;
  const waHref = whatsappUrlFor("/airport-transfers");

  return (
    <>
      <Seo
        title="Airport Transfers · SVRM Group | Cape Town"
        description="Private airport transfers in Cape Town — small, medium and large / van options. Enquire on WhatsApp for a swift, chauffeured pickup."
        path="/airport-transfers"
      />
      <Nav />
      <PageHero
        eyebrow="Travel"
        title="Airport transfers"
        subtitle="Private, chauffeured, on time. Enquire on WhatsApp for a swift response."
      />

      <main className="max-w-6xl mx-auto px-6 lg:px-10 py-16 md:py-24">
        <p className="eyebrow mb-6">Choose your size</p>
        <div className="grid md:grid-cols-3 gap-6">
          {OPTIONS.map((o) => {
            const active = requested === o.id;
            return (
              <div
                key={o.id}
                className={`card-luxury p-6 flex flex-col justify-between ${
                  active ? "border-primary/60" : ""
                }`}
              >
                <div>
                  <p className="eyebrow">{o.seats}</p>
                  <h2 className="font-serif text-2xl mt-2">{o.title}</h2>
                  <p className="text-sm text-muted-foreground mt-3">{o.blurb}</p>
                </div>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.28em] text-primary-foreground bg-primary px-5 py-3 hover:bg-primary-glow transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Enquire — {o.title}
                </a>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground mt-10 max-w-2xl">
          WhatsApp is the fastest way to reach our concierge. Share your flight
          number, pickup point and party size and we'll confirm within minutes.
        </p>
      </main>

      <Footer />
    </>
  );
};

export default AirportTransfers;
