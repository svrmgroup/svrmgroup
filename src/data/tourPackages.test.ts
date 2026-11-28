import { describe, expect, it } from "vitest";
import { tours } from "./tours";
import { allTourPackages, findTourPackage, hasAuthoredPackageDescription, tourPackageDescription, tourPackagePath, tourPackagePhotoKey, tourPackageSlug } from "./tourPackages";
import { tourPackagePhotos } from "./tourPhotos";
import { allListingPaths } from "./listings";

describe("tour package detail pages", () => {
  it("gives all 47 packages an authored description, stable URL and real credited photograph", () => {
    const packages = allTourPackages();
    expect(packages).toHaveLength(47);
    for (const { tour, pkg, path, description } of packages) {
      expect(tourPackageSlug(pkg), path).toMatch(/^[a-z0-9-]+$/);
      expect(hasAuthoredPackageDescription(tour, pkg), path).toBe(true);
      expect(description.length, path).toBeGreaterThan(120);
      expect(description, path).toBe(tourPackageDescription(tour, pkg));
      const photos = tourPackagePhotos(tour, pkg);
      expect(photos.length, path).toBeGreaterThan(0);
      for (const photo of photos) {
        expect(photo.src, path).toMatch(/^\/__l5e\/assets-v1\//);
        expect(photo.alt.length, path).toBeGreaterThan(12);
        expect(photo.artist.length, path).toBeGreaterThan(0);
        expect(photo.source, path).toMatch(/^https:\/\/commons\.wikimedia\.org\//);
        expect(photo.license.length, path).toBeGreaterThan(0);
      }
    }
  });

  it("has globally unique paths and photo keys", () => {
    const packages = allTourPackages();
    expect(new Set(packages.map((item) => item.path)).size).toBe(packages.length);
    expect(new Set(packages.map((item) => tourPackagePhotoKey(item.tour, item.pkg))).size).toBe(packages.length);
  });

  it("keeps all three one-day Aquila packages and equal-duration Peninsula options distinct", () => {
    const aquila = tours.find((tour) => tour.slug === "aquila-safari")!;
    const paths = aquila.packages.map((pkg) => tourPackagePath(aquila, pkg));
    expect(new Set(paths).size).toBe(3);
    for (const pkg of aquila.packages) {
      const found = findTourPackage("aquila-safari", tourPackageSlug(pkg));
      expect(found?.pkg.title).toBe(pkg.title);
    }
    const peninsula = tours.find((tour) => tour.slug === "cape-peninsula")!;
    expect(new Set(peninsula.packages.map((pkg) => tourPackagePath(peninsula, pkg))).size).toBe(3);
  });

  it("includes every package in static search routes", () => {
    const paths = allListingPaths().map((route) => route.path);
    for (const { path } of allTourPackages()) expect(paths).toContain(path);
  });

  it("returns no package for an unknown URL instead of showing a sibling", () => {
    expect(findTourPackage("aquila-safari", "not-a-package")).toBeUndefined();
    expect(findTourPackage("not-a-tour", "morning")).toBeUndefined();
  });
});
