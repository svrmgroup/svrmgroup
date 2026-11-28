import type { TourCategory, TourPackage } from "./tours";
import { tourPackagePhotoKey } from "./tourPackages";
import library from "./tourPhotoLibrary.json";

/** A real, credited photograph (Wikimedia Commons) used to illustrate a tour package. */
export interface TourPhoto { src: string; fullSrc: string; fit?: "contain"; alt: string; artist: string; license: string; source: string }
type Entry = { src: string; title: string; artist: string; license: string; source: string };
const lib = library as Record<string, Entry[]>;

const byTour: Record<string, string[]> = {
  "bo-kaap-cooking-tour": ["bo-kaap", "cape-malay-food"],
  "cape-peninsula": ["cape-point", "chapmans-peak", "boulders-penguins"],
  safari: ["kruger-elephant", "sabi-sand-leopard", "lion-kruger", "madikwe"],
  hunting: ["plains-game", "karoo"],
  cultural: ["robben-island", "bo-kaap", "table-mountain"],
  adventure: ["paragliding", "table-mountain", "chapmans-peak"],
  marine: ["boulders-penguins", "hermanus-whale", "cape-point"],
  "garden-route": ["knysna", "tsitsikamma", "addo"],
  aerial: ["helicopter-cape-town", "camps-bay", "hot-air-balloon"],
  culinary: ["cape-malay-food", "spice-market", "oranjezicht-market"],
  wellness: ["spa", "franschhoek", "cederberg"],
  photography: ["lions-head", "table-mountain", "clifton-sunset"],
  "group-travel": ["table-mountain", "cape-point", "v-and-a"],
  romantic: ["clifton-sunset", "sunset-dinner", "camps-bay"],
  "aquila-safari": ["aquila", "rhino", "karoo"],
};
const byPackage: Record<string, string[]> = {
  "peninsula-and-winelands": ["stellenbosch", "cape-point"],
  "sabi-sand-signature": ["sabi-sand-leopard"],
  "madikwe-and-kruger": ["madikwe", "kruger-elephant"],
  "hermanus-whale-weekend": ["hermanus-whale"],
  "cape-to-addo-grand-tour": ["addo", "knysna"],
  "coast-and-forest-signature": ["tsitsikamma", "knysna"],
  "sunrise-hot-air-balloon": ["hot-air-balloon"],
  "two-oceans-aerial-tour": ["cape-point", "helicopter-cape-town"],
  "markets-coffee-and-spice": ["oranjezicht-market", "spice-market"],
  "mountain-wellness-retreat": ["franschhoek", "spa"],
  "cederberg-hot-springs": ["cederberg"],
  "sunrise-lions-head-shoot": ["lions-head"],
  "garden-route-group": ["knysna", "tsitsikamma"],
  "cape-and-bush": ["paragliding", "lion-kruger"],
  "cape-and-national-parks": ["robben-island", "kruger-elephant"],
  "aquila-sunset-safari": ["karoo", "aquila"],
  "aquila-big-five-safari-midday": ["rhino", "aquila"],
};
const VEHICLE_SHOT = /suv|maybach|vclass|v-class|sprinter|vehicle|fleet/i;
const NO_CREDIT = /public domain|cc0|^pd/i;
const nice = (title: string) => title.replace(/^File:/, "").replace(/\.[a-z]+$/i, "").replace(/[_-]+/g, " ").trim();

export function tourPackagePhotos(tour: TourCategory, pkg: TourPackage): TourPhoto[] {
  const slug = tourPackagePhotoKey(tour, pkg).split(":").pop()!;
  const keys = [...(byPackage[slug] ?? []), ...(byTour[tour.slug] ?? [])];
  const seen = new Set<string>();
  const out: TourPhoto[] = [];
  for (const k of keys) for (const e of lib[k] ?? []) {
    // Only photos free to use without a visible credit (public domain / CC0).
    if (seen.has(e.src) || !NO_CREDIT.test(e.license)) continue;
    seen.add(e.src);
    out.push({ src: e.src, fullSrc: e.src, alt: `${pkg.title} — illustrative photograph: ${nice(e.title)}`, artist: e.artist, license: e.license, source: e.source });
  }
  const own = pkg.image ?? tour.image;
  // Existing SVRM vehicle photos are shown whole (uncropped) alongside the real tour photos.
  if (pkg.image && VEHICLE_SHOT.test(pkg.image)) out.unshift({ src: pkg.image, fullSrc: pkg.image, fit: "contain", alt: `${pkg.title} — SVRM chauffeur vehicle, Cape Town`, artist: "SVRM Group", license: "SVRM Group", source: "" });
  if (!out.length && own) out.push({ src: own, fullSrc: own, alt: `${pkg.title} — ${tour.label}, Cape Town`, artist: "SVRM Group", license: "SVRM Group", source: "" });
  return out.slice(0, 5);
}
