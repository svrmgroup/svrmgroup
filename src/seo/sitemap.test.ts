import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const root = path.resolve(__dirname, "../..");
const sitemap = fs.readFileSync(path.join(root, "public/sitemap.xml"), "utf8");
const app = fs.readFileSync(path.join(root, "src/App.tsx"), "utf8");
const routes = [...app.matchAll(/<Route path="([^"]+)" element=\{<(?!Navigate|TravelRedirect)/g)].map((m) => m[1]);
const matches = (p: string) => routes.some((r) => new RegExp("^" + r.replace(/:[^/]+/g, "[^/]+") + "$").test(p));

describe("sitemap", () => {
  it("lists only live, non-redirect public pages", () => {
    const paths = [...sitemap.matchAll(/<loc>https:\/\/svrm\.group([^<]*)<\/loc>/g)].map((m) => m[1] || "/");
    expect(paths.length).toBeGreaterThan(0);
    const bad = paths.filter((p) => !matches(p.replace(/\/$/, "") || "/"));
    expect(bad).toEqual([]);
  });
  it("never lists /travel or admin pages", () => {
    expect(sitemap).not.toMatch(/svrm\.group\/(travel|admin)/);
  });
});
