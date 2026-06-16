import safariImg from "@/assets/svc-exp-safari.jpg";
import wineImg from "@/assets/svc-exp-wine.jpg";
import yachtImg from "@/assets/svc-exp-yacht.jpg";
import culturalImg from "@/assets/svc-tours-cultural.jpg";
import adventureImg from "@/assets/svc-tours-adventure.jpg";
import huntingImg from "@/assets/svc-tours-hunting.jpg";

export type TourSlug = "safari" | "hunting" | "cultural" | "adventure" | "builder";

export interface TourPackage {
  duration: string;
  title: string;
  fromPrice: string;
  inclusions: string[];
}

export interface TourCategory {
  slug: TourSlug;
  label: string;
  blurb: string;
  description: string;
  image: string;
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
    packages: [
      {
        duration: "3 days",
        title: "Kruger essentials",
        fromPrice: "US$1,020",
        inclusions: ["2 nights luxury lodge", "Twice-daily game drives", "All meals", "Private transfers"],
      },
      {
        duration: "5 days",
        title: "Sabi Sand signature",
        fromPrice: "US$1,500",
        inclusions: ["4 nights premium lodge", "Twice-daily game drives", "All meals & house drinks", "Internal flights"],
      },
      {
        duration: "7 days",
        title: "Madikwe & Kruger",
        fromPrice: "US$3,000",
        inclusions: ["Two-lodge itinerary", "Private guide & vehicle", "All flights & transfers", "Spa treatments"],
      },
      {
        duration: "14 days",
        title: "Bespoke grand safari",
        fromPrice: "On request",
        inclusions: ["Multi-region itinerary", "Private villa stays", "Helicopter add-ons", "Curated, end to end"],
      },
    ],
  },
  {
    slug: "hunting",
    label: "Hunting Tours",
    blurb: "Five-star plains game, conducted properly.",
    description:
      "Conducted, ethical plains-game hunting in established private reserves. Lodging, professional hunters, trophy preparation and export coordination — handled with the same precision as our safaris.",
    image: huntingImg,
    packages: [
      {
        duration: "7 days",
        title: "5-star plains game package",
        fromPrice: "US$5,230",
        inclusions: ["Per hunter, all-inclusive", "5-star lodge accommodation", "Professional hunter & tracker", "Trophy fees & preparation"],
      },
    ],
  },
  {
    slug: "cultural",
    label: "Historical & Cultural",
    blurb: "South Africa, read closely.",
    description:
      "Robben Island, Table Mountain, the District Six Museum, township and heritage walks led by historians — built into measured, comfortable itineraries.",
    image: culturalImg,
    packages: [
      {
        duration: "3 days",
        title: "Cape heritage",
        fromPrice: "US$1,500",
        inclusions: ["Robben Island & Table Mountain", "District Six & city tour", "Private guide", "Boutique stay"],
      },
      {
        duration: "5 days",
        title: "Cape & national parks",
        fromPrice: "US$2,400",
        inclusions: ["Cape Town heritage", "Cape Point & Boulders", "National park visits", "All transfers"],
      },
      {
        duration: "7 days",
        title: "Heritage grand tour",
        fromPrice: "US$3,500",
        inclusions: ["Cape Town + Garden Route", "Museums & heritage sites", "Private historian guide", "Premium accommodation"],
      },
    ],
  },
  {
    slug: "adventure",
    label: "Adventure & Safaris",
    blurb: "The wild, organised.",
    description:
      "Helicopter flips over the Cape Peninsula, Big Five game drives, shark-cage diving in Gansbaai, horseback trails through the Winelands — assembled into balanced multi-day experiences.",
    image: adventureImg,
    packages: [
      {
        duration: "3 days",
        title: "Cape adventure short",
        fromPrice: "US$1,800",
        inclusions: ["Helicopter scenic flip", "Shark-cage diving", "Boutique accommodation", "All transfers"],
      },
      {
        duration: "5 days",
        title: "Cape & bush",
        fromPrice: "US$3,200",
        inclusions: ["Cape adventure + safari", "Helicopter + game drives", "Internal flights", "Luxury lodging"],
      },
      {
        duration: "7 days",
        title: "Land, sea & sky",
        fromPrice: "US$4,800",
        inclusions: ["Heli, yacht & safari", "Horseback Winelands trail", "Private guides throughout", "Premium accommodation"],
      },
    ],
  },
];

export const findTour = (slug: string) => tours.find((t) => t.slug === slug);

// Lifestyle (yachting) — used on /lifestyle
export const lifestyleHero = yachtImg;
export const lifestyleWine = wineImg;
