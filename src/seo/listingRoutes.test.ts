import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";
import { allListingPaths } from "@/data/listings";
import { LISTING_ROUTES } from "./listingRoutes.generated";

describe("listing detail pages", () => {
  it("static heads cover every published listing (re-run scripts/generate-listing-routes.ts)", () => {
    expect(LISTING_ROUTES.map((r) => r.path).sort()).toEqual(allListingPaths().map((r) => r.path).sort());
  });
  it("sitemap lists every listing page", () => {
    const xml = fs.readFileSync(path.resolve(__dirname, "../../public/sitemap.xml"), "utf8");
    for (const r of LISTING_ROUTES) expect(xml).toContain(`<loc>https://svrm.group${r.path}</loc>`);
  });
  it("uses the requested Atlantic Villa and Maybach V-Class URLs", () => {
    const paths = LISTING_ROUTES.map((r) => r.path);
    expect(paths).toContain("/stays/the-atlantic-villa-camps-bay");
    expect(paths).toContain("/chauffeur/maybach-v-class");
    expect(paths).toContain("/rentals/bmw-x5");
  });
});
