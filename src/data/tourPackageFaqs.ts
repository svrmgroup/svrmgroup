import type { Faq } from "@/data/listings";
import type { TourPackage } from "@/data/tours";
import { pickStable } from "@/lib/faqPicks";
import { tourPackageSlug } from "@/data/tourPackages";

type TourLike = { slug: string; label: string };

/** Varied, fact-based questions per tour package; answers only restate the package's own inclusions. */
export function tourPackageFaqs(tour: TourLike, pkg: TourPackage): Faq[] {
  const inc = pkg.inclusions.join(", ").toLowerCase();
  const multi = !/^(half|full|1 )|hour/i.test(pkg.duration);
  const pool: Faq[] = [
    { q: `What is included in ${pkg.title}?`, a: `${pkg.inclusions.join(", ")}. Your written quote confirms every detail.` },
    { q: `Why do people book ${pkg.title}?`, a: `It covers ${inc} in ${pkg.duration}, privately arranged by SVRM so you don't have to plan the logistics.` },
    { q: `Is ${pkg.title} good for couples?`, a: "Yes — it runs privately, so couples get the pace and privacy they want. Tell us if it's a special occasion and we'll add the details." },
    { q: `Can families or groups book ${pkg.title}?`, a: "Yes — tell us how many adults and children are travelling and we'll match the vehicle and plan to your group." },
    { q: `How long is ${pkg.title}?`, a: `${pkg.duration}. ${multi ? "Dates can be moved to suit your trip." : "Start times are flexible around your plans."}` },
    { q: `How much does ${pkg.title} cost?`, a: pkg.fromZAR != null ? `From R${pkg.fromZAR.toLocaleString("en-ZA")} ${pkg.unit ?? "per person"}. Your written quote is final.` : "Pricing is on request — send your dates and group size and we'll quote." },
    { q: "Can the itinerary be personalised?", a: "Yes — every SVRM tour is private, so stops, timings and add-ons can be changed to suit you." },
    { q: "Is hotel or villa collection included?", a: "Your private chauffeur can collect you from your hotel, villa or the airport. Add the address when you enquire." },
    { q: `What happens if the weather changes on ${pkg.title}?`, a: "Your concierge watches the forecast and will suggest a new order or date if conditions affect the experience." },
    { q: `Can I combine ${pkg.title} with other ${tour.label.toLowerCase()} experiences?`, a: "Yes — tell us what else you'd like to do and we'll build it into one plan." },
  ];
  return pickStable(pool, `${tour.slug}:${tourPackageSlug(pkg)}`, 5);
}

export const tourPackageKeywords = (tour: TourLike, pkg: TourPackage) => [
  `${pkg.title} Cape Town`, `${tour.label} Cape Town`, `private ${tour.label.toLowerCase().replace(/\s*tours?$/, "")} tour`,
  `${pkg.duration} private tour Cape Town`, "luxury private tour Cape Town", "private chauffeur tour Cape Town",
  ...pkg.inclusions.slice(0, 4).map((i) => `${i.toLowerCase()} Cape Town`),
].join(", ");
