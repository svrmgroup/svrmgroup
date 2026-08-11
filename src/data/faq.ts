export type FaqItem = {
  q: string;
  a: string;
  /** Hidden search keywords / synonyms so the right FAQ surfaces for common terms. */
  keywords?: string[];
  /** Optional tags for grouping or boosting search results. */
  tags?: string[];
};
export type FaqGroup = { id: string; title: string; items: FaqItem[] };

export const faqGroups: FaqGroup[] = [
  {
    id: "general",
    title: "About SVRM",
    items: [
      { q: "What is SVRM?", a: "SVRM is a Cape Town–based luxury lifestyle management and concierge service. We curate transport, tours, stays, security and bespoke experiences for private clients and businesses — locally and across South Africa.", keywords: ["about", "who", "what is svrm", "company", "concierge", "lifestyle management", "cape town"] },
      { q: "Where are you based and where do you operate?", a: "We are headquartered in Cape Town. Our chauffeured travel, tours, security and stays operate across the Western Cape as standard, and nationally on request. International planning and onward arrangements can be coordinated through our partner network.", keywords: ["location", "based", "operate", "western cape", "south africa", "area", "where"] },
      { q: "Do you work with businesses as well as private clients?", a: "Yes. We support corporate visits, executive transport, roadshows, conference logistics, group travel, private events and ongoing retainers. Speak to the concierge for a tailored proposal.", keywords: ["corporate", "business", "executive", "roadshow", "events", "company", "private client"] },
      { q: "Is SVRM discreet? Will my booking be private?", a: "Discretion is fundamental. Our team is NDA-bound, our vehicles are unbranded, and we do not publish client names, itineraries or images without written consent.", keywords: ["privacy", "discretion", "nda", "confidential", "private", "secret", "unbranded"] },
    ],
  },
  {
    id: "booking",
    title: "Booking & Pricing",
    items: [
      { q: "How do I make a booking?", a: "The quickest route is WhatsApp on +27 73 064 1481. You can also email concierge@svrm.group or use the enquiry form on this page. We typically reply the same day.", keywords: ["book", "booking", "reserve", "how to book", "make a booking", "enquiry", "contact"] },
      { q: "Why don't you publish prices?", a: "Every itinerary is composed for the guest — vehicle, route, wait time, season, party size and discretion all shape the rate. A published number would be wrong for almost everyone, so we send a written quote within 24 hours instead.", keywords: ["price", "cost", "rate", "quote", "why no prices", "how much", "pricing"] },
      { q: "Which currencies can I be quoted in?", a: "We quote in ZAR by default and can present the same quote in GBP or USD. The site has a currency switcher in the top navigation.", keywords: ["currency", "zar", "gbp", "usd", "dollar", "rand", "pound", "payment currency"] },
      { q: "How do I pay? Is a deposit required?", a: "We accept EFT, card, international wire and a secure payment link. A deposit is typically required to confirm; the balance is settled before or on the day of service. Specific terms are on every written quote.", keywords: ["pay", "payment", "deposit", "eft", "card", "credit card", "payment link", "wire", "bank transfer", "how to pay"] },
      { q: "What is your cancellation policy?", a: "Terms are set per booking and clearly stated on the quote. As a general guide, cancellations made well in advance are refundable; short-notice cancellations may be partially or non-refundable, especially for tours, charters and seasonal stays.", keywords: ["cancel", "cancellation", "refund", "policy", "change booking", "modify"] },
      { q: "How far in advance should I book?", a: "For peak season (December–February and Easter) we recommend 4–8 weeks. Off-peak we can often arrange transport, tours and stays within 24–72 hours.", keywords: ["advance", "how early", "peak season", "availability", "last minute", "when to book"] },
    ],
  },
  {
    id: "travel",
    title: "Travel & Chauffeur",
    items: [
      { q: "What does your chauffeured travel include?", a: "A professional, NDA-bound chauffeur, the vehicle of your choice, fuel, tolls, water on board and in-trip support from the concierge. Wait time, child seats and additional stops are arranged on request.", keywords: ["chauffeur", "driver", "travel", "car", "vehicle", "included", "fuel", "tolls", "water"] },
      { q: "Do you offer airport transfers?", a: "Yes — to and from Cape Town International, private FBOs and regional airports. Flight tracking is standard so we adjust automatically for early or delayed arrivals.", keywords: ["airport", "transfer", "cape town international", "flight", "pickup", "drop off", "airport pickup", "ctia"] },
      { q: "Can I hire a vehicle without a chauffeur?", a: "Yes. Self-drive hire is available through the Rentals page and is priced lower than the chauffeured equivalent. A valid licence, ID/passport and a refundable deposit are required.", keywords: ["self drive", "rental", "hire", "without driver", "self-drive", "car hire", "licence", "deposit"] },
      { q: "Do you offer private jets, helicopters or yachts?", a: "Yes — through trusted partners. We arrange private jet charter, scenic and transfer helicopters, and motor or sailing yachts from the V&A Waterfront. See the Travel page categories.", keywords: ["private jet", "helicopter", "yacht", "charter", "scenic flight", "va waterfront", "boat", "luxury travel"] },
      { q: "Do you offer group transport?", a: "Yes. 16-seater Sprinters, 22-seater midibuses, 32-seater touring buses and full luxury coaches for weddings, corporate groups and tours.", keywords: ["group", "bus", "coach", "sprinter", "minibus", "wedding transport", "corporate group", "large group"] },
    ],
  },
  {
    id: "tours",
    title: "Tours & Experiences",
    items: [
      { q: "What kinds of tours do you offer?", a: "Safari, marine and wildlife, Garden Route road trips, aerial and scenic flights, culinary experiences, wellness retreats, photography tours, cultural and adventure days, and fully custom itineraries.", keywords: ["tours", "safari", "garden route", "wildlife", "marine", "culinary", "wellness", "photography", "adventure", "itinerary"] },
      { q: "Are your tours private?", a: "Yes — every SVRM tour is private to your party. We do not run shared or group-with-strangers tours.", keywords: ["private tour", "group tour", "shared tour", "exclusive", "personal"] },
      { q: "Can you build a custom itinerary?", a: "Yes. Use the Tour Builder on the Tours page or message the concierge with dates, party size and the feeling you want from the trip. We return a first sketch within a day.", keywords: ["custom", "bespoke", "tailor made", "itinerary", "plan", "tour builder", "personalised"] },
      { q: "Do you offer wine tours?", a: "No. We do not offer alcohol-led tours. We do offer culinary experiences, vineyard landscapes and Cape Winelands scenery where alcohol is not the focus.", keywords: ["wine tour", "winelands", "vineyard", "alcohol", "culinary", "stellenbosch", "franschhoek"] },
    ],
  },
  {
    id: "stays",
    title: "Stays & Property",
    items: [
      { q: "What types of stays do you arrange?", a: "Private villas, serviced apartments, boutique hotels and long-term residences across Cape Town and the Cape Peninsula. Short-term, long-term and seasonal options are all available.", keywords: ["stay", "accommodation", "villa", "apartment", "hotel", "residence", "cape peninsula", "where to stay"] },
      { q: "Can you find a stay that fits my specific budget?", a: "Yes. Use the Custom Stay bar on the Stays page — tell us dates, party, neighbourhood and budget, and we return a curated shortlist.", keywords: ["budget", "cheap", "affordable", "custom stay", "shortlist", "find accommodation"] },
      { q: "Do you help with buying or selling property?", a: "Yes. We facilitate residential sales, off-market introductions and long-term lease negotiations in partnership with vetted Cape Town agents.", keywords: ["property", "buy", "sell", "real estate", "lease", "off market", "residential"] },
      { q: "Can I add a chef, housekeeper or chauffeur to my stay?", a: "Yes — see the Stay Extras options. Private chefs, housekeeping, in-residence trainers, chauffeurs on call and security can all be arranged.", keywords: ["chef", "housekeeper", "butler", "extras", "private chef", "housekeeping", "trainer", "in residence"] },
    ],
  },
  {
    id: "security",
    title: "Security",
    items: [
      { q: "What security services do you offer?", a: "Armoured vehicle transport (BMW 7 Series, X5, Mercedes G63), armed and unarmed close protection, residential security, event security and secure airport transfers.", keywords: ["security", "bodyguard", "close protection", "armoured car", "g63", "bmw", "residential security", "event security", "psira"] },
      { q: "Is your security team licensed?", a: "Yes — our protection partners operate under PSiRA-registered firms with vetted personnel. Specifics for any deployment are confirmed in writing before service.", keywords: ["licensed", "psira", "registered", "vetting", "qualified", "legal"] },
      { q: "Can security be added to any booking?", a: "Yes. Close protection, secure transport and venue advance work can be layered onto any travel, tour, stay or event.", keywords: ["add security", "extra security", "venue advance", "secure transport", "protection"] },
    ],
  },
  {
    id: "scope",
    title: "What we don't offer",
    items: [
      { q: "Is there anything SVRM won't arrange?", a: "We do not arrange anything illegal, unsafe or in conflict with the wellbeing of guests, staff or wildlife. We do not run alcohol-led tours, we do not work with unlicensed operators, and we do not accept bookings we cannot deliver to our standard.", keywords: ["won't", "don't offer", "not available", "restrictions", "rules", "limits"] },
      { q: "Do you offer hunting tours?", a: "We facilitate ethical, legally licensed game experiences only. We do not arrange any activity that contravenes South African wildlife or firearms law.", keywords: ["hunting", "game", "firearms", "wildlife law", "ethical"] },
      { q: "Do you sell tickets to public events?", a: "We don't operate as a ticket agency. We do arrange private access, hospitality and transport around major Cape Town events when capacity allows.", keywords: ["tickets", "events", "public events", "ticket agency", "private access"] },
    ],
  },
  {
    id: "policies",
    title: "Privacy & Data",
    items: [
      { q: "How do you handle my personal information?", a: "We collect only what is needed to deliver the service you have requested — contact details, travel details and any preferences you share. Information is shared with the specific vendors required to deliver your booking, under confidentiality.", keywords: ["privacy", "personal information", "data", "gdpr", "confidentiality", "contact details"] },
      { q: "Will my booking appear on social media?", a: "No — never without your explicit written consent. Our default is full discretion.", keywords: ["social media", "instagram", "facebook", "consent", "marketing", "photos"] },
      { q: "Who do I contact about a data or privacy request?", a: "Email concierge@svrm.group with the subject 'Privacy request' and we will respond within a reasonable period.", keywords: ["privacy request", "data request", "contact", "email", "gdpr request"] },
    ],
  },
  {
    id: "hours",
    title: "Hours",
    items: [
      { q: "What are your hours?", a: "Concierge support runs 24 hours, seven days a week. Active bookings (transport, security, ongoing itineraries) are supported 24/7 by the on-duty team.", keywords: ["hours", "open", "24/7", "support", "when", "time", "availability"] },
    ],
  },
  {
    id: "terms",
    title: "Booking Terms",
    items: [
      { q: "How do I make a booking?", a: "Bookings and enquiries can be made through WhatsApp, email, our website, or other communication channels provided by SVRM Group. Once your requirements have been confirmed, SVRM Group will provide the relevant pricing, availability, payment requirements and booking details.", keywords: ["booking terms", "how to book", "enquiry", "reservation process", "requirements"] },
      { q: "How much is the deposit?", a: "A 50% deposit is generally required to secure and confirm a booking. The remaining balance must be paid in accordance with the payment terms provided for your booking.\n\nIn certain circumstances, SVRM Group may, at its discretion, agree to an alternative deposit or payment arrangement. Any such exception must be agreed and confirmed in writing.", keywords: ["deposit", "50%", "down payment", "secure booking", "balance", "payment terms"] },
      { q: "What is your cancellation policy?", a: "Bookings may be cancelled within 72 hours of the booking being confirmed.\n\nOnce the 72-hour cancellation period has passed, the booking becomes fully non-refundable, and any payments or deposits made will not be refunded.\n\nThis policy applies because SVRM Group may reserve vehicles, accommodation, chauffeurs, personnel, guides, suppliers and other services specifically for your booking.", keywords: ["cancellation policy", "72 hours", "non-refundable", "cancel", "refund", "forfeit"] },
      { q: "Are refunds subject to payment fees?", a: "Yes. Where a refund is approved, the refund will be issued less the payment processing fees originally charged to SVRM Group when receiving the payment.\n\nSVRM Group's payment processing fees are typically approximately 5% of the transaction amount, depending on the payment method and payment provider.\n\nThese fees are deducted because they are costs incurred by SVRM Group when processing the original payment and are generally non-refundable to SVRM Group.", keywords: ["refund", "payment fees", "5%", "processing fee", "money back", "deduction"] },
      { q: "Can I make a special arrangement with SVRM?", a: "Yes. SVRM Group may, at its discretion, agree to special arrangements regarding a booking, including payment terms, deposits, services, vehicles, timings or other requirements.\n\nAny special arrangement or amendment must be agreed in writing by SVRM Group.", keywords: ["special arrangement", "exception", "amendment", "change booking", "written agreement"] },
      { q: "Do WhatsApp messages, emails and other written communications form part of my booking?", a: "Yes. Written communications relating to your booking may form part of the official booking record and may be relied upon as evidence of the terms, instructions, arrangements or agreements made between you and SVRM Group.\n\nThis includes, but is not limited to:\n\n• WhatsApp messages\n• Email correspondence\n• SMS or text messages\n• Written booking confirmations\n• Written quotations\n• Payment correspondence\n• Written confirmations of amendments or special arrangements\n\nAny amendment, variation or special agreement confirmed in writing between the client and SVRM Group may form part of the booking terms.\n\nWhere a specific written agreement for a particular booking differs from the standard SVRM Group policy, the specific written agreement may take precedence for that booking.\n\nClients should retain copies of their booking communications and confirmations.", keywords: ["written communications", "whatsapp", "email", "sms", "booking record", "evidence", "terms", "quotation", "confirmation"] },
      { q: "Can SVRM make exceptions to the cancellation policy?", a: "SVRM Group may, at its sole discretion, make exceptions to the standard cancellation or payment policy in exceptional circumstances.\n\nAny exception is discretionary and does not create an obligation or precedent for future bookings.", keywords: ["exception", "cancellation exception", "discretion", "precedent", "special case"] },
      { q: "What happens if SVRM has to cancel my booking?", a: "In the unlikely event that SVRM Group has to cancel a booking, SVRM Group will work with the client to provide an appropriate alternative or refund, subject to the circumstances and any applicable third-party supplier terms.", keywords: ["svrm cancel", "we cancel", "alternative", "refund", "supplier terms"] },
      { q: "By making a booking, do I accept these terms?", a: "Yes. By making a booking, paying a deposit, or otherwise confirming services with SVRM Group, the client acknowledges that they have read, understood and accepted the SVRM Group Cancellation & Deposit Policy, including the provisions relating to deposits, cancellations, payment processing fees, written communications, amendments and special arrangements.", keywords: ["accept terms", "agreement", "terms and conditions", "deposit policy", "cancellation policy"] },
    ],
  },
];

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqGroups.flatMap((g) =>
    g.items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    }))
  ),
};
