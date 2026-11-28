import bmwx3Extra from "@/assets/vehicles/bmwx3-gallery-4k.jpg.asset.json";
import bmwx5Extra from "@/assets/vehicles/bmwx5-gallery-4k.jpg.asset.json";
import sprinterExtra from "@/assets/vehicles/sprinter-gallery-4k.jpg.asset.json";
import cullinanExtra from "@/assets/vehicles/cullinan-gallery-4k.jpg.asset.json";
import phantomExtra from "@/assets/vehicles/phantom-gallery-4k.jpg.asset.json";
import ghost from "@/assets/vehicles/ghost.jpg";
import phantom from "@/assets/vehicles/phantom-refreshed-4k.jpg.asset.json";
import g63 from "@/assets/vehicles/g63.jpg";
import gls from "@/assets/vehicles/gls.jpg";
import bmw7 from "@/assets/vehicles/bmw7-refreshed-4k.jpg.asset.json";
import urus from "@/assets/vehicles/urus.jpg";
import sclass from "@/assets/vehicles/sclass-svrm.jpg";
import maybach from "@/assets/vehicles/maybach-refreshed-4k.jpg.asset.json";
import vclass from "@/assets/vehicles/vclass.jpg";
import staria from "@/assets/vehicles/staria.jpg";
import rangerover from "@/assets/vehicles/autobiography-refreshed-4k.jpg.asset.json";
import rrsport from "@/assets/vehicles/rrsport-refreshed-4k.jpg.asset.json";
import cayenne from "@/assets/vehicles/cayenne.jpg";
import bentayga from "@/assets/vehicles/bentayga.jpg";
import cclass from "@/assets/vehicles/cclass.jpg";
import audiq5 from "@/assets/vehicles/audiq5.jpg";
import bmw3 from "@/assets/vehicles/bmw3.jpg";
import bmw5 from "@/assets/vehicles/bmw5-refreshed-4k.jpg.asset.json";
import eclass from "@/assets/vehicles/eclass.jpg";
import corolla from "@/assets/vehicles/corolla.jpg";
import polo from "@/assets/vehicles/polo.jpg";
import midibus22 from "@/assets/vehicles/midibus22.jpg";
import bus32 from "@/assets/vehicles/bus32.jpg";
import coach from "@/assets/vehicles/coach.jpg";
import maybachVExterior from "@/assets/vehicles/maybach-vclass-exterior.webp.asset.json";
import maybachVSeating from "@/assets/vehicles/maybach-vclass-seating.webp.asset.json";
import maybachVEntertainment from "@/assets/vehicles/maybach-vclass-entertainment.webp.asset.json";
import maybachVExterior4k from "@/assets/vehicles/maybach-vclass-exterior-4k.jpg.asset.json";
import maybachVSeating4k from "@/assets/vehicles/maybach-vclass-seating-4k.jpg.asset.json";
import maybachVEntertainment4k from "@/assets/vehicles/maybach-vclass-entertainment-4k.jpg.asset.json";
import { PHANTOM_DESCRIPTION } from "@/seo/vehicleServices";

export type VehicleTier = "Signature" | "Premium SUV" | "Executive" | "Everyday" | "Budget" | "Group Travel";

export interface Vehicle {
  slug: string;
  name: string;
  tagline: string;
  /** Chauffeured day rate in ZAR (Travel page). */
  fromZAR: number;
  /** Self-drive day rate in ZAR (Rentals page). Falls back to fromZAR when omitted. */
  rentalZAR?: number;
  image: string;
  gallery?: { src: string; fullSrc: string; alt: string }[];
  tier: VehicleTier;
  selfDrive: boolean;
}

