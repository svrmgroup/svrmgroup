import safariImg from "@/assets/svc-exp-safari.jpg";
import wineImg from "@/assets/svc-exp-wine.jpg";
import yachtImg from "@/assets/svc-exp-yacht.jpg";
import culturalImg from "@/assets/svc-tours-cultural.jpg";
import adventureImg from "@/assets/svc-tours-adventure.jpg";
import huntingImg from "@/assets/svc-tours-hunting.jpg";
import marineImg from "@/assets/tours/marine.jpg";
import gardenRouteImg from "@/assets/tours/garden-route.jpg";
import aerialImg from "@/assets/tours/aerial.jpg";
import culinaryImg from "@/assets/tours/culinary.jpg";
import wellnessImg from "@/assets/tours/wellness.jpg";
import photographyImg from "@/assets/tours/photography.jpg";
import groupTravelImg from "@/assets/tours/group-travel.jpg";
import romanticImg from "@/assets/tours/romantic.jpg";
import safariVid from "@/assets/videos/tour-safari.mp4.asset.json";
import huntingVid from "@/assets/videos/tour-hunting.mp4.asset.json";
import culturalVid from "@/assets/videos/tour-cultural.mp4.asset.json";
import adventureVid from "@/assets/videos/tour-adventure.mp4.asset.json";
import marineVid from "@/assets/videos/tour-marine.mp4.asset.json";
import gardenRouteVid from "@/assets/videos/tour-garden-route.mp4.asset.json";
import aerialVid from "@/assets/videos/tour-aerial.mp4.asset.json";
import culinaryVid from "@/assets/videos/tour-culinary.mp4.asset.json";
import wellnessVid from "@/assets/videos/tour-wellness.mp4.asset.json";
import photographyVid from "@/assets/videos/tour-photography.mp4.asset.json";

export type TourSlug =
  | "safari"
  | "hunting"
  | "cultural"
  | "adventure"
  | "marine"
  | "garden-route"
  | "aerial"
  | "culinary"
  | "wellness"
  | "photography"
  | "group-travel"
  | "romantic"
  | "builder";

export interface TourPackage {
  duration: string;
  title: string;
  /** ZAR per person. Use null for "On request". */
  fromZAR: number | null;
  inclusions: string[];
}

export interface TourCategory {
  slug: TourSlug;
  label: string;
  blurb: string;
  description: string;
  image: string;
  video?: string;
  packages: TourPackage[];
}

