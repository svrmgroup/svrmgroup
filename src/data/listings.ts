// Detail-page content for every published vehicle and stay, derived from the fleet and stay data
// so a new published listing automatically gets its own page. Unknown figures stay "to confirm".
import { vehicles, type Vehicle } from "@/data/vehicles";
import { stays, type Stay } from "@/data/stays";
import { stayGalleries } from "@/data/stayGalleries";
import { guestLabel, poolAnswer, poolLabel, stayFacts, stayHasPublicRate } from "@/data/stayFacts";
import { MAYBACH_DESCRIPTION, PHANTOM_DESCRIPTION, FLAGSHIP_SLUG } from "@/seo/vehicleServices";
import { allTourPackages } from "@/data/tourPackages";
import { tourPackagePhotos } from "@/data/tourPhotos";

export const SITE_URL = "https://svrm.group";
const rand = (n: number) => `R${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
export const CONFIRM = "Your concierge will confirm";

export interface Faq { q: string; a: string }
export interface RelatedLink { label: string; to: string }
/** `fit: "contain"` shows the whole photo uncropped (used for vehicle shots). */
export interface Photo { src: string; fullSrc: string; alt: string; caption?: string; fit?: "contain" }

/* ------------------------------ Vehicles ------------------------------ */

export const vehiclePath = (slug: string, selfDrive = false) => selfDrive ? `/rentals/${slug}` : `/chauffeur/${slug}`;

interface VehicleFacts { passengers?: string; luggage?: string; features?: string[]; why?: string; suits?: string; faqs?: Faq[]; related?: RelatedLink[] }

const AIRPORT: RelatedLink = { label: "Airport transfers", to: "/airport-transfers" };
const PENINSULA: RelatedLink = { label: "Private Cape Peninsula tour", to: "/tours/cape-peninsula" };
const HONEYMOON: RelatedLink = { label: "Honeymoon chauffeur", to: "/honeymoon-cape-town" };
const ANNIVERSARY: RelatedLink = { label: "Anniversary experiences", to: "/anniversary-cape-town" };
const GROUP_TOURS: RelatedLink = { label: "Group tours", to: "/tours/group-travel" };
const SECURITY: RelatedLink = { label: "Secure transport", to: "/security" };
const RENTALS: RelatedLink = { label: "Self-drive rentals", to: "/rentals" };

const FACTS: Record<string, VehicleFacts> = {
  "maybach-v-class": {
    passengers: "Up to 6 passengers", luggage: "Room for several large suitcases — tell us your bags and we'll confirm",
    features: ["Reclining massage seats", "Onboard TV", "Quilted leather cabin", "Private chauffeur"],
    why: "It turns travel time into lounge time: families and small groups sit facing each other in reclining massage seats, with space for luggage and an onboard screen for longer drives.",
    suits: "Families, small groups, airport arrivals with luggage and full-day Peninsula or Winelands touring.",
    related: [PENINSULA, AIRPORT, { label: "Mercedes V-Class", to: "/chauffeur/mercedes-v-class" }],
  },
  "mercedes-maybach-s-class": {
    passengers: "Up to 3 passengers", luggage: "Two large suitcases plus hand luggage",
    features: ["Rear-seat comfort", "Quiet cabin", "Private chauffeur"],
    why: "It is the most restful rear seat in the fleet — quiet, generous and made for arriving composed.",
    suits: "Couples, honeymoons, anniversaries, evenings out and executive travel.",
    related: [HONEYMOON, ANNIVERSARY, AIRPORT],
  },
  "rolls-royce-phantom": {
    passengers: "Up to 3 passengers", luggage: "Two large suitcases plus hand luggage",
    features: ["Coach doors", "Cream leather cabin", "Private chauffeur"],
    why: "When the arrival itself matters — a wedding, proposal or milestone — nothing makes the moment like the Phantom.",
    suits: "Weddings, proposals, milestone celebrations and statement arrivals.",
    related: [ANNIVERSARY, HONEYMOON, { label: "Rolls-Royce Cullinan", to: "/chauffeur/rolls-royce-cullinan" }],
  },
  "rolls-royce-cullinan": { passengers: "Up to 3 passengers", luggage: "Three large suitcases", suits: "Couples and VIP guests who want Rolls-Royce comfort with SUV space.", related: [AIRPORT, ANNIVERSARY, { label: "Rolls-Royce Phantom", to: "/chauffeur/rolls-royce-phantom" }] },
  "mercedes-v-class": {
    passengers: "Up to 7 passengers", luggage: "Room for a family's luggage — we'll confirm for larger bags",
    features: ["Lounge seating", "Sliding doors", "Private chauffeur"],
    why: "It is the practical favourite for families and groups: everyone travels together with luggage, at a sensible day rate.",
    suits: "Families, groups up to seven, airport arrivals and Cape Peninsula days.",
    related: [PENINSULA, AIRPORT, { label: "Maybach V-Class", to: "/chauffeur/maybach-v-class" }],
  },
  "sprinter-16": { passengers: "Up to 16 passengers", luggage: "Luggage space depends on group size — we'll confirm", features: ["Lounge seating", "Private chauffeur"], suits: "Group tours, corporate transport, weddings and conference shuttles.", related: [GROUP_TOURS, { label: "Corporate chauffeur", to: "/chauffeur" }, AIRPORT] },
  "midibus-22": { passengers: "Up to 22 passengers", suits: "Mid-size groups, shuttles and day tours.", related: [GROUP_TOURS, AIRPORT] },
  "bus-32": { passengers: "Up to 32 passengers", suits: "Larger parties, full-day tours and conferences.", related: [GROUP_TOURS, AIRPORT] },
  "luxury-coach": { passengers: "50+ passengers", suits: "Large groups and long-haul touring.", related: [GROUP_TOURS] },
  "hyundai-staria": { passengers: "Up to 9 passengers", suits: "Groups and families who want space at a lower rate.", related: [PENINSULA, AIRPORT] },
  "bmw-x5": { passengers: "Up to 4 passengers", luggage: "Three large suitcases", suits: "Families and executives who want SUV space with a refined ride.", related: [AIRPORT, PENINSULA, { label: "BMW X3", to: "/chauffeur/bmw-x3" }] },
  "bmw-x3": { passengers: "Up to 4 passengers", luggage: "Two large suitcases", suits: "Couples and small families on everyday trips.", related: [AIRPORT, { label: "BMW X5", to: "/chauffeur/bmw-x5" }] },
  "range-rover-autobiography": { passengers: "Up to 4 passengers", luggage: "Three large suitcases", suits: "VIP guests and executives who want quiet authority on any road.", related: [AIRPORT, SECURITY, { label: "Range Rover Sport", to: "/chauffeur/range-rover-sport" }] },
  "range-rover-sport": { passengers: "Up to 4 passengers", luggage: "Two to three large suitcases", suits: "Couples and small families who want a sporty, capable SUV.", related: [AIRPORT, { label: "Range Rover Autobiography", to: "/chauffeur/range-rover-autobiography" }] },
};

const TIER_DEFAULTS: Record<Vehicle["tier"], { passengers: string; suits: string }> = {
  "Signature": { passengers: "Up to 3 passengers", suits: "Special occasions, VIP guests and statement arrivals." },
  "Premium SUV": { passengers: "Up to 4 passengers", suits: "Families and executives who want space and comfort." },
  "Executive": { passengers: "Up to 3 passengers", suits: "Business travel, airport transfers and evenings out." },
  "Everyday": { passengers: "Up to 4 passengers", suits: "Everyday trips and longer stays on a sensible budget." },
  "Budget": { passengers: "Up to 4 passengers", suits: "Simple, economical everyday travel." },
  "Group Travel": { passengers: CONFIRM, suits: "Groups, tours and events." },
};

export interface VehicleListing {
  vehicle: Vehicle;
  slug: string;
  name: string;
  path: string;
  url: string;
  service: "chauffeur" | "self-drive";
  serviceLabel: string;
  description: string;
  whyTitle: string;
  why: string;
  suits: string;
  passengers: string;
  luggage: string;
  features: string[];
  hireOptions: string[];
  serviceArea: string;
  priceLabel: string;
  priceNote: string;
  photos: Photo[];
  faqs: Faq[];
  related: RelatedLink[];
}

export function vehicleListing(v: Vehicle, service: "chauffeur" | "self-drive" = "chauffeur"): VehicleListing {
  const f = FACTS[v.slug] ?? {};
  const t = TIER_DEFAULTS[v.tier];
  const chauffeur = service === "chauffeur";
  const path = vehiclePath(v.slug, !chauffeur);
  const description = v.slug === FLAGSHIP_SLUG ? PHANTOM_DESCRIPTION
    : v.slug === "mercedes-maybach-s-class" && chauffeur ? MAYBACH_DESCRIPTION
    : chauffeur ? `${v.tagline} Book the ${v.name} with a private SVRM chauffeur in Cape Town — by the hour, the day or across your stay.`
    : `${v.tagline} Hire the ${v.name} as a self-drive rental in Cape Town, delivered to your door.`;
  const passengers = chauffeur ? (f.passengers ?? t.passengers) : (f.passengers ?? t.passengers).replace("passengers", "passengers incl. driver");
  const photos: Photo[] = v.gallery?.length
    ? v.gallery.map((g) => ({ src: g.src, fullSrc: g.fullSrc, alt: `${v.name} — ${g.alt}` }))
    : [{ src: v.image, fullSrc: v.image, alt: `${v.name} in Cape Town` }];
  const hireOptions = chauffeur
    ? ["Hourly", "Full day", "Multi-day", "Airport transfer", ...(v.tier === "Group Travel" ? ["Group tours & events"] : [])]
    : ["Daily", "Weekly", "Delivered to your address"];
  const faqs: Faq[] = chauffeur ? [
    { q: `How many passengers fit in the ${v.name}?`, a: `${passengers}, not counting your chauffeur. Tell us your group size and we'll confirm the best vehicle.` },
    { q: `How much luggage can the ${v.name} take?`, a: `${f.luggage ?? CONFIRM + " — send us your number of bags"}. For bigger groups we can add a luggage vehicle.` },
    { q: `Can I book the ${v.name} for several days?`, a: "Yes. Choose a start and end date in the enquiry and we'll quote a multi-day rate with the same chauffeur where possible." },
    { q: `Can the ${v.name} collect us from Cape Town International?`, a: "Yes — meet-and-greet inside the terminal, help with luggage and a direct drive to your hotel or villa. Share your flight number and we'll track it." },
    ...(v.tier === "Signature" ? [{ q: `Is the ${v.name} suitable for a special occasion?`, a: "Yes — anniversaries, honeymoons, proposals and weddings. Tell us the occasion and we'll prepare the details." }] : []),
  ] : [
    { q: `Is the ${v.name} self-drive rate shown online?`, a: "Self-drive rentals are priced on enquiry. Send your dates and we'll reply with a quote and the rental terms." },
    { q: "What do I need to rent?", a: "A valid driver's licence, ID or passport and a refundable deposit. Your concierge confirms the exact requirements with your quote." },
    { q: "Can you deliver the car?", a: "Yes — to your hotel, villa or the airport. Add the address in your enquiry." },
    { q: `Can I have the ${v.name} with a chauffeur instead?`, a: `Yes — see the chauffeured ${v.name} page for that service.` },
  ];
  const related = f.related ?? (chauffeur ? [AIRPORT, PENINSULA] : [AIRPORT]);
  return {
    vehicle: v, slug: v.slug, name: v.name, path, url: `${SITE_URL}${path}`, service,
    serviceLabel: chauffeur ? "With private chauffeur" : "Self-drive rental",
    description,
    whyTitle: `Why choose the ${v.name}?`,
    why: f.why ?? `${v.tagline} ${chauffeur ? "With a private SVRM chauffeur, you" : "You"} get ${v.tier === "Group Travel" ? "everyone travelling together" : "comfort and reliability"} without the logistics.`,
    suits: f.suits ?? t.suits,
    passengers,
    luggage: f.luggage ?? CONFIRM,
    features: f.features ?? (chauffeur ? ["Private chauffeur", "Bottled water", "Door-to-door service"] : ["Delivered to your door", "Fully insured"]),
    hireOptions,
    serviceArea: "Cape Town, the Atlantic Seaboard, Winelands and Cape Peninsula — longer routes on request",
    priceLabel: chauffeur ? `From ${rand(v.fromZAR)} / day` : "On enquiry",
    priceNote: chauffeur ? "Indicative day rate — your written quote is final." : "Quote sent back personally.",
    photos,
    faqs,
    related: [
      ...(chauffeur && v.selfDrive ? [{ label: `${v.name} self-drive`, to: vehiclePath(v.slug, true) }] : []),
      ...(!chauffeur ? [{ label: `${v.name} with chauffeur`, to: vehiclePath(v.slug) }, RENTALS] : []),
      ...related,
    ].slice(0, 3),
  };
}

