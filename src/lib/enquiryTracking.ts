// Enquiry references, per-service WhatsApp messages and ad attribution.
// Click IDs (gclid/gbraid/wbraid) are only kept in browser storage or sent with an
// enquiry when advertising measurement is allowed; names, phones and messages are
// never sent to analytics.
import { canTrackAds, CONSENT_EVENT } from "@/lib/adsConsent";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

export type Service =
  | "tours" | "chauffeur" | "airport_transfer" | "honeymoon" | "occasion"
  | "secure_transport" | "stays" | "rentals" | "experiences" | "general";

const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I

/** Short, human-readable reference a guest can quote, e.g. "SV-7K3QP". */
export function newReference(random: () => number = Math.random): string {
  let s = "";
  for (let i = 0; i < 5; i++) s += REF_ALPHABET[Math.floor(random() * REF_ALPHABET.length)];
  return `SV-${s}`;
}

export function serviceFromPath(path: string): Service {
  const p = (path || "/").toLowerCase();
  if (p.startsWith("/tours")) return "tours";
  if (p.startsWith("/chauffeur") || p.startsWith("/vehicle")) return "chauffeur";
  if (p.startsWith("/airport-transfers")) return "airport_transfer";
  if (p.startsWith("/honeymoon")) return "honeymoon";
  if (p.startsWith("/anniversary")) return "occasion";
  if (p.startsWith("/security")) return "secure_transport";
  if (p.startsWith("/stays") || p.startsWith("/stay")) return "stays";
  if (p.startsWith("/rentals")) return "rentals";
  if (p.startsWith("/experiences") || p.startsWith("/lifestyle")) return "experiences";
  return "general";
}

const EN: Record<Service, string> = {
  tours: "Hi SVRM, I'd like a private tour on [date] for [number] guests. We're staying in [area].",
  chauffeur: "Hi SVRM, I'd like a private chauffeur from [date] for [number] days, for [number] guests. Pickup area: [area].",
  airport_transfer: "Hi SVRM, I'd like a private airport transfer on [date] for [number] guests with [number] bags, to [hotel or area].",
  honeymoon: "Hi SVRM, we're planning our Cape Town honeymoon from [dates] and would love your help with the itinerary.",
  occasion: "Hi SVRM, I'd like to plan a special occasion in Cape Town on [date] for [number] guests.",
  secure_transport: "Hi SVRM, I'd like to request a discreet secure transfer on [date] for [number] guests. I'll share further details privately.",
  stays: "Hi SVRM, I'm interested in a stay from [dates] for [number] guests.",
  rentals: "Hi SVRM, I'd like to enquire about a vehicle from [date] to [date].",
  experiences: "Hi SVRM, I'd like help arranging an experience in Cape Town on [date] for [number] guests.",
  general: "Hi SVRM, I'd like to check December availability. Dates: [date]. Guests: [number].",
};

const DE: Partial<Record<Service, string>> = {
  tours: "Hallo SVRM, ich möchte eine private Tour am [Datum] für [Anzahl] Personen. Wir wohnen in [Gegend].",
  chauffeur: "Hallo SVRM, ich möchte einen privaten Fahrer ab [Datum] für [Anzahl] Tage, für [Anzahl] Personen. Abholung: [Gegend].",
  airport_transfer: "Hallo SVRM, ich möchte einen privaten Flughafentransfer am [Datum] für [Anzahl] Personen mit [Anzahl] Gepäckstücken nach [Hotel].",
  general: "Hallo SVRM, ich möchte die Verfügbarkeit im Dezember anfragen. Datum: [Datum]. Personen: [Anzahl].",
};

export function serviceMessage(path: string, lang = "en"): string {
  const service = serviceFromPath(path);
  const p = (path || "").toLowerCase();
  if (lang === "de") {
    if (p.startsWith("/tours/cape-peninsula")) return "Hallo SVRM, ich möchte eine private Kap-Halbinsel-Tour am [Datum] für [Anzahl] Personen. Wir wohnen in [Gegend].";
    if (DE[service]) return DE[service]!;
  }
  if (p.startsWith("/tours/cape-peninsula")) return "Hi SVRM, I'd like a private Cape Peninsula tour on [date] for [number] guests. We're staying in [area].";
  return EN[service];
}

/** The site's single generic prefill; links carrying it get the per-service message instead. */
export const GENERIC_PREFILL_START = "Hi SVRM Group, I'd like to make an enquiry.";

