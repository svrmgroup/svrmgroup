import shopping from "@/assets/svc-lifestyle-shopping.jpg";
import chef from "@/assets/svc-lifestyle-chef.jpg";
import wellness from "@/assets/svc-lifestyle-wellness.jpg";
import chauffeur from "@/assets/service-chauffeur.jpg";
import airport from "@/assets/svc-transport-airport.jpg";
import heli from "@/assets/svc-transport-heli.jpg";
import villa from "@/assets/svc-stays-villa.jpg";
import estate from "@/assets/svc-stays-estate.jpg";
import hotel from "@/assets/svc-stays-hotel.jpg";
import wine from "@/assets/svc-exp-wine.jpg";
import yacht from "@/assets/svc-exp-yacht.jpg";
import safari from "@/assets/svc-exp-safari.jpg";

export type CategorySlug = "lifestyle" | "transport" | "stays" | "experiences";

export interface Service {
  slug: string;
  title: string;
  teaser: string;
  description: string;
  included: string[];
  image: string;
}

export interface Category {
  slug: CategorySlug;
  label: string;
  blurb: string;
  services: Service[];
}

export const categories: Category[] = [
  {
    slug: "lifestyle",
    label: "Lifestyle",
    blurb: "The everyday, elevated.",
    services: [
      {
        slug: "personal-shopping",
        title: "Personal Shopping",
        teaser: "Private appointments, curated wardrobes, sourced rarities.",
        description:
          "From a single occasion to a fully curated seasonal wardrobe, our stylists work alongside Cape Town's finest boutiques and international ateliers to source pieces that arrive ready, fitted and unrushed.",
        included: ["Private boutique appointments", "Personal stylist", "In-suite fittings", "Discreet sourcing"],
        image: shopping,
      },
      {
        slug: "private-chef",
        title: "Private Chef",
        teaser: "A menu shaped to your table — wherever it is set.",
        description:
          "A private chef placed for an evening, a weekend, or a stay. Menus are written around your tastes and dietary preferences, sourced from local producers, and served with the discretion of a household team.",
        included: ["Bespoke tasting menus", "Sommelier on request", "Local sourcing", "Full service & cleardown"],
        image: chef,
      },
      {
        slug: "wellness-spa",
        title: "Wellness & Spa",
        teaser: "Treatments brought to you, or doors opened to the city's best.",
        description:
          "In-suite massage, facials, breathwork and recovery — or quiet access to the most considered spas in the city. Programmes designed for arrival, jetlag, performance, or simply rest.",
        included: ["In-residence treatments", "Spa access", "Wellness itineraries", "Recovery & breathwork"],
        image: wellness,
      },
    ],
  },
  {
    slug: "transport",
    label: "Transport",
    blurb: "Arrive without thinking about it.",
    services: [
      {
        slug: "chauffeur",
        title: "Chauffeur",
        teaser: "Discreet, on-demand transport in considered vehicles.",
        description:
          "A vetted chauffeur and a quiet vehicle, available by the hour, the day, or the length of your stay. For meetings, dinners, vineyards, or a route you'd rather not think about.",
        included: ["Hourly or daily hire", "Vetted English-speaking drivers", "Multiple vehicle classes", "Route planning"],
        image: chauffeur,
      },
      {
        slug: "airport-transfers",
        title: "Airport Transfers",
        teaser: "Met at the door, on either side of the flight.",
        description:
          "A meet-and-greet inside the terminal, baggage handled, and a private transfer to your residence — domestic, international or private terminal. The same care, in reverse, for departure.",
        included: ["Terminal meet-and-greet", "Baggage assistance", "Flight tracking", "Fast-track on request"],
        image: airport,
      },
      {
        slug: "helicopter-charter",
        title: "Helicopter & Charter",
        teaser: "From the V&A to the Winelands in twelve minutes.",
        description:
          "Helicopter transfers, scenic flights and private jet charter — arranged through trusted operators with the routing, briefing and ground transport coordinated end to end.",
        included: ["Helicopter transfers", "Scenic flights", "Private jet charter", "Ground coordination"],
        image: heli,
      },
    ],
  },
  {
    slug: "stays",
    label: "Stays",
    blurb: "Selected, not searched.",
    services: [
      {
        slug: "boutique-villas",
        title: "Boutique Villas",
        teaser: "Private villas with views and a key at the door.",
        description:
          "A short, considered list of villas in Camps Bay, Bantry Bay, Clifton and Constantia. Each one walked, vetted and matched to how you actually intend to use it.",
        included: ["Private villas", "Housekeeping", "Concierge on call", "Pre-arrival provisioning"],
        image: villa,
      },
      {
        slug: "private-estates",
        title: "Private Estates",
        teaser: "Wine estates and country residences, taken in full.",
        description:
          "Whole-estate stays in the Winelands and beyond — for families, milestone gatherings, or simply a quieter base. Staff, transport and dining arranged around the house.",
        included: ["Whole-estate exclusivity", "Resident staff", "Private dining", "Activities curated"],
        image: estate,
      },
      {
        slug: "signature-hotels",
        title: "Signature Hotels",
        teaser: "Direct access, the right room, recognised at arrival.",
        description:
          "Preferred-partner rates and amenities at the city's leading hotels — with the right room, the right floor, and a quiet word ahead of you on arrival.",
        included: ["Preferred rates", "Room upgrades", "VIP recognition", "Full pre-arrival brief"],
        image: hotel,
      },
    ],
  },
  {
    slug: "experiences",
    label: "Experiences",
    blurb: "The reason you came.",
    services: [
      {
        slug: "wine-routes",
        title: "Wine Routes",
        teaser: "Private cellars, owners' tables, the lists you don't see.",
        description:
          "A day or two through Stellenbosch, Franschhoek and Constantia — built around the estates worth your time, with private tastings, owner introductions and lunch already on the table.",
        included: ["Private tastings", "Owner introductions", "Cellar visits", "Lunch arranged"],
        image: wine,
      },
      {
        slug: "yacht-days",
        title: "Yacht Days",
        teaser: "A day on the water with Table Mountain at your back.",
        description:
          "Skippered yacht and catamaran charters from the V&A — sunset, lunch, or full-day along the Atlantic seaboard. Catering, water toys and onboard service to your brief.",
        included: ["Skippered charter", "Catering on board", "Water toys", "Sunset or full day"],
        image: yacht,
      },
      {
        slug: "safari-add-ons",
        title: "Safari Add-ons",
        teaser: "Two nights in the bush, stitched seamlessly to your stay.",
        description:
          "Short, premium safari extensions to your Cape Town trip — Sabi Sand, Madikwe, Kruger private concessions — with flights, transfers and lodge selection handled end to end.",
        included: ["Lodge selection", "Internal flights", "Private transfers", "Full itinerary"],
        image: safari,
      },
    ],
  },
];

export const findCategory = (slug: string) =>
  categories.find((c) => c.slug === slug);

export const findService = (categorySlug: string, serviceSlug: string) => {
  const category = findCategory(categorySlug);
  if (!category) return null;
  const service = category.services.find((s) => s.slug === serviceSlug);
  if (!service) return null;
  return { category, service };
};
