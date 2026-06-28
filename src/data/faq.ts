export type FaqItem = { q: string; a: string };
export type FaqGroup = { id: string; title: string; items: FaqItem[] };

export const faqGroups: FaqGroup[] = [
  {
    id: "general",
    title: "About SVRM",
    items: [
      { q: "What is SVRM?", a: "SVRM is a Cape Town–based luxury lifestyle management and concierge service. We curate transport, tours, stays, security and bespoke experiences for private clients and businesses — locally and across South Africa." },
      { q: "Where are you based and where do you operate?", a: "We are headquartered in Cape Town. Our chauffeured travel, tours, security and stays operate across the Western Cape as standard, and nationally on request. International planning and onward arrangements can be coordinated through our partner network." },
      { q: "Do you work with businesses as well as private clients?", a: "Yes. We support corporate visits, executive transport, roadshows, conference logistics, group travel, private events and ongoing retainers. Speak to the concierge for a tailored proposal." },
      { q: "Is SVRM discreet? Will my booking be private?", a: "Discretion is fundamental. Our team is NDA-bound, our vehicles are unbranded, and we do not publish client names, itineraries or images without written consent." },
    ],
  },
  {
    id: "booking",
    title: "Booking & Pricing",
    items: [
      { q: "How do I make a booking?", a: "The quickest route is WhatsApp on +27 73 064 1481. You can also email concierge@svrm.group or use the enquiry form on this page. We typically reply the same day." },
      { q: "Why don't you publish prices?", a: "Every itinerary is composed for the guest — vehicle, route, wait time, season, party size and discretion all shape the rate. A published number would be wrong for almost everyone, so we send a written quote within 24 hours instead." },
      { q: "Which currencies can I be quoted in?", a: "We quote in ZAR by default and can present the same quote in GBP or USD. The site has a currency switcher in the top navigation." },
      { q: "How do I pay? Is a deposit required?", a: "We accept EFT, card and international wire. A deposit is typically required to confirm; the balance is settled before or on the day of service. Specific terms are on every written quote." },
      { q: "What is your cancellation policy?", a: "Terms are set per booking and clearly stated on the quote. As a general guide, cancellations made well in advance are refundable; short-notice cancellations may be partially or non-refundable, especially for tours, charters and seasonal stays." },
      { q: "How far in advance should I book?", a: "For peak season (December–February and Easter) we recommend 4–8 weeks. Off-peak we can often arrange transport, tours and stays within 24–72 hours." },
    ],
  },
  {
    id: "travel",
    title: "Travel & Chauffeur",
    items: [
      { q: "What does your chauffeured travel include?", a: "A professional, NDA-bound chauffeur, the vehicle of your choice, fuel, tolls, water on board and in-trip support from the concierge. Wait time, child seats and additional stops are arranged on request." },
      { q: "Do you offer airport transfers?", a: "Yes — to and from Cape Town International, private FBOs and regional airports. Flight tracking is standard so we adjust automatically for early or delayed arrivals." },
      { q: "Can I hire a vehicle without a chauffeur?", a: "Yes. Self-drive hire is available through the Rentals page and is priced lower than the chauffeured equivalent. A valid licence, ID/passport and a refundable deposit are required." },
      { q: "Do you offer private jets, helicopters or yachts?", a: "Yes — through trusted partners. We arrange private jet charter, scenic and transfer helicopters, and motor or sailing yachts from the V&A Waterfront. See the Travel page categories." },
      { q: "Do you offer group transport?", a: "Yes. 16-seater Sprinters, 22-seater midibuses, 32-seater touring buses and full luxury coaches for weddings, corporate groups and tours." },
    ],
  },
  {
    id: "tours",
    title: "Tours & Experiences",
    items: [
      { q: "What kinds of tours do you offer?", a: "Safari, marine and wildlife, Garden Route road trips, aerial and scenic flights, culinary experiences, wellness retreats, photography tours, cultural and adventure days, and fully custom itineraries." },
      { q: "Are your tours private?", a: "Yes — every SVRM tour is private to your party. We do not run shared or group-with-strangers tours." },
      { q: "Can you build a custom itinerary?", a: "Yes. Use the Tour Builder on the Tours page or message the concierge with dates, party size and the feeling you want from the trip. We return a first sketch within a day." },
      { q: "Do you offer wine tours?", a: "No. We do not offer alcohol-led tours. We do offer culinary experiences, vineyard landscapes and Cape Winelands scenery where alcohol is not the focus." },
    ],
  },
  {
    id: "stays",
    title: "Stays & Property",
    items: [
      { q: "What types of stays do you arrange?", a: "Private villas, serviced apartments, boutique hotels and long-term residences across Cape Town and the Cape Peninsula. Short-term, long-term and seasonal options are all available." },
      { q: "Can you find a stay that fits my specific budget?", a: "Yes. Use the Custom Stay bar on the Stays page — tell us dates, party, neighbourhood and budget, and we return a curated shortlist." },
      { q: "Do you help with buying or selling property?", a: "Yes. We facilitate residential sales, off-market introductions and long-term lease negotiations in partnership with vetted Cape Town agents." },
      { q: "Can I add a chef, housekeeper or chauffeur to my stay?", a: "Yes — see the Stay Extras options. Private chefs, housekeeping, in-residence trainers, chauffeurs on call and security can all be arranged." },
    ],
  },
  {
    id: "security",
    title: "Security",
    items: [
      { q: "What security services do you offer?", a: "Armoured vehicle transport (BMW 7 Series, X5, Mercedes G63), armed and unarmed close protection, residential security, event security and secure airport transfers." },
      { q: "Is your security team licensed?", a: "Yes — our protection partners operate under PSiRA-registered firms with vetted personnel. Specifics for any deployment are confirmed in writing before service." },
      { q: "Can security be added to any booking?", a: "Yes. Close protection, secure transport and venue advance work can be layered onto any travel, tour, stay or event." },
    ],
  },
  {
    id: "scope",
    title: "What we don't offer",
    items: [
      { q: "Is there anything SVRM won't arrange?", a: "We do not arrange anything illegal, unsafe or in conflict with the wellbeing of guests, staff or wildlife. We do not run alcohol-led tours, we do not work with unlicensed operators, and we do not accept bookings we cannot deliver to our standard." },
      { q: "Do you offer hunting tours?", a: "We facilitate ethical, legally licensed game experiences only. We do not arrange any activity that contravenes South African wildlife or firearms law." },
      { q: "Do you sell tickets to public events?", a: "We don't operate as a ticket agency. We do arrange private access, hospitality and transport around major Cape Town events when capacity allows." },
    ],
  },
  {
    id: "policies",
    title: "Privacy & Data",
    items: [
      { q: "How do you handle my personal information?", a: "We collect only what is needed to deliver the service you have requested — contact details, travel details and any preferences you share. Information is shared with the specific vendors required to deliver your booking, under confidentiality." },
      { q: "Will my booking appear on social media?", a: "No — never without your explicit written consent. Our default is full discretion." },
      { q: "Who do I contact about a data or privacy request?", a: "Email concierge@svrm.group with the subject 'Privacy request' and we will respond within a reasonable period." },
    ],
  },
  {
    id: "hours",
    title: "Hours",
    items: [
      { q: "What are your hours?", a: "Concierge support runs 24/7 seven days a week. Active bookings (transport, security, ongoing itineraries) are supported 24/7 by the on-duty team." },
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
