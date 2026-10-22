// Google Ads loading, regional consent and conversion reporting.
// Banner route: UK/EEA/CH/Quebec visitors are measured only after they accept.

declare global {
  interface Window { dataLayer: unknown[]; gtag?: (...args: unknown[]) => void }
}

/** Both SVRM Google Ads accounts receive conversions (new account + earlier account). */
export const ADS_IDS = ["AW-18529194342", "AW-18245038892"] as const;
export const CONVERSIONS = {
  whatsapp: ["AW-18529194342/xrjyCNDU6aQdEOaitINF", "AW-18245038892/rByJCMiI39QcEKzm9PtD"],
  enquiry: ["AW-18529194342/vzroCNPU6aQdEOaitINF", "AW-18245038892/tGk6CPzmk6YdEKzm9PtD"],
} as const;

export const STORAGE_KEY = "cookie_consent";
export const CONSENT_NOTICE_VERSION = "2026-10-21";
export const CONSENT_EVENT = "svrm-consent-change";
const CONSENT_COUNTRIES = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB','CH','CA'];
let consentRegion: Promise<boolean> | undefined;

export function isConsentRequiredRegion(): Promise<boolean> {
  return consentRegion ??= lookupConsentRegion();
}

async function lookupConsentRegion(): Promise<boolean> {
  try {
    const res = await fetch("/cdn-cgi/trace", { signal: AbortSignal.timeout(2000) });
    if (!res.ok) return true;
    const country = (await res.text()).match(/^loc=([A-Z0-9]{2})$/m)?.[1];
    if (!country || country === "XX" || country === "T1") return true;
    return CONSENT_COUNTRIES.includes(country);
  } catch {
    return true;
  }
}

export function storedChoice(): "granted" | "denied" | null {
  const v = localStorage.getItem(STORAGE_KEY);
  return v === "granted" || v === "denied" ? v : null;
}

export async function canTrackAds(): Promise<boolean> {
  const choice = storedChoice();
  if (choice !== null) return choice === "granted";
  const required = await isConsentRequiredRegion();
  const latest = storedChoice();
  return latest !== null ? latest === "granted" : !required;
}

export function updateConsent(decision: "granted" | "denied") {
  if (decision === "denied") window.gtag?.("set", "user_data", null);
  window.gtag?.("consent", "update", { ad_storage: decision, ad_user_data: decision, ad_personalization: decision });
}

/** Persist a visitor's choice with when and which notice version they saw. */
export function saveConsent(decision: "granted" | "denied") {
  localStorage.setItem(STORAGE_KEY, decision);
  localStorage.setItem(`${STORAGE_KEY}_record`, JSON.stringify({ decision, at: new Date().toISOString(), notice: CONSENT_NOTICE_VERSION }));
  updateConsent(decision);
  window.dispatchEvent(new Event(CONSENT_EVENT));
  if (decision === "granted") void loadGoogleAds();
}

export async function loadGoogleAds() {
  const allowed = await canTrackAds();
  if (!allowed) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  updateConsent("granted");
  if (document.querySelector("script[data-google-ads]")) return;
  window.gtag("set", "developer_id.dZjgwMW", true);
  window.gtag("js", new Date());
  for (const id of ADS_IDS) window.gtag("config", id);
  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ADS_IDS[0]}`;
  script.async = true;
  script.dataset.googleAds = "";
  document.head.appendChild(script);
}

/** Report a conversion to every configured account, only when tracking is allowed. Never throws. */
export async function reportConversion(kind: keyof typeof CONVERSIONS) {
  try {
    if (!(await canTrackAds())) return;
    await loadGoogleAds();
    for (const send_to of CONVERSIONS[kind]) window.gtag?.("event", "conversion", { send_to });
  } catch {
    /* tracking must never break UX */
  }
}