export const findVehicle = (slug?: string) => vehicles.find((v) => v.slug === slug);

/* ------------------------------- Stays -------------------------------- */

const STAY_URL_ALIASES: Record<string, string> = { "camps-bay-5-bed-signature-villa": "the-atlantic-villa-camps-bay" };
export const stayUrlSlug = (s: Stay) => STAY_URL_ALIASES[s.slug] ?? s.slug.replace(/^nox-/, "");
export const stayPath = (s: Stay) => `/stays/${stayUrlSlug(s)}`;
export const findStay = (urlSlug?: string) => stays.find((s) => stayUrlSlug(s) === urlSlug || s.slug === urlSlug);

export interface StayListing {
  stay: Stay; slug: string; name: string; path: string; url: string; neighbourhood: string;
  description: string; why: string; bedrooms: string; bathrooms: string; maxGuests: string;
  bedroomCount?: number; bathroomCount?: number; guestCapacity?: number;
  amenities: string[]; pool: string; poolAnswer: string; priceLabel: string; priceNote: string;
  factsSource: string; poolSource: string; rateSource: string;
  photos: Photo[]; faqs: Faq[]; related: RelatedLink[];
}

const A_LA_ALTS = [
  "private terrace with hanging chair and Lion's Head view",
  "open-plan lounge with Atlantic Ocean views",
  "living room opening onto the panoramic terrace",
  "private terrace and mountain views",
  "terrace loungers overlooking the Atlantic",
  "designer kitchen with sea views",
  "main bedroom with ocean views",
  "main bathroom with marble vanity and walk-in shower",
  "second bedroom",
];

