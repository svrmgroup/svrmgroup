import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Seo } from "@/components/Seo";
import Nav from "@/components/svrm/Nav";
import Footer from "@/components/svrm/Footer";
import { WHATSAPP_BASE } from "@/lib/whatsappMessages";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MessageCircle, Users, Luggage, MapPin, CalendarClock, Send, CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDate } from "@/lib/locale";
import hero from "@/assets/airport-transfers-hero.jpg";

// Common Cape Town pickup / drop-off points for autofill.
const PLACES = [
  "Cape Town International Airport (CPT)",
  "V&A Waterfront",
  "Camps Bay",
  "Clifton",
  "Sea Point",
  "Green Point",
  "City Bowl / CBD",
  "Constantia",
  "Bantry Bay",
  "Bo-Kaap",
  "Hout Bay",
  "Stellenbosch",
  "Franschhoek",
  "Table Mountain Cableway",
  "Cape Grace Hotel",
  "One&Only Cape Town",
  "The Silo Hotel",
  "Ellerman House",
  "Mount Nelson Hotel",
  "Cape Winelands",
];

const startOfToday = () => new Date(new Date().setHours(0, 0, 0, 0));

const parseWhen = (value: string): { date?: Date; time: string } => {
  if (!value) return { time: "12:00" };
  const [datePart, timePart] = value.split("T");
  const date = new Date(datePart + "T00:00:00");
  return { date: Number.isNaN(date.getTime()) ? undefined : date, time: timePart || "12:00" };
};

