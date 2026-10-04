import { supabase } from "@/integrations/supabase/client";
import type { LineItem } from "@/lib/confirmationMessage";

export interface ItImage { path: string; caption?: string; main?: boolean }
export interface ItActivity {
  id: string; time: string; title: string; description: string;
  pickup: string; dropoff: string; venue: string; accommodation: string;
  vehicle: string; driver: string; notes: string; confirmation: string;
  images: ItImage[];
}
export interface ItDay { id: string; date: string; title: string; notes: string; activities: ItActivity[]; images: ItImage[] }
export interface ItClient {
  name: string; ref: string; guests: string; phone: string; email: string;
  arrival: string; departure: string; destination: string; accommodation: string;
  vehicle: string; chauffeur: string; concierge: string; security: string;
}
export interface ItPricing {
  show: boolean; currency: string; items: { label: string; amount: number }[];
  total: number; deposit: number; paid: number; balance: number; dueDate: string;
}
export interface ItData {
  client: ItClient; intro: string; cover: ItImage | null; days: ItDay[];
  info: { label: string; value: string }[]; inclusions: string[]; pricing: ItPricing;
}
export type ItStatus = "draft" | "sent" | "confirmed" | "completed" | "cancelled";
export const STATUSES: ItStatus[] = ["draft", "sent", "confirmed", "completed", "cancelled"];

export const uid = () => Math.random().toString(36).slice(2, 10);

export const emptyActivity = (p: Partial<ItActivity> = {}): ItActivity => ({
  id: uid(), time: "", title: "", description: "", pickup: "", dropoff: "", venue: "",
  accommodation: "", vehicle: "", driver: "", notes: "", confirmation: "", images: [], ...p,
});
export const emptyDay = (p: Partial<ItDay> = {}): ItDay => ({ id: uid(), date: "", title: "", notes: "", activities: [], images: [], ...p });

export const emptyClient = (): ItClient => ({
  name: "", ref: "", guests: "", phone: "", email: "", arrival: "", departure: "",
  destination: "Cape Town", accommodation: "", vehicle: "", chauffeur: "", concierge: "", security: "",
});

export const defaultIntro = (name: string) =>
  `Dear ${name || "Guest"},\n\nThank you for choosing SVRM Group. Please find below your personalised Cape Town itinerary. Our team will remain available throughout your stay to ensure every element of your journey is handled seamlessly.`;

export const emptyData = (): ItData => ({
  client: emptyClient(), intro: defaultIntro(""), cover: null, days: [emptyDay({ title: "ARRIVAL IN CAPE TOWN", activities: [emptyActivity()] })],
  info: [], inclusions: [],
  pricing: { show: false, currency: "ZAR", items: [], total: 0, deposit: 0, paid: 0, balance: 0, dueDate: "" },
});

export const INCLUSION_PRESETS = [
  "Private chauffeur", "Airport transfers", "Vehicle", "Fuel", "Toll fees", "Driver standby",
  "Concierge service", "Accommodation", "Activities", "Entrance tickets", "Restaurant reservations",
  "Security", "Airport meet & greet",
];
export const INFO_PRESETS = [
  "Chauffeur contact", "Concierge contact", "Emergency contact", "Vehicle details", "Airport information",
  "Important booking notes", "Dress code", "What to bring", "Cancellation information", "Additional charges", "Special requests",
];
export const IMAGE_CATEGORIES = ["Vehicles", "Accommodation", "Cape Town", "Garden Route", "Safari", "Experiences", "Restaurants", "Yachts", "Helicopters", "Beaches", "Other"];

/** Normalise a saved/AI payload so every field exists. */
export function normalise(d: Partial<ItData> | null | undefined): ItData {
  const base = emptyData();
  const x = d || {};
  return {
    ...base, ...x,
    client: { ...base.client, ...(x.client || {}) },
    pricing: { ...base.pricing, ...(x.pricing || {}) },
    days: (x.days || base.days).map((dy) => ({
      ...emptyDay(), ...dy,
      images: dy.images || [],
      activities: (dy.activities || []).map((a) => ({ ...emptyActivity(), ...a, images: a.images || [] })),
    })),
    info: x.info || [], inclusions: x.inclusions || [], cover: x.cover ?? null,
  };
}

