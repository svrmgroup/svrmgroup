import { useMemo, useState } from "react";
import { Seo } from "@/components/Seo";
import PageHero from "@/components/svrm/PageHero";
import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import KenBurnsImage from "@/components/svrm/KenBurnsImage";
import { WHATSAPP_BASE } from "@/lib/whatsappMessages";
import { MessageCircle, Users, Luggage, MapPin, CalendarClock } from "lucide-react";
import vclass from "@/assets/vehicles/vclass.jpg";
import staria from "@/assets/vehicles/staria.jpg";
import eclass from "@/assets/vehicles/eclass.jpg";
import bmwx3 from "@/assets/vehicles/bmwx3.jpg";
import cclass from "@/assets/vehicles/cclass.jpg";
import corolla from "@/assets/vehicles/corolla.jpg";
import sclass from "@/assets/vehicles/sclass.jpg";
import sprinter16 from "@/assets/vehicles/sprinter16.jpg";

type Car = { name: string; image: string; seats: string; bags: string; blurb: string };

const CARS: Car[] = [
  { name: "Mercedes V-Class", image: vclass, seats: "1–7 guests", bags: "6+ bags", blurb: "Lounge-seating people-mover for families and executives." },
  { name: "Hyundai Staria", image: staria, seats: "1–9 guests", bags: "7+ bags", blurb: "Modern van, ideal for larger parties with full luggage." },
  { name: "Mercedes E-Class", image: eclass, seats: "1–3 guests", bags: "2–3 bags", blurb: "Discreet executive sedan for solo travellers and couples." },
  { name: "Mercedes S-Class", image: sclass, seats: "1–3 guests", bags: "2–3 bags", blurb: "Flagship chauffeured sedan — the quiet standard." },
  { name: "BMW X3", image: bmwx3, seats: "1–4 guests", bags: "3–4 bags", blurb: "Compact SUV with room for a small family and luggage." },
  { name: "Mercedes C-Class", image: cclass, seats: "1–3 guests", bags: "2 bags", blurb: "Understated daily-driver sedan for city transfers." },
  { name: "Toyota Corolla", image: corolla, seats: "1–3 guests", bags: "2 bags", blurb: "Value pick — reliable, comfortable, budget-friendly." },
  { name: "Sprinter · 16-seater", image: sprinter16, seats: "8–16 guests", bags: "Full luggage", blurb: "Group transfer with executive seating and space to spare." },
];