/** Rewrite a wa.me link: generic prefills become the per-service message; every link gets the reference. */
export function withServiceMessage(href: string, path: string, reference: string, lang = "en"): string {
  let url: URL;
  try { url = new URL(href); } catch { return href; }
  if (!url.hostname.endsWith("wa.me")) return href;
  const existing = url.searchParams.get("text") || "";
  const base = !existing || existing.startsWith(GENERIC_PREFILL_START) ? serviceMessage(path, lang) : existing.replace(/\s*Ref: SV-[A-Z0-9]{5,8}\s*$/, "");
  const label = lang === "de" ? "Referenz" : "Ref";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`${base}\n\n${label}: ${reference}`)}`;
}

// ---------------- attribution ----------------

export type Attribution = {
  gclid: string | null; gbraid: string | null; wbraid: string | null;
  utm_source: string | null; utm_medium: string | null; utm_campaign: string | null; utm_term: string | null;
  landing_path: string | null;
};

const ATTR_KEY = "svrm-attribution";
const MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;
const CLICK_KEYS = ["gclid", "gbraid", "wbraid"] as const;
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term"] as const;
let pending: (Attribution & { at: number }) | null = null;

const clip = (v: string | null, n: number) => (v ? v.slice(0, n) : null);

export function parseAttribution(search: string, path: string): Attribution | null {
  const q = new URLSearchParams(search);
  const hasAny = [...CLICK_KEYS, ...UTM_KEYS].some((k) => q.get(k));
  if (!hasAny) return null;
  return {
    gclid: clip(q.get("gclid"), 200), gbraid: clip(q.get("gbraid"), 200), wbraid: clip(q.get("wbraid"), 200),
    utm_source: clip(q.get("utm_source"), 120), utm_medium: clip(q.get("utm_medium"), 120),
    utm_campaign: clip(q.get("utm_campaign"), 200), utm_term: clip(q.get("utm_term"), 200),
    landing_path: clip(path, 300),
  };
}

function readStored(): (Attribution & { at: number }) | null {
  try {
    const raw = localStorage.getItem(ATTR_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    if (!v?.at || Date.now() - v.at > MAX_AGE_MS) return null;
    return v;
  } catch { return null; }
}

async function persistIfAllowed() {
  if (!pending) return;
  if (await canTrackAds()) {
    try { localStorage.setItem(ATTR_KEY, JSON.stringify(pending)); } catch { /* ignore */ }
  } else {
    // Without ad consent only non-identifying campaign tags may be stored.
    const { gclid: _g, gbraid: _b, wbraid: _w, ...rest } = pending;
    try { localStorage.setItem(ATTR_KEY, JSON.stringify({ ...rest, gclid: null, gbraid: null, wbraid: null })); } catch { /* ignore */ }
  }
}

/** Call on every navigation. Keeps the latest ad landing in memory; persists per consent. */
export function captureAttribution(search: string, path: string) {
  const parsed = parseAttribution(search, path);
  if (!parsed) return;
  pending = { ...parsed, at: Date.now() };
  void persistIfAllowed();
}

if (typeof window !== "undefined") {
  window.addEventListener(CONSENT_EVENT, () => { void persistIfAllowed(); });
}

/** Fields to store with an enquiry or WhatsApp tap. Click IDs only when ad measurement is allowed. */
export async function trackingFields(path: string): Promise<Attribution & { service: Service; ad_consent: boolean }> {
  const allowed = await canTrackAds();
  const a = pending ?? readStored();
  return {
    service: serviceFromPath(path),
    ad_consent: allowed,
    gclid: allowed ? a?.gclid ?? null : null,
    gbraid: allowed ? a?.gbraid ?? null : null,
    wbraid: allowed ? a?.wbraid ?? null : null,
    utm_source: a?.utm_source ?? null, utm_medium: a?.utm_medium ?? null,
    utm_campaign: a?.utm_campaign ?? null, utm_term: a?.utm_term ?? null,
    landing_path: a?.landing_path ?? null,
  };
}

/** Whole days covered by an inclusive date range, e.g. 1–5 Dec = 5 chauffeur days. */
export function inclusiveDays(from: Date, to: Date): number {
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.max(1, Math.round((b - a) / 86400000) + 1);
}

// ---------------- Google Ads offline import ----------------

export type StageRow = {
  gclid: string | null; ad_consent: boolean; is_employment: boolean; is_duplicate: boolean;
  qualified_at: string | null; quote_sent_at: string | null; deposit_paid_at: string | null; completed_at: string | null;
  contribution: number | null;
};

/** Conversion names must match the Google Ads upload actions exactly. */
export const IMPORT_ACTIONS = {
  qualified_at: "Qualified enquiry",
  quote_sent_at: "Quote sent",
  deposit_paid_at: "Deposit paid",
  completed_at: "Completed booking",
} as const;

const sast = (iso: string) => {
  const d = new Date(new Date(iso).getTime() + 2 * 3600 * 1000); // Africa/Johannesburg, no DST
  return d.toISOString().slice(0, 19).replace("T", " ");
};

/** Google Ads click-conversion import sheet; skips rows without consent, click ID, or flagged as job/duplicate. */
export function buildImportCsv(rows: StageRow[]): string {
  const lines = ["Parameters:TimeZone=Africa/Johannesburg", "Google Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency"];
  for (const r of rows) {
    if (!r.gclid || !/^[A-Za-z0-9_-]+$/.test(r.gclid) || !r.ad_consent || r.is_employment || r.is_duplicate) continue;
    for (const key of Object.keys(IMPORT_ACTIONS) as (keyof typeof IMPORT_ACTIONS)[]) {
      const at = r[key];
      if (!at) continue;
      const value = key === "completed_at" && r.contribution != null ? String(r.contribution) : "";
      lines.push([r.gclid, IMPORT_ACTIONS[key], sast(at), value, value ? "ZAR" : ""].join(","));
    }
  }
  return lines.join("\n");
}
