// Item-aware WhatsApp enquiries: field rules, date checks and message text per listing type.
// Pure functions so the rules can be tested without the browser.
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

export type EnquiryKind = "chauffeur" | "self-drive" | "stay" | "tour" | "airport" | "charter" | "occasion" | "security";

export interface EnquiryListing {
  /** Stable id used in analytics, e.g. "vehicle:maybach-v-class". */
  id: string;
  name: string;
  kind: EnquiryKind;
  /** Canonical absolute URL of the listing page. */
  url: string;
  /** Optional preselected detail, e.g. occasion or charter type. */
  detail?: string;
}

export interface EnquiryInput {
  startDate?: string; // yyyy-mm-dd
  endDate?: string;
  time?: string; // HH:MM
  flexible?: boolean;
  guests?: number;
  children?: number;
  pickup?: string;
  destination?: string;
  luggage?: string;
  vehiclePreference?: string;
  direction?: "arrival" | "departure";
  flightNumber?: string;
  route?: string;
  occasion?: string;
  requests?: string;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function parts(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return { y, mo, d };
}

/** "12 December 2026" — the same for UK and US readers. */
export function formatEnquiryDate(iso: string): string {
  const p = parts(iso);
  return p ? `${p.d} ${MONTHS[p.mo - 1]} ${p.y}` : iso;
}

/** "12 to 15 December 2026", or full dates when month/year differ. */
export function formatEnquiryRange(from: string, to: string): string {
  const a = parts(from), b = parts(to);
  if (!a || !b) return `${from} to ${to}`;
  if (a.y === b.y && a.mo === b.mo) return `${a.d} to ${b.d} ${MONTHS[b.mo - 1]} ${b.y}`;
  if (a.y === b.y) return `${a.d} ${MONTHS[a.mo - 1]} to ${b.d} ${MONTHS[b.mo - 1]} ${b.y}`;
  return `${formatEnquiryDate(from)} to ${formatEnquiryDate(to)}`;
}

export function todayIso(now = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

/** Which fields a listing type asks for. */
export function enquiryFields(kind: EnquiryKind) {
  return {
    range: kind === "chauffeur" || kind === "self-drive" || kind === "stay" || kind === "occasion",
    endRequired: kind === "stay",
    time: kind === "airport" || kind === "charter",
    pickup: kind === "chauffeur" || kind === "self-drive" || kind === "tour" || kind === "airport",
    destination: kind === "airport",
    luggage: kind === "chauffeur" || kind === "self-drive" || kind === "airport",
    children: kind === "stay",
    vehiclePreference: kind === "tour",
    direction: kind === "airport",
    flightNumber: kind === "airport",
    route: kind === "charter",
    occasion: kind === "occasion",
    requests: kind === "occasion" || kind === "security" || kind === "charter",
  };
}

export type EnquiryErrors = Partial<Record<"startDate" | "endDate" | "guests" | "pickup" | "destination" | "time", string>>;

export function validateEnquiry(kind: EnquiryKind, input: EnquiryInput, today = todayIso()): { errors: EnquiryErrors; sameDay: boolean } {
  const f = enquiryFields(kind);
  const errors: EnquiryErrors = {};
  const start = input.startDate?.trim();
  const end = input.endDate?.trim();
  if (!start && !input.flexible) errors.startDate = kind === "stay" ? "Choose a check-in date or tick flexible dates." : "Choose a date or tick flexible dates.";
  if (start && !parts(start)) errors.startDate = "Enter a valid date.";
  if (start && parts(start) && start < today) errors.startDate = "This date has already passed.";
  if (f.endRequired && !end && !input.flexible) errors.endDate = "Choose a check-out date.";
  if (end && !parts(end)) errors.endDate = "Enter a valid date.";
  if (start && end && parts(start) && parts(end)) {
    if (kind === "stay" && end <= start) errors.endDate = "Check-out must be after check-in.";
    else if (kind !== "stay" && end < start) errors.endDate = "End date can't be before the start date.";
  }
  if (!input.guests || input.guests < 1 || !Number.isInteger(input.guests)) errors.guests = "Enter how many guests.";
  else if (input.guests > 500) errors.guests = "For very large groups, message us directly.";
  if (kind === "airport") {
    if (!input.pickup?.trim()) errors.pickup = "Enter the pickup.";
    if (!input.destination?.trim()) errors.destination = "Enter the destination.";
  }
  const sameDay = (kind === "chauffeur" || kind === "self-drive" || kind === "airport") && start === today;
  return { errors, sameDay };
}

const clean = (s?: string) => (s ?? "").replace(/\s+/g, " ").trim().slice(0, 300);
const people = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

function when(input: EnquiryInput, single: string): string {
  const s = input.startDate, e = input.endDate;
  if (s && e && e !== s) return `from ${formatEnquiryRange(s, e)}`;
  if (s) return `${single} ${formatEnquiryDate(s)}`;
  return "";
}

/** Builds the WhatsApp draft text from the guest's selections; blank optional fields are left out. */
export function buildEnquiryMessage(listing: EnquiryListing, input: EnquiryInput): string {
  const g = input.guests ?? 1;
  const flex = input.flexible ? (input.startDate ? " My dates are flexible." : " My dates are flexible — please suggest what's available.") : "";
  const name = listing.name;
  const lines: string[] = [];
  switch (listing.kind) {
    case "chauffeur":
    case "self-drive": {
      const svc = listing.kind === "chauffeur" ? "with chauffeur" : "as a self-drive rental";
      let s = `Hi SVRM Group, I'd like to check availability for the ${name} ${svc}`;
      const w = when(input, "on");
      if (w) s += ` ${w}`;
      s += ` for ${people(g, "passenger")}.`;
      const pickup = clean(input.pickup);
      if (pickup) s += listing.kind === "chauffeur" ? ` We're staying in ${pickup}.` : ` Delivery or collection: ${pickup}.`;
      const lug = clean(input.luggage);
      if (lug) s += ` Luggage: ${lug}.`;
      s += flex;
      s += listing.kind === "chauffeur" ? " Could you confirm availability and send me a quote?" : " Could you confirm availability and the rental terms?";
      lines.push(s);
      break;
    }
    case "stay": {
      let s = `Hi SVRM Group, I'm interested in ${name}.`;
      if (input.startDate && input.endDate) s += ` We'd like to check in on ${formatEnquiryDate(input.startDate)} and check out on ${formatEnquiryDate(input.endDate)}.`;
      else if (input.startDate) s += ` We'd like to check in on ${formatEnquiryDate(input.startDate)}.`;
      const kids = input.children && input.children > 0 ? ` and ${people(input.children, "child").replace("childs", "children")}` : "";
      s += ` There will be ${people(g, "adult")}${kids}.`;
      s += flex;
      s += " Could you confirm availability and the total price for our stay?";
      lines.push(s);
      break;
    }
    case "tour": {
      let s = `Hi SVRM Group, I'd like to enquire about the private ${name}`;
      const w = when(input, "on");
      if (w) s += ` ${w}`;
      s += ` for ${people(g, "guest")}`;
      const pickup = clean(input.pickup);
      if (pickup) s += `, with pickup at ${pickup}`;
      s += ".";
      const vp = clean(input.vehiclePreference);
      if (vp) s += ` Preferred vehicle: ${vp}.`;
      s += flex;
      s += " Could you confirm availability and what's included?";
      lines.push(s);
      break;
    }
    case "airport": {
      const dir = input.direction === "departure" ? "departure transfer" : "arrival transfer";
      let s = `Hi SVRM Group, I'd like to book an ${dir}`;
      if (input.startDate) s += ` on ${formatEnquiryDate(input.startDate)}`;
      if (input.time) s += ` at ${input.time}`;
      s += ` for ${people(g, "passenger")}, from ${clean(input.pickup)} to ${clean(input.destination)}.`;
      const fl = clean(input.flightNumber);
      if (fl) s += ` Flight: ${fl}.`;
      const lug = clean(input.luggage);
      if (lug) s += ` Luggage: ${lug}.`;
      s += flex;
      s += " Could you confirm availability and send me a quote?";
      lines.push(s);
      break;
    }
    case "charter": {
      let s = `Hi SVRM Group, I'd like to enquire about ${name}`;
      if (input.startDate) s += ` on ${formatEnquiryDate(input.startDate)}`;
      if (input.time) s += ` around ${input.time}`;
      s += ` for ${people(g, "guest")}.`;
      const r = clean(input.route);
      if (r) s += ` Route or idea: ${r}.`;
      const req = clean(input.requests);
      if (req) s += ` ${req}.`;
      s += flex;
      s += " Could you confirm availability and send me a quote?";
      lines.push(s);
      break;
    }
    case "occasion": {
      const occ = clean(input.occasion) || listing.detail || name;
      let s = `Hi SVRM Group, I'm planning a ${occ.toLowerCase()} in Cape Town`;
      const w = when(input, "on");
      if (w) s += ` ${w}`;
      s += ` for ${people(g, "guest")}.`;
      const req = clean(input.requests);
      if (req) s += ` Requests: ${req}.`;
      s += flex;
      s += " Could you help me plan it and send me a quote?";
      lines.push(s);
      break;
    }
    case "security": {
      let s = `Hi SVRM Group, I'd like to enquire about ${name}`;
      if (input.startDate) s += ` on ${formatEnquiryDate(input.startDate)}`;
      s += ` for a party of ${g}.`;
      const req = clean(input.requests);
      if (req) s += ` Service needed: ${req}.`;
      s += flex;
      s += " I'd prefer to share itinerary details privately. Could you contact me to discuss?";
      lines.push(s);
      break;
    }
  }
  lines.push("", listing.url);
  return lines.join("\n");
}

export function enquiryWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
