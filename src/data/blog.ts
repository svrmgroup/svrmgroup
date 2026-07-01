import safariImg from "@/assets/svc-exp-safari.jpg";
import yachtImg from "@/assets/svc-exp-yacht.jpg";
import villaImg from "@/assets/svc-stays-villa.jpg";
import fleetImg from "@/assets/svc-travel-fleet.jpg";
import culturalImg from "@/assets/svc-tours-cultural.jpg";
import customImg from "@/assets/svc-custom.jpg";
import jetImg from "@/assets/svc-travel-jet.jpg";
import heliImg from "@/assets/svc-transport-heli.jpg";
import chefImg from "@/assets/svc-lifestyle-chef.jpg";
import wellnessImg from "@/assets/svc-lifestyle-wellness.jpg";
import penthouseImg from "@/assets/svc-stays-penthouse.jpg";
import adventureImg from "@/assets/svc-tours-adventure.jpg";
import shoppingImg from "@/assets/svc-lifestyle-shopping.jpg";
import estateImg from "@/assets/svc-stays-estate.jpg";

export type BlogCategory = "Travel" | "Tours" | "Lifestyle" | "Properties" | "Insights";

export interface BlogSection {
  heading?: string;
  body: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  date: string;
  image: string;
  readTime: string;
  intro: string;
  sections: BlogSection[];
  closing?: string;
}

