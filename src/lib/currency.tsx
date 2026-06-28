import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { formatCurrency, onLocaleChange, getActiveLocale } from "./locale";


export type Currency = "ZAR" | "USD" | "GBP" | "EUR" | "AED" | "AUD" | "CAD" | "CHF" | "JPY" | "CNY" | "INR" | "SAR";

// Indicative rates — 1 ZAR = X
const RATES: Record<Currency, number> = {
  ZAR: 1,
  USD: 0.054,
  GBP: 0.043,
  EUR: 0.05,
  AED: 0.2,
  AUD: 0.083,
  CAD: 0.074,
  CHF: 0.048,
  JPY: 8.4,
  CNY: 0.39,
  INR: 4.55,
  SAR: 0.2,
};

const SYMBOLS: Record<Currency, string> = {
  ZAR: "R",
  USD: "$",
  GBP: "£",
  EUR: "€",
  AED: "د.إ",
  AUD: "A$",
  CAD: "C$",
  CHF: "CHF",
  JPY: "¥",
  CNY: "¥",
  INR: "₹",
  SAR: "﷼",
};

export const CURRENCY_LIST: { code: Currency; label: string; symbol: string }[] = (
  Object.keys(RATES) as Currency[]
).map((code) => ({ code, label: code, symbol: SYMBOLS[code] }));

interface Ctx {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (zar: number) => string;
  symbol: string;
}

const CurrencyContext = createContext<Ctx | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<Currency>("ZAR");

  useEffect(() => {
    const saved = localStorage.getItem("svrm-currency") as Currency | null;
    if (saved && saved in RATES) setCurrencyState(saved);
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("svrm-currency", c);
  };

  const format = (zar: number) => {
    const converted = zar * RATES[currency];
    const rounded =
      currency === "ZAR" || currency === "JPY" || currency === "INR"
        ? Math.round(converted / 100) * 100
        : Math.round(converted / 10) * 10;
    return `${SYMBOLS[currency]} ${rounded.toLocaleString("en-US")}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format, symbol: SYMBOLS[currency] }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
};
