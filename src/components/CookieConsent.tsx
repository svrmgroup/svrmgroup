import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CONSENT_EVENT, isConsentRequiredRegion, loadGoogleAds, saveConsent, storedChoice, updateConsent } from "@/lib/adsConsent";

export const OPEN_COOKIE_SETTINGS = "svrm-open-cookie-settings";
export const openCookieSettings = () => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS));

/** Regional cookie banner: only UK/EEA/CH/Quebec visitors without a saved choice see it. */
const CookieConsent = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (window.location.pathname.startsWith("/admin")) return;
    const choice = storedChoice();
    if (choice) updateConsent(choice);
    void loadGoogleAds();
    if (!choice) void isConsentRequiredRegion().then((req) => { if (req && !storedChoice()) setOpen(true); });
    const onOpen = () => setOpen(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== "cookie_consent") return;
      const c = storedChoice();
      if (c) { updateConsent(c); if (c === "granted") void loadGoogleAds(); }
      window.dispatchEvent(new Event(CONSENT_EVENT));
    };
    window.addEventListener(OPEN_COOKIE_SETTINGS, onOpen);
    window.addEventListener("storage", onStorage);
    return () => { window.removeEventListener(OPEN_COOKIE_SETTINGS, onOpen); window.removeEventListener("storage", onStorage); };
  }, []);

  if (!open) return null;
  const choose = (d: "granted" | "denied") => { saveConsent(d); setOpen(false); };

  return (
    <div role="dialog" aria-modal="false" aria-labelledby="cookie-title" className="fixed inset-x-4 bottom-4 md:left-6 md:right-auto md:max-w-md z-[60] bg-surface-raised border border-primary/40 p-6 shadow-lg">
      <p id="cookie-title" className="eyebrow">Cookies</p>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        With your permission, we use Google Ads cookies to measure which ads lead to enquiries. They share
        visit and enquiry data with Google for advertising measurement. You can change this anytime under
        "Cookie settings". <Link to="/privacy" className="text-gold underline underline-offset-4">Privacy policy</Link>
      </p>
      <div className="mt-5 flex gap-3">
        <Button variant="outline" className="flex-1" onClick={() => choose("denied")}>Reject</Button>
        <Button className="flex-1" onClick={() => choose("granted")}>Accept</Button>
      </div>
    </div>
  );
};

export default CookieConsent;
