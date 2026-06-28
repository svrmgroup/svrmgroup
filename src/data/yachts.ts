import sailing from "@/assets/yachts/sailing.jpg";
import motor from "@/assets/yachts/motor.jpg";
import superyacht from "@/assets/yachts/superyacht.jpg";

export interface Yacht {
  slug: string;
  name: string;
  tagline: string;
  capacity: string;
  image: string;
}

export const yachts: Yacht[] = [
  { slug: "sailing-60", name: "60ft Sailing Yacht", tagline: "Quiet day-sail along the Atlantic seaboard.", capacity: "Up to 12 guests · half / full day", image: sailing },
  { slug: "motor-80", name: "80ft Motor Yacht", tagline: "Sunset cruise from the V&A around Clifton.", capacity: "Up to 20 guests · half / full day", image: motor },
  { slug: "superyacht", name: "Superyacht Charter", tagline: "Multi-day charter, full crew, destinations on request.", capacity: "Up to 12 guests overnight", image: superyacht },
];