export const posts: BlogPost[] = [
  {
    slug: "top-5-luxury-safari-lodges-sa",
    title: "Top 5 luxury safari lodges in South Africa",
    excerpt:
      "The five lodges we send our most discerning clients to — and how to choose between them.",
    category: "Tours",
    date: "March 2026",
    image: safariImg,
    readTime: "6 min read",
    intro:
      "A great safari is less about the Big Five and more about the rhythm of the day. Below are the five South African lodges we return to most often — each chosen for a different kind of traveller.",
    sections: [
      {
        heading: "Singita Lebombo · Kruger",
        body:
          "Architecturally the most quietly confident lodge in the country. Glass-fronted suites built into a cliff above the N'wanetsi River. Best for guests who want privacy, design, and game density without compromise.",
      },
      {
        heading: "Royal Malewane · Greater Kruger",
        body:
          "Old-world service with the highest concentration of master trackers in Africa. We send couples here who want to be quietly looked after — and families who want their children genuinely included in the bush.",
      },
      {
        heading: "Tswalu Motse · Kalahari",
        body:
          "South Africa's largest private reserve, and the only place to reliably see pangolin, aardvark and brown hyena in the same week. Off the standard circuit, which is precisely the point.",
      },
      {
        heading: "Sabi Sabi Earth Lodge · Sabi Sand",
        body:
          "Underground suites, dramatic art, and leopard sightings that border on routine. Strong choice for first-time safari guests who still want a sense of arrival.",
      },
      {
        heading: "Bushmans Kloof · Cederberg",
        body:
          "A wilderness reserve rather than a Big Five experience — rock art, fly-fishing, mountain swims. Three hours from Cape Town and an ideal pre- or post-safari decompression.",
      },
    ],
    closing:
      "We book all five direct, arrange private charter from Cape Town, and pair each lodge with the right city stay. Message the concierge for a quiet recommendation based on your dates.",
  },
  {
    slug: "design-your-dream-tour",
    title: "How to design your dream tour",
    excerpt:
      "What we ask, what we listen for, and how a great brief shortens a great itinerary.",
    category: "Tours",
    date: "February 2026",
    image: culturalImg,
    readTime: "4 min read",
    intro:
      "Most of our best itineraries begin with a fifteen-minute conversation, not a form. Here is what we are listening for — and what makes a brief easy to build around.",
    sections: [
      {
        heading: "Start with the feeling, not the list",
        body:
          "'Slow mornings, long lunches, one extraordinary evening' tells us more than a list of landmarks. We work backwards from the energy of the trip and let the venues fall into place.",
      },
      {
        heading: "Be honest about pace",
        body:
          "Cape Town rewards a slightly slower hand. Two anchor experiences per day — one in the morning, one late afternoon — almost always outperforms four.",
      },
      {
        heading: "Tell us the non-negotiables",
        body:
          "Dietary needs, allergies, mobility, children, anniversaries, faith observances. None of these are inconvenient. They are the difference between a good day and a perfect one.",
      },
      {
        heading: "Leave room for the unscripted",
        body:
          "Our favourite afternoons are rarely on the original itinerary. A trusted concierge plans deliberately and protects one empty window per day for whatever the trip becomes.",
      },
    ],
    closing:
      "Send us a few sentences on WhatsApp — dates, party size, and the feeling you are after. We will reply with a first sketch within a day.",
  },
  {
    slug: "atlantic-seaboard-yachting",
    title: "A quiet day on the Atlantic seaboard",
    excerpt:
      "Why the V&A is just the start — and how to compose a yacht day that doesn't feel scheduled.",
    category: "Lifestyle",
    date: "February 2026",
    image: yachtImg,
    readTime: "5 min read",
    intro:
      "A yacht charter from the V&A Waterfront can be a tourist exercise or a genuinely beautiful day. The difference is in the composition.",
    sections: [
      {
        heading: "Leave late, not early",
        body:
          "The light on the Atlantic seaboard is at its best from 3pm onwards. A late lunch on board, then a slow drift past Clifton and Camps Bay, then sunset off Sea Point. The morning belongs to a quiet breakfast somewhere else.",
      },
      {
        heading: "Choose the vessel for the guest list",
        body:
          "A sailing catamaran is unhurried and social. A motor yacht is quicker, quieter at anchor, and easier with children. A classic sloop is for two people who actually want to sail.",
      },
      {
        heading: "Provision properly",
        body:
          "We work with a small list of private chefs who plate on board. Cold seafood, a single warm dish, fruit, and good water — nothing that requires concentration.",
      },
      {
        heading: "Build the return",
        body:
          "Land back at the V&A at golden hour, then a chauffeured transfer to a quiet dinner in De Waterkant or Bantry Bay. The day should end as deliberately as it began.",
      },
    ],
    closing:
      "We arrange vessels, crew, provisioning, transfers and the dinner that follows. Tell us the date and the party — we compose the rest.",
  },
  {
    slug: "long-term-cape-town-residences",
    title: "Long-term residences: the Cape Town brief",
    excerpt:
      "The neighbourhoods, the buildings and the leases we trust for stays of a month or more.",
    category: "Properties",
    date: "January 2026",
    image: villaImg,
    readTime: "5 min read",
    intro:
      "More clients now arrive for a month, a season, or a full Southern Hemisphere summer. Long-term living in Cape Town is a different proposition to a week's holiday — here is how we brief it.",
    sections: [
      {
        heading: "Choose the neighbourhood first",
        body:
          "Bantry Bay and Fresnaye for quiet sea views. De Waterkant for walkable city living. Constantia for families and gardens. Llandudno for genuine seclusion. Each has its own weather pattern and its own pace.",
      },
      {
        heading: "Insist on serviced",
        body:
          "Twice-weekly housekeeping, a single point of contact, a managed handover. The difference between a long stay that feels like home and one that feels like admin.",
      },
      {
        heading: "Plan the staff around the stay",
        body:
          "A private chef two evenings a week. A chauffeur on call. A trainer who comes to the residence. Long stays reward standing arrangements over one-off bookings.",
      },
      {
        heading: "Protect the lease",
        body:
          "We negotiate every long-term lease directly with the owner — pricing, cancellation, what happens if the trip extends. Always in writing, always on SVRM paper.",
      },
    ],
    closing:
      "Share your dates, party and rough budget on WhatsApp. We will return a shortlist of three residences, each visited by us in person.",
  },
  {
    slug: "chauffeured-vs-self-drive",
    title: "Chauffeured or self-drive — which suits the trip?",
    excerpt:
      "A practical guide to choosing transport when the brief is genuinely flexible.",
    category: "Travel",
    date: "January 2026",
    image: fleetImg,
    readTime: "4 min read",
    intro:
      "Cape Town is one of the few cities in the world where both chauffeured travel and self-drive luxury hire make genuine sense. The choice depends on the trip, not the budget.",
    sections: [
      {
        heading: "Choose chauffeured for the city",
        body:
          "Restaurant evenings, business meetings, group transfers, the wine valleys. Anywhere you would rather not park, navigate, or arrive flustered. Our chauffeurs are discreet, NDA-bound and quietly excellent.",
      },
      {
        heading: "Choose self-drive for the road",
        body:
          "The Garden Route, Cape Point, the Cederberg. Trips where the road is the experience and you want to set your own pace. Our self-drive fleet is intentionally cheaper than the chauffeured one — same vehicles, different brief.",
      },
      {
        heading: "Hybrid is usually right",
        body:
          "Most of our guests do both. Chauffeured for the first two days while they orient. Self-drive for the long weekend out of town. Chauffeured again for the final evening and the airport.",
      },
    ],
    closing:
      "If the brief is unclear, send us the itinerary and we will recommend the split. Vehicles arrive on the SVRM number plate either way.",
  },
  {
    slug: "request-only-the-svrm-way",
    title: "Request-only: why we don't publish prices",
    excerpt:
      "Every itinerary is personal. Here's what to expect when you send the first message.",
    category: "Insights",
    date: "December 2025",
    image: customImg,
    readTime: "3 min read",
    intro:
      "We are often asked why our pricing sits behind a conversation. The honest answer: a published rate would be wrong for almost every guest.",
    sections: [
      {
        heading: "Each booking is composed",
        body:
          "A chauffeured day is not a fixed hourly rate. It is a vehicle, a chauffeur, a route, a wait time, a return, and the discretion that wraps around all of it. The same applies to tours, stays and security.",
      },
      {
        heading: "Discretion is part of the price",
        body:
          "Our clients pay for an NDA-bound team that does not appear in tagged photos or guest lists. That is a real cost — and one we honour by not publishing the names of vendors, vehicles or villas we use.",
      },
      {
        heading: "What to expect from the first message",
        body:
          "A short WhatsApp reply, usually the same day. A few sensible questions. A written quote within twenty-four hours, valid for seven days, with no obligation. No follow-up unless invited.",
      },
    ],
    closing:
      "Open a conversation with the concierge when you are ready. The first message is the only one that needs to feel formal.",
  },
];

export const categories: BlogCategory[] = ["Travel", "Tours", "Lifestyle", "Properties", "Insights"];