/** Map the AI parse result onto ItData days. */
export function daysFromAi(r: any): ItDay[] {
  return (r?.days || []).map((d: any) => emptyDay({
    date: d.date || "", title: (d.title || "").toUpperCase(),
    activities: (d.activities || []).map((a: any) => emptyActivity({
      time: a.time || "", title: a.title || "", description: a.description || "",
      pickup: a.pickup || "", dropoff: a.dropoff || "", venue: a.venue || "",
      vehicle: a.vehicle || "", confirmation: a.confirmation || "",
    })),
  }));
}

export async function aiParse(text: string, context = ""): Promise<any> {
  const { data, error } = await supabase.functions.invoke("itinerary-parse", { body: { text, context } });
  if (error) {
    let msg = error.message;
    try { const b = await (error as any).context?.json?.(); if (b?.error) msg = b.error; } catch { /* */ }
    throw new Error(msg);
  }
  if (data?.error) throw new Error(data.error);
  return data.result;
}

// ---------- Bookings ----------
export interface BookingRow {
  id: string; booking_code: string; client_name: string; client_email: string | null; client_phone: string | null;
  start_date: string | null; end_date: string | null; line_items: LineItem[]; currency: string; subtotal: number;
  deposit_amount: number; balance_due: number; amount_paid: number; notes: string | null; created_at: string;
}