export function stayListing(s: Stay): StayListing {
  const tokens = s.beds.split("·").map((x) => x.trim()).filter(Boolean);
  const bed = /(\d+)\s*bed/i.exec(s.beds)?.[1];
  const bath = /(\d+)\s*bath/i.exec(s.beds)?.[1];
  const facts = stayFacts[s.slug];
  const bedrooms = facts ? `${facts.bedrooms} bedroom${facts.bedrooms === 1 ? "" : "s"}` : s.type === "hotel" ? tokens[0] ?? CONFIRM : bed ? `${bed} bedroom${bed === "1" ? "" : "s"}` : CONFIRM;
  const bathrooms = facts ? `${facts.bathrooms} bathroom${facts.bathrooms === 1 ? "" : "s"}` : bath ? `${bath} bathroom${bath === "1" ? "" : "s"}` : CONFIRM;
  const maxGuests = facts ? guestLabel(facts) : CONFIRM;
  const amenities = tokens.filter((x) => !/^\d+\s*(bed|bath|guest)/i.test(x) && !/^1 king$/i.test(x)).map((x) => x[0].toUpperCase() + x.slice(1));
  const showPrice = s.showPrice === true && stayHasPublicRate(s.slug);
  const path = stayPath(s);
  const gallery = stayGalleries[s.slug] ?? [];
  const photos: Photo[] = (gallery.length ? gallery : [s.image]).map((src, i) => ({ src, fullSrc: src, alt: s.slug === "a-la-penthouse" ? `${s.name} — ${A_LA_ALTS[i] ?? `photo ${i + 1}`}` : `${s.name} — photo ${i + 1}` }));
  const alt = stays.filter((x) => x.slug !== s.slug && x.type === s.type).sort((a, b) => Math.abs(a.fromZAR - s.fromZAR) - Math.abs(b.fromZAR - s.fromZAR))[0];
  const kind = s.type === "hotel" ? "room" : s.type;
  const isALa = s.slug === "a-la-penthouse";
  return {
    stay: s, slug: stayUrlSlug(s), name: s.name, path, url: `${SITE_URL}${path}`, neighbourhood: s.area,
    description: s.blurb,
    why: isALa
      ? "The residence combines the privacy of a top-floor home with hotel-style service. Designer interiors, generous lounges, a private lift and panoramic views across the Atlantic, Lion's Head, Table Mountain and the Twelve Apostles make it as suited to a quiet retreat as to a special celebration or photo shoot."
      : `Stay in ${s.area} with SVRM handling the details — airport collection, a private chauffeur and concierge for restaurants, tours and experiences throughout your stay.`,
    bedrooms,
    bathrooms,
    maxGuests,
    bedroomCount: facts?.bedrooms,
    bathroomCount: facts?.bathrooms,
    guestCapacity: facts?.maxGuests,
    amenities,
    pool: poolLabel(facts),
    poolAnswer: poolAnswer(facts),
    priceLabel: showPrice ? `From ${rand(s.fromZAR)} / night` : "On enquiry",
    priceNote: facts.rate.note,
    factsSource: facts.source,
    poolSource: facts.pool.source,
    rateSource: facts.rate.source,
    photos,
    faqs: [
      { q: "Is the pool private or shared?", a: poolAnswer(facts) },
      ...(isALa ? [
        { q: "How many guests can À La Penthouse accommodate?", a: "The main two-bedroom penthouse accommodates a maximum of four guests. Additional luxury accommodation on the lower level can be arranged on request for a larger group; ask your concierge for availability and a separate quote." },
        { q: "Which services and private facilities are included?", a: "The official listing includes daily breakfast, housekeeping from Monday to Saturday, concierge assistance, high-speed Wi-Fi, a private terrace with an outdoor jacuzzi, a private sauna and private lift access." },
        { q: "Is there a minimum stay?", a: "The official listing states a seven-night minimum stay. Your concierge will confirm the minimum and final rate for your requested dates." },
      ] : [
        { q: `How many guests can this ${kind} accommodate?`, a: facts ? `${maxGuests}. Tell us the adults and children in your party so your concierge can confirm the right configuration.` : `${CONFIRM} the maximum occupancy for your dates.` },
        { q: "Is there a minimum stay?", a: "Minimum stays depend on the season and dates — usually longer over December and New Year. We'll confirm with your quote." },
      ]),
      { q: `Which amenities belong to this ${kind}?`, a: amenities.length ? `Listed for this ${kind}: ${amenities.join(", ")}. ${CONFIRM} anything else you need.` : `${CONFIRM} the full amenity list for your dates.` },
      { q: "Can SVRM arrange airport collection?", a: "Yes — a private chauffeur can meet you at Cape Town International and bring you straight to the door." },
    ],
    related: [
      { label: "Chauffeur airport transfer", to: "/airport-transfers" },
      { label: "Private Cape Peninsula tour", to: "/tours/cape-peninsula" },
      ...(alt ? [{ label: alt.name, to: stayPath(alt) }] : []),
    ],
  };
}

