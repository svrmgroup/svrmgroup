import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Currency = "ZAR" | "GBP" | "USD";

// Indicative rates — 1 ZAR = X
const RATES: Record<Currency, number> = {
  ZAR: 1,
  USD: 0.054,
  GBP: 0.043,
};

const SYMBOLS: Record<Currency, string> = {
  ZAR: "R",
  USD: "$",
  GBP: "£",
};

interface Ctx {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (zar: number) => string;
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
      currency === "ZAR"
        ? Math.round(converted / 100) * 100
        : Math.round(converted / 10) * 10;
    return `${SYMBOLS[currency]} ${rounded.toLocaleString("en-US")}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
};