const addDays = (iso: string, n: number) => { const d = new Date(iso + "T00:00:00"); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

export async function bookingFacts(bookingId: string) {
  const { data: b } = await supabase.from("manual_bookings").select("*").eq("id", bookingId).maybeSingle();
  if (!b) throw new Error("Booking not found");
  const { data: asg } = await (supabase as any).from("booking_assignments")
    .select("role, staff:staff_id ( full_name, role, phone, whatsapp )").eq("booking_id", bookingId);
  const staff = (asg || []).filter((a: any) => a.staff);
  const pick = (re: RegExp) => staff.filter((a: any) => re.test(`${a.role || ""} ${a.staff.role}`))
    .map((a: any) => `${a.staff.full_name}${a.staff.phone || a.staff.whatsapp ? ` · ${a.staff.phone || a.staff.whatsapp}` : ""}`).join(", ");
  const row = b as unknown as BookingRow;
  const items = (row.line_items || []) as LineItem[];
  const vehicle = items.map((i) => i.label).find((l) => /mercedes|maybach|bmw|range|v-class|s-class|gls|porsche|audi|rolls|phantom|bentley|vehicle|car/i.test(l)) || "";
  const accommodation = items.map((i) => i.label).find((l) => /villa|hotel|stay|night|lodge|apartment|suite/i.test(l)) || "";
  const client: ItClient = {
    ...emptyClient(),
    name: row.client_name || "", ref: row.booking_code || "", phone: row.client_phone || "", email: row.client_email || "",
    arrival: row.start_date || "", departure: row.end_date || "", accommodation, vehicle,
    chauffeur: pick(/driver|chauffeur/i), concierge: pick(/concierge|host|manager|founder|operations/i), security: pick(/security/i),
  };
  const total = Number(row.subtotal || 0);
  const paid = Number(row.amount_paid || 0);
  const pricing: ItPricing = {
    show: false, currency: row.currency || "ZAR",
    items: items.map((i) => ({ label: i.label + (i.qty && i.qty > 1 ? ` × ${i.qty}${i.unit ? " " + i.unit : ""}` : ""), amount: Number(i.amount || 0) })),
    total, deposit: Number(row.deposit_amount || 0), paid, balance: Math.max(0, total - paid), dueDate: row.start_date || "",
  };
  return { row, client, pricing, inclusions: items.map((i) => i.label) };
}

/** Build a draft itinerary from a booking. Uses AI to structure services/notes into days; falls back to a date scaffold. */
export async function buildFromBooking(bookingId: string): Promise<ItData> {
  const { row, client, pricing, inclusions } = await bookingFacts(bookingId);
  const data = emptyData();
  data.client = client; data.pricing = pricing; data.inclusions = inclusions;
  data.intro = defaultIntro(client.name.split(" ")[0]);
  if (row.notes) data.info.push({ label: "Important booking notes", value: row.notes });

  const text = [
    `Client: ${client.name}`, client.arrival && `Arrival: ${client.arrival}`, client.departure && `Departure: ${client.departure}`,
    client.vehicle && `Vehicle: ${client.vehicle}`, client.accommodation && `Accommodation: ${client.accommodation}`,
    client.chauffeur && `Chauffeur: ${client.chauffeur}`,
    "Services booked:", ...(row.line_items || []).map((i) => `- ${i.label}${i.qty ? ` (${i.qty}${i.unit ? " " + i.unit : ""})` : ""}`),
    row.notes && `Notes: ${row.notes}`,
  ].filter(Boolean).join("\n");

  try {
    const r = await aiParse(text, "Build one day per date between arrival and departure. Day 1 includes airport arrival and chauffeur collection if relevant; last day departure. Do not include prices.");
    const days = daysFromAi(r);
    if (days.length) { data.days = days; return data; }
  } catch { /* fall through */ }

  const days: ItDay[] = [];
  if (client.arrival) {
    const end = client.departure || client.arrival;
    const n = Math.min(30, Math.max(1, Math.round((+new Date(end) - +new Date(client.arrival)) / 864e5) + 1));
    for (let i = 0; i < n; i++) {
      const date = addDays(client.arrival, i);
      days.push(emptyDay({
        date,
        title: i === 0 ? "ARRIVAL IN CAPE TOWN" : i === n - 1 && n > 1 ? "DEPARTURE" : "CAPE TOWN AT LEISURE",
        activities: i === 0 ? [emptyActivity({ title: "Private Chauffeur Collection", description: "Your SVRM chauffeur will meet you at the designated collection point.", vehicle: client.vehicle })] : [],
      }));
    }
  }
  data.days = days.length ? days : emptyData().days;
  return data;
}

/** Fields that can be refreshed from the booking, with human labels. */
export function bookingDiff(cur: ItData, fresh: { client: ItClient; pricing: ItPricing }) {
  const out: { key: string; label: string; from: string; to: string; apply: (d: ItData) => void }[] = [];
  const cl: [keyof ItClient, string][] = [
    ["name", "Client name"], ["ref", "Booking reference"], ["phone", "Phone"], ["email", "Email"],
    ["arrival", "Arrival date"], ["departure", "Departure date"], ["vehicle", "Vehicle"], ["accommodation", "Accommodation"],
    ["chauffeur", "Chauffeur"], ["concierge", "Concierge"], ["security", "Security"],
  ];
  for (const [k, label] of cl) {
    const a = cur.client[k] || "", b = fresh.client[k] || "";
    if (b && a !== b) out.push({ key: "c_" + k, label, from: a, to: b, apply: (d) => { d.client[k] = b; } });
  }
  const pr: [keyof ItPricing, string][] = [["total", "Total"], ["deposit", "Deposit"], ["paid", "Amount paid"], ["balance", "Balance"], ["currency", "Currency"]];
  for (const [k, label] of pr) {
    const a = String(cur.pricing[k] ?? ""), b = String(fresh.pricing[k] ?? "");
    if (a !== b) out.push({ key: "p_" + k, label, from: a, to: b, apply: (d) => { (d.pricing as any)[k] = fresh.pricing[k]; } });
  }
  const ai = JSON.stringify(cur.pricing.items), bi = JSON.stringify(fresh.pricing.items);
  if (ai !== bi) out.push({ key: "p_items", label: "Priced services", from: `${cur.pricing.items.length} items`, to: `${fresh.pricing.items.length} items`, apply: (d) => { d.pricing.items = fresh.pricing.items; } });
  return out;
}

export function fileName(d: ItData) {
  const first = (d.client.name || "Guest").split(" ")[0].replace(/[^a-z0-9]/gi, "");
  const date = d.client.arrival || d.days.find((x) => x.date)?.date;
  const ds = date ? new Date(date + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/ /g, "-") : "";
  return `SVRM-Itinerary-${first}${ds ? "-" + ds : ""}.pdf`;
}
