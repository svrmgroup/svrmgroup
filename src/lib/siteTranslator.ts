import { protectContactNodes } from "@/lib/protectContacts";

const STORAGE_KEY = "svrm-lang";
const RTL_LANGS = ["ar", "he", "fa", "ur"];
const SKIP_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "TEXTAREA",
  "INPUT",
  "SELECT",
  "OPTION",
  "CODE",
  "PRE",
  "SVG",
  "CANVAS",
  "VIDEO",
  "AUDIO",
]);
const TRANSLATABLE_ATTRS = ["aria-label", "title", "placeholder", "alt"] as const;
const LETTER_RE = /\p{L}/u;
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_RE = /(\+?27[\s-]?7\d{1,2}[\s-]?\d{3}[\s-]?\d{4}|0\s?7\d{1,2}[\s-]?\d{3}[\s-]?\d{4})/i;
const SEPARATOR = "\n[[SVRM_TRANSLATION_BREAK]]\n";

let runId = 0;
let observer: MutationObserver | null = null;
let observerTimer: number | undefined;
const memoryCache = new Map<string, string>();
const originalTextNodes = new WeakMap<Text, string>();
const inflight = new Map<string, Promise<string>>();
const CACHE_PREFIX = "svrm-tr:";
const persistQueue = new Map<string, string>();
let persistTimer: number | undefined;

export const getSavedLanguage = () => localStorage.getItem(STORAGE_KEY) || "en";

export const isRtlLanguage = (lang: string) => RTL_LANGS.includes(lang);

export const applyDocumentLanguage = (lang: string) => {
  const active = lang || "en";
  document.documentElement.setAttribute("dir", isRtlLanguage(active) ? "rtl" : "ltr");
  document.documentElement.setAttribute("lang", active);
};

const hasContactDetails = (text: string) => EMAIL_RE.test(text) || PHONE_RE.test(text);

const shouldSkipElement = (el: Element | null): boolean => {
  let current = el;
  while (current) {
    if (current.id === "google_translate_element") return true;
    if (current.classList?.contains("notranslate")) return true;
    if (current.getAttribute("translate") === "no") return true;
    if ((current as HTMLElement).dataset?.svrmI18n === "true") return true;
    if (SKIP_TAGS.has(current.tagName)) return true;
    current = current.parentElement;
  }
  return false;
};

const canTranslate = (text: string): boolean => {
  const trimmed = text.trim();
  if (trimmed.length < 2) return false;
  if (!LETTER_RE.test(trimmed)) return false;
  if (hasContactDetails(trimmed)) return false;
  return true;
};

const cacheKey = (lang: string, text: string) => `${lang}::${text}`;

const readCached = (lang: string, text: string) => {
  const key = cacheKey(lang, text);
  const mem = memoryCache.get(key);
  if (mem !== undefined) return mem;
  try {
    const stored = localStorage.getItem(CACHE_PREFIX + key);
    if (stored !== null) {
      memoryCache.set(key, stored);
      return stored;
    }
  } catch {}
  return undefined;
};

const flushPersist = () => {
  try {
    persistQueue.forEach((value, key) => {
      try { localStorage.setItem(CACHE_PREFIX + key, value); } catch {}
    });
  } finally {
    persistQueue.clear();
    persistTimer = undefined;
  }
};

const writeCached = (lang: string, text: string, translated: string) => {
  const key = cacheKey(lang, text);
  memoryCache.set(key, translated);
  persistQueue.set(key, translated);
  if (persistTimer === undefined) {
    persistTimer = window.setTimeout(flushPersist, 500);
  }
};


const fetchTranslationBatch = async (texts: string[], lang: string): Promise<string[]> => {
  if (lang === "en") return texts;
  const combined = texts.join(SEPARATOR);
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "en");
  url.searchParams.set("tl", lang);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", combined);

  const response = await fetch(url.toString());
  if (!response.ok) throw new Error("Translation request failed");
  const data = await response.json();
  const translated = Array.isArray(data?.[0])
    ? data[0].map((part: unknown[]) => part?.[0] || "").join("")
    : "";
  const split = translated.split(SEPARATOR);
  if (split.length !== texts.length) throw new Error("Translation split mismatch");
  return split;
};

