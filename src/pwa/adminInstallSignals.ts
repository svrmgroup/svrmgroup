// Install-prompt signals (web-app manifest, apple-touch-icon, mobile-web-app
// capability meta) must ONLY exist while the visitor is inside the /admin
// console. On every other route we strip them so browsers never offer
// "Add to Home Screen" / install-app on the public marketing site.
//
// Extracted from src/main.tsx so it can be unit-tested against jsdom.

interface SignalSpec {
  selector: string;
  create: (doc: Document) => HTMLElement;
}

const SIGNALS: SignalSpec[] = [
  {
    selector: 'link[rel="manifest"]',
    create: (doc) => {
      const el = doc.createElement("link");
      el.setAttribute("rel", "manifest");
      el.setAttribute("href", "/admin-manifest.webmanifest");
      return el;
    },
  },
  {
    selector: 'link[rel="apple-touch-icon"]',
    create: (doc) => {
      const el = doc.createElement("link");
      el.setAttribute("rel", "apple-touch-icon");
      el.setAttribute("sizes", "180x180");
      el.setAttribute("href", "/svrm-icon-180.png");
      return el;
    },
  },
  {
    selector: 'meta[name="apple-mobile-web-app-capable"]',
    create: (doc) => {
      const el = doc.createElement("meta");
      el.setAttribute("name", "apple-mobile-web-app-capable");
      el.setAttribute("content", "yes");
      return el;
    },
  },
  {
    selector: 'meta[name="mobile-web-app-capable"]',
    create: (doc) => {
      const el = doc.createElement("meta");
      el.setAttribute("name", "mobile-web-app-capable");
      el.setAttribute("content", "yes");
      return el;
    },
  },
  {
    selector: 'meta[name="apple-mobile-web-app-status-bar-style"]',
    create: (doc) => {
      const el = doc.createElement("meta");
      el.setAttribute("name", "apple-mobile-web-app-status-bar-style");
      el.setAttribute("content", "black-translucent");
      return el;
    },
  },
  {
    selector: 'meta[name="apple-mobile-web-app-title"]',
    create: (doc) => {
      const el = doc.createElement("meta");
      el.setAttribute("name", "apple-mobile-web-app-title");
      el.setAttribute("content", "SVRM Admin");
      return el;
    },
  },
];

export const INSTALL_SIGNAL_SELECTORS = SIGNALS.map((s) => s.selector);

export function isAdminPath(pathname: string): boolean {
  return pathname.startsWith("/admin");
}

/** Adds install signals under /admin, strips them everywhere else. */
export function applyAdminInstallSignals(doc: Document, pathname: string): void {
  const enable = isAdminPath(pathname);
  for (const spec of SIGNALS) {
    if (enable) {
      if (!doc.head.querySelector(spec.selector)) {
        doc.head.appendChild(spec.create(doc));
      }
    } else {
      doc.head.querySelectorAll(spec.selector).forEach((el) => el.remove());
    }
  }
}
