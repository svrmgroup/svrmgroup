import { describe, it, expect, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  applyAdminInstallSignals,
  INSTALL_SIGNAL_SELECTORS,
} from "./adminInstallSignals";

// Seed jsdom's <head> with the real index.html <head> so we're testing the
// exact static markup shipped to browsers (WebKit/Safari included).
const INDEX_HTML = readFileSync(resolve(__dirname, "../../index.html"), "utf8");
const HEAD_HTML = INDEX_HTML.match(/<head>([\s\S]*?)<\/head>/i)?.[1] ?? "";

function resetHead() {
  document.head.innerHTML = HEAD_HTML;
}

describe("admin install signals", () => {
  beforeEach(resetHead);

  it("static index.html <head> ships zero install signals", () => {
    // Baseline: even before any script runs, the marketing HTML must be
    // devoid of manifest / apple-touch-icon / *-web-app-capable tags. This
    // is what non-JS crawlers and every browser (Safari included) see first.
    for (const sel of INSTALL_SIGNAL_SELECTORS) {
      expect(
        document.head.querySelector(sel),
        `unexpected install signal in index.html: ${sel}`,
      ).toBeNull();
    }
  });

  it("public routes have no install signals after the injector runs", () => {
    for (const path of ["/", "/services", "/portal/abc", "/anything"]) {
      resetHead();
      applyAdminInstallSignals(document, path);
      for (const sel of INSTALL_SIGNAL_SELECTORS) {
        expect(
          document.head.querySelector(sel),
          `install signal leaked onto public route ${path}: ${sel}`,
        ).toBeNull();
      }
    }
  });

  it("/admin and nested admin routes get every install signal", () => {
    for (const path of ["/admin", "/admin/", "/admin/bookings", "/admin/staff/new"]) {
      resetHead();
      applyAdminInstallSignals(document, path);
      for (const sel of INSTALL_SIGNAL_SELECTORS) {
        expect(
          document.head.querySelector(sel),
          `missing install signal on admin route ${path}: ${sel}`,
        ).not.toBeNull();
      }
    }
  });

  it("admin manifest points at the admin-scoped webmanifest", () => {
    applyAdminInstallSignals(document, "/admin");
    const link = document.head.querySelector('link[rel="manifest"]') as HTMLLinkElement | null;
    expect(link?.getAttribute("href")).toBe("/admin-manifest.webmanifest");
  });

  it("navigating admin -> public strips the previously-injected signals", () => {
    applyAdminInstallSignals(document, "/admin");
    // Confirm they were added…
    expect(document.head.querySelector('link[rel="manifest"]')).not.toBeNull();
    // …then leaving admin must remove every one.
    applyAdminInstallSignals(document, "/");
    for (const sel of INSTALL_SIGNAL_SELECTORS) {
      expect(document.head.querySelector(sel), `signal survived on /: ${sel}`).toBeNull();
    }
  });

  it("does not duplicate signals when the injector runs twice on /admin", () => {
    applyAdminInstallSignals(document, "/admin");
    applyAdminInstallSignals(document, "/admin");
    for (const sel of INSTALL_SIGNAL_SELECTORS) {
      expect(document.head.querySelectorAll(sel).length).toBe(1);
    }
  });
});
