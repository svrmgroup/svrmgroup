import cullinan from "@/assets/vehicles/cullinan.jpg";
import ghost from "@/assets/vehicles/ghost.jpg";
import g63 from "@/assets/vehicles/g63.jpg";
import bmw7 from "@/assets/vehicles/bmw7.jpg";
import urus from "@/assets/vehicles/urus.jpg";
import bmwx5 from "@/assets/vehicles/bmwx5.jpg";
import bmwx3 from "@/assets/vehicles/bmwx3.jpg";
import sclass from "@/assets/vehicles/sclass.jpg";
import vclass from "@/assets/vehicles/vclass.jpg";
import rangerover from "@/assets/vehicles/rangerover.jpg";
import rrsport from "@/assets/vehicles/rrsport.jpg";
import cayenne from "@/assets/vehicles/cayenne.jpg";
import bentayga from "@/assets/vehicles/bentayga.jpg";
import cclass from "@/assets/vehicles/cclass.jpg";
import audiq5 from "@/assets/vehicles/audiq5.jpg";

export type VehicleTier = "Signature" | "Premium SUV" | "Executive" | "Everyday";

export interface Vehicle {
  slug: string;
  name: string;
  tagline: string;
  fromZAR: number; // per day
  image: string;
  tier: VehicleTier;
  selfDrive: boolean;
}

export const vehicles: Vehicle[] = [
  // Signature
  { slug: "rolls-royce-cullinan", name: "Rolls-Royce Cullinan", tagline: "The summit of the SVRM fleet.", fromZAR: 57500, image: cullinan, tier: "Signature", selfDrive: false },
  { slug: "rolls-royce-ghost", name: "Rolls-Royce Ghost", tagline: "Silent presence, chauffeured.", fromZAR: 55000, image: ghost, tier: "Signature", selfDrive: false },
  { slug: "bentley-bentayga", name: "Bentley Bentayga", tagline: "British craft, African horizon.", fromZAR: 23000, image: bentayga, tier: "Signature", selfDrive: false },
  { slug: "lamborghini-urus", name: "Lamborghini Urus", tagline: "Performance, refined.", fromZAR: 33500, image: urus, tier: "Signature", selfDrive: true },

  // Premium SUV
  { slug: "mercedes-amg-g63", name: "Mercedes-AMG G63", tagline: "The icon. Cape Town's roads, conquered.", fromZAR: 21500, image: g63, tier: "Premium SUV", selfDrive: true },
  { slug: "range-rover-autobiography", name: "Range Rover Autobiography", tagline: "Quiet authority, every terrain.", fromZAR: 20500, image: rangerover, tier: "Premium SUV", selfDrive: true },
  { slug: "range-rover-sport", name: "Range Rover Sport", tagline: "Athletic Range, dynamic stance.", fromZAR: 8500, image: rrsport, tier: "Premium SUV", selfDrive: true },
  { slug: "porsche-cayenne", name: "Porsche Cayenne", tagline: "Sport SUV with a Stuttgart accent.", fromZAR: 11500, image: cayenne, tier: "Premium SUV", selfDrive: true },
  { slug: "bmw-x5", name: "BMW X5", tagline: "Family-sized, executive-grade.", fromZAR: 8500, image: bmwx5, tier: "Premium SUV", selfDrive: true },

  // Executive
  { slug: "mercedes-s-class", name: "Mercedes-Benz S-Class", tagline: "The benchmark sedan, chauffeured.", fromZAR: 14000, image: sclass, tier: "Executive", selfDrive: false },
  { slug: "bmw-7-series", name: "BMW 7 Series", tagline: "Executive transfer, understated.", fromZAR: 20500, image: bmw7, tier: "Executive", selfDrive: true },
  { slug: "mercedes-v-class", name: "Mercedes V-Class", tagline: "Up to seven, in lounge comfort.", fromZAR: 8500, image: vclass, tier: "Executive", selfDrive: false },

  // Everyday / Budget
  { slug: "bmw-x3", name: "BMW X3", tagline: "Compact SUV, dialled in.", fromZAR: 5000, image: bmwx3, tier: "Everyday", selfDrive: true },
  { slug: "mercedes-c-class", name: "Mercedes C-Class", tagline: "Discreet daily driver.", fromZAR: 4500, image: cclass, tier: "Everyday", selfDrive: true },
  { slug: "audi-q5", name: "Audi Q5", tagline: "Effortless, comfortable, current.", fromZAR: 6200, image: audiq5, tier: "Everyday", selfDrive: true },
];

export const vehicleTiers: VehicleTier[] = ["Signature", "Premium SUV", "Executive", "Everyday"];
