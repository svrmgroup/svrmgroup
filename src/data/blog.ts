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
];

export const categories: BlogCategory[] = ["Travel", "Tours", "Lifestyle", "Properties", "Insights"];
