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
import maybachImg from "@/assets/vehicles/maybach.jpg";
import sclassImg from "@/assets/svc-travel-sclass.jpg";
import airportImg from "@/assets/svc-transport-airport.jpg";
import securityImg from "@/assets/svc-custom.jpg";
import romanticImg from "@/assets/tours/romantic.jpg";
import capePeninsulaImg from "@/assets/tours/cape-peninsula.jpg";
import wineImg from "@/assets/svc-exp-wine.jpg";


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
  /** ISO date for article:published_time & JSON-LD. */
  publishedISO?: string;
  image: string;
  readTime: string;
  intro: string;
  sections: BlogSection[];
  closing?: string;
  /** SEO <title>. Keep under ~60 chars. Falls back to `${title} — SVRM Journal`. */
  seoTitle?: string;
  /** Meta description. Keep under ~160 chars. Falls back to excerpt. */
  seoDescription?: string;
  /** Meta keywords, comma-separated. */
  seoKeywords?: string;
  /** Absolute or root-relative URL for og:image. Falls back to hero image. */
  ogImage?: string;
}

export const posts: BlogPost[] = [
  {
    slug: "top-5-luxury-safari-lodges-sa",
    publishedISO: "2026-03-01",
    seoTitle: "Top 5 Luxury Safari Lodges in South Africa (2026)",
    seoDescription: "Singita, Royal Malewane, Tswalu, Sabi Sabi Earth Lodge & Bushmans Kloof \u2014 the five South African safari lodges SVRM books most, honestly compared.",
    seoKeywords: "luxury safari South Africa, best safari lodges South Africa, Singita Lebombo, Royal Malewane, Tswalu Kalahari, Sabi Sabi Earth Lodge, Bushmans Kloof, private safari from Cape Town, Big 5 safari, Kruger private lodges",
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
    publishedISO: "2026-02-15",
    seoTitle: "How to Design Your Dream Cape Town Tour",
    seoDescription: "The four questions a great concierge asks before building an itinerary \u2014 pace, brief, non-negotiables, and the empty window that saves every trip.",
    seoKeywords: "design custom Cape Town tour, bespoke itinerary Cape Town, private tour planning South Africa, concierge tour brief, luxury travel planner Cape Town",
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
    publishedISO: "2026-02-05",
    seoTitle: "A Quiet Yacht Day on the Atlantic Seaboard, Cape Town",
    seoDescription: "How to compose a private yacht charter from the V&A Waterfront \u2014 vessel choice, provisioning, sunset timing and the dinner that follows.",
    seoKeywords: "private yacht charter Cape Town, V&A Waterfront yacht hire, Atlantic Seaboard sunset cruise, catamaran charter Cape Town, luxury day charter, Clifton yacht cruise",
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
    publishedISO: "2026-01-20",
    seoTitle: "Long-Term Luxury Rentals Cape Town \u2014 Concierge Guide",
    seoDescription: "Neighbourhoods, buildings and lease terms for month-plus stays in Cape Town \u2014 Bantry Bay, Fresnaye, De Waterkant, Constantia and Llandudno.",
    seoKeywords: "long term rental Cape Town, monthly villa rental Cape Town, luxury apartment long stay, Bantry Bay long term, Fresnaye rental, De Waterkant apartment, Constantia estate, Llandudno villa, serviced apartment Cape Town, digital nomad Cape Town luxury",
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
    publishedISO: "2026-01-10",
    seoTitle: "Chauffeured or Self-Drive Car Hire in Cape Town?",
    seoDescription: "A practical guide from SVRM on when to book chauffeured travel, when to self-drive, and why most Cape Town trips work best as a hybrid.",
    seoKeywords: "chauffeur vs self drive Cape Town, luxury car rental Cape Town, private chauffeur Cape Town, Garden Route self drive, hire car Cape Town, executive driver South Africa",
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
    publishedISO: "2025-12-15",
    seoTitle: "Why SVRM Prices Are on Request \u2014 The Concierge View",
    seoDescription: "How SVRM quotes bespoke luxury services in Cape Town \u2014 what to expect after the first WhatsApp message and why published rates would be wrong.",
    seoKeywords: "SVRM pricing, luxury concierge quote, bespoke Cape Town concierge, private lifestyle management pricing, NDA concierge South Africa",
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
  {
    slug: "private-jet-charter-cape-town",
    publishedISO: "2026-04-05",
    seoTitle: "Private Jet Charter from Cape Town \u2014 What Matters",
    seoDescription: "Aircraft sizing, crew, weather slots and FBO ground handling \u2014 how to book a Cape Town private jet charter that actually lands calmly.",
    seoKeywords: "private jet charter Cape Town, jet hire Cape Town International, empty leg Cape Town, Pilatus PC-12 safari, Citation XLS Cape Town Johannesburg, Global jet charter South Africa, FBO Cape Town, private aviation South Africa",
    title: "Private jet charter from Cape Town: what actually matters",
    excerpt:
      "Aircraft type, crew, slot timing, and the small operational details that separate a good charter from a forgettable one.",
    category: "Travel",
    date: "April 2026",
    image: jetImg,
    readTime: "5 min read",
    intro:
      "Private aviation out of Cape Town International is more accessible than most guests expect — and the difference between operators is much larger than the difference between aircraft.",
    sections: [
      {
        heading: "Match the aircraft to the leg",
        body:
          "A Pilatus PC-12 is perfect for the safari hop to Sabi Sand. A Citation XLS is right for Johannesburg or Victoria Falls. A Global for anything intercontinental. We size the aircraft to the leg, not the ego — and the saving is usually meaningful.",
      },
      {
        heading: "Crew is the whole experience",
        body:
          "The captain sets the tone. We fly with a short list of South African crews we know personally — quiet, unflappable, and briefed on the guest before wheels-up.",
      },
      {
        heading: "Slot times are everything",
        body:
          "Cape Town's afternoon southeaster and the winter fog windows are real. A charter booked with the weather in mind lands calmly. One booked without it does not.",
      },
      {
        heading: "Ground handling on both ends",
        body:
          "Chauffeured arrival to the FBO, wheels-up in ten minutes, chauffeured collection at the destination. We arrange all three under one brief so nothing is handed between vendors.",
      },
    ],
    closing:
      "Send dates, party size and destination on WhatsApp. We return two or three sensible aircraft options and a fully-loaded quote within the day.",
  },
  {
    slug: "helicopter-transfers-cape-winelands",
    publishedISO: "2026-04-15",
    seoTitle: "Helicopter Transfers to the Cape Winelands & Hermanus",
    seoDescription: "Twelve minutes to Franschhoek, thirty to Hermanus \u2014 when a private helicopter charter earns its place in a Cape Town itinerary, and when it doesn't.",
    seoKeywords: "helicopter transfer Cape Town, helicopter charter Winelands, V&A to Franschhoek helicopter, Cape Town to Hermanus helicopter, whale watching helicopter, scenic helicopter Cape Peninsula, private helicopter South Africa",
    title: "Helicopter transfers to the Winelands and beyond",
    excerpt:
      "Twelve minutes to Franschhoek, thirty to Hermanus. When a helicopter earns its place in the itinerary.",
    category: "Travel",
    date: "April 2026",
    image: heliImg,
    readTime: "3 min read",
    intro:
      "A helicopter is not always the right answer — but when it is, it reshapes the day. Here is when we recommend one, and when we quietly steer guests back to the road.",
    sections: [
      {
        heading: "The right legs",
        body:
          "V&A to Franschhoek in twelve minutes. Cape Town to Hermanus for whale season in thirty. Cape Point scenic loop in forty-five. Legs where the road would consume the day and the view from the air is the point.",
      },
      {
        heading: "The wrong legs",
        body:
          "Anywhere inside the city bowl, anything under fifteen minutes by road, and most airport transfers. A chauffeured S-Class is more comfortable, more discreet, and considerably cheaper.",
      },
      {
        heading: "What we book",
        body:
          "Twin-engine machines only, IFR-rated crews, and a ground team on both pads. Weather calls are made honestly — if the wind is wrong we say so and reroute by road without a fuss.",
      },
    ],
    closing:
      "Tell us the leg and the party. We recommend heli or road with a straight answer, and arrange whichever serves the day.",
  },
  {
    slug: "private-chef-cape-town",
    publishedISO: "2026-03-10",
    seoTitle: "Private Chefs in Cape Town \u2014 How SVRM Briefs Them",
    seoDescription: "The three questions we ask before pairing a private chef with a Camps Bay or Bantry Bay villa \u2014 and why the menu is always the last conversation.",
    seoKeywords: "private chef Cape Town, villa chef Camps Bay, in-residence chef South Africa, luxury dining at home Cape Town, private dining Bantry Bay, personal chef Winelands",
    title: "Private chefs at home: how we brief them",
    excerpt:
      "The three questions we ask before pairing a chef with a residence — and why the menu is the last conversation, not the first.",
    category: "Lifestyle",
    date: "March 2026",
    image: chefImg,
    readTime: "4 min read",
    intro:
      "A private chef at the villa is one of the quietest luxuries Cape Town offers. Getting it right is less about the menu and more about the fit.",
    sections: [
      {
        heading: "Who is at the table",
        body:
          "Six adults over a long lunch is a different chef to two couples with young children. We match temperament first — the food follows.",
      },
      {
        heading: "How the kitchen works",
        body:
          "Some residences have a chef's kitchen. Some have a domestic one behind a wall. A good chef adapts, but we brief them in advance so nothing is improvised on the night.",
      },
      {
        heading: "The menu is last",
        body:
          "We agree the shape of the evening — canapés on the terrace, a plated main, a shared dessert — before the chef proposes a dish. Menus written to a real evening are always better than menus written in the abstract.",
      },
    ],
    closing:
      "Give us the residence, the guests and the evening you have in mind. We propose two chefs, both of whom we have eaten with personally.",
  },
  {
    slug: "cape-town-summer-season-guide",
    publishedISO: "2026-03-20",
    seoTitle: "Cape Town Summer Season Guide (Nov\u2013Mar), Honestly",
    seoDescription: "Week-by-week view of Cape Town's Nov\u2013Mar summer season from a full-time concierge \u2014 when to come, when to avoid, and what each window costs.",
    seoKeywords: "best time to visit Cape Town, Cape Town summer season, when to travel Cape Town, Cape Town December January, peak season Cape Town, shoulder season Cape Town, Cape Town weather guide",
    title: "The Cape Town summer season, honestly assessed",
    excerpt:
      "When to come, when to avoid, and what a good concierge does with each week between November and March.",
    category: "Insights",
    date: "March 2026",
    image: penthouseImg,
    readTime: "6 min read",
    intro:
      "Southern Hemisphere summer in Cape Town runs from November to March. Not all of it is equal. Here is the week-by-week view from someone who works through the whole season.",
    sections: [
      {
        heading: "Early November — the quiet window",
        body:
          "Warm days, cool evenings, still-affordable villas, restaurants easy to book. Our favourite fortnight of the year and the one we quietly recommend to returning clients.",
      },
      {
        heading: "Late November to mid-December — the sweet spot",
        body:
          "Long light, warm sea, everything open, prices climbing but not yet peak. Book residences six months out.",
      },
      {
        heading: "20 December to 5 January — the peak",
        body:
          "Genuinely busy. Villa rates double, restaurants require standing arrangements, roads to Camps Bay slow at 6pm. Beautiful if planned tightly, chaotic if not.",
      },
      {
        heading: "Mid-January to end of February — the second spring",
        body:
          "Locals return to work, the city exhales, weather remains excellent. Arguably the best combination of climate and calm in the calendar.",
      },
      {
        heading: "March — the long farewell",
        body:
          "Warm sea, cooler evenings, harvest in the Winelands. Our second-favourite month.",
      },
    ],
    closing:
      "Tell us the window you are considering. We say honestly whether it is right — and, if not, when to come instead.",
  },
  {
    slug: "garden-route-in-four-days",
    publishedISO: "2026-02-25",
    seoTitle: "The Garden Route in 4 Days \u2014 A Luxury Itinerary",
    seoDescription: "A tight, unhurried private Garden Route itinerary from Cape Town via Hermanus, Knysna and Plettenberg Bay \u2014 with a chartered return flight.",
    seoKeywords: "Garden Route itinerary, luxury Garden Route tour, private Garden Route trip, Cape Town to Plettenberg Bay, Knysna luxury stay, Hermanus whale watching, Tsitsikamma tour, 4 day Garden Route",
    title: "The Garden Route in four days, done properly",
    excerpt:
      "A tight, unhurried itinerary from Cape Town to Plettenberg Bay — no rushed lunches, no wasted afternoons.",
    category: "Tours",
    date: "February 2026",
    image: adventureImg,
    readTime: "5 min read",
    intro:
      "The Garden Route is often oversold as a week-long drive. Four days, planned well, is usually enough — and considerably more elegant.",
    sections: [
      {
        heading: "Day one — Cape Town to Hermanus",
        body:
          "Late start, coastal drive via Betty's Bay, lunch at the harbour, whale-watching in season. Overnight at a small guesthouse above the cliffs.",
      },
      {
        heading: "Day two — Hermanus to Knysna",
        body:
          "The long driving day. Break at Wilderness for the beach, arrive Knysna for sunset over the lagoon. Dinner at a private residence we hold on account.",
      },
      {
        heading: "Day three — Knysna and Plettenberg",
        body:
          "Slow morning, forest walk in Tsitsikamma, afternoon on the beach at Plett. This is the day the trip earns its keep.",
      },
      {
        heading: "Day four — return by air",
        body:
          "Chauffeured to George, forty-five minute flight back to Cape Town. The drive home is what ruins most Garden Route trips. We do not do the drive home.",
      },
    ],
    closing:
      "We arrange the vehicle, the stays, the private dinners and the return flight as one brief. Send us your dates.",
  },
  {
    slug: "wellness-recovery-cape-town",
    publishedISO: "2026-02-20",
    seoTitle: "Wellness & Recovery Weeks in Cape Town \u2014 SVRM",
    seoDescription: "Discreet in-residence trainers, physios, IV clinics and private chefs \u2014 how SVRM structures a Cape Town wellness or post-surgery recovery week.",
    seoKeywords: "wellness retreat Cape Town, recovery week Cape Town, in-residence trainer, private physio Cape Town, IV therapy Cape Town, post surgery recovery South Africa, medical concierge Cape Town, private GP Cape Town",
    title: "Wellness and recovery weeks in Cape Town",
    excerpt:
      "Discreet trainers, IV clinics, quiet residences, and how we structure a week that actually resets.",
    category: "Lifestyle",
    date: "February 2026",
    image: wellnessImg,
    readTime: "4 min read",
    intro:
      "A growing share of our work is quiet recovery weeks — post-surgery, post-tour, or simply post-year. Cape Town is unusually well suited to it.",
    sections: [
      {
        heading: "The residence sets the tone",
        body:
          "Somewhere with a private pool, morning sun, and no neighbours in earshot. Bantry Bay and Higgovale both work. Camps Bay in peak season does not.",
      },
      {
        heading: "The team comes to you",
        body:
          "Trainer at 7am, physio at 10, chef for lunch, massage at 4. The whole week is arranged around one residence so nothing has to be commuted to.",
      },
      {
        heading: "Medical when needed",
        body:
          "We work with a small list of private GPs, IV clinics and physiotherapists who visit in-residence. All NDA-bound, all invoiced through us for privacy.",
      },
    ],
    closing:
      "Share the shape of the week and any medical context on WhatsApp. Full discretion, and a proposal within twenty-four hours.",
  },
  {
    slug: "buying-property-cape-town",
    publishedISO: "2026-01-30",
    seoTitle: "Buying Luxury Property in Cape Town \u2014 Concierge View",
    seoDescription: "Where SVRM clients are quietly buying in Cape Town \u2014 Fresnaye, Bantry Bay, Higgovale, Constantia, Llandudno \u2014 and how off-market really works.",
    seoKeywords: "buying property Cape Town, luxury property Cape Town, Fresnaye property, Bantry Bay house, Higgovale home, Constantia estate, Llandudno property, off market Cape Town, foreign buyer South Africa, luxury real estate Cape Town",
    title: "Buying property in Cape Town: the concierge view",
    excerpt:
      "Where our clients are buying, what to expect from the process, and why the right introduction matters more than the right listing.",
    category: "Properties",
    date: "January 2026",
    image: estateImg,
    readTime: "5 min read",
    intro:
      "We are not estate agents. We are, however, in the residences of Cape Town's best neighbourhoods most weeks — and clients increasingly ask us where to buy.",
    sections: [
      {
        heading: "Where the money is quietly going",
        body:
          "Fresnaye and Bantry Bay for view and privacy. Higgovale for architecture. Constantia for land. Llandudno for the long view. Each has a very different profile of buyer.",
      },
      {
        heading: "Off-market is most of the market",
        body:
          "The best houses do not appear on the listing sites. They move between neighbours, agents and concierges. An introduction is worth more than a portal alert.",
      },
      {
        heading: "The process, briefly",
        body:
          "Offer to purchase, deposit, bond approval if applicable, transfer at the Deeds Office. Usually eight to twelve weeks. We coordinate the conveyancer and the handover.",
      },
      {
        heading: "Live in it first",
        body:
          "We routinely place buyers into a long-term residence for a month or two while they look. It is the single best way to avoid a wrong purchase.",
      },
    ],
    closing:
      "Tell us the brief in confidence. We arrange the stay, the introductions, and the viewings — quietly.",
  },
  {
    slug: "shopping-cape-town-private",
    publishedISO: "2025-12-05",
    seoTitle: "Private Shopping Days in Cape Town \u2014 SVRM Concierge",
    seoDescription: "How SVRM composes a private shopping day in Cape Town \u2014 De Waterkant ateliers, V&A private suites and Woodstock design galleries.",
    seoKeywords: "private shopping Cape Town, personal shopper Cape Town, luxury shopping V&A Waterfront, De Waterkant designers, Woodstock galleries, VIP shopping South Africa",
    title: "Private shopping days in Cape Town",
    excerpt:
      "Where we take clients when the brief is a considered wardrobe, not a tourist afternoon.",
    category: "Lifestyle",
    date: "December 2025",
    image: shoppingImg,
    readTime: "3 min read",
    intro:
      "Cape Town's shopping is quietly excellent if you know where to go — and considerably less so if you do not. Here is how we structure a private day.",
    sections: [
      {
        heading: "Start in De Waterkant",
        body:
          "Local designers, small ateliers, and the best of South African leather. Morning coffee, two hours on foot, chauffeur waiting.",
      },
      {
        heading: "Then the V&A private suites",
        body:
          "The luxury houses at the V&A open private appointment rooms on request. We book them ahead so the shop is closed to walk-ins during the visit.",
      },
      {
        heading: "Finish in Woodstock",
        body:
          "Art, ceramics, and the design galleries around the Old Biscuit Mill. Late lunch, back to the residence with everything already delivered ahead.",
      },
    ],
    closing:
      "Tell us the brief and the labels. We compose the day, book the private rooms, and handle the deliveries.",
  },
  {
    slug: "mercedes-maybach-s-class-chauffeur-cape-town",
    publishedISO: "2026-08-01",
    seoTitle: "Maybach S-Class Chauffeur Service in Cape Town | SVRM",
    seoDescription: "SVRM's flagship Mercedes-Maybach S-Class with a private chauffeur in Cape Town — R22,000 per day. Airport transfers, executive travel, weddings and honeymoons.",
    seoKeywords: "Mercedes-Maybach S-Class Cape Town, Maybach chauffeur Cape Town, luxury chauffeur Cape Town, executive chauffeur South Africa, VIP chauffeur Cape Town, Maybach hire Cape Town, private chauffeur service Cape Town",
    title: "Mercedes-Maybach S-Class chauffeur service in Cape Town",
    excerpt:
      "The flagship of the SVRM fleet, and why it is the car we put in front of our most demanding briefs.",
    category: "Travel",
    date: "August 2026",
    image: maybachImg,
    readTime: "7 min read",
    intro:
      "There are cars that move people and cars that change the shape of a day. The Mercedes-Maybach S-Class is the second kind, and it is the vehicle we place at the head of the SVRM fleet in Cape Town. Chauffeured, at R22,000 per day, it is the quietest way we know to make travel disappear as a problem.",
    sections: [
      {
        heading: "Why the Maybach and not simply an S-Class",
        body:
          "The standard S-Class is already an exceptional car. The Maybach is a different proposition: a longer wheelbase, executive rear seating that reclines properly, near-silent cabin isolation, a separated rear climate zone and rear-seat refreshments. On a two-hour Winelands run or a late-night airport arrival, the difference is not cosmetic — it is the difference between travelling and resting.",
      },
      {
        heading: "Who we put in it",
        body:
          "Executives moving between meetings across the city bowl and the northern suburbs. Diplomatic and corporate visitors who need a vehicle that reads correctly on arrival. Couples on honeymoon or an anniversary, where the car is part of the occasion. Wedding parties. And clients arriving on long-haul flights into Cape Town International who would rather step from the aircraft into something that feels like the room they left.",
      },
      {
        heading: "How the day is structured",
        body:
          "A Maybach day runs on your schedule, not a meter. Your chauffeur is briefed on the full itinerary in advance, holds the car within a short call of wherever you are, and manages parking, timing and routing without being asked. Airport meet-and-greet, luggage handling and route changes on the day are included in the way we work.",
      },
      {
        heading: "Rates and combinations",
        body:
          "R22,000 per day in Cape Town, quoted in ZAR and converted live to USD, GBP or EUR on our site. Half-day and multi-day arrangements are available on request, and the Maybach can be requested as an upgrade on our Cape Peninsula private tour, our honeymoon and anniversary itineraries, and any airport transfer.",
      },
    ],
    closing:
      "Send us the dates and the route. We will confirm the Maybach, the chauffeur and the timing, usually the same day.",
  },
  {
    slug: "luxury-chauffeur-service-cape-town-guide",
    publishedISO: "2026-08-02",
    seoTitle: "Luxury Chauffeur Service in Cape Town — Complete Guide",
    seoDescription: "How private chauffeur service works in Cape Town: vehicle classes, hourly vs daily hire, airport transfers, tipping, and what a good chauffeur actually does.",
    seoKeywords: "luxury chauffeur service Cape Town, private chauffeur Cape Town, chauffeur hire Cape Town, executive chauffeur Cape Town, VIP chauffeur South Africa, chauffeur driven car Cape Town",
    title: "A guide to luxury chauffeur service in Cape Town",
    excerpt:
      "Vehicle classes, day rates versus hourly hire, and what separates a chauffeur from a driver.",
    category: "Travel",
    date: "August 2026",
    image: sclassImg,
    readTime: "6 min read",
    intro:
      "Chauffeur service in Cape Town covers everything from an airport sedan to a full-week executive detail. The vocabulary is not always clear, so here is how we structure it — and what to ask for.",
    sections: [
      {
        heading: "Vehicle classes",
        body:
          "At the top sits the Mercedes-Maybach S-Class, our flagship. Below it, the S-Class and E-Class cover executive work; the V-Class and Staria handle families and small groups with luggage; the BMW X5 and Cayenne suit longer road days and gravel approaches. For convoys and security work we run G63s and armoured 7 Series.",
      },
      {
        heading: "Hourly, daily and transfer rates",
        body:
          "Airport transfers are quoted point to point. In-city executive work is usually an eight-hour day with the car held for you throughout. Winelands, Peninsula and Hermanus days are quoted as full days because the distance rules out anything shorter. Multi-day hire attracts a lower daily rate.",
      },
      {
        heading: "What a chauffeur is, and is not",
        body:
          "A driver takes you to an address. A chauffeur reads the day in advance: where parking is impossible, which gate the restaurant prefers, how long the N2 will take at half past four, whether the flight has slipped. Ours are vetted, uniformed, discreet and briefed on your full itinerary before you land.",
      },
      {
        heading: "Practical notes",
        body:
          "Traffic between the airport and the Atlantic seaboard is heavier than visitors expect between 07:00 and 09:00 and again from 16:00. Child seats, extra luggage capacity and multilingual chauffeurs should be requested at booking. Gratuities are never expected and always passed on in full.",
      },
    ],
    closing:
      "Tell us your dates, your route and whether the car should wait. We will match the class and the chauffeur to the brief.",
  },
  {
    slug: "cape-town-airport-transfer-luxury-guide",
    publishedISO: "2026-08-03",
    seoTitle: "Luxury Airport Transfers Cape Town | Private & Chauffeured",
    seoDescription: "Private airport transfers in Cape Town — meet-and-greet, luggage handling, vehicle sizing for groups, flight tracking and fixed pricing. How SVRM runs them.",
    seoKeywords: "Cape Town airport transfer, luxury airport transfer Cape Town, private airport transfer Cape Town, chauffeur airport transfer Cape Town, CPT airport transfer, executive airport transfer South Africa",
    title: "Luxury airport transfers in Cape Town: what to expect",
    excerpt:
      "Meet-and-greet, flight tracking and choosing the right vehicle for your luggage — not just your headcount.",
    category: "Travel",
    date: "August 2026",
    image: airportImg,
    readTime: "5 min read",
    intro:
      "An airport transfer is the first and last thing a client experiences of a city. Done properly it takes no thought at all. Here is how we run it at Cape Town International.",
    sections: [
      {
        heading: "Meet-and-greet, not a car park",
        body:
          "Your chauffeur meets you inside the arrivals hall with a name board, takes the luggage and walks you to a car parked close, not in the far bays. For arrivals with security or privacy requirements we arrange alternative access on request.",
      },
      {
        heading: "Flight tracking and waiting time",
        body:
          "We track the inbound flight and adjust the pickup automatically. Delays cost you nothing — the chauffeur is already rescheduled before you land. Waiting time on international arrivals is generous by default.",
      },
      {
        heading: "Sizing the vehicle to luggage, not people",
        body:
          "The most common mistake is booking a sedan for four adults with four large cases. Four passengers with full luggage belong in a V-Class or Staria. Six or more need a Sprinter. We size on luggage first and tell you if the booking looks wrong.",
      },
      {
        heading: "Fixed pricing and the route",
        body:
          "Transfers are quoted point to point, in ZAR, with live conversion to your currency. Camps Bay, Clifton, the V&A Waterfront, Constantia and the Winelands are all common destinations and each has its own realistic timing — we build that into the schedule rather than the apology.",
      },
    ],
    closing:
      "Send us your flight number, party size, luggage count and destination, and we will confirm the vehicle and the fixed rate.",
  },
  {
    slug: "best-luxury-cars-to-rent-cape-town",
    publishedISO: "2026-08-04",
    seoTitle: "Best Luxury Cars to Rent in Cape Town (2026 Guide)",
    seoDescription: "Choosing a luxury rental in Cape Town — SUV versus sedan, Chapman's Peak and gravel routes, parking realities, and which cars actually suit the city.",
    seoKeywords: "luxury car rental Cape Town, rent luxury car Cape Town, BMW rental Cape Town, luxury SUV rental Cape Town, self drive luxury car South Africa, premium car hire Cape Town",
    title: "The best luxury cars to rent in Cape Town",
    excerpt:
      "SUV or sedan, and which cars genuinely suit Cape Town's roads, parking and weekend routes.",
    category: "Travel",
    date: "August 2026",
    image: fleetImg,
    readTime: "6 min read",
    intro:
      "Cape Town rewards the right car and punishes the wrong one. Steep city-bowl streets, exposed coastal wind, gravel approaches to some of the best wine estates, and parking that varies from generous to non-existent within a kilometre.",
    sections: [
      {
        heading: "Start with the SUV question",
        body:
          "For most visitors the answer is yes. A BMW X3 or X5 handles Signal Hill, Chapman's Peak and the gravel run into a Franschhoek estate without a second thought, and gives you the ride height for unmarked speed humps in the suburbs. A Cayenne does the same with more pace.",
      },
      {
        heading: "When a sedan is the better car",
        body:
          "If your week is city bowl, Sea Point, the Waterfront and a few restaurant evenings, a 3 Series, C-Class or E-Class is easier to park, cheaper to fuel and perfectly comfortable. Sedans also read better for business meetings.",
      },
      {
        heading: "Families and groups",
        body:
          "Two adults and two children with beach kit fill a mid-size SUV quickly. Six or more should be looking at a V-Class or Staria. If everyone wants their own car for part of the week, we will split the fleet rather than force one vehicle.",
      },
      {
        heading: "The practical side",
        body:
          "Self-drive rentals from SVRM include delivery within Cape Town, a walkthrough of the vehicle, and 24/7 support. Cross-border travel, additional drivers and long-term rates are arranged on request. Our BMW X3 is currently on special at R2,000 per day.",
      },
    ],
    closing:
      "Tell us your week and we will recommend the car — including telling you when a chauffeur would cost less than the parking.",
  },
  {
    slug: "vip-security-cape-town-what-to-expect",
    publishedISO: "2026-08-05",
    seoTitle: "VIP Security in Cape Town | Executive Protection Guide",
    seoDescription: "How VIP and executive protection works in Cape Town — close protection officers, armoured vehicles, advance work, residential and event security. Discreet, on request.",
    seoKeywords: "VIP security Cape Town, executive protection Cape Town, close protection Cape Town, security services Cape Town, private security South Africa, bodyguard Cape Town",
    title: "VIP security in Cape Town: what to expect",
    excerpt:
      "Advance work, close protection officers and armoured vehicles — how a discreet detail is actually assembled.",
    category: "Insights",
    date: "August 2026",
    image: securityImg,
    readTime: "6 min read",
    intro:
      "Good security is almost invisible. If you notice it working, something has usually already gone wrong. Here is how we structure protection for visitors and residents in Cape Town.",
    sections: [
      {
        heading: "The advance is most of the work",
        body:
          "Before anyone is deployed we run the routes, the venues and the timings. Which entrance, which parking level, where the vehicle waits, what the alternate route is. Most incidents are avoided in this stage rather than managed later.",
      },
      {
        heading: "Close protection officers",
        body:
          "Our officers are PSIRA-registered, vetted and selected to match the environment — a business detail looks entirely different from a family beach day. Armed and unarmed options are both available, and we will tell you honestly which the situation warrants.",
      },
      {
        heading: "Vehicles",
        body:
          "Standard chauffeured vehicles for low-profile work; armoured BMW 7 Series and X5 where the threat assessment justifies it; G63 convoy configurations for higher-profile movements. Security drivers are trained separately from our chauffeurs.",
      },
      {
        heading: "Residential and event cover",
        body:
          "Static residential cover for villas and estates, event and function security, and travel security that runs with you across South Africa. All of it is quoted on request and treated as confidential from the first message.",
      },
    ],
    closing:
      "Send us the dates, the profile and the concerns. We will come back with a proposal, not a sales pitch.",
  },
  {
    slug: "luxury-honeymoon-cape-town-guide",
    publishedISO: "2026-08-06",
    seoTitle: "Luxury Honeymoon in Cape Town | Planning Guide 2026",
    seoDescription: "When to come, where to stay and what to book for a luxury honeymoon in Cape Town — villas, private chauffeur, the Winelands, safari extensions and romantic experiences.",
    seoKeywords: "luxury honeymoon Cape Town, honeymoon Cape Town, honeymoon South Africa, romantic Cape Town, honeymoon planner Cape Town, luxury honeymoon South Africa",
    title: "Planning a luxury honeymoon in Cape Town",
    excerpt:
      "When to come, where to stay, and how to build a week that does not read like a checklist.",
    category: "Lifestyle",
    date: "August 2026",
    image: romanticImg,
    readTime: "7 min read",
    intro:
      "Cape Town is one of the few honeymoon destinations that can be beach, mountain, wine country and safari inside a single week. The risk is trying to do all of it. Here is how we pace it.",
    sections: [
      {
        heading: "When to come",
        body:
          "November to March is high summer: warm, dry, long evenings, and busy. April and May are our quiet recommendation — still warm, far fewer people, better rates on villas. June to August is green, dramatic and excellent for Winelands fireside dining and whale season along the coast.",
      },
      {
        heading: "Where to stay",
        body:
          "Camps Bay and Clifton for beach and sunset; Bantry Bay and Fresnaye for privacy; Constantia for gardens and space; the Winelands for a few nights of complete quiet. We favour private villas and residences over hotels for honeymoons, simply because privacy is the thing couples miss most.",
      },
      {
        heading: "What to actually book",
        body:
          "One Cape Peninsula day, one Winelands day, one day on the water, and at least two days with nothing planned. A sunrise hot-air balloon flight, a helicopter picnic on a closed beach, and a private-chef dinner at the villa cover most of what couples remember afterwards.",
      },
      {
        heading: "Extending the trip",
        body:
          "Three to four nights in the Sabi Sand or Madikwe turns the honeymoon into two distinct halves. Flights are short and we handle the connection end to end so you never touch a booking desk.",
      },
    ],
    closing:
      "Tell us your dates and what you want the week to feel like. We build the rest and you approve it before anything is confirmed.",
  },
  {
    slug: "luxury-anniversary-ideas-cape-town",
    publishedISO: "2026-08-07",
    seoTitle: "Luxury Anniversary Ideas in Cape Town | SVRM Concierge",
    seoDescription: "Anniversary ideas in Cape Town from an evening to a milestone week — Maybach chauffeur, private yacht sunsets, villa dinners and Peninsula days.",
    seoKeywords: "luxury anniversary Cape Town, anniversary ideas Cape Town, romantic anniversary Cape Town, anniversary experience South Africa, anniversary concierge Cape Town",
    title: "Luxury anniversary ideas in Cape Town",
    excerpt:
      "From a single considered evening to a milestone week, with the logistics taken off both of you.",
    category: "Lifestyle",
    date: "August 2026",
    image: villaImg,
    readTime: "5 min read",
    intro:
      "The best anniversaries are specific. Not a generic dinner but the restaurant you both remember, arrived at in a car neither of you has to park. Here are the arrangements clients ask us for most.",
    sections: [
      {
        heading: "The evening",
        body:
          "A Maybach chauffeur from six until late, a table held at a restaurant with a view worth the drive, and flowers waiting at the residence on return. Simple, and almost always enough.",
      },
      {
        heading: "On the water",
        body:
          "A private crewed yacht from the V&A Waterfront timed to sunset along the Atlantic seaboard. Champagne, canapés and roughly two hours where nobody can reach either of you.",
      },
      {
        heading: "The Peninsula day",
        body:
          "Chapman's Peak, Cape Point and Boulders Beach with a chauffeur and a long lunch above the water. Unhurried by design — no group, no schedule but yours.",
      },
      {
        heading: "The milestone week",
        body:
          "For significant years we sequence Cape Town, the Winelands and a safari extension into one itinerary with a single concierge across all of it, so no part of it becomes admin.",
      },
    ],
    closing:
      "Give us the date and one detail about the two of you. We will build something that is not off a shelf.",
  },
  {
    slug: "cape-peninsula-one-day-private-tour-guide",
    publishedISO: "2026-08-08",
    seoTitle: "Cape Peninsula One Day Private Tour | Route & Guide",
    seoDescription: "The full Cape Peninsula route in one private day — Camps Bay, Chapman's Peak, Cape Point, Boulders Beach and Simon's Town. Timing, stops and what to skip.",
    seoKeywords: "Cape Peninsula private tour, Cape Point tour, Chapman's Peak drive, Boulders Beach penguins, private day tour Cape Town, Cape Peninsula one day tour",
    title: "The Cape Peninsula in one day: a private tour guide",
    excerpt:
      "The full coastal route, the honest timings, and the stops most itineraries get wrong.",
    category: "Tours",
    date: "August 2026",
    image: capePeninsulaImg,
    readTime: "6 min read",
    intro:
      "The Peninsula is the single best day Cape Town offers, and it is regularly ruined by trying to fit eleven stops into eight hours. Here is the route as we run it privately.",
    sections: [
      {
        heading: "The morning: Atlantic seaboard to Hout Bay",
        body:
          "Out through Sea Point, Clifton and Camps Bay with the Twelve Apostles on your left, then over Suikerbossie into Hout Bay. Coffee at the harbour, and the first proper photographs of the day.",
      },
      {
        heading: "Chapman's Peak to Noordhoek",
        body:
          "One of the great coastal roads anywhere: 114 curves cut into the cliff face above the Atlantic. We stop at the viewpoints most coaches drive past because they cannot park there.",
      },
      {
        heading: "Cape Point and the Cape of Good Hope",
        body:
          "The nature reserve, the funicular to the old lighthouse, and the walk down to the Cape of Good Hope sign. Budget two hours here properly rather than rushing it in forty minutes.",
      },
      {
        heading: "Boulders Beach and Simon's Town",
        body:
          "The African penguin colony on the boardwalk at Boulders, then the naval village of Simon's Town for a late lunch on the water before running home over Ou Kaapse Weg.",
      },
      {
        heading: "What we skip, and why",
        body:
          "Table Mountain does not belong in this day — the cableway queue alone will cost you the Peninsula. Kirstenbosch is a separate morning. Doing fewer things slowly is the entire point.",
      },
    ],
    closing:
      "From R8,500 for the private day, with the Mercedes-Maybach S-Class available on request.",
  },
  {
    slug: "cape-town-wedding-transport-guide",
    publishedISO: "2026-08-09",
    seoTitle: "Wedding Car Hire & Transport in Cape Town | SVRM",
    seoDescription: "Planning wedding transport in Cape Town — bridal cars, guest shuttles, Winelands timings and the schedule mistakes that cost the most on the day.",
    seoKeywords: "wedding car hire Cape Town, wedding transport Cape Town, bridal car Cape Town, wedding chauffeur Cape Town, Winelands wedding transport, guest shuttle Cape Town",
    title: "Wedding transport in Cape Town: a planning guide",
    excerpt:
      "Bridal cars, guest shuttles and the Winelands timings that ruin schedules if nobody checks them.",
    category: "Travel",
    date: "August 2026",
    image: sclassImg,
    readTime: "5 min read",
    intro:
      "Wedding transport is the part of the day everyone forgets until three weeks out. It is also the part most likely to make the ceremony late. A short guide.",
    sections: [
      {
        heading: "The bridal car",
        body:
          "The Maybach S-Class or a Rolls-Royce for the arrival, with a chauffeur briefed on dress logistics, umbrella cover and where to stand. The car stays for the couple's departure rather than leaving after drop-off.",
      },
      {
        heading: "Guest movement",
        body:
          "Winelands venues have limited parking and guests who should not drive home. Sprinter and midibus shuttles running a loop from two or three city pickup points solve both problems, and are cheaper than the alternative.",
      },
      {
        heading: "Timing, honestly",
        body:
          "Cape Town to Franschhoek is an hour without traffic and ninety minutes with it. Stellenbosch is closer but the last stretch is slow. We build in the buffer rather than discovering it on the day.",
      },
      {
        heading: "The night before and the morning after",
        body:
          "Rehearsal dinner transfers and airport runs the following morning are the two easiest things to forget. We schedule them at the same time as everything else.",
      },
    ],
    closing:
      "Send us the venue, the guest count and the schedule. We will map the fleet against it.",
  },
  {
    slug: "cape-town-winelands-private-tour",
    publishedISO: "2026-08-10",
    seoTitle: "Private Winelands Tour from Cape Town | Stellenbosch & More",
    seoDescription: "A chauffeured private Winelands day from Cape Town — Stellenbosch, Franschhoek and Constantia estates, tasting appointments, lunch and honest timings.",
    seoKeywords: "private Winelands tour Cape Town, Stellenbosch wine tour, Franschhoek wine tour, Constantia wine tasting, chauffeured wine tour Cape Town, luxury wine tour South Africa",
    title: "A private Winelands day from Cape Town",
    excerpt:
      "Three estates, one long lunch, and a chauffeur so nobody has to count glasses.",
    category: "Tours",
    date: "August 2026",
    image: wineImg,
    readTime: "5 min read",
    intro:
      "The Winelands are forty-five minutes from the city and best seen at three estates rather than six. Here is how a private day is built.",
    sections: [
      {
        heading: "Choosing the valley",
        body:
          "Constantia is closest and works as a half day. Stellenbosch has the greatest range and the best classic architecture. Franschhoek is the prettiest and the strongest for food. We usually pick one valley per day rather than crossing between them.",
      },
      {
        heading: "Appointments matter",
        body:
          "The best tastings at the top estates are private, seated and booked in advance. Walk-in tasting rooms are a different and lesser experience. We hold the appointments ahead of the day.",
      },
      {
        heading: "Lunch as the centre of the day",
        body:
          "One long lunch at an estate restaurant, booked for two hours, is the correct shape for a Winelands day. Two tastings before it, one after, and home before dark.",
      },
      {
        heading: "The chauffeur point",
        body:
          "This is the one day in a Cape Town trip where driving yourself is genuinely a mistake. A chauffeured vehicle costs less than the alternative in every sense.",
      },
    ],
    closing:
      "Tell us the valley, the party size and whether you want the day to be serious about wine or simply beautiful.",
  },
  {
    slug: "safari-from-cape-town-how-to-plan",
    publishedISO: "2026-08-11",
    seoTitle: "Safari from Cape Town | How to Plan the Extension",
    seoDescription: "Adding a Big 5 safari to a Cape Town trip — Sabi Sand, Madikwe and Eastern Cape compared, flight logistics, malaria, timing and realistic budgets.",
    seoKeywords: "safari from Cape Town, Big 5 safari South Africa, Sabi Sand safari, Madikwe safari, malaria free safari South Africa, luxury safari extension Cape Town",
    title: "How to add a safari to a Cape Town trip",
    excerpt:
      "Sabi Sand, Madikwe or the Eastern Cape — how to choose, and how the flights actually work.",
    category: "Tours",
    date: "August 2026",
    image: safariImg,
    readTime: "6 min read",
    intro:
      "There is no Big 5 game within driving distance of Cape Town worth the name. A proper safari is a flight, and that flight is easier than most visitors assume.",
    sections: [
      {
        heading: "Sabi Sand",
        body:
          "The best leopard viewing in Africa and the strongest lodge collection. Fly Cape Town to Nelspruit or Skukuza, then a short road or air transfer. Malaria area, low risk in winter. Three nights minimum.",
      },
      {
        heading: "Madikwe",
        body:
          "Malaria-free, excellent for families, and reached by charter or via Johannesburg. Big 5 present with strong wild dog sightings. A good choice if young children are travelling.",
      },
      {
        heading: "Eastern Cape",
        body:
          "Closest to Cape Town, malaria-free, and reachable by a short flight to Port Elizabeth. The game is genuinely good if not Sabi Sand-level, and it suits a two-night add-on.",
      },
      {
        heading: "Practicalities",
        body:
          "Three nights is the minimum worth doing; four is better. Charter flights remove every connection headache and are worth pricing. Baggage on light aircraft is soft-sided and weight-limited — we tell you before you pack, not at the airstrip.",
      },
    ],
    closing:
      "We handle the flights, the transfers, the lodge and the return to Cape Town as one arrangement.",
  },
  {
    slug: "luxury-villa-rental-cape-town-guide",
    publishedISO: "2026-08-12",
    seoTitle: "Luxury Villa Rental in Cape Town | Areas & Guide",
    seoDescription: "A guide to luxury villa rental in Cape Town — Camps Bay, Clifton, Bantry Bay and Constantia compared, staffing, wind, security and what to ask before booking.",
    seoKeywords: "luxury villa rental Cape Town, villa Camps Bay, Clifton villa rental, private villa Cape Town, luxury holiday home Cape Town, Atlantic seaboard villa",
    title: "Renting a luxury villa in Cape Town",
    excerpt:
      "The areas compared, the wind question nobody mentions, and what to ask before you sign.",
    category: "Properties",
    date: "August 2026",
    image: villaImg,
    readTime: "6 min read",
    intro:
      "A villa is almost always the better choice over a hotel in Cape Town, provided it is the right villa in the right suburb. The differences between neighbourhoods here are larger than the photographs suggest.",
    sections: [
      {
        heading: "The areas",
        body:
          "Camps Bay: beach, restaurants, sunset, busy in season. Clifton: the best beaches and the steepest stairs. Bantry Bay and Fresnaye: quieter, more private, excellent views. Llandudno: dramatic and remote. Constantia: gardens, space and families, twenty minutes from the sea.",
      },
      {
        heading: "The wind",
        body:
          "The south-easter blows hard in midsummer and hits some suburbs far worse than others. A villa with a sheltered courtyard or a north-facing pool terrace is worth more in January than one with a bigger view. We will tell you which side of the mountain your dates favour.",
      },
      {
        heading: "Staffing and services",
        body:
          "Most of our residences come with a housekeeper, and a private chef, butler, driver and in-house spa can all be added. Grocery provisioning ahead of arrival is standard on our bookings.",
      },
      {
        heading: "What to ask",
        body:
          "Generator or inverter backup, gate and alarm arrangements, parking for the size of vehicle you are renting, and how far the nearest beach actually is on foot rather than on a map.",
      },
    ],
    closing:
      "Send us the dates, the party and the priorities. We will shortlist three residences, not thirty.",
  },
  {
    slug: "cape-town-concierge-service-what-it-covers",
    publishedISO: "2026-08-13",
    seoTitle: "Luxury Concierge Service in Cape Town | What It Covers",
    seoDescription: "What a Cape Town luxury concierge actually does — reservations, transport, staffing, private events, lifestyle management and 24/7 support. And what it costs.",
    seoKeywords: "luxury concierge Cape Town, concierge service Cape Town, lifestyle management Cape Town, private concierge South Africa, VIP concierge Cape Town, bespoke concierge service",
    title: "What a luxury concierge service actually covers",
    excerpt:
      "Reservations and transport are the smallest part of it. Here is the rest.",
    category: "Insights",
    date: "August 2026",
    image: customImg,
    readTime: "5 min read",
    intro:
      "Concierge is a word that has been diluted. In practice it means one person holding the whole shape of your time in a city, so you never have to.",
    sections: [
      {
        heading: "Access and reservations",
        body:
          "Tables that are notionally full, private tasting rooms, closed viewings, event access and last-minute changes to all of it. This is the visible part of the service and roughly a fifth of the work.",
      },
      {
        heading: "Movement",
        body:
          "Chauffeurs, airport transfers, charter flights, helicopters and yachts, sequenced so no one waits and nothing overlaps. Movement is where most itineraries actually fail.",
      },
      {
        heading: "Staffing and residences",
        body:
          "Private chefs, butlers, housekeepers, nannies, therapists and security placed into the residence you are staying in, vetted and briefed before arrival.",
      },
      {
        heading: "Everything unglamorous",
        body:
          "Pharmacies at midnight, a replacement passport appointment, a suit altered before a dinner, a birthday cake in a different city. This is the part clients remember, and it is why there is one number rather than a portal.",
      },
    ],
    closing:
      "Our concierge desk runs 24/7 across Cape Town and South Africa, on retainer or per trip.",
  },
  {
    slug: "private-jet-charter-cape-town-guide",
    publishedISO: "2026-08-14",
    seoTitle: "Private Jet Charter from Cape Town | Costs & Routes",
    seoDescription: "Private jet and turboprop charter from Cape Town — common routes, aircraft classes, realistic costs, empty legs and the FBO experience explained.",
    seoKeywords: "private jet charter Cape Town, jet charter South Africa, private aviation Cape Town, empty leg flights South Africa, charter flight Cape Town, luxury air charter",
    title: "Private jet charter from Cape Town",
    excerpt:
      "Aircraft classes, the routes that make sense, and when charter genuinely beats a scheduled flight.",
    category: "Travel",
    date: "August 2026",
    image: jetImg,
    readTime: "5 min read",
    intro:
      "Charter is not always the extravagance it looks like. On some South African routes, with four or more travelling, it is close to rational.",
    sections: [
      {
        heading: "The routes that make sense",
        body:
          "Cape Town to the Sabi Sand or Madikwe, where scheduled flights plus transfers consume most of a day. Cape Town to Johannesburg for a same-day meeting. Cape Town to Namibia, Botswana or Mozambique, where connections are poor.",
      },
      {
        heading: "Aircraft classes",
        body:
          "Turboprops such as the PC-12 and King Air for short legs and bush strips. Light and mid jets for national routes. Heavy jets for intercontinental. The right aircraft is dictated by runway and range, not preference.",
      },
      {
        heading: "What it costs, roughly",
        body:
          "Charter is priced by flight hour plus positioning, landing and crew. Empty legs — repositioning flights sold at a discount — can be dramatically cheaper if your dates are flexible, and we watch them for clients who are.",
      },
      {
        heading: "The experience",
        body:
          "FBO terminals mean arriving twenty minutes before departure, no queues, your own security screening and a chauffeur on the apron at both ends. We arrange the ground transport as part of the same booking.",
      },
    ],
    closing:
      "Send us the route, the date and the party size and we will come back with aircraft options and costs.",
  },
  {
    slug: "helicopter-charter-cape-town",
    publishedISO: "2026-08-15",
    seoTitle: "Helicopter Charter in Cape Town | Scenic Flights & Transfers",
    seoDescription: "Helicopter charter in Cape Town — scenic routes over the Twelve Apostles and Cape Point, beach picnic landings, Winelands transfers and flight timings.",
    seoKeywords: "helicopter charter Cape Town, scenic helicopter flight Cape Town, helicopter tour Cape Town, helicopter transfer Winelands, private helicopter South Africa",
    title: "Helicopter charter and scenic flights in Cape Town",
    excerpt:
      "The scenic routes worth flying, the picnic landings, and when the wind will ground you.",
    category: "Travel",
    date: "August 2026",
    image: heliImg,
    readTime: "4 min read",
    intro:
      "Cape Town from the air is a different city. The peninsula reads as a single sculpted object rather than a series of suburbs, and it takes about fifteen minutes to understand why people move here.",
    sections: [
      {
        heading: "The scenic routes",
        body:
          "The short Atlantic loop over the Twelve Apostles and Camps Bay takes around twenty minutes. The full Peninsula flight to Cape Point and back runs closer to an hour and is the one worth doing.",
      },
      {
        heading: "Landings and picnics",
        body:
          "Private landings on secluded beaches and mountain plateaus are permitted at approved sites. A helicopter picnic — flight out, chef-prepared lunch, flight back — is one of the most-requested honeymoon and anniversary arrangements we run.",
      },
      {
        heading: "Transfers",
        body:
          "Helicopter transfers to the Winelands, Hermanus and coastal lodges turn a two-hour drive into twenty-five minutes. They are also the cleanest solution for a tight wedding schedule.",
      },
      {
        heading: "Weather, honestly",
        body:
          "Summer wind grounds flights more often than visitors expect, usually in the afternoon. We book mornings where possible and hold a flexible alternative for the day.",
      },
    ],
    closing:
      "Tell us the occasion and the date. We will hold the aircraft and a weather alternative.",
  },
  {
    slug: "yacht-charter-cape-town-guide",
    publishedISO: "2026-08-16",
    seoTitle: "Private Yacht Charter in Cape Town | Sunset & Day Charters",
    seoDescription: "Private yacht and catamaran charter from the V&A Waterfront — sunset cruises, full-day charters, catering, crew and the best months to be on the water.",
    seoKeywords: "yacht charter Cape Town, private boat charter Cape Town, sunset cruise Cape Town, catamaran charter V&A Waterfront, luxury yacht hire South Africa",
    title: "Private yacht charter in Cape Town",
    excerpt:
      "Sunset runs, full-day charters and what the Atlantic actually does to a schedule.",
    category: "Lifestyle",
    date: "August 2026",
    image: yachtImg,
    readTime: "5 min read",
    intro:
      "Two hours on the water off Cape Town, timed correctly, is among the best things the city offers. Timed incorrectly it is cold and choppy. The difference is entirely planning.",
    sections: [
      {
        heading: "The sunset charter",
        body:
          "Departing the V&A Waterfront around ninety minutes before sunset, running along Sea Point, Clifton and Camps Bay with the mountain lit behind you. Champagne and canapés aboard, crewed, roughly two hours.",
      },
      {
        heading: "Full-day charters",
        body:
          "Longer charters run down to Hout Bay and the seal colony at Duiker Island, or across to Simon's Town in False Bay when the Atlantic side is blowing. Lunch aboard or ashore, your choice.",
      },
      {
        heading: "Vessels",
        body:
          "Sailing catamarans for stability and space, motor yachts for pace and comfort, and larger vessels for events and celebrations. Party size and sea state usually decide it.",
      },
      {
        heading: "Timing and weather",
        body:
          "November to April is the strongest window. If the south-easter is up, False Bay is the correct answer rather than cancelling. We move the departure rather than the day where we can.",
      },
    ],
    closing:
      "Give us the date, the party and the occasion, and we will match the vessel and the crew.",
  },
  {
    slug: "best-time-to-visit-cape-town-luxury",
    publishedISO: "2026-08-17",
    seoTitle: "Best Time to Visit Cape Town | Season by Season Guide",
    seoDescription: "A season-by-season guide to Cape Town for luxury travellers — weather, wind, crowds, whale season, villa rates and which months quietly work best.",
    seoKeywords: "best time to visit Cape Town, Cape Town weather by month, Cape Town high season, when to visit South Africa, Cape Town shoulder season",
    title: "The best time to visit Cape Town",
    excerpt:
      "High summer, the shoulder months nobody books, and the wind nobody warns you about.",
    category: "Insights",
    date: "August 2026",
    image: penthouseImg,
    readTime: "5 min read",
    intro:
      "Cape Town has four genuinely distinct seasons and most visitors come during only one of them. That is a shame, because two of the others are arguably better.",
    sections: [
      {
        heading: "December to February",
        body:
          "Hot, dry, long evenings and completely full. Beaches, festivals and the best of the outdoor city — alongside peak villa rates, restaurant queues and the strongest south-easter of the year.",
      },
      {
        heading: "March to May",
        body:
          "Our quiet recommendation. Still warm into April, the wind drops, the crowds leave, and the Winelands are in harvest. Rates fall significantly from mid-March.",
      },
      {
        heading: "June to August",
        body:
          "Green, dramatic and wet in bursts. Whale season along the Overberg coast, fireside lunches in the Winelands, empty restaurants and the lowest rates of the year. Bring a coat and stop apologising for it.",
      },
      {
        heading: "September to November",
        body:
          "Wildflowers, whales still present into November, warming days and thin crowds until the schools break. Arguably the best all-round month is October.",
      },
    ],
    closing:
      "Tell us when you can travel and we will tell you honestly what that month is good for.",
  },
  {
    slug: "cape-town-private-chef-dining-guide",
    publishedISO: "2026-08-18",
    seoTitle: "Private Chef Hire in Cape Town | Villa Dining Guide",
    seoDescription: "Hiring a private chef in Cape Town — how villa dining works, costs, dietary and halal requirements, wine pairing and when a restaurant is the better call.",
    seoKeywords: "private chef Cape Town, villa chef Cape Town, private dining Cape Town, halal private chef Cape Town, chef hire South Africa, luxury catering Cape Town",
    title: "Private chefs and dining in Cape Town",
    excerpt:
      "How villa dining actually works, and when you should just book the restaurant instead.",
    category: "Lifestyle",
    date: "August 2026",
    image: chefImg,
    readTime: "4 min read",
    intro:
      "A private chef at the villa is often better than the restaurant, and occasionally a waste of a good evening out. Here is how we decide.",
    sections: [
      {
        heading: "When the chef wins",
        body:
          "Arrival night, when nobody wants to be in public. Families with young children. Celebrations where you want the room to yourselves. Any night the wind makes outdoor restaurant terraces unpleasant.",
      },
      {
        heading: "How it works",
        body:
          "The chef proposes a menu against your preferences, shops that day, cooks in the villa kitchen, serves and leaves the kitchen cleaner than they found it. Three to five courses is standard; wine pairing is arranged separately or from your own cellar.",
      },
      {
        heading: "Dietary requirements",
        body:
          "Halal, kosher-style, vegan, allergen-free and children's menus are all routine. Tell us at booking rather than on the night and none of it is a constraint.",
      },
      {
        heading: "When to go out instead",
        body:
          "Cape Town's best restaurants are genuinely world-class and the rooms are part of the experience. We hold tables at the ones worth the drive and will say so when eating out is the better call.",
      },
    ],
    closing:
      "Tell us the nights, the numbers and the preferences, and we will place the chef and hold the tables.",
  },
  {
    slug: "executive-travel-cape-town-business-guide",
    publishedISO: "2026-08-19",
    seoTitle: "Executive Travel in Cape Town | Business Visitor Guide",
    seoDescription: "Executive travel logistics in Cape Town — chauffeur service, traffic realities, where to stay for meetings, connectivity, security and same-day Johannesburg runs.",
    seoKeywords: "executive travel Cape Town, business travel Cape Town, corporate chauffeur Cape Town, executive transport South Africa, business concierge Cape Town",
    title: "Executive travel in Cape Town: a business visitor's guide",
    excerpt:
      "Traffic realities, where to base yourself, and how to make a two-day trip actually work.",
    category: "Travel",
    date: "August 2026",
    image: fleetImg,
    readTime: "5 min read",
    intro:
      "Cape Town is an easy business city if you plan around two things: distance and traffic. Get those right and everything else follows.",
    sections: [
      {
        heading: "Where to base yourself",
        body:
          "The V&A Waterfront and the city bowl for CBD meetings. Century City if your business is in the northern corridor. Constantia only if your schedule is light — it is beautiful and slow to leave in the morning.",
      },
      {
        heading: "Traffic, honestly",
        body:
          "The N1 and N2 inbound are heavy from 06:45 to 09:00 and outbound from 16:00 to 18:30. A twenty-minute route becomes fifty. We schedule against real timings rather than optimistic ones.",
      },
      {
        heading: "The chauffeur case",
        body:
          "Between three and six meetings across the city in a day, a held car with a chauffeur costs less in time than parking and navigation. It also gives you a working hour in the back seat that you would otherwise lose.",
      },
      {
        heading: "Extending or connecting",
        body:
          "Same-day Johannesburg returns work well on the early flight. If the schedule tightens, charter turns two days into one. Airport meet-and-greet and fast-track handling are arranged on request.",
      },
    ],
    closing:
      "Send us the meeting schedule and we will build the movement plan around it.",
  },
  {
    slug: "armoured-vehicles-south-africa-guide",
    publishedISO: "2026-08-20",
    seoTitle: "Armoured Vehicle Hire in South Africa | Levels & Guidance",
    seoDescription: "Armoured vehicle hire in South Africa — B4 and B6 protection levels explained, when a discreet standard vehicle is safer, and how convoy work is structured.",
    seoKeywords: "armoured vehicle hire South Africa, armoured car Cape Town, B6 armoured vehicle, VIP convoy South Africa, secure transport Cape Town, executive protection vehicles",
    title: "Armoured vehicles in South Africa: when they make sense",
    excerpt:
      "B4 versus B6, why discretion often beats armour, and how convoys are actually run.",
    category: "Insights",
    date: "August 2026",
    image: securityImg,
    readTime: "5 min read",
    intro:
      "Armoured vehicles are the most visible part of protective work and often the least necessary. That said, when they are warranted, the specification matters.",
    sections: [
      {
        heading: "Protection levels",
        body:
          "B4 covers handgun threats and is the common commercial standard, usually on an X5 or 7 Series. B6 covers rifle threats, adds substantial weight and changes the way the vehicle drives. The threat assessment dictates the level, not the budget.",
      },
      {
        heading: "Discretion versus armour",
        body:
          "For most visiting executives a standard, unremarkable vehicle with a trained security driver is safer than an obviously armoured one, because it attracts no attention. We say this to clients more often than we quote B6.",
      },
      {
        heading: "Convoy configurations",
        body:
          "Where profile is unavoidable, a lead and follow configuration with G63s and a protected principal vehicle is standard. Routes are run in advance, alternates are held, and the detail commander controls timing.",
      },
      {
        heading: "Drivers",
        body:
          "Security drivers are trained differently from chauffeurs — evasive driving, embus and debus procedure, route discipline. We do not interchange the two roles.",
      },
    ],
    closing:
      "All security work is quoted on request and treated as confidential from the first message.",
  },
  {
    slug: "long-term-luxury-rental-cape-town",
    publishedISO: "2026-08-21",
    seoTitle: "Long-Term Luxury Rentals in Cape Town | Relocation Guide",
    seoDescription: "Long-term luxury rentals in Cape Town for remote workers and relocations — areas, lease terms, furnishing, connectivity, schools and monthly cost realities.",
    seoKeywords: "long term rental Cape Town, luxury apartment rental Cape Town, relocation Cape Town, furnished rental Cape Town, digital nomad Cape Town, monthly villa rental Cape Town",
    title: "Long-term luxury rentals in Cape Town",
    excerpt:
      "Lease terms, connectivity, schools and the suburbs that suit a stay of months rather than nights.",
    category: "Properties",
    date: "August 2026",
    image: estateImg,
    readTime: "5 min read",
    intro:
      "More clients now come for three to six months than for a week. The requirements are entirely different, and so is the way we search.",
    sections: [
      {
        heading: "Areas for longer stays",
        body:
          "Sea Point and Green Point for walkability and restaurants. Higgovale and Oranjezicht for quiet and views with a short commute. Constantia for families and schools. Camps Bay is glorious for a fortnight and expensive for a season.",
      },
      {
        heading: "Lease terms",
        body:
          "Anything under six months is treated as a holiday let and priced accordingly. From six months, rates fall sharply and standard leases apply, usually with a deposit and utilities separated out.",
      },
      {
        heading: "Connectivity and load-shedding",
        body:
          "Fibre is widespread and fast. Backup power is the real question: confirm inverter or generator capacity and battery runtime before signing, particularly if you work from the property.",
      },
      {
        heading: "Schools and settling in",
        body:
          "International and independent school placements need lead time — start three to six months out. We handle viewings, negotiation, furnishing, staff placement and the vehicle arrangements as one process.",
      },
    ],
    closing:
      "Tell us the duration, the budget and who is travelling. We will shortlist properties and manage the lease.",
  },
];

export const categories: BlogCategory[] = ["Travel", "Tours", "Lifestyle", "Properties", "Insights"];
