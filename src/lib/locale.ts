// Map our app language codes (Google Translate codes) to BCP47 locales
// used by Intl.NumberFormat / Intl.DateTimeFormat.
const LANG_TO_LOCALE: Record<string, string> = {
  en: "en-ZA",
  ar: "ar",
  "zh-CN": "zh-CN",
  "zh-TW": "zh-TW",
  fr: "fr-FR",
  de: "de-DE",
  es: "es-ES",
  pt: "pt-PT",
  it: "it-IT",
  ru: "ru-RU",
  ja: "ja-JP",
  ko: "ko-KR",
  hi: "hi-IN",
  nl: "nl-NL",
  tr: "tr-TR",
  pl: "pl-PL",
  sv: "sv-SE",
  af: "af-ZA",
  zu: "zu-ZA",
  xh: "xh-ZA",
  he: "he-IL",
  th: "th-TH",
  vi: "vi-VN",
  id: "id-ID",
  fa: "fa-IR",
  ur: "ur-PK",
};

export const getActiveLang = (): string => {
  if (typeof window === "undefined") return "en";
  return localStorage.getItem("svrm-lang") || "en";
};

export const getActiveLocale = (): string => {
  const lang = getActiveLang();
  return LANG_TO_LOCALE[lang] || lang || "en-ZA";
};

/** Subscribe to language changes (storage events + a custom 'svrm-lang-change' event). */
export const onLocaleChange = (cb: () => void): (() => void) => {
  const handler = () => cb();
  window.addEventListener("storage", handler);
  window.addEventListener("svrm-lang-change", handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("svrm-lang-change", handler);
  };
};

export const formatNumber = (
  value: number,
  options?: Intl.NumberFormatOptions,
  locale = getActiveLocale()
): string => new Intl.NumberFormat(locale, options).format(value);

export const formatCurrency = (
  value: number,
  currency: string,
  locale = getActiveLocale()
): string => {
  const noDecimals = ["ZAR", "JPY", "INR", "CNY"].includes(currency);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: noDecimals ? 0 : 2,
    minimumFractionDigits: noDecimals ? 0 : 0,
  }).format(value);
};

export const formatDate = (
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" },
  locale = getActiveLocale()
): string => new Intl.DateTimeFormat(locale, options).format(new Date(date));

export const formatTime = (
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" },
  locale = getActiveLocale()
): string => new Intl.DateTimeFormat(locale, options).format(new Date(date));

export const formatDateTime = (
  date: Date | string | number,
  locale = getActiveLocale()
): string =>
  new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));

export const formatDateRange = (
  start: Date | string | number,
  end: Date | string | number,
  options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" },
  locale = getActiveLocale()
): string => {
  const fmt = new Intl.DateTimeFormat(locale, options);
  // formatRange is widely supported in modern browsers
  const anyFmt = fmt as unknown as { formatRange?: (a: Date, b: Date) => string };
  if (anyFmt.formatRange) return anyFmt.formatRange(new Date(start), new Date(end));
  return `${fmt.format(new Date(start))} – ${fmt.format(new Date(end))}`;
};