const AirportTransfers = () => {
  const [pax, setPax] = useState("2");
  const [bags, setBags] = useState("2");
  const [when, setWhen] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [prefCar, setPrefCar] = useState<string>("");

  const message = useMemo(() => {
    const lines = [
      "Hi SVRM Group, I'd like to book an airport transfer.",
      "",
      when ? `Date/time: ${when}` : null,
      pax ? `Passengers: ${pax}` : null,
      bags ? `Luggage: ${bags} bags` : null,
      from ? `From: ${from}` : null,
      to ? `To: ${to}` : null,
      prefCar ? `Preferred vehicle: ${prefCar}` : null,
    ].filter(Boolean);
    return lines.join("\n");
  }, [when, pax, bags, from, to, prefCar]);

  const waHref = `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`;

  return (
    <>
      <Seo
        title="Airport Transfers · SVRM Group | Cape Town"
        description="Private, chauffeured airport transfers in Cape Town. Choose your vehicle, tell us your route and party size, and we'll confirm on WhatsApp within minutes."
        path="/airport-transfers"
      />
      <Nav />
      <PageHero
        eyebrow="Travel"
        title="Airport transfers"
        subtitle="Choose your vehicle. Share the route. We handle the rest — chauffeured, on time, on WhatsApp."
      />

      <main className="max-w-6xl mx-auto px-6 lg:px-10 py-16 md:py-24 space-y-16">
        {/* Enquiry form */}
        <section className="card-luxury p-6 md:p-10">
          <p className="eyebrow">Enquire</p>
          <h2 className="font-serif text-3xl md:text-4xl mt-2">Tell us about your transfer</h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-2xl">
            Fill in what you know — flight number, hotel, party size. Send it straight to
            our concierge on WhatsApp and we'll confirm the vehicle, driver and quote.
          </p>

          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="eyebrow flex items-center gap-2"><CalendarClock className="h-3.5 w-3.5" /> Date & time</span>
              <input
                type="datetime-local"
                value={when}
                onChange={(e) => setWhen(e.target.value)}
                className="bg-transparent border border-border/60 px-4 py-3 text-sm focus:border-primary outline-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="eyebrow flex items-center gap-2"><Users className="h-3.5 w-3.5" /> Passengers</span>
              <input
                type="number"
                min={1}
                value={pax}
                onChange={(e) => setPax(e.target.value)}
                className="bg-transparent border border-border/60 px-4 py-3 text-sm focus:border-primary outline-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="eyebrow flex items-center gap-2"><Luggage className="h-3.5 w-3.5" /> Luggage (bags)</span>
              <input
                type="number"
                min={0}
                value={bags}
                onChange={(e) => setBags(e.target.value)}
                className="bg-transparent border border-border/60 px-4 py-3 text-sm focus:border-primary outline-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="eyebrow">Preferred vehicle (optional)</span>
              <select
                value={prefCar}
                onChange={(e) => setPrefCar(e.target.value)}
                className="bg-transparent border border-border/60 px-4 py-3 text-sm focus:border-primary outline-none"
              >
                <option value="">Any — recommend for me</option>
                {CARS.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="eyebrow flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> From</span>
              <input
                type="text"
                placeholder="Hotel, address or CTIA"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="bg-transparent border border-border/60 px-4 py-3 text-sm focus:border-primary outline-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="eyebrow flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> To</span>
              <input
                type="text"
                placeholder="Airport, hotel or address"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="bg-transparent border border-border/60 px-4 py-3 text-sm focus:border-primary outline-none"
              />
            </label>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 flex-1 bg-[#25D366] text-black font-medium tracking-[0.18em] uppercase text-sm px-6 py-5 hover:brightness-95 transition"
            >
              <MessageCircle className="h-5 w-5" />
              Send on WhatsApp
            </a>
            <a
              href={`mailto:concierge@svrm.group?subject=${encodeURIComponent("Airport transfer enquiry")}&body=${encodeURIComponent(message)}`}
              className="inline-flex items-center justify-center flex-1 border border-primary/60 text-gold uppercase tracking-[0.24em] text-xs px-6 py-5 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Enquire by email
            </a>
          </div>
        </section>

        {/* Vehicle picker */}
        <section>
          <p className="eyebrow">Choose your vehicle</p>
          <h2 className="font-serif text-3xl md:text-4xl mt-2">Our transfer fleet</h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-2xl">
            Every transfer is chauffeured. Pick a vehicle to preview, or leave it to us
            and we'll match to your party and luggage.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {CARS.map((c, i) => (
              <article
                key={c.name}
                className={`group bg-surface-raised border ${prefCar === c.name ? "border-primary/70" : "border-border/40"} flex flex-col cursor-pointer transition-colors`}
                onClick={() => setPrefCar(c.name)}
              >
                <KenBurnsImage src={c.image} alt={c.name} className="aspect-[16/10]" direction={(i % 4) as 0 | 1 | 2 | 3} />
                <div className="p-5 flex-1 flex flex-col">
                  <p className="eyebrow">{c.seats} · {c.bags}</p>
                  <h3 className="font-serif text-xl mt-2 text-foreground">{c.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2 flex-1">{c.blurb}</p>
                  <div className="mt-4 text-[10px] uppercase tracking-[0.24em] text-gold">
                    {prefCar === c.name ? "Selected" : "Tap to select"}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <p className="text-xs text-muted-foreground max-w-2xl">
          WhatsApp is the fastest way to reach our concierge. Share your flight number,
          pickup point and party size — we'll confirm within minutes.
        </p>
      </main>

      <Footer />
    </>
  );
};

export default AirportTransfers;