export const vehicles: Vehicle[] = [
  // Signature — flagship first
  { slug: "rolls-royce-phantom", name: "Rolls-Royce Phantom", tagline: PHANTOM_DESCRIPTION, fromZAR: 40000, image: phantom.url, tier: "Signature", selfDrive: false, gallery: [{ src: phantom.url, fullSrc: phantom.url, alt: "Current exterior photo" }, { src: phantomExtra.url, fullSrc: phantomExtra.url, alt: "Cream leather cabin with coach doors open" }] },
  { slug: "mercedes-maybach-s-class", name: "Mercedes-Maybach S-Class", tagline: "Quiet luxury, generous rear-seat comfort and time to unwind — arrive refreshed with your private chauffeur.", fromZAR: 22000, image: maybach.url, tier: "Signature", selfDrive: false },
  { slug: "maybach-v-class", name: "Maybach V-Class", tagline: "Your private lounge across Cape Town — unwind in reclining massage seats, enjoy onboard TV and travel in quilted-leather comfort with your own chauffeur.", fromZAR: 20000, image: maybachVExterior.url, tier: "Signature", selfDrive: false,
    gallery: [
      { src: maybachVExterior.url, fullSrc: maybachVExterior4k.url, alt: "Two-tone exterior with SVRM number plate" },
      { src: maybachVSeating.url, fullSrc: maybachVSeating4k.url, alt: "Quilted leather reclining massage seats" },
      { src: maybachVEntertainment.url, fullSrc: maybachVEntertainment4k.url, alt: "Onboard TV in the private chauffeur lounge" },
    ],
  },
  { slug: "rolls-royce-cullinan", name: "Rolls-Royce Cullinan", tagline: "The summit of the SVRM fleet.", fromZAR: 45000, image: cullinanExtra.url, tier: "Signature", selfDrive: false },
  { slug: "rolls-royce-ghost", name: "Rolls-Royce Ghost", tagline: "Silent presence, chauffeured.", fromZAR: 30000, image: ghost, tier: "Signature", selfDrive: false },
  { slug: "bentley-bentayga", name: "Bentley Bentayga", tagline: "British craft, African horizon.", fromZAR: 25000, rentalZAR: 18500, image: bentayga, tier: "Signature", selfDrive: true },
  { slug: "lamborghini-urus", name: "Lamborghini Urus", tagline: "Performance, refined.", fromZAR: 37500, rentalZAR: 20500, image: urus, tier: "Signature", selfDrive: true },

  // Premium SUV
  { slug: "mercedes-amg-g63", name: "Mercedes-AMG G63", tagline: "The icon. Cape Town's roads, conquered.", fromZAR: 18000, rentalZAR: 16500, image: g63, tier: "Premium SUV", selfDrive: true },
  { slug: "range-rover-autobiography", name: "Range Rover Autobiography", tagline: "Quiet authority, every terrain.", fromZAR: 20000, rentalZAR: 15500, image: rangerover.url, tier: "Premium SUV", selfDrive: true },
  { slug: "mercedes-gls", name: "Mercedes-Benz GLS", tagline: "Generous space, first-class everywhere.", fromZAR: 14000, image: gls, tier: "Premium SUV", selfDrive: false },
  { slug: "range-rover-sport", name: "Range Rover Sport", tagline: "Athletic Range, dynamic stance.", fromZAR: 10500, rentalZAR: 7800, image: rrsport.url, tier: "Premium SUV", selfDrive: true },
  { slug: "porsche-cayenne", name: "Porsche Cayenne", tagline: "Sport SUV with a Stuttgart accent.", fromZAR: 9500, rentalZAR: 8900, image: cayenne, tier: "Premium SUV", selfDrive: true },
  { slug: "bmw-x5", name: "BMW X5", tagline: "Family-sized, executive-grade.", fromZAR: 8500, rentalZAR: 7500, image: bmwx5Extra.url, tier: "Premium SUV", selfDrive: true },

  // Executive
  { slug: "mercedes-s-class", name: "Mercedes-Benz S-Class", tagline: "The benchmark sedan, chauffeured.", fromZAR: 18000, image: sclass, tier: "Executive", selfDrive: false },
  { slug: "bmw-7-series", name: "BMW 7 Series", tagline: "Executive transfer, understated.", fromZAR: 14500, rentalZAR: 3500, image: bmw7.url, tier: "Executive", selfDrive: true },
  { slug: "mercedes-v-class", name: "Mercedes V-Class", tagline: "Up to seven, in lounge comfort.", fromZAR: 9000, image: vclass, tier: "Executive", selfDrive: false },
  { slug: "hyundai-staria", name: "Hyundai Staria", tagline: "Futuristic people-mover for groups up to nine.", fromZAR: 4800, rentalZAR: 3200, image: staria, tier: "Executive", selfDrive: true },
  { slug: "mercedes-e-class", name: "Mercedes-Benz E-Class", tagline: "Executive sedan, quietly capable.", fromZAR: 7500, rentalZAR: 4000, image: eclass, tier: "Executive", selfDrive: true },
  { slug: "bmw-5-series", name: "BMW 5 Series", tagline: "The dynamic executive.", fromZAR: 7200, rentalZAR: 3200, image: bmw5.url, tier: "Executive", selfDrive: true },

  // Everyday
  { slug: "bmw-x3", name: "BMW X3", tagline: "Compact SUV, dialled in.", fromZAR: 4500, rentalZAR: 3000, image: bmwx3Extra.url, tier: "Everyday", selfDrive: true },
  { slug: "mercedes-c-class", name: "Mercedes C-Class", tagline: "Discreet daily driver.", fromZAR: 4000, rentalZAR: 3400, image: cclass, tier: "Everyday", selfDrive: true },
  { slug: "audi-q5", name: "Audi Q5", tagline: "Effortless, comfortable, current.", fromZAR: 6200, rentalZAR: 4600, image: audiq5, tier: "Everyday", selfDrive: true },

  // Budget
  { slug: "bmw-3-series", name: "BMW 3 Series", tagline: "Sharp, sporty, value-led.", fromZAR: 3800, rentalZAR: 2400, image: bmw3, tier: "Budget", selfDrive: true },
  { slug: "toyota-corolla", name: "Toyota Corolla", tagline: "Reliable daily, low running costs.", fromZAR: 2400, rentalZAR: 1500, image: corolla, tier: "Budget", selfDrive: true },
  { slug: "vw-polo", name: "Volkswagen Polo", tagline: "Compact, nimble, easy to park.", fromZAR: 2200, rentalZAR: 1300, image: polo, tier: "Budget", selfDrive: true },

  // Group Travel
  { slug: "sprinter-16", name: "Mercedes Sprinter · 16-seater", tagline: "Executive group transfer, lounge seating.", fromZAR: 9500, image: sprinterExtra.url, tier: "Group Travel", selfDrive: false },
  { slug: "midibus-22", name: "Midibus · 22-seater", tagline: "Mid-size group days out and shuttles.", fromZAR: 13500, image: midibus22, tier: "Group Travel", selfDrive: false },
  { slug: "bus-32", name: "Touring Bus · 32-seater", tagline: "Larger parties, full-day tours, conferences.", fromZAR: 18500, image: bus32, tier: "Group Travel", selfDrive: false },
  { slug: "luxury-coach", name: "Luxury Coach · 50+ seater", tagline: "Long-haul touring coach with onboard amenities.", fromZAR: 26500, image: coach, tier: "Group Travel", selfDrive: false },
];

export const vehicleTiers: VehicleTier[] = ["Signature", "Premium SUV", "Executive", "Everyday", "Budget", "Group Travel"];

/** Effective self-drive rate for a vehicle. */
export const rentalRate = (v: Vehicle) => v.rentalZAR ?? v.fromZAR;
