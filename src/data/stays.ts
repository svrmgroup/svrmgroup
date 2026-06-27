import campsbay from "@/assets/stays/campsbay.jpg";
import clifton from "@/assets/stays/clifton.jpg";
import bantry from "@/assets/stays/bantry.jpg";
import vanda from "@/assets/stays/vanda.jpg";
import seapoint from "@/assets/stays/seapoint.jpg";

export interface Stay {
  slug: string;
  name: string;
  area: string;
  beds: string;
  fromZAR: number; // per night
  image: string;
  blurb: string;
}

export const stays: Stay[] = [
  {
    slug: "camps-bay-cliff",
    name: "Camps Bay Cliff Villa",
    area: "Camps Bay",
    beds: "5 bedrooms · pool · sea view",
    fromZAR: 38000,
    image: campsbay,
    blurb: "Clifftop villa with infinity pool over the Twelve Apostles.",
  },
  {
    slug: "clifton-penthouse",
    name: "Clifton Beachfront Penthouse",
    area: "Clifton",
    beds: "3 bedrooms · beach access",
    fromZAR: 28000,
    image: clifton,
    blurb: "Floor-to-ceiling glass directly above Clifton 2nd Beach.",
  },
  {
    slug: "bantry-bay-villa",
    name: "Bantry Bay Ocean Villa",
    area: "Bantry Bay",
    beds: "4 bedrooms · pool deck",
    fromZAR: 32000,
    image: bantry,
    blurb: "Sunset-facing villa with pool deck and Atlantic views.",
  },
  {
    slug: "vanda-marina",
    name: "V&A Marina Apartment",
    area: "V&A Waterfront",
    beds: "2 bedrooms · marina view",
    fromZAR: 12000,
    image: vanda,
    blurb: "Secure marina apartment overlooking yachts and Table Mountain.",
  },
  {
    slug: "sea-point-sky",
    name: "Sea Point Sky Residence",
    area: "Sea Point",
    beds: "2 bedrooms · ocean view",
    fromZAR: 9500,
    image: seapoint,
    blurb: "High-floor residence over the promenade and Atlantic seaboard.",
  },
];
