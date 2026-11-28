import type { TourCategory, TourPackage } from "./tours";
import { tourPackagePhotoKey } from "./tourPackages";
import library from "./tourPhotoLibrary.json";

/** A real, credited photograph (Wikimedia Commons) used to illustrate a tour package. */
export interface TourPhoto { src: string; fullSrc: string; fit?: "contain"; alt: string; artist: string; license: string; source: string }
type Entry = { src: string; title: string; artist: string; license: string; source: string };
const lib = library as Record<string, Entry[]>;

const byTour: Record<string, string[]> = {
  "bo-kaap-cooking-tour": ["bo-kaap", "cape-malay-food"],
  "cape-peninsula": ["hout-bay", "chapmans-peak", "cape-point", "boulders-penguins", "camps-bay"],
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
  "bo-kaap-cultural-and-cooking-experience": ["bo-kaap", "spice-market", "cape-malay-food"],
  "bo-kaap-and-cape-town-heritage-day": ["bo-kaap", "spice-market", "cape-malay-food", "table-mountain"],
  "cape-peninsula-private-tour": ["hout-bay", "camps-bay", "chapmans-peak", "cape-point", "boulders-penguins", "clifton-sunset"],
  "cape-peninsula-maybach-signature": ["chapmans-peak", "hout-bay", "cape-point", "boulders-penguins", "camps-bay"],
  "peninsula-and-winelands": ["stellenbosch", "cape-point", "chapmans-peak", "boulders-penguins", "franschhoek"],
  "kruger-essentials": ["kruger-elephant", "sabi-sand-leopard", "rhino"],
  "sabi-sand-signature": ["sabi-sand-leopard", "kruger-elephant", "rhino"],
  "madikwe-and-kruger": ["kruger-elephant", "rhino", "sabi-sand-leopard", "spa"],
  "bespoke-grand-safari": ["sabi-sand-leopard", "kruger-elephant", "rhino", "addo"],
  "5-star-plains-game-package": ["plains-game", "karoo"],
  "cape-heritage": ["robben-island", "table-mountain", "bo-kaap"],
  "cape-and-national-parks": ["robben-island", "cape-point", "boulders-penguins", "table-mountain"],
  "heritage-grand-tour": ["robben-island", "bo-kaap", "knysna", "table-mountain"],
  "cape-adventure-short": ["helicopter-cape-town", "camps-bay", "table-mountain"],
  "cape-and-bush": ["helicopter-cape-town", "sabi-sand-leopard", "kruger-elephant", "rhino"],
  "land-sea-and-sky": ["helicopter-cape-town", "franschhoek", "sabi-sand-leopard", "kruger-elephant"],
  "boulders-penguins-and-cape-point": ["boulders-penguins", "cape-point"],
  "hermanus-whale-weekend": ["hermanus-whale"],
  "marine-grand-circuit": ["hermanus-whale", "boulders-penguins", "hout-bay"],
  "garden-route-essentials": ["knysna", "tsitsikamma"],
  "coast-and-forest-signature": ["tsitsikamma", "knysna"],
  "cape-to-addo-grand-tour": ["addo", "knysna", "tsitsikamma"],
  "atlantic-seaboard-heli-flip": ["helicopter-cape-town", "camps-bay", "v-and-a", "clifton-sunset"],
  "two-oceans-aerial-tour": ["helicopter-cape-town", "cape-point", "hout-bay", "chapmans-peak"],
  "sunrise-hot-air-balloon": ["hot-air-balloon", "franschhoek"],
  "bo-kaap-cooking-class": ["cape-malay-food", "bo-kaap", "spice-market"],
  "markets-coffee-and-spice": ["oranjezicht-market", "spice-market", "bo-kaap"],
  "cape-culinary-signature": ["cape-malay-food", "oranjezicht-market", "spice-market"],
  "spa-day-signature": ["spa-massage", "spa-lounge", "spa"],
  "mountain-wellness-retreat": ["retreat-suite", "retreat-meditation", "franschhoek"],
  "cederberg-hot-springs": ["hot-springs", "cederberg-stars", "cederberg"],
  "sunrise-lions-head-shoot": ["lions-head", "clifton-sunset", "camps-bay"],
  "cape-town-in-a-day": ["bo-kaap", "v-and-a", "lions-head", "clifton-sunset"],
  "cape-photographic-signature": ["table-mountain", "cape-point", "boulders-penguins", "lions-head"],
  "city-group-transfer": ["v-and-a", "table-mountain"],
  "cape-peninsula-group-tour": ["boulders-penguins", "cape-point", "chapmans-peak"],
  "garden-route-group": ["knysna", "tsitsikamma"],
  "weddings-corporate-and-incentive": ["v-and-a", "table-mountain"],
  "the-proposal": ["clifton-sunset", "sunset-dinner", "franschhoek"],
  "anniversary-escape": ["sunset-dinner", "spa-massage", "clifton-sunset"],
  "cape-honeymoon-signature": ["hot-air-balloon", "helicopter-cape-town", "sunset-dinner", "camps-bay"],
  "grand-romantic-tour": ["franschhoek", "hot-air-balloon", "helicopter-cape-town", "sabi-sand-leopard", "sunset-dinner"],
  "anniversary-grand-celebration": ["hot-air-balloon", "helicopter-cape-town", "sunset-dinner", "spa-massage", "knysna"],
  "bespoke-honeymoon-end-to-end": ["sunset-dinner", "clifton-sunset", "franschhoek"],
  "aquila-big-five-day-safari-morning": ["aquila", "rhino"],
  "aquila-big-five-safari-midday": ["rhino", "aquila"],
  "aquila-sunset-safari": ["aquila", "karoo", "rhino"],
};
const VEHICLE_SHOT = /suv|maybach|vclass|v-class|sprinter|vehicle|fleet/i;
const NO_CREDIT = /public domain|cc0|^pd/i;
const nice = (title: string) => title.replace(/^File:/, "").replace(/\.[a-z]+$/i, "").replace(/[_-]+/g, " ").trim();

export function tourPackagePhotos(tour: TourCategory, pkg: TourPackage): TourPhoto[] {
  const slug = tourPackagePhotoKey(tour, pkg).split(":").pop()!;
  // A package with its own photo set (3+) uses only those, so it never repeats a sibling package's gallery.
  const own = byPackage[slug] ?? [];
  // Every package is curated: only photos matching what that package includes.
  const dedicated = own.length > 0;
  const keys = dedicated ? own : [...own, ...(byTour[tour.slug] ?? [])];
  const seen = new Set<string>();
  const out: TourPhoto[] = [];
  for (const k of keys) for (const e of lib[k] ?? []) {
    // Only photos free to use without a visible credit (public domain / CC0).
    if (seen.has(e.src) || !NO_CREDIT.test(e.license)) continue;
    seen.add(e.src);
    out.push({ src: e.src, fullSrc: e.src, alt: `${pkg.title} — illustrative photograph: ${nice(e.title)}`, artist: e.artist, license: e.license, source: e.source });
  }
  // Open with the best scenic photo, then SVRM's own tour/package imagery, then the rest.
  const lead = [...new Set(dedicated && tour.slug === "wellness" ? [pkg.image] : [pkg.image, tour.image])].filter((src): src is string => !!src && !seen.has(src));
  lead.reverse().forEach((src) => { seen.add(src); out.splice(Math.min(1, out.length), 0, { src, fullSrc: src, alt: `${pkg.title} — ${tour.label}, Cape Town`, artist: "SVRM Group", license: "SVRM Group", source: "" }); });
  return out.slice(0, 6);
}
