import { useEffect, useRef, useState } from "react";
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

const COOKIE_NAME = "googtrans";

const setCookie = (value: string) => {
  // domain & path so Google Translate picks it up
  const host = window.location.hostname;
  document.cookie = `${COOKIE_NAME}=${value};path=/`;
  document.cookie = `${COOKIE_NAME}=${value};path=/;domain=${host}`;
  const parts = host.split(".");
  if (parts.length > 1) {
    document.cookie = `${COOKIE_NAME}=${value};path=/;domain=.${parts.slice(-2).join(".")}`;
  }
};

const readCurrent = (): string => {
  const match = document.cookie.match(/googtrans=\/[^/]+\/([^;]+)/);
  return match?.[1] || "en";
};

const LanguageSwitch = ({ className = "" }: { className?: string }) => {
  const [current, setCurrent] = useState<string>("en");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrent(readCurrent());
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const choose = (code: string) => {
    if (code === "en") {
      // clear translation
      setCookie("/en/en");
    } else {
      setCookie(`/en/${code}`);
    }
    setCurrent(code);
    setOpen(false);
    // reload to apply translation cleanly
    window.location.reload();
  };

  const active = LANGUAGES.find((l) => l.code === current) || LANGUAGES[0];

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 border border-border/60 px-2.5 py-1 text-[11px] tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors notranslate"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="uppercase">{active.code === "zh-CN" || active.code === "zh-TW" ? "ZH" : active.code.toUpperCase()}</span>
        <ChevronDown className="h-3 w-3 opacity-70" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-60 max-h-80 overflow-y-auto bg-surface-deep/95 backdrop-blur-md border border-border/60 shadow-lg notranslate">
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
