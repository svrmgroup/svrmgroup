// Country dial codes used by the phone inputs across the site + admin console.
export type Country = { name: string; iso: string; dial: string; flag: string };

export const COUNTRIES: Country[] = [
  { name: "South Africa", iso: "ZA", dial: "+27", flag: "🇿🇦" },
  { name: "United Kingdom", iso: "GB", dial: "+44", flag: "🇬🇧" },
  { name: "United States", iso: "US", dial: "+1", flag: "🇺🇸" },
  { name: "United Arab Emirates", iso: "AE", dial: "+971", flag: "🇦🇪" },
  { name: "Germany", iso: "DE", dial: "+49", flag: "🇩🇪" },
  { name: "France", iso: "FR", dial: "+33", flag: "🇫🇷" },
  { name: "Netherlands", iso: "NL", dial: "+31", flag: "🇳🇱" },
  { name: "Switzerland", iso: "CH", dial: "+41", flag: "🇨🇭" },
  { name: "Austria", iso: "AT", dial: "+43", flag: "🇦🇹" },
  { name: "Belgium", iso: "BE", dial: "+32", flag: "🇧🇪" },
  { name: "Spain", iso: "ES", dial: "+34", flag: "🇪🇸" },
  { name: "Portugal", iso: "PT", dial: "+351", flag: "🇵🇹" },
  { name: "Italy", iso: "IT", dial: "+39", flag: "🇮🇹" },
  { name: "Ireland", iso: "IE", dial: "+353", flag: "🇮🇪" },
  { name: "Denmark", iso: "DK", dial: "+45", flag: "🇩🇰" },
  { name: "Sweden", iso: "SE", dial: "+46", flag: "🇸🇪" },
  { name: "Norway", iso: "NO", dial: "+47", flag: "🇳🇴" },
  { name: "Finland", iso: "FI", dial: "+358", flag: "🇫🇮" },
  { name: "Poland", iso: "PL", dial: "+48", flag: "🇵🇱" },
  { name: "Czechia", iso: "CZ", dial: "+420", flag: "🇨🇿" },
  { name: "Greece", iso: "GR", dial: "+30", flag: "🇬🇷" },
  { name: "Turkey", iso: "TR", dial: "+90", flag: "🇹🇷" },
  { name: "Russia", iso: "RU", dial: "+7", flag: "🇷🇺" },
  { name: "Saudi Arabia", iso: "SA", dial: "+966", flag: "🇸🇦" },
  { name: "Qatar", iso: "QA", dial: "+974", flag: "🇶🇦" },
  { name: "Kuwait", iso: "KW", dial: "+965", flag: "🇰🇼" },
  { name: "Bahrain", iso: "BH", dial: "+973", flag: "🇧🇭" },
  { name: "Oman", iso: "OM", dial: "+968", flag: "🇴🇲" },
  { name: "Israel", iso: "IL", dial: "+972", flag: "🇮🇱" },
  { name: "India", iso: "IN", dial: "+91", flag: "🇮🇳" },
  { name: "China", iso: "CN", dial: "+86", flag: "🇨🇳" },
  { name: "Hong Kong", iso: "HK", dial: "+852", flag: "🇭🇰" },
  { name: "Singapore", iso: "SG", dial: "+65", flag: "🇸🇬" },
  { name: "Japan", iso: "JP", dial: "+81", flag: "🇯🇵" },
  { name: "South Korea", iso: "KR", dial: "+82", flag: "🇰🇷" },
  { name: "Australia", iso: "AU", dial: "+61", flag: "🇦🇺" },
  { name: "New Zealand", iso: "NZ", dial: "+64", flag: "🇳🇿" },
  { name: "Brazil", iso: "BR", dial: "+55", flag: "🇧🇷" },
  { name: "Argentina", iso: "AR", dial: "+54", flag: "🇦🇷" },
  { name: "Mexico", iso: "MX", dial: "+52", flag: "🇲🇽" },
  { name: "Chile", iso: "CL", dial: "+56", flag: "🇨🇱" },
  { name: "Nigeria", iso: "NG", dial: "+234", flag: "🇳🇬" },
  { name: "Ghana", iso: "GH", dial: "+233", flag: "🇬🇭" },
  { name: "Kenya", iso: "KE", dial: "+254", flag: "🇰🇪" },
  { name: "Tanzania", iso: "TZ", dial: "+255", flag: "🇹🇿" },
  { name: "Uganda", iso: "UG", dial: "+256", flag: "🇺🇬" },
  { name: "Zambia", iso: "ZM", dial: "+260", flag: "🇿🇲" },
  { name: "Zimbabwe", iso: "ZW", dial: "+263", flag: "🇿🇼" },
  { name: "Mozambique", iso: "MZ", dial: "+258", flag: "🇲🇿" },
  { name: "Namibia", iso: "NA", dial: "+264", flag: "🇳🇦" },
  { name: "Botswana", iso: "BW", dial: "+267", flag: "🇧🇼" },
  { name: "Mauritius", iso: "MU", dial: "+230", flag: "🇲🇺" },
  { name: "Egypt", iso: "EG", dial: "+20", flag: "🇪🇬" },
  { name: "Morocco", iso: "MA", dial: "+212", flag: "🇲🇦" },
];

export const DEFAULT_COUNTRY = COUNTRIES[0];

/** Longest-prefix match of a stored phone number to a country. */
export function countryFromPhone(phone?: string | null): Country | null {
  if (!phone) return null;
  const digits = phone.replace(/[^\d+]/g, "");
  const normalised = digits.startsWith("+") ? digits : `+${digits.replace(/^00/, "")}`;
  let best: Country | null = null;
  for (const c of COUNTRIES) {
    if (normalised.startsWith(c.dial) && (!best || c.dial.length > best.dial.length)) best = c;
  }
  return best;
}

/** "🇿🇦 South Africa" style label for admin views, or null when unknown. */
export function countryLabel(phone?: string | null): string | null {
  const c = countryFromPhone(phone);
  return c ? `${c.flag} ${c.name}` : null;
}

/** Split a stored number into dial code + local part. */
export function splitPhone(phone?: string | null): { dial: string; local: string } {
  const c = countryFromPhone(phone);
  if (!phone) return { dial: DEFAULT_COUNTRY.dial, local: "" };
  const cleaned = phone.replace(/[^\d+]/g, "").replace(/^00/, "+");
  if (c && cleaned.startsWith(c.dial)) return { dial: c.dial, local: cleaned.slice(c.dial.length) };
  return { dial: DEFAULT_COUNTRY.dial, local: cleaned.replace(/^\+/, "") };
}

export function joinPhone(dial: string, local: string): string {
  const l = local.replace(/[^\d]/g, "").replace(/^0+/, "");
  return l ? `${dial}${l}` : "";
}
