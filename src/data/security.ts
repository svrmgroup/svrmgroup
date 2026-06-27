import bmw7 from "@/assets/security/bmw7-armored.jpg";
import bmwx5 from "@/assets/security/bmwx5-armored.jpg";
import g63 from "@/assets/security/g63-armored.jpg";
import cp from "@/assets/security/close-protection.jpg";
import residential from "@/assets/security/residential.jpg";
import event from "@/assets/security/event.jpg";

export type SecurityCategory = "Armoured Transport" | "Close Protection" | "Residential" | "Events";

export interface SecurityOffering {
  slug: string;
  name: string;
  category: SecurityCategory;
  tagline: string;
  image: string;
  highlights: string[];
}

export const securityOfferings: SecurityOffering[] = [
  {
    slug: "armoured-bmw-7-series",
    name: "Armoured BMW 7 Series",
    category: "Armoured Transport",
    tagline: "Discreet executive sedan, ballistic-rated.",
    image: bmw7,
    highlights: ["B4/B6 ballistic rating", "Vetted chauffeur", "Run-flat tyres", "Secure routing"],
  },
  {
    slug: "armoured-bmw-x5",
    name: "Armoured BMW X5 + Armed Detail",
    category: "Armoured Transport",
    tagline: "Family-sized SUV with on-board protection officers.",
    image: bmwx5,
    highlights: ["Armed PSD on board", "Reinforced glass & body", "Counter-surveillance route", "Up to 4 principals"],
  },
  {
    slug: "armoured-g63-convoy",
    name: "Armoured G63 Convoy",
    category: "Armoured Transport",
    tagline: "Multi-vehicle motorcade with lead & follow.",
    image: g63,
    highlights: ["Lead / principal / follow vehicles", "Tactical team coordination", "Comms & live tracking", "Airport-to-villa"],
  },
  {
    slug: "close-protection-officer",
    name: "Close Protection Officer",
    category: "Close Protection",
    tagline: "Vetted, suited, discreet — solo or team.",
    image: cp,
    highlights: ["PSiRA-registered", "Plain clothes or visible", "Travel & hotel cover", "24/7 on-call"],
  },
  {
    slug: "residential-security",
    name: "Residential Security",
    category: "Residential",
    tagline: "Armed guarding for villas and estates.",
    image: residential,
    highlights: ["Static armed guards", "Roving patrols", "Alarm & CCTV response", "Estate access control"],
  },
  {
    slug: "event-security",
    name: "Event & VIP Security",
    category: "Events",
    tagline: "Red-carpet, private function and corporate cover.",
    image: event,
    highlights: ["Access screening", "VIP escorting", "Plain-clothes detail", "Liaison with venue"],
  },
];

export const securityCategories: SecurityCategory[] = [
  "Armoured Transport",
  "Close Protection",
  "Residential",
  "Events",
];
