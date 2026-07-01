import cullinan from "@/assets/vehicles/cullinan.jpg";
import ghost from "@/assets/vehicles/ghost.jpg";
import phantom from "@/assets/vehicles/phantom.jpg";
import g63 from "@/assets/vehicles/g63.jpg";
import bmw7 from "@/assets/vehicles/bmw7.jpg";
import urus from "@/assets/vehicles/urus.jpg";
import bmwx5 from "@/assets/vehicles/bmwx5.jpg";
import bmwx3 from "@/assets/vehicles/bmwx3.jpg";
import sclass from "@/assets/vehicles/sclass.jpg";
import vclass from "@/assets/vehicles/vclass.jpg";
import staria from "@/assets/vehicles/staria.jpg";
import rangerover from "@/assets/vehicles/rangerover.jpg";
import rrsport from "@/assets/vehicles/rrsport.jpg";
import cayenne from "@/assets/vehicles/cayenne.jpg";
import bentayga from "@/assets/vehicles/bentayga.jpg";
import cclass from "@/assets/vehicles/cclass.jpg";
import audiq5 from "@/assets/vehicles/audiq5.jpg";
import bmw3 from "@/assets/vehicles/bmw3.jpg";
import bmw5 from "@/assets/vehicles/bmw5.jpg";
import eclass from "@/assets/vehicles/eclass.jpg";
import corolla from "@/assets/vehicles/corolla.jpg";
import polo from "@/assets/vehicles/polo.jpg";
import sprinter16 from "@/assets/vehicles/sprinter16.jpg";
import midibus22 from "@/assets/vehicles/midibus22.jpg";
import bus32 from "@/assets/vehicles/bus32.jpg";
import coach from "@/assets/vehicles/coach.jpg";

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
  tier: VehicleTier;
  selfDrive: boolean;
}

