import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Globe, ChevronDown, Check } from "lucide-react";

type Lang = { code: string; label: string; native: string };

const LANGUAGES: Lang[] = [
  { code: "en", label: "English", native: "English" },
  { code: "ar", label: "Arabic", native: "العربية" },
  { code: "zh-CN", label: "Chinese (Simplified)", native: "简体中文" },
  { code: "zh-TW", label: "Chinese (Traditional)", native: "繁體中文" },
  { code: "fr", label: "French", native: "Français" },
  { code: "de", label: "German", native: "Deutsch" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "pt", label: "Portuguese", native: "Português" },
  { code: "it", label: "Italian", native: "Italiano" },
  { code: "ru", label: "Russian", native: "Русский" },
  { code: "ja", label: "Japanese", native: "日本語" },
  { code: "ko", label: "Korean", native: "한국어" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "nl", label: "Dutch", native: "Nederlands" },
  { code: "tr", label: "Turkish", native: "Türkçe" },
  { code: "pl", label: "Polish", native: "Polski" },
  { code: "sv", label: "Swedish", native: "Svenska" },
  { code: "af", label: "Afrikaans", native: "Afrikaans" },
  { code: "zu", label: "Zulu", native: "isiZulu" },
  { code: "xh", label: "Xhosa", native: "isiXhosa" },
  { code: "he", label: "Hebrew", native: "עברית" },
  { code: "th", label: "Thai", native: "ไทย" },
  { code: "vi", label: "Vietnamese", native: "Tiếng Việt" },
  { code: "id", label: "Indonesian", native: "Bahasa Indonesia" },
];

const STORAGE_KEY = "svrm-lang";
const GEO_DONE_KEY = "svrm-lang-geo-checked";

// Country → preferred site language. ZA stays English (per user request).
const COUNTRY_LANG: Record<string, string> = {
  AE: "ar", SA: "ar", QA: "ar", KW: "ar", OM: "ar", BH: "ar",
  EG: "ar", MA: "ar", JO: "ar", LB: "ar", IQ: "ar", DZ: "ar", TN: "ar",
  CN: "zh-CN", HK: "zh-TW", TW: "zh-TW", SG: "zh-CN",
  FR: "fr", BE: "fr", LU: "fr", CI: "fr", SN: "fr",
  DE: "de", AT: "de", CH: "de",
  ES: "es", MX: "es", AR: "es", CL: "es", CO: "es", PE: "es",
  PT: "pt", BR: "pt", AO: "pt", MZ: "pt",
  IT: "it",
  RU: "ru", BY: "ru", KZ: "ru",
  JP: "ja",
  KR: "ko",
  IN: "hi",
  NL: "nl",
  TR: "tr",
  PL: "pl",
  SE: "sv",
  IL: "he",
  TH: "th",
  VN: "vi",
  ID: "id",
};

const setCookie = (lang: string) => {
  const value = lang === "en" ? "" : `/en/${lang}`;
  const host = window.location.hostname;
  if (!value) {
    // Clear cookie variants
    ["", `;domain=${host}`, `;domain=.${host}`].forEach((d) => {
      document.cookie = `googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT${d}`;
    });
    return;
  }
  document.cookie = `googtrans=${value};path=/`;
  document.cookie = `googtrans=${value};path=/;domain=${host}`;
};

const RTL_LANGS = ["ar", "he", "fa", "ur"];
const applyDir = (lang: string) => {
  const isRtl = RTL_LANGS.includes(lang);
  document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
  document.documentElement.setAttribute("lang", lang || "en");
};

const applyToGoogleSelect = (lang: string, attempts = 0) => {
  const sel = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
  if (!sel) {
    if (attempts < 30) setTimeout(() => applyToGoogleSelect(lang, attempts + 1), 200);
    return;
  }
  sel.value = lang === "en" ? "" : lang;
  sel.dispatchEvent(new Event("change"));
};

const LanguageSwitch = ({ className = "" }: { className?: string }) => {
  const [current, setCurrent] = useState<string>("en");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Keep <html dir> + lang in sync with current language
  useEffect(() => {
    applyDir(current);
  }, [current]);



  // Initial: load saved → else geo-detect
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setCurrent(saved);
      if (saved !== "en") applyToGoogleSelect(saved);
      return;
    }
    if (sessionStorage.getItem(GEO_DONE_KEY)) return;
    sessionStorage.setItem(GEO_DONE_KEY, "1");
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((d) => {
        const country: string | undefined = d?.country_code;
        if (!country || country === "ZA") return; // ZA → English
        const lang = COUNTRY_LANG[country];
        if (!lang) return;
        localStorage.setItem(STORAGE_KEY, lang);
        setCurrent(lang);
        setCookie(lang);
        applyToGoogleSelect(lang);
      })
      .catch(() => {});
  }, []);

  // Re-apply translation on every SPA navigation
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved !== "en") {
      setTimeout(() => applyToGoogleSelect(saved), 250);
    }
  }, [location.pathname]);

  // Honour ?lang= URL param (deep-links from hreflang alternates)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("lang");
    if (q && LANGUAGES.some((l) => l.code === q) && q !== localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, q);
      setCookie(q);
      setCurrent(q);
      applyToGoogleSelect(q);
    }
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const choose = (code: string) => {
    const prev = localStorage.getItem(STORAGE_KEY) || "en";
    localStorage.setItem(STORAGE_KEY, code);
    setCookie(code);
    setCurrent(code);
    setOpen(false);
    // Notify currency/locale-aware components without a full reload
    window.dispatchEvent(new CustomEvent("svrm-lang-change", { detail: code }));
    // Google Translate only reliably (re)translates the whole page when it
    // bootstraps from the `googtrans` cookie at load. The hidden `.goog-te-combo`
    // shortcut is not available in every embed/iframe context, so we always
    // reload after a language change.
    if (code === "en") setCookie("");
    if (code !== prev) {
      window.location.reload();
      return;
    }
  };


  const active = LANGUAGES.find((l) => l.code === current) || LANGUAGES[0];
  const badge =
    active.code === "zh-CN" || active.code === "zh-TW" ? "ZH" : active.code.toUpperCase();

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 border border-border/60 px-2.5 py-1 text-[11px] tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors notranslate"
        aria-haspopup="listbox"
        aria-expanded={open}
        translate="no"
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="uppercase">{badge}</span>
        <ChevronDown className="h-3 w-3 opacity-70" />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-2 z-50 w-60 max-h-80 overflow-y-auto bg-surface-deep/95 backdrop-blur-md border border-border/60 shadow-lg notranslate"
          translate="no"
        >
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => choose(l.code)}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-[11px] uppercase tracking-[0.18em] transition-colors ${
                current === l.code
                  ? "text-gold bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
              }`}
            >
              <span className="flex flex-col">
                <span>{l.label}</span>
                <span className="text-[10px] normal-case tracking-normal opacity-60">{l.native}</span>
              </span>
              {current === l.code && <Check className="h-3 w-3" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitch;