export const tours: TourCategory[] = [
  {
    slug: "safari",
    label: "Safari Experiences",
    blurb: "Big Five, big sky, small footprint.",
    description:
      "Premium safaris in South Africa's most considered private concessions — Sabi Sand, Madikwe, Kruger. Game drives, luxury lodges, internal flights and ground transfers handled end to end.",
    image: safariImg,
    video: safariVid.url,
    packages: [
      { duration: "3 days", title: "Kruger essentials", fromZAR: 19000, inclusions: ["2 nights luxury lodge", "Twice-daily game drives", "All meals", "Private transfers"] },
      { duration: "5 days", title: "Sabi Sand signature", fromZAR: 28000, inclusions: ["4 nights premium lodge", "Twice-daily game drives", "All meals & house drinks", "Internal flights"] },
      { duration: "7 days", title: "Madikwe & Kruger", fromZAR: 55000, inclusions: ["Two-lodge itinerary", "Private guide & vehicle", "All flights & transfers", "Spa treatments"] },
      { duration: "14 days", title: "Bespoke grand safari", fromZAR: null, inclusions: ["Multi-region itinerary", "Private villa stays", "Helicopter add-ons", "Curated, end to end"] },
    ],
  },
  {
    slug: "hunting",
    label: "Hunting Tours",
    blurb: "Five-star plains game, conducted properly.",
    description:
      "Conducted, ethical plains-game hunting in established private reserves. Lodging, professional hunters, trophy preparation and export coordination — handled with the same precision as our safaris.",
    image: huntingImg,
    video: huntingVid.url,
    packages: [
      { duration: "7 days", title: "5-star plains game package", fromZAR: 97000, inclusions: ["Per hunter, all-inclusive", "5-star lodge accommodation", "Professional hunter & tracker", "Trophy fees & preparation"] },
    ],
  },
  {
    slug: "cultural",
    label: "Historical & Cultural",
    blurb: "South Africa, read closely.",
    description:
      "Robben Island, Table Mountain, the District Six Museum, township and heritage walks led by historians — built into measured, comfortable itineraries.",
    image: culturalImg,
    video: culturalVid.url,
    packages: [
      { duration: "3 days", title: "Cape heritage", fromZAR: 28000, inclusions: ["Robben Island & Table Mountain", "District Six & city tour", "Private guide", "Boutique stay"] },
      { duration: "5 days", title: "Cape & national parks", fromZAR: 44000, inclusions: ["Cape Town heritage", "Cape Point & Boulders", "National park visits", "All transfers"] },
      { duration: "7 days", title: "Heritage grand tour", fromZAR: 65000, inclusions: ["Cape Town + Garden Route", "Museums & heritage sites", "Private historian guide", "Premium accommodation"] },
    ],
  },
  {
    slug: "adventure",
    label: "Adventure & Safaris",
    blurb: "The wild, organised.",
    description:
      "Helicopter flips over the Cape Peninsula, Big Five game drives, shark-cage diving in Gansbaai, horseback trails through the Winelands — assembled into balanced multi-day experiences.",
    image: adventureImg,
    video: adventureVid.url,
    packages: [
      { duration: "3 days", title: "Cape adventure short", fromZAR: 33000, inclusions: ["Helicopter scenic flip", "Shark-cage diving", "Boutique accommodation", "All transfers"] },
      { duration: "5 days", title: "Cape & bush", fromZAR: 59000, inclusions: ["Cape adventure + safari", "Helicopter + game drives", "Internal flights", "Luxury lodging"] },
      { duration: "7 days", title: "Land, sea & sky", fromZAR: 89000, inclusions: ["Heli, yacht & safari", "Horseback Winelands trail", "Private guides throughout", "Premium accommodation"] },
    ],
  },
  {
    slug: "marine",
    label: "Marine & Wildlife",
    blurb: "Whales, penguins, and great whites.",
    description:
      "Boat-based whale watching out of Hermanus and Gansbaai (June–November), the African penguin colony at Boulders Beach, shark-cage diving with great whites, and seal snorkelling at Duiker Island — sequenced into measured day trips or multi-day coastal itineraries.",
    image: marineImg,
    video: marineVid.url,
    packages: [
      { duration: "1 day", title: "Boulders penguins & Cape Point", fromZAR: 6500, inclusions: ["Private chauffeur", "Boulders Beach entry", "Cape Point funicular", "Picnic lunch"] },
      { duration: "2 days", title: "Hermanus whale weekend", fromZAR: 18500, inclusions: ["Boat-based whale watching", "Coastal cliff walk", "1 night boutique stay", "All transfers"] },
      { duration: "3 days", title: "Marine grand circuit", fromZAR: 32000, inclusions: ["Whale watching + shark cage diving", "Seal snorkelling at Duiker Island", "2 nights luxury accommodation", "Private guide throughout"] },
    ],
  },
  {
    slug: "garden-route",
    label: "Garden Route Road Trip",
    blurb: "Cape Town to Knysna, taken slowly.",
    description:
      "The classic Garden Route from Cape Town along the southern coast — Mossel Bay, Wilderness, Knysna lagoons, Tsitsikamma forests and suspension bridges, ending at Plettenberg Bay beaches. Private chauffeur or self-drive, with hand-picked boutique stays.",
    image: gardenRouteImg,
    video: gardenRouteVid.url,
    packages: [
      { duration: "4 days", title: "Garden Route essentials", fromZAR: 38000, inclusions: ["Private chauffeur or rental car", "3 nights boutique stays", "Tsitsikamma suspension bridge", "Knysna lagoon cruise"] },
      { duration: "6 days", title: "Coast & forest signature", fromZAR: 62000, inclusions: ["Extended coastal itinerary", "Robberg nature reserve hike", "Plettenberg Bay beach time", "All meals & transfers"] },
      { duration: "10 days", title: "Cape to Addo grand tour", fromZAR: null, inclusions: ["Garden Route + Addo Elephant Park", "Private guide & vehicle", "Premium lodging throughout", "Curated, end to end"] },
    ],
  },
  {
    slug: "aerial",
    label: "Aerial & Scenic Flights",
    blurb: "Cape Town from above.",
    description:
      "Helicopter scenic flips over the Twelve Apostles and Cape Point, tandem paragliding off Signal Hill, and hot-air balloon flights over the Winelands valley floor at sunrise. Short, high-impact experiences slotted into any itinerary.",
    image: aerialImg,
    video: aerialVid.url,
    packages: [
      { duration: "30 min", title: "Atlantic seaboard heli flip", fromZAR: 4500, inclusions: ["Helicopter scenic flight", "Camps Bay & Twelve Apostles", "V&A Waterfront departure", "Private transfers"] },
      { duration: "45 min", title: "Two Oceans aerial tour", fromZAR: 7200, inclusions: ["Cape Point & Cape of Good Hope", "Hout Bay & Chapman's Peak", "Pilot narration", "Private transfers"] },
      { duration: "Half day", title: "Sunrise hot-air balloon", fromZAR: 8900, inclusions: ["Hot-air balloon flight", "Light breakfast on landing", "Private pickup", "Photographer on request"] },
    ],
  },
  {
    slug: "culinary",
    label: "Culinary Experiences",
    blurb: "Cape flavours, no alcohol required.",
    description:
      "Cape Malay cooking classes in Bo-Kaap, private chef-led market walks through Neighbourgoods and Oranjezicht, specialty coffee roastery tours, biltong & dried-fruit tastings, and tea ceremonies at heritage estates — all alcohol-free.",
    image: culinaryImg,
    video: culinaryVid.url,
    packages: [
      { duration: "Half day", title: "Bo-Kaap cooking class", fromZAR: 3200, inclusions: ["Private Cape Malay cooking class", "Heritage walk through Bo-Kaap", "Shared lunch", "Private transfers"] },
      { duration: "1 day", title: "Markets, coffee & spice", fromZAR: 5800, inclusions: ["Two artisan markets", "Specialty coffee roastery", "Spice route walking tour", "Private guide"] },
      { duration: "3 days", title: "Cape culinary signature", fromZAR: 22000, inclusions: ["Cooking class + market tours", "Heritage tea ceremony", "Chef-led tastings", "2 nights boutique accommodation"] },
    ],
  },
  {
    slug: "wellness",
    label: "Wellness & Retreat",
    blurb: "Reset, in serious quiet.",
    description:
      "Sunrise yoga on Camps Bay deck, hot mineral spring soaks in the Cederberg, forest bathing in Tsitsikamma, and full spa days at the Cape's leading wellness sanctuaries. Built for travellers who want to come home better than they arrived.",
    image: wellnessImg,
    video: wellnessVid.url,
    packages: [
      { duration: "1 day", title: "Spa day signature", fromZAR: 5500, inclusions: ["Full-day spa access", "Two treatments", "Healthy lunch", "Private transfers"] },
      { duration: "3 days", title: "Mountain wellness retreat", fromZAR: 28000, inclusions: ["2 nights wellness lodge", "Daily yoga & meditation", "Two spa treatments", "Plant-based dining"] },
      { duration: "5 days", title: "Cederberg hot springs", fromZAR: 46000, inclusions: ["Hot mineral spring soaks", "Guided hikes & stargazing", "4 nights boutique lodge", "All wellness inclusions"] },
    ],
  },
  {
    slug: "photography",
    label: "Photography Tours",
    blurb: "Sunrise on Lion's Head, with a guide.",
    description:
      "Led by a working Cape Town photographer — pre-dawn shoots on Lion's Head, blue-hour at the V&A Waterfront, Bo-Kaap colour studies, Cape Point lighthouses and Boulders penguins. Suits both phone shooters and full-frame travellers.",
    image: photographyImg,
    video: photographyVid.url,
    packages: [
      { duration: "Half day", title: "Sunrise Lion's Head shoot", fromZAR: 3800, inclusions: ["Pre-dawn private hike", "Photographer mentor", "Coffee on summit", "Edits delivered"] },
      { duration: "1 day", title: "Cape Town in a day", fromZAR: 6800, inclusions: ["Bo-Kaap, V&A, Sea Point", "Sunset at Signal Hill", "Private photographer guide", "Curated edits"] },
      { duration: "3 days", title: "Cape photographic signature", fromZAR: 28000, inclusions: ["City + Cape Point + Boulders", "Sunrise & sunset shoots", "Private guide & transport", "Boutique accommodation"] },
    ],
  },
  {
    slug: "group-travel",
    label: "Group Travel",
    blurb: "Bigger parties, same standard.",
    description:
      "Curated group tours for weddings, corporate retreats, incentive trips, school groups and family reunions — 16-seater Sprinters, 22 & 32-seater touring buses, and full luxury coaches. Routes built around your dates, with chauffeurs, guides and stays sequenced end to end.",
    image: groupTravelImg,
    video: culturalVid.url,
    packages: [
      { duration: "Half day", title: "City group transfer", fromZAR: 6500, inclusions: ["16 or 22-seater bus", "Chauffeur & fuel", "Bottled water onboard", "Up to 5 hours"] },
      { duration: "1 day", title: "Cape Peninsula group tour", fromZAR: 14500, inclusions: ["Up to 32-seater bus", "Guide + chauffeur", "Boulders & Cape Point", "Lunch arranged"] },
      { duration: "3 days", title: "Garden Route group", fromZAR: 65000, inclusions: ["Luxury touring coach", "All accommodation", "Guided stops & meals", "All transfers"] },
      { duration: "Custom", title: "Weddings, corporate & incentive", fromZAR: null, inclusions: ["Multi-vehicle fleets", "Airport meet & greet", "Hostess & coordinator", "Curated, end to end"] },
    ],
  },
  {
    slug: "romantic",
    label: "Romantic Packages",
    blurb: "Proposals, honeymoons and quiet celebrations.",
    description:
      "Curated romance across the Cape — surprise proposals, honeymoons, anniversaries and vow renewals. Rose-petal turndowns and bespoke bouquets on the bed, private florists, fine jewellery sourcing with a trusted Cape Town atelier, sunrise hot-air balloon flights over the Winelands, helicopter picnics on secluded beaches, and candlelit private-chef dinners at your villa. Every detail arranged discreetly, end to end.",
    image: romanticImg,
    packages: [
      {
        duration: "Half day",
        title: "The Proposal",
        fromZAR: 12500,
        inclusions: [
          "Private venue styling (beach, vineyard or villa)",
          "Signature bouquet & rose-petal setup on the bed",
          "Photographer to capture the moment",
          "Private chauffeur & 24/7 concierge",
        ],
      },
      {
        duration: "2 days",
        title: "Anniversary escape",
        fromZAR: 24000,
        inclusions: [
          "1 night in a boutique suite with sea or vineyard view",
          "Rose-petal turndown & fresh floral arrangement",
          "Private candlelit chef's dinner",
          "Couples spa treatment",
          "Private chauffeur & 24/7 concierge",
        ],
      },
      {
        duration: "3 days",
        title: "Cape honeymoon signature",
        fromZAR: 48000,
        inclusions: [
          "2 nights in a luxury honeymoon suite",
          "Sunrise hot-air balloon over the Winelands",
          "Private helicopter beach picnic",
          "Daily florist-fresh bouquets & petal turndown",
          "Private chauffeur & 24/7 concierge",
        ],
      },
      {
        duration: "5 days",
        title: "Grand romantic tour",
        fromZAR: 92000,
        inclusions: [
          "Cape Town + Winelands + private safari lodge",
          "Hot-air balloon, helicopter & yacht sunset cruise",
          "Private jewellery atelier appointment (rings & bespoke pieces)",
          "Chef-led candlelit dinners & couples spa daily",
          "Private chauffeur & 24/7 concierge",
        ],
      },
      {
        duration: "10 days",
        title: "Anniversary grand celebration",
        fromZAR: 178000,
        inclusions: [
          "Cape Town, Winelands, Garden Route & private safari lodge",
          "Hot-air balloon at sunrise + helicopter beach picnic",
          "Private yacht sunset cruise with chef & florist",
          "Bespoke jewellery atelier appointment & anniversary gift commission",
          "Daily rose-petal turndown & fresh bouquets in every suite",
          "Couples spa treatments & candlelit chef dinners throughout",
          "Vow renewal ceremony option with private officiant & photographer",
          "Private chauffeur & 24/7 concierge, dedicated to you end to end",
        ],
      },
      {
        duration: "7+ days",
        title: "Bespoke honeymoon, end to end",
        fromZAR: null,
        inclusions: [
          "Multi-region itinerary curated around you",
          "Private villa stays with dedicated concierge",
          "Fine jewellery sourcing & bespoke commissions",
          "Private chauffeur & 24/7 concierge",
          "Everything discreet, seamless, one point of contact",
        ],
      },
    ],
  },
];

export const findTour = (slug: string) => tours.find((t) => t.slug === slug);

// Lifestyle (yachting) — used on /lifestyle
export const lifestyleHero = yachtImg;
export const lifestyleWine = wineImg;