export const vehicles: Vehicle[] = [
  // Signature
  { slug: "rolls-royce-phantom", name: "Rolls-Royce Phantom", tagline: "The pinnacle of motoring, chauffeured.", fromZAR: 30500, image: phantom, tier: "Signature", selfDrive: false },
  { slug: "rolls-royce-cullinan", name: "Rolls-Royce Cullinan", tagline: "The summit of the SVRM fleet.", fromZAR: 37500, image: cullinan, tier: "Signature", selfDrive: false },
  { slug: "rolls-royce-ghost", name: "Rolls-Royce Ghost", tagline: "Silent presence, chauffeured.", fromZAR: 30000, image: ghost, tier: "Signature", selfDrive: false },
  { slug: "bentley-bentayga", name: "Bentley Bentayga", tagline: "British craft, African horizon.", fromZAR: 25000, rentalZAR: 18500, image: bentayga, tier: "Signature", selfDrive: true },
  { slug: "lamborghini-urus", name: "Lamborghini Urus", tagline: "Performance, refined.", fromZAR: 28500, rentalZAR: 20500, image: urus, tier: "Signature", selfDrive: true },

  // Premium SUV
  { slug: "mercedes-amg-g63", name: "Mercedes-AMG G63", tagline: "The icon. Cape Town's roads, conquered.", fromZAR: 18000, rentalZAR: 16500, image: g63, tier: "Premium SUV", selfDrive: true },
  { slug: "range-rover-autobiography", name: "Range Rover Autobiography", tagline: "Quiet authority, every terrain.", fromZAR: 17500, rentalZAR: 15500, image: rangerover, tier: "Premium SUV", selfDrive: true },
  { slug: "range-rover-sport", name: "Range Rover Sport", tagline: "Athletic Range, dynamic stance.", fromZAR: 10500, rentalZAR: 7800, image: rrsport, tier: "Premium SUV", selfDrive: true },
  { slug: "porsche-cayenne", name: "Porsche Cayenne", tagline: "Sport SUV with a Stuttgart accent.", fromZAR: 9500, rentalZAR: 8900, image: cayenne, tier: "Premium SUV", selfDrive: true },
  { slug: "bmw-x5", name: "BMW X5", tagline: "Family-sized, executive-grade.", fromZAR: 8500, rentalZAR: 7500, image: bmwx5, tier: "Premium SUV", selfDrive: true },

  // Executive
  { slug: "mercedes-s-class", name: "Mercedes-Benz S-Class", tagline: "The benchmark sedan, chauffeured.", fromZAR: 18000, image: sclass, tier: "Executive", selfDrive: false },
  { slug: "bmw-7-series", name: "BMW 7 Series", tagline: "Executive transfer, understated.", fromZAR: 14500, rentalZAR: 3500, image: bmw7, tier: "Executive", selfDrive: true },
  { slug: "mercedes-v-class", name: "Mercedes V-Class", tagline: "Up to seven, in lounge comfort.", fromZAR: 15500, image: vclass, tier: "Executive", selfDrive: false },
  { slug: "hyundai-staria", name: "Hyundai Staria", tagline: "Futuristic people-mover for groups up to nine.", fromZAR: 4800, rentalZAR: 3200, image: staria, tier: "Executive", selfDrive: true },
  { slug: "mercedes-e-class", name: "Mercedes-Benz E-Class", tagline: "Executive sedan, quietly capable.", fromZAR: 7500, rentalZAR: 4000, image: eclass, tier: "Executive", selfDrive: true },
  { slug: "bmw-5-series", name: "BMW 5 Series", tagline: "The dynamic executive.", fromZAR: 7200, rentalZAR: 3200, image: bmw5, tier: "Executive", selfDrive: true },

  // Everyday
  { slug: "bmw-x3", name: "BMW X3", tagline: "Compact SUV, dialled in.", fromZAR: 4500, rentalZAR: 3000, image: bmwx3, tier: "Everyday", selfDrive: true },
  { slug: "mercedes-c-class", name: "Mercedes C-Class", tagline: "Discreet daily driver.", fromZAR: 4000, rentalZAR: 3400, image: cclass, tier: "Everyday", selfDrive: true },
  { slug: "audi-q5", name: "Audi Q5", tagline: "Effortless, comfortable, current.", fromZAR: 6200, rentalZAR: 4600, image: audiq5, tier: "Everyday", selfDrive: true },

  // Budget
  { slug: "bmw-3-series", name: "BMW 3 Series", tagline: "Sharp, sporty, value-led.", fromZAR: 3800, rentalZAR: 2400, image: bmw3, tier: "Budget", selfDrive: true },
  { slug: "toyota-corolla", name: "Toyota Corolla", tagline: "Reliable daily, low running costs.", fromZAR: 2400, rentalZAR: 1500, image: corolla, tier: "Budget", selfDrive: true },
  { slug: "vw-polo", name: "Volkswagen Polo", tagline: "Compact, nimble, easy to park.", fromZAR: 2200, rentalZAR: 1300, image: polo, tier: "Budget", selfDrive: true },

  // Group Travel
  { slug: "sprinter-16", name: "Mercedes Sprinter · 16-seater", tagline: "Executive group transfer, lounge seating.", fromZAR: 9500, image: sprinter16, tier: "Group Travel", selfDrive: false },
  { slug: "midibus-22", name: "Midibus · 22-seater", tagline: "Mid-size group days out and shuttles.", fromZAR: 13500, image: midibus22, tier: "Group Travel", selfDrive: false },
  { slug: "bus-32", name: "Touring Bus · 32-seater", tagline: "Larger parties, full-day tours, conferences.", fromZAR: 18500, image: bus32, tier: "Group Travel", selfDrive: false },
  { slug: "luxury-coach", name: "Luxury Coach · 50+ seater", tagline: "Long-haul touring coach with onboard amenities.", fromZAR: 26500, image: coach, tier: "Group Travel", selfDrive: false },
];

export const vehicleTiers: VehicleTier[] = ["Signature", "Premium SUV", "Executive", "Everyday", "Budget", "Group Travel"];

/** Effective self-drive rate for a vehicle. */
export const rentalRate = (v: Vehicle) => v.rentalZAR ?? v.fromZAR;
