import { findTour, tours, type TourCategory, type TourPackage } from "@/data/tours";

export const tourPackageSlug = (pkg: TourPackage) => pkg.title
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/&/g, " and ")
  .replace(/[’']/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

export const tourPackagePath = (tour: TourCategory, pkg: TourPackage) =>
  `/tours/${tour.slug}/packages/${tourPackageSlug(pkg)}`;

export const tourPackagePhotoKey = (tour: TourCategory, pkg: TourPackage) =>
  `package:${tour.slug}:${tourPackageSlug(pkg)}`;

export const findTourPackage = (categorySlug?: string, packageSlug?: string) => {
  const tour = findTour(categorySlug ?? "");
  const pkg = tour?.packages.find((item) => tourPackageSlug(item) === packageSlug);
  return tour && pkg ? { tour, pkg } : undefined;
};

const DESCRIPTIONS: Record<string, string> = {
  "bo-kaap-cooking-tour:bo-kaap-cultural-and-cooking-experience": "Spend a relaxed half-day discovering Bo-Kaap through its streets, spices and home cooking. Walk with a local host, learn the blends behind Cape Malay dishes, then prepare and share a meal in a family home, with private chauffeur transport throughout.",
  "bo-kaap-cooking-tour:bo-kaap-and-cape-town-heritage-day": "Combine a Bo-Kaap cooking experience with a wider exploration of Cape Town’s heritage. Your private chauffeur connects the neighbourhood walk and cooking class with the Company’s Garden, Castle of Good Hope and other city landmarks at a comfortable pace.",
  "cape-peninsula:cape-peninsula-private-tour": "Travel around the Peninsula in a private luxury sedan or SUV with your own chauffeur. This full-day journey links the Atlantic Seaboard, Hout Bay, Chapman’s Peak, Cape Point and Boulders Beach, with time to enjoy each stop rather than follow a group timetable.",
  "cape-peninsula:cape-peninsula-maybach-signature": "Experience the complete Peninsula route from the quiet rear seat of a Mercedes-Maybach S-Class. Your chauffeur shapes the day around your preferred stops and pace, while refreshments, entry arrangements, a lunch reservation and concierge support are coordinated for you.",
  "cape-peninsula:peninsula-and-winelands": "Take two unhurried days to see two distinct sides of the Cape. Day one follows the Peninsula’s coastal landmarks; day two continues to selected Winelands estates and tastings, with the same private chauffeur service and restaurant arrangements throughout.",
  "safari:kruger-essentials": "A concise three-day Kruger escape built around two nights at a luxury lodge and twice-daily game drives. Meals and private transfers are included, leaving you free to focus on the bush, guiding and time between drives.",
  "safari:sabi-sand-signature": "Settle into four nights at a premium Sabi Sand lodge with twice-daily game drives in one of South Africa’s celebrated wildlife regions. Meals, house drinks and internal flights are coordinated as one seamless five-day itinerary.",
  "safari:madikwe-and-kruger": "Contrast Madikwe and Kruger on a seven-day, two-lodge safari with a private guide and vehicle. Flights, transfers, accommodation and spa time are arranged together so the journey between reserves feels as considered as the game viewing.",
  "safari:bespoke-grand-safari": "A fully tailored two-week safari for travellers who want to combine regions, private villa stays and exceptional guiding. Your concierge builds the route around your interests, with options such as helicopter transfers and other privately arranged experiences.",
  "hunting:5-star-plains-game-package": "A seven-day conducted plains-game itinerary with five-star lodge accommodation, a professional hunter and tracker. Trophy fees, preparation and the practical arrangements are addressed within one coordinated package for the hunter.",
  "cultural:cape-heritage": "Explore Cape Town’s layered history over three days, from Robben Island and Table Mountain to District Six and the city’s historic streets. A private guide and boutique stay give you context, comfort and time for questions.",
  "cultural:cape-and-national-parks": "Pair Cape Town’s heritage with its remarkable protected landscapes on a five-day private itinerary. City history, Cape Point, Boulders Beach and national-park visits are connected by arranged transfers and a measured daily pace.",
  "cultural:heritage-grand-tour": "Follow a seven-day cultural journey from Cape Town into the Garden Route. Museums, heritage sites and regional stories are brought together by a private historian guide, with premium accommodation and transport arranged throughout.",
  "adventure:cape-adventure-short": "Fit two very different Cape adventures into a polished three-day escape. A scenic helicopter flight and shark-cage diving provide the adrenaline, while boutique accommodation and private transfers keep the logistics straightforward.",
  "adventure:cape-and-bush": "Combine Cape adventure with a luxury safari over five days. Helicopter sightseeing, game drives, internal flights and hand-picked lodging are sequenced into one itinerary rather than booked as disconnected activities.",
  "adventure:land-sea-and-sky": "A seven-day journey built around contrasting perspectives: helicopter, yacht, safari and a horseback trail. Private guides and premium accommodation connect each experience, with enough structure to keep the week effortless.",
  "marine:boulders-penguins-and-cape-point": "Meet the African penguins at Boulders Beach and continue to Cape Point on a private coastal day out. Chauffeur transport, Boulders entry, the Cape Point funicular and a picnic lunch are brought together in one easy arrangement.",
  "marine:hermanus-whale-weekend": "Spend two days on the Whale Coast with boat-based whale watching, a coastal cliff walk and a night in a boutique property. Transfers from Cape Town and between activities are arranged for you; sightings remain subject to nature and season.",
  "marine:marine-grand-circuit": "A three-day marine itinerary combining whale watching, shark-cage diving and seal snorkelling with two nights of luxury accommodation. A private guide coordinates the ocean experiences and overland travel, subject to conditions and seasonal availability.",
  "garden-route:garden-route-essentials": "Travel from Cape Town into the Garden Route over four days with either a private chauffeur or a rental car. Boutique stays, Tsitsikamma’s suspension bridge and a Knysna lagoon cruise provide a balanced introduction to the coast and forest.",
  "garden-route:coast-and-forest-signature": "Slow down for six days along the Garden Route, with additional time for Robberg’s coastal trails and Plettenberg Bay’s beaches. Meals, transfers and an extended route are arranged so you can enjoy both forest and shoreline without rushing.",
  "garden-route:cape-to-addo-grand-tour": "Link the Garden Route with Addo Elephant Park on a privately guided ten-day journey. Premium lodging, a dedicated vehicle and a tailored sequence of coastal, forest and wildlife stops create one continuous Cape-to-Addo experience.",
  "aerial:atlantic-seaboard-heli-flip": "See Camps Bay and the Twelve Apostles from above on a 30-minute helicopter flight departing from the V&A Waterfront. Private transfers connect your accommodation with the departure point for a compact, memorable scenic experience.",
  "aerial:two-oceans-aerial-tour": "Take in Cape Point, the Cape of Good Hope, Hout Bay and Chapman’s Peak on a 45-minute aerial journey. Pilot narration adds context to the coastline below, while private transfers make the flight easy to fit into your day.",
  "aerial:sunrise-hot-air-balloon": "Begin before dawn for a peaceful hot-air balloon flight above the Winelands. Private pickup, a light breakfast after landing and an optional photographer turn the early start into a carefully arranged half-day experience.",
  "culinary:bo-kaap-cooking-class": "Learn Cape Malay cooking in Bo-Kaap during a private half-day class, then share the dishes you have prepared. A heritage walk and private transfers add neighbourhood context and make the experience easy to reach.",
  "culinary:markets-coffee-and-spice": "Taste your way through Cape Town’s artisan food culture with two market visits, a specialty coffee roastery and a spice-focused walking route. A private guide shapes the day around quality producers rather than a fixed group schedule.",
  "culinary:cape-culinary-signature": "Spend three days exploring the Cape through cooking, markets, tea and chef-led tastings. Two nights in boutique accommodation are included, creating a relaxed culinary break with time to enjoy each experience properly.",
  "wellness:spa-day-signature": "Set aside a full day for restorative spa time, two treatments and a healthy lunch. Private transfers remove the driving, making this a simple way to add genuine rest to a Cape Town stay.",
  "wellness:mountain-wellness-retreat": "Reconnect with a quieter rhythm during two nights at a mountain wellness lodge. Daily yoga and meditation, two spa treatments and plant-based dining create a structured but unhurried three-day retreat.",
  "wellness:cederberg-hot-springs": "Spend five days among the Cederberg’s dramatic landscapes with hot mineral spring soaks, guided hikes and stargazing. Four nights at a boutique lodge and the listed wellness experiences are arranged as one restorative escape.",
  "photography:sunrise-lions-head-shoot": "Climb Lion’s Head before dawn with a photographer mentor and shoot as the city wakes below you. Coffee on the summit and delivered edits complete a private half-day designed around light, guidance and your own skill level.",
  "photography:cape-town-in-a-day": "Photograph Bo-Kaap, the V&A Waterfront and Sea Point before finishing with sunset at Signal Hill. A private photographer guide helps with locations and technique, followed by a curated set of edits from your day.",
  "photography:cape-photographic-signature": "Build a varied Cape portfolio over three days, from city colour to Cape Point and Boulders Beach. Sunrise and sunset sessions, private guiding, transport and boutique accommodation give you time to work in changing light.",
  "group-travel:city-group-transfer": "Move your group comfortably around Cape Town for up to five hours in a 16- or 22-seater vehicle. A chauffeur, fuel and bottled water are included, making this suitable for event shuttles, airport movements or a short city programme.",
  "group-travel:cape-peninsula-group-tour": "Take a larger party around the Peninsula in a touring vehicle of up to 32 seats. A guide and chauffeur lead the day, with Boulders Beach, Cape Point and lunch arrangements coordinated for the whole group.",
  "group-travel:garden-route-group": "Bring a group through the Garden Route over three days with a luxury touring coach, accommodation, guided stops and meals. Transfers and daily logistics are managed centrally so organisers have one clear point of coordination.",
  "group-travel:weddings-corporate-and-incentive": "Custom transport and guest coordination for weddings, corporate retreats and incentive travel. Multi-vehicle fleets, airport meet-and-greet and an on-the-ground coordinator can be combined around your schedule and group size.",
  "romantic:the-proposal": "Create a private proposal setting at a beach, vineyard or villa with considered floral styling and a photographer ready for the moment. A chauffeur and concierge coordinate the details discreetly so your attention stays on the occasion.",
  "romantic:anniversary-escape": "Celebrate with a night in a boutique suite, fresh flowers, a rose-petal turndown and a candlelit dinner prepared by a private chef. A couples spa treatment and chauffeur service complete this two-day anniversary escape.",
  "romantic:cape-honeymoon-signature": "Begin married life with two nights in a luxury honeymoon suite and a sequence of memorable Cape experiences. A sunrise balloon flight, helicopter beach picnic, fresh flowers and private chauffeur service are arranged around the two of you.",
  "romantic:grand-romantic-tour": "Combine Cape Town, the Winelands and a private safari lodge in a five-day celebration. Ballooning, helicopter and yacht experiences sit alongside private dining, spa time and an optional bespoke jewellery appointment.",
  "romantic:anniversary-grand-celebration": "Mark a major anniversary across ten days in Cape Town, the Winelands, Garden Route and safari country. Private chefs, florists, spa experiences and exceptional excursions are coordinated throughout, with an optional vow-renewal ceremony.",
  "romantic:bespoke-honeymoon-end-to-end": "A fully tailored honeymoon shaped around your preferred places, pace and style of stay. Private villas, dedicated concierge support, chauffeur travel and personal touches such as bespoke jewellery are brought together under one point of contact.",
  "aquila-safari:aquila-big-five-day-safari-morning": "Leave Cape Town at dawn for Aquila’s morning game drive in an open 4x4, followed by buffet lunch at the lodge. Private chauffeur pickup and return make this a straightforward full-day safari without an overnight stay.",
  "aquila-safari:aquila-big-five-safari-midday": "Choose a later start with private late-morning collection from your accommodation and a midday open-vehicle game drive at Aquila. Buffet lunch and the return chauffeur journey are coordinated as one day trip.",
  "aquila-safari:aquila-sunset-safari": "Travel to Aquila in the afternoon for golden-hour and sunset game viewing, followed by dinner at the lodge. Your private chauffeur handles the late-evening return to Cape Town, removing the need to drive after the experience.",
};

export const tourPackageDescription = (tour: TourCategory, pkg: TourPackage) =>
  DESCRIPTIONS[`${tour.slug}:${tourPackageSlug(pkg)}`]
  ?? `${pkg.title} is a ${pkg.duration.toLowerCase()} ${tour.label.toLowerCase()} itinerary arranged by SVRM. ${pkg.inclusions.join("; ")}.`;

export const allTourPackages = () => tours.flatMap((tour) => tour.packages.map((pkg) => ({
  tour,
  pkg,
  slug: tourPackageSlug(pkg),
  path: tourPackagePath(tour, pkg),
  description: tourPackageDescription(tour, pkg),
})));

export const hasAuthoredPackageDescription = (tour: TourCategory, pkg: TourPackage) =>
  Boolean(DESCRIPTIONS[`${tour.slug}:${tourPackageSlug(pkg)}`]);
