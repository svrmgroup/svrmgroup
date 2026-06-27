import campsbay from "@/assets/stays/campsbay.jpg";
import clifton from "@/assets/stays/clifton.jpg";
import bantry from "@/assets/stays/bantry.jpg";
import vanda from "@/assets/stays/vanda.jpg";
import seapoint from "@/assets/stays/seapoint.jpg";
import llandudno from "@/assets/stays/llandudno.jpg";
import bishopscourt from "@/assets/stays/bishopscourt.jpg";
import constantia from "@/assets/stays/constantia.jpg";
import dewaterkant from "@/assets/stays/dewaterkant.jpg";
import greenpoint from "@/assets/stays/greenpoint.jpg";
import woodstock from "@/assets/stays/woodstock.jpg";
import hotelCapeGrace from "@/assets/stays/hotel-capegrace.jpg";
import hotelOneAndOnly from "@/assets/stays/hotel-oneandonly.jpg";
import hotelMountNelson from "@/assets/stays/hotel-mountnelson.jpg";
import hotelSilo from "@/assets/stays/hotel-silo.jpg";
import hotelTableBay from "@/assets/stays/hotel-tablebay.jpg";
import hotelBay from "@/assets/stays/hotel-bayhotel.jpg";

export type StayType = "villa" | "apartment" | "hotel";

export interface Stay {
  slug: string;
  name: string;
  area: string;
  beds: string;
  fromZAR: number; // per night
  image: string;
  blurb: string;
  type: StayType;
}

export const stays: Stay[] = [
  // VILLAS
  { slug: "camps-bay-cliff", name: "Camps Bay Cliff Villa", area: "Camps Bay", beds: "5 bed · pool · sea view", fromZAR: 38000, image: campsbay, blurb: "Clifftop villa with infinity pool over the Twelve Apostles.", type: "villa" },
  { slug: "bantry-bay-villa", name: "Bantry Bay Ocean Villa", area: "Bantry Bay", beds: "4 bed · pool deck", fromZAR: 32000, image: bantry, blurb: "Sunset-facing villa with pool deck and Atlantic views.", type: "villa" },
  { slug: "llandudno-cliff", name: "Llandudno Cliff House", area: "Llandudno", beds: "4 bed · infinity pool", fromZAR: 29000, image: llandudno, blurb: "Modern white architecture above Llandudno beach.", type: "villa" },
  { slug: "bishopscourt-estate", name: "Bishopscourt Manor", area: "Bishopscourt", beds: "6 bed · gardens · staff", fromZAR: 24000, image: bishopscourt, blurb: "Classical estate set in two hectares of garden under Table Mountain.", type: "villa" },
  { slug: "constantia-house", name: "Constantia Country House", area: "Constantia", beds: "5 bed · vineyards · pool", fromZAR: 18000, image: constantia, blurb: "Cape Dutch farmhouse on the Constantia winelands.", type: "villa" },

  // APARTMENTS
  { slug: "clifton-penthouse", name: "Clifton Beachfront Penthouse", area: "Clifton", beds: "3 bed · beach access", fromZAR: 28000, image: clifton, blurb: "Floor-to-ceiling glass directly above Clifton 2nd Beach.", type: "apartment" },
  { slug: "vanda-marina", name: "V&A Marina Apartment", area: "V&A Waterfront", beds: "2 bed · marina view", fromZAR: 12000, image: vanda, blurb: "Secure marina apartment overlooking yachts and Table Mountain.", type: "apartment" },
  { slug: "sea-point-sky", name: "Sea Point Sky Residence", area: "Sea Point", beds: "2 bed · ocean view", fromZAR: 9500, image: seapoint, blurb: "High-floor residence over the promenade and Atlantic seaboard.", type: "apartment" },
  { slug: "de-waterkant-loft", name: "De Waterkant Townhouse", area: "De Waterkant", beds: "2 bed · designer interior", fromZAR: 7800, image: dewaterkant, blurb: "Historic Cape facade with a sleek, modern interior. Walk everywhere.", type: "apartment" },
  { slug: "green-point-apt", name: "Green Point Stadium View", area: "Green Point", beds: "2 bed · stadium & ocean view", fromZAR: 6500, image: greenpoint, blurb: "Smart apartment overlooking the stadium and Atlantic.", type: "apartment" },
  { slug: "woodstock-loft", name: "Woodstock Industrial Loft", area: "Woodstock", beds: "1 bed · open plan loft", fromZAR: 4200, image: woodstock, blurb: "Designer loft in the Woodstock art district. Budget-friendly, full of character.", type: "apartment" },

  // HOTEL ROOMS
  { slug: "hotel-cape-grace", name: "Cape Grace — Luxury Room", area: "V&A Waterfront", beds: "1 king · harbour view", fromZAR: 11500, image: hotelCapeGrace, blurb: "Five-star landmark on its own private quay.", type: "hotel" },
  { slug: "hotel-one-and-only", name: "One&Only — Marina Room", area: "V&A Waterfront", beds: "1 king · marina view", fromZAR: 14500, image: hotelOneAndOnly, blurb: "Resort-style city hotel with full-service spa.", type: "hotel" },
  { slug: "hotel-mount-nelson", name: "Mount Nelson — Garden Suite", area: "Gardens", beds: "1 king · suite", fromZAR: 12000, image: hotelMountNelson, blurb: "Iconic pink palace at the foot of Table Mountain.", type: "hotel" },
  { slug: "hotel-silo", name: "The Silo — Designer Room", area: "V&A Silo District", beds: "1 king · pillow windows", fromZAR: 13500, image: hotelSilo, blurb: "Reimagined grain silo above the Zeitz MOCAA museum.", type: "hotel" },
  { slug: "hotel-table-bay", name: "Table Bay — Marina Suite", area: "V&A Waterfront", beds: "1 king · marina suite", fromZAR: 9500, image: hotelTableBay, blurb: "Grand waterfront hotel with direct mall access.", type: "hotel" },
  { slug: "hotel-bay-hotel", name: "The Bay Hotel — Beach Room", area: "Camps Bay", beds: "1 king · beach front", fromZAR: 7500, image: hotelBay, blurb: "Boutique five-star directly opposite Camps Bay beach.", type: "hotel" },
];

export const stayTypeLabels: Record<StayType, string> = {
  villa: "Villas",
  apartment: "Apartments",
  hotel: "Hotel Rooms",
};
