import { describe, expect, it } from "vitest";
import { addFleetImagesToSitemap, fleetImageHtml, fleetImagesForRoute } from "./vehicleImages";

describe("fleet image discovery", () => {
  it("lists stable image URLs under their real service pages", () => {
    const xml = addFleetImagesToSitemap('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://svrm.group/chauffeur</loc></url><url><loc>https://svrm.group/rentals</loc></url><url><loc>https://svrm.group/contact</loc></url></urlset>');
    expect(xml).toContain('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');
    expect((xml.match(/<image:loc>/g) ?? []).length).toBe(17);
    expect(xml).not.toContain('/assets/');
    expect(xml).toContain('https://svrm.group/__l5e/assets-v1/');
  });
  it("keeps chauffeur-only vehicles out of rental image discovery", () => {
    expect(fleetImagesForRoute("/rentals").map(image => image.name)).toEqual(["BMW X3", "BMW X5", "Range Rover Autobiography", "Range Rover Sport", "BMW 7 Series", "BMW 5 Series"]);
    expect(fleetImagesForRoute("/admin")).toEqual([]);
    expect(fleetImageHtml("/chauffeur")).toContain('phantom-gallery-4k.jpg');
  });
});