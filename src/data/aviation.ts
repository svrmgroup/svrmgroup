import jetLight from "@/assets/aviation/jet-light.jpg";
import jetMid from "@/assets/aviation/jet-midsize.jpg";
import jetHeavy from "@/assets/aviation/jet-heavy.jpg";
import heliR44 from "@/assets/aviation/heli-r44.jpg";
import heliAs350 from "@/assets/aviation/heli-as350.jpg";
import heliEc130 from "@/assets/aviation/heli-ec130.jpg";

export interface Aircraft {
  slug: string;
  name: string;
  tagline: string;
  capacity: string;
  image: string;
}

export const jets: Aircraft[] = [
  { slug: "light-jet", name: "Light Jet", tagline: "Short-hop charter — Cape Town to Joburg or the Garden Route.", capacity: "Up to 6 guests · ~3 hr range", image: jetLight },
  { slug: "midsize-jet", name: "Midsize Jet", tagline: "Continental range with a full cabin standing.", capacity: "Up to 8 guests · ~5 hr range", image: jetMid },
  { slug: "heavy-jet", name: "Heavy Jet", tagline: "Intercontinental, bedroom-cabin charter.", capacity: "Up to 14 guests · global range", image: jetHeavy },
];

export const helicopters: Aircraft[] = [
  { slug: "r44", name: "Robinson R44", tagline: "Scenic flips over the Cape Peninsula.", capacity: "3 guests · 30–60 min", image: heliR44 },
  { slug: "as350", name: "Airbus AS350", tagline: "Twelve Apostles, Cape Point, Winelands transfers.", capacity: "5 guests · single-engine", image: heliAs350 },
  { slug: "ec130", name: "Airbus EC130", tagline: "Premium twin-engine — wide-window VIP charter.", capacity: "6 guests · twin-engine", image: heliEc130 },
];