const translateMany = async (texts: string[], lang: string): Promise<Map<string, string>> => {
  const output = new Map<string, string>();
  const missing = Array.from(new Set(texts)).filter((text) => {
    const cached = readCached(lang, text);
    if (cached) output.set(text, cached);
    return !cached;
  });

  const chunks: string[][] = [];
  let current: string[] = [];
  let currentLength = 0;
  for (const text of missing) {
    if (current.length && (current.length >= 24 || currentLength + text.length > 2500)) {
      chunks.push(current);
      current = [];
      currentLength = 0;
    }
    current.push(text);
    currentLength += text.length + SEPARATOR.length;
  }
  if (current.length) chunks.push(current);

  for (const chunk of chunks) {
    try {
      const translated = await fetchTranslationBatch(chunk, lang);
      chunk.forEach((text, index) => {
        const value = translated[index] || text;
        writeCached(lang, text, value);
        output.set(text, value);
      });
    } catch {
      await Promise.all(
        chunk.map(async (text) => {
          try {
            const [translated] = await fetchTranslationBatch([text], lang);
            writeCached(lang, text, translated || text);
            output.set(text, translated || text);
          } catch {
            output.set(text, text);
          }
        }),
      );
    }
  }

  return output;
};

const splitOuterWhitespace = (text: string) => {
  const leading = text.match(/^\s*/)?.[0] || "";
  const trailing = text.match(/\s*$/)?.[0] || "";
  const core = text.slice(leading.length, text.length - trailing.length);
  return { leading, core, trailing };
};

const collectTextTargets = (root: ParentNode) => {
  const targets: Array<{ node: Text; original: string; leading: string; core: string; trailing: string }> = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const text = originalTextNodes.get(node as Text) || node.nodeValue || "";
      const parent = (node as Text).parentElement;
      if (!parent || shouldSkipElement(parent)) return NodeFilter.FILTER_REJECT;
      return canTranslate(text) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });

  let node = walker.nextNode();
  while (node) {
    const textNode = node as Text;
    const original = originalTextNodes.get(textNode) || textNode.nodeValue || "";
    originalTextNodes.set(textNode, original);
    const { leading, core, trailing } = splitOuterWhitespace(original);
    if (canTranslate(core)) targets.push({ node: textNode, original, leading, core, trailing });
    node = walker.nextNode();
  }

  return targets;
};

const collectAttributeTargets = (root: ParentNode) => {
  const targets: Array<{ el: Element; attr: (typeof TRANSLATABLE_ATTRS)[number]; text: string }> = [];
  const elements = root instanceof Element ? [root, ...Array.from(root.querySelectorAll("*"))] : Array.from(document.body.querySelectorAll("*"));

  elements.forEach((el) => {
    if (shouldSkipElement(el)) return;
    TRANSLATABLE_ATTRS.forEach((attr) => {
      const current = el.getAttribute(attr);
      if (!current || !canTranslate(current)) return;
      const key = `svrmOriginal${attr.replace(/[^a-z]/gi, "")}`;
      const stored = (el as HTMLElement).dataset[key] || current;
      (el as HTMLElement).dataset[key] = stored;
      targets.push({ el, attr, text: stored });
    });
  });

  return targets;
};

export const translatePage = async (lang = getSavedLanguage(), root: ParentNode = document.body) => {
  if (typeof window === "undefined" || !root) return;
  const thisRun = ++runId;
  applyDocumentLanguage(lang);
  protectContactNodes(root);
  const textTargets = collectTextTargets(root);
  const attrTargets = collectAttributeTargets(root);
  const originals = [
    ...textTargets.map((target) => target.core),
    ...attrTargets.map((target) => target.text),
  ];

  if (lang === "en") {
    textTargets.forEach(({ node, original }) => {
      node.nodeValue = original;
    });
    attrTargets.forEach(({ el, attr, text }) => el.setAttribute(attr, text));
    return;
  }

  const translations = await translateMany(originals, lang);
  if (thisRun !== runId || getSavedLanguage() !== lang) return;

  textTargets.forEach(({ node, leading, core, trailing }) => {
    node.nodeValue = `${leading}${translations.get(core) || core}${trailing}`;
  });
  attrTargets.forEach(({ el, attr, text }) => {
    el.setAttribute(attr, translations.get(text) || text);
  });
};

export const startTranslationObserver = () => {
  if (typeof window === "undefined" || observer || !document.body) return;
  observer = new MutationObserver(() => {
    const lang = getSavedLanguage();
    if (lang === "en") return;
    window.clearTimeout(observerTimer);
    observerTimer = window.setTimeout(() => translatePage(lang), 120);
  });
  observer.observe(document.body, { childList: true, subtree: true });

};