const formatWhen = (date?: Date, time = "12:00") => {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}T${time}`;
};

const AirportTransfers = () => {
  const location = useLocation();
  const [pax, setPax] = useState("2");
  const [bags, setBags] = useState("2");
  const [when, setWhen] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  const { date: selectedDate, time: selectedTime } = parseWhen(when);

  const message = useMemo(() => {
    const lines = [
      "Hi SVRM Group, I'd like to book an airport transfer.",
      "",
      when ? `Date/time: ${when}` : null,
      pax ? `Passengers: ${pax}` : null,
      bags ? `Luggage: ${bags} bags` : null,
      from ? `From: ${from}` : null,
      to ? `To: ${to}` : null,
    ].filter(Boolean);
    return lines.join("\n");
  }, [when, pax, bags, from, to]);

  const waHref = `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`;

  const submitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please add your name and email.");
      return;
    }
    setSubmitting(true);
    const body = [
      when ? `Date/time: ${when}` : null,
      pax ? `Passengers: ${pax}` : null,
      bags ? `Luggage: ${bags} bags` : null,
      from ? `From: ${from}` : null,
      to ? `To: ${to}` : null,
    ].filter(Boolean).join("\n");
    const { error } = await supabase.from("enquiries").insert({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      subject: "Airport transfer enquiry",
      message: body || "Airport transfer enquiry",
      source_page: location.pathname,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Couldn't send. Please try WhatsApp instead.");
      return;
    }
    setDone(true);
    toast.success("Enquiry received. We'll respond within hours.");
  };

  const inputCls =
    "bg-surface-raised/60 border border-border/60 px-4 py-3 text-sm text-foreground focus:border-primary outline-none [color-scheme:dark]";

  return (
    <>
      <Seo
        title="Cape Town Airport Transfers | Private Chauffeur | SVRM Group"
        description="Private chauffeured airport transfers in Cape Town — Mercedes V-Class, E-Class, BMW X3, Sprinter. Flat rates, on-time meet & greet, book on WhatsApp in minutes."
        path="/airport-transfers"
        keywords="Cape Town airport transfer, CPT airport transfer, private chauffeur Cape Town, Mercedes V-Class transfer, luxury airport pickup Cape Town, SVRM Group"
      />
      <Nav />

      {/* Hero image */}
      <header className="relative w-full h-[52vh] min-h-[380px] max-h-[640px] overflow-hidden">
        <img
          src={hero}
          alt="Black Mercedes V-Class with luggage at Cape Town International Airport"
          width={1920}
          height={960}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10" />
        <div className="relative z-10 h-full max-w-6xl mx-auto px-6 lg:px-10 flex flex-col justify-end pb-10 md:pb-16">
          <p className="eyebrow text-gold">Travel</p>
          <h1 className="font-serif text-4xl md:text-6xl mt-3 text-foreground max-w-3xl">
            Airport transfers
          </h1>
          <p className="mt-4 max-w-2xl text-sm md:text-base text-muted-foreground">
            Chauffeured, on time, on WhatsApp. Share the route — we handle the rest.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 lg:px-10 py-16 md:py-24 space-y-10">
        {done ? (
          <div className="card-luxury p-8 md:p-12 text-center">
            <p className="eyebrow">Thank you</p>
            <h2 className="font-serif text-3xl md:text-4xl mt-3">Your enquiry is with us.</h2>
            <p className="mt-4 text-sm text-muted-foreground max-w-xl mx-auto">
              Our concierge will confirm the vehicle, driver and quote personally, within hours.
              For anything urgent, message us directly on WhatsApp.
            </p>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 bg-[#25D366] text-black font-medium tracking-[0.18em] uppercase text-sm px-6 py-4"
            >
              <MessageCircle className="h-5 w-5" /> Message on WhatsApp
            </a>
          </div>
        ) : (
          <form onSubmit={submitEnquiry} className="card-luxury p-6 md:p-10">
            <p className="eyebrow">Enquire</p>
            <h2 className="font-serif text-3xl md:text-4xl mt-2">Tell us about your transfer</h2>
            <p className="text-sm text-muted-foreground mt-3 max-w-2xl">
              Fill in what you know — flight number, hotel, party size. Send it to
              our concierge and we'll confirm the vehicle, driver and quote.
            </p>

            {/* Trip details */}
            <div className="mt-8 grid md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="eyebrow flex items-center gap-2"><CalendarClock className="h-3.5 w-3.5" /> Date & time</span>
                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        inputCls,
                        "cursor-pointer flex items-center justify-between gap-3 text-left w-full",
                        !when && "text-muted-foreground"
                      )}
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <CalendarIcon className="h-4 w-4 text-gold shrink-0" />
                        <span className="truncate">
                          {when
                            ? `${formatDate(selectedDate ?? new Date(), { day: "numeric", month: "short", year: "numeric" })} at ${selectedTime}`
                            : "Pick a date & time"}
                        </span>
                      </span>
                      {when && (
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => { e.stopPropagation(); setWhen(""); }}
                          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); setWhen(""); }}}
                          className="text-muted-foreground hover:text-gold text-xs uppercase tracking-wider"
                        >
                          Clear
                        </span>
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-surface-raised border-border/60" align="start">
                    <div className="p-3 pointer-events-auto">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(d) => {
                          if (!d) return;
                          setWhen(formatWhen(d, selectedTime));
                        }}
                        defaultMonth={selectedDate ?? startOfToday()}
                        disabled={(d) => d < startOfToday()}
                        initialFocus
                        className="p-0"
                      />
                      <div className="mt-3 pt-3 border-t border-border/40 flex items-center gap-2 px-1">
                        <Clock className="h-4 w-4 text-gold" />
                        <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Time</span>
                        <input
                          type="time"
                          value={selectedTime}
                          onChange={(e) => setWhen(formatWhen(selectedDate, e.target.value))}
                          className={cn(inputCls, "ml-auto w-[116px] py-2 px-2 text-center")}
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="eyebrow flex items-center gap-2"><Users className="h-3.5 w-3.5" /> Passengers</span>
                <input
                  type="number"
                  min={1}
                  value={pax}
                  onChange={(e) => setPax(e.target.value)}
                  className={inputCls}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="eyebrow flex items-center gap-2"><Luggage className="h-3.5 w-3.5" /> Luggage (bags)</span>
                <input
                  type="number"
                  min={0}
                  value={bags}
                  onChange={(e) => setBags(e.target.value)}
                  className={inputCls}
                />
              </label>
              <div className="hidden md:block" />
              <label className="flex flex-col gap-1.5">
                <span className="eyebrow flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> From</span>
                <input
                  type="text"
                  list="svrm-places"
                  autoComplete="on"
                  placeholder="Type any address, hotel or CTIA — or pick from list"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className={inputCls}
                />
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">Custom location? Just type it in.</span>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="eyebrow flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> To</span>
                <input
                  type="text"
                  list="svrm-places"
                  autoComplete="on"
                  placeholder="Type any address, hotel or CTIA — or pick from list"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className={inputCls}
                />
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">Custom location? Just type it in.</span>
              </label>
              <datalist id="svrm-places">
                <option value="Custom location — type your own" />
                {PLACES.map((p) => <option key={p} value={p} />)}
              </datalist>
            </div>

            {/* Contact */}
            <div className="mt-8 pt-8 border-t border-border/40">
              <p className="eyebrow">Your details</p>
              <div className="mt-4 grid md:grid-cols-3 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="eyebrow">Name</span>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputCls}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="eyebrow">Email</span>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputCls}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="eyebrow">Phone (optional)</span>
                  <input
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputCls}
                  />
                </label>
              </div>
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
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 flex-1 bg-primary text-primary-foreground uppercase tracking-[0.24em] text-xs px-6 py-5 hover:brightness-110 transition disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {submitting ? "Sending…" : "Enquire"}
              </button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Pressing Enquire sends your request straight to our admin console — we reply within hours.
            </p>
          </form>
        )}
      </main>

      <Footer />
    </>
  );
};

export default AirportTransfers;