const shareImage = (photos: Photo[]) => (photos.find((p) => /^(https:\/\/|\/__l5e\/)/.test(p.src)) ?? photos[0]).src;

/** Every public detail page, for the sitemap and static page heads. */
export function allListingPaths(): { path: string; title: string; description: string; heading: string; summary: string; image: string }[] {
  const v = vehicles.flatMap((veh) => {
    const out = [vehicleListing(veh, "chauffeur")];
    if (veh.selfDrive) out.push(vehicleListing(veh, "self-drive"));
    return out;
  }).map((l) => ({
    path: l.path,
    title: `${l.name} ${l.service === "chauffeur" ? "with Chauffeur" : "Self-Drive Rental"} Cape Town | SVRM Group`,
    description: `${l.name} ${l.service === "chauffeur" ? "with a private chauffeur" : "self-drive rental"} in Cape Town. ${l.passengers}. ${l.priceLabel}. Check availability on WhatsApp.`.slice(0, 300),
    heading: `${l.name} — ${l.serviceLabel}, Cape Town`,
    summary: `${l.description} ${l.whyTitle} ${l.why} Suits: ${l.suits}`,
    image: shareImage(l.photos),
  }));
  const s = stays.map(stayListing).map((l) => ({
    path: l.path,
    title: `${l.name} | Luxury Stay Cape Town — SVRM`,
    description: `${l.name} in ${l.neighbourhood}, Cape Town. ${l.bedrooms}, ${l.bathrooms}; ${l.maxGuests}. ${l.priceLabel}. Check availability on WhatsApp.`.slice(0, 300),
    heading: l.name,
    summary: `${l.description} Bedrooms: ${l.bedrooms}. Bathrooms: ${l.bathrooms}. Maximum guests: ${l.maxGuests}. Pool: ${l.pool}. ${l.poolAnswer} ${l.why}`, 
    image: shareImage(l.photos),
  }));
  const t = allTourPackages().map(({ tour, pkg, path, description }) => {
    const photos = tourPackagePhotos(tour, pkg);
    return {
      path,
      title: `${pkg.title} | ${tour.label} — SVRM`,
      description: `${description} ${pkg.fromZAR != null ? `From ${rand(pkg.fromZAR)}` : "On request"} ${pkg.unit ?? "per person"}. Check availability on WhatsApp.`.slice(0, 300),
      heading: `${pkg.title} · ${pkg.duration}`,
      summary: `${description} Included: ${pkg.inclusions.join("; ")}.`,
      image: shareImage(photos),
    };
  });
  return [...v, ...s, ...t];
}
