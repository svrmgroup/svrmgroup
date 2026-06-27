import cullinan from "@/assets/vehicles/cullinan.jpg";
import ghost from "@/assets/vehicles/ghost.jpg";
import g63 from "@/assets/vehicles/g63.jpg";
import bmw7 from "@/assets/vehicles/bmw7.jpg";
import urus from "@/assets/vehicles/urus.jpg";

export interface Vehicle {
  slug: string;
  name: string;
  tagline: string;
  fromZAR: number; // per day
  image: string;
}

export const vehicles: Vehicle[] = [
  {
    slug: "rolls-royce-cullinan",
    name: "Rolls-Royce Cullinan",
    tagline: "The summit of the SVRM fleet.",
    fromZAR: 24500,
    image: cullinan,
  },
  {
    slug: "rolls-royce-ghost",
    name: "Rolls-Royce Ghost",
    tagline: "Silent presence, chauffeured.",
    fromZAR: 22000,
    image: ghost,
  },
  {
    slug: "lamborghini-urus",
    name: "Lamborghini Urus",
    tagline: "Performance, refined.",
    fromZAR: 19500,
    image: urus,
  },
  {
    slug: "mercedes-amg-g63",
    name: "Mercedes-AMG G63",
    tagline: "The icon. Cape Town's roads, conquered.",
    fromZAR: 14500,
    image: g63,
  },
  {
    slug: "bmw-7-series",
    name: "BMW 7 Series",
    tagline: "Executive transfer, understated.",
    fromZAR: 9500,
    image: bmw7,
  },
];
