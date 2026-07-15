import jsPDF from "jspdf";
import type { LineItem } from "@/lib/confirmationMessage";
import { supabase } from "@/integrations/supabase/client";
import svrmLogo from "@/assets/svrm-logo.png.asset.json";

/**
 * Branded PDF renderer — matches the SVRM Group template:
 * cream background, gold accents, dark price panel, serif headings.
 * Renders three variants: "invoice", "confirmation", "thank_you".
 */

const CURRENCY_SYMBOLS: Record<string, string> = { ZAR: "R", USD: "$", EUR: "€", GBP: "£" };

export interface InvoiceBooking {
  booking_code: string;
  client_name: string;
  client_email?: string | null;
  client_phone?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  line_items: LineItem[];
  currency: string;
  subtotal: number;
  deposit_amount: number;
  balance_due: number;
  notes?: string | null;
  confirmation_message?: string | null;
  created_at?: string;
}

interface Settings {
  company_name?: string; company_email?: string; company_phone?: string; company_whatsapp?: string;
  company_address?: string; website?: string; tagline?: string; logo_url?: string;
  vat_number?: string; vat_rate?: number;
  bank_name?: string; bank_account?: string; bank_branch?: string; bank_swift?: string;
  invoice_footer?: string; confirmation_footer?: string; thank_you_message?: string;
  brand_primary?: string; brand_bg?: string;
}

const DEFAULTS: Settings = {
  company_name: "SVRM GROUP",
  tagline: "EVERY EXPERIENCE, UNIQUELY CURATED FOR YOU",
  company_email: "concierge@svrm.group",
  company_phone: "+27 73 064 1481",
  company_whatsapp: "+27 73 064 1481",
  website: "svrm.group",
  brand_primary: "#d4b876",
  brand_bg: "#1f1b18",
  invoice_footer: "A 50% deposit is required to secure this booking. The remaining balance must be paid prior to the commencement of travel.",
  confirmation_footer: "This confirmation constitutes acceptance of the SVRM Group terms of service.",
  thank_you_message: "Thank you for choosing SVRM. Our concierge team will be in touch shortly with next steps.",
};

let cache: Settings | null = null;
async function loadSettings(): Promise<Settings> {
  if (cache) return cache;
  try {
    const { data } = await supabase.from("app_settings" as any).select("*").eq("id", 1).maybeSingle();
    cache = { ...DEFAULTS, ...(data as any) };
  } catch { cache = DEFAULTS; }
  return cache!;
}

// Cache the SVRM logo (or the settings override) as a data URL so jsPDF
// renders it reliably regardless of CORS / same-origin quirks.
let logoDataUrlCache: { src: string; data: string } | null = null;
async function loadLogoDataUrl(overrideUrl?: string): Promise<string | null> {
  const src = overrideUrl || svrmLogo.url;
  if (logoDataUrlCache && logoDataUrlCache.src === src) return logoDataUrlCache.data;
  try {
    const res = await fetch(src, { credentials: "omit" });
    if (!res.ok) return null;
    const blob = await res.blob();
    const dataUrl: string = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
    logoDataUrlCache = { src, data: dataUrl };
    return dataUrl;
  } catch {
    return null;
  }
}

type PdfKind = "invoice" | "confirmation" | "thank_you";

async function build(kind: PdfKind, b: InvoiceBooking) {
  const s = await loadSettings();
  const GOLD = s.brand_primary || "#d4b876";
  const DARK = s.brand_bg || "#1f1b18";
  const CREAM = "#f8f1e4";
  const CREAM_SOFT = "#efe6d3";
  const TEXT = "#231f1c";
  const MUTED = "#8a8478";
  const sym = CURRENCY_SYMBOLS[b.currency] || (b.currency + " ");
  const money = (n: number) => `${sym}${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Cream background
  doc.setFillColor(CREAM); doc.rect(0, 0, w, h, "F");

  // Header — SVRM logo (settings override → bundled brand asset → monogram)
  const logoY = 40;
  const logoData = await loadLogoDataUrl(s.logo_url);
  if (logoData) {
    try {
      doc.addImage(logoData, "PNG", w / 2 - 32, logoY, 64, 64);
    } catch {
      doc.setFillColor(GOLD); doc.circle(w / 2, logoY + 26, 26, "F");
      doc.setTextColor(DARK); doc.setFont("times", "bold"); doc.setFontSize(9);
      doc.text("SVRM", w / 2, logoY + 30, { align: "center" });
    }
  } else {
    doc.setFillColor(GOLD); doc.circle(w / 2, logoY + 26, 26, "F");
    doc.setTextColor(DARK); doc.setFont("times", "bold"); doc.setFontSize(9);
    doc.text("SVRM", w / 2, logoY + 30, { align: "center" });
  }


  // Company name + tagline
  doc.setTextColor(TEXT); doc.setFont("helvetica", "bold"); doc.setFontSize(24);
  doc.text((s.company_name || "SVRM GROUP").toUpperCase(), w / 2, logoY + 100, { align: "center" });
  doc.setTextColor(GOLD); doc.setFont("helvetica", "normal"); doc.setFontSize(9);
  doc.text((s.tagline || "").toUpperCase(), w / 2, logoY + 118, { align: "center" });

  // Gold divider
  doc.setDrawColor(GOLD); doc.setLineWidth(1);
  doc.line(w / 2 - 40, logoY + 128, w / 2 + 40, logoY + 128);

  // Section title
  let y = logoY + 170;
  const title = kind === "invoice" ? "INVOICE" : kind === "confirmation" ? "BOOKING CONFIRMATION" : "THANK YOU";
  doc.setTextColor(TEXT); doc.setFont("helvetica", "bold"); doc.setFontSize(18);
  doc.text(title, 40, y);
  y += 24;

  // Meta rows
  doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(TEXT);
  const issueDate = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const bookingDates = b.start_date && b.end_date
    ? `${new Date(b.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} – ${new Date(b.end_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`
    : b.start_date || "Dates on request";
  doc.text(`${kind === "invoice" ? "Invoice" : "Reference"} No: ${b.booking_code}`, 40, y); y += 14;
  doc.text(`Issue Date: ${issueDate}`, 40, y); y += 14;
  doc.text(`Booking Dates: ${bookingDates}`, 40, y); y += 30;

  // CLIENT + CONCIERGE two-column
  doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(GOLD);
  doc.text("CLIENT", 40, y);
  doc.text("LEAD ORGANISER / CONCIERGE", w / 2, y);
  y += 14;
  doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(TEXT);
  doc.text(b.client_name || "—", 40, y);
  doc.text(s.company_name || "SVRM Group", w / 2, y); y += 13;
  if (b.client_email) { doc.text(b.client_email, 40, y); }
  if (s.company_phone) doc.text(s.company_phone, w / 2, y);
  y += 13;
  if (b.client_phone) doc.text(b.client_phone, 40, y);
  if (s.website) doc.text(s.website.replace(/^https?:\/\//, ""), w / 2, y);
  y += 24;

  // Hairline divider
  doc.setDrawColor("#c9bfa8"); doc.setLineWidth(0.5); doc.line(40, y, w - 40, y);
  y += 24;

  // PACKAGE title
  doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(TEXT);
  doc.text("PACKAGE", 40, y);
  y += 18;
  const firstItem = (b.line_items || [])[0];
  const packageTitle = firstItem?.label || "Bespoke SVRM experience";
  doc.setFont("times", "italic"); doc.setFontSize(13); doc.setTextColor(TEXT);
  const titleLines = doc.splitTextToSize(packageTitle, w - 80);
  doc.text(titleLines, 40, y);
  y += titleLines.length * 16 + 8;

  // PACKAGE INCLUDES bullets
  const includes = (b.line_items || []).slice(0, 8).map(it => {
    const q = it.qty ? ` × ${it.qty}${it.unit ? ` ${it.unit}` : ""}` : "";
    return `${it.label}${q}`;
  });
  if (includes.length) {
    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(GOLD);
    doc.text("PACKAGE INCLUDES", 40, y);
    y += 14;
    doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(TEXT);
    includes.forEach(line => {
      // gold bullet
      doc.setFillColor(GOLD); doc.circle(46, y - 3, 1.6, "F");
      const wrapped = doc.splitTextToSize(line, w - 100);
      doc.text(wrapped, 58, y);
      y += wrapped.length * 13;
    });
    y += 10;
  }

  // IMPORTANT NOTE callout (from notes)
  if (b.notes && y < h - 260) {
    const boxX = 40, boxW = w - 80;
    doc.setFillColor(CREAM_SOFT);
    const noteLines = doc.splitTextToSize(b.notes, boxW - 30);
    const boxH = 24 + 14 + noteLines.length * 12 + 16;
    doc.roundedRect(boxX, y, boxW, boxH, 6, 6, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(TEXT);
    doc.text("IMPORTANT NOTE", boxX + 16, y + 20);
    doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    doc.text(noteLines, boxX + 16, y + 40);
    y += boxH + 20;
  }

  // Dark price panel
  const panelH = 90;
  if (y > h - panelH - 100) y = h - panelH - 100;
  doc.setFillColor(DARK);
  doc.roundedRect(40, y, w - 80, panelH, 8, 8, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(GOLD);
  const label = kind === "thank_you" ? "AMOUNT PAID" : "TOTAL PACKAGE PRICE";
  doc.text(label, 60, y + 26);
  doc.setFont("helvetica", "bold"); doc.setFontSize(24); doc.setTextColor("#ffffff");
  doc.text(money(b.subtotal), 60, y + 56);
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor("#cfc7b6");
  if (kind !== "thank_you") {
    doc.text(`Deposit Required (50%): ${money(b.deposit_amount)}`, 60, y + 78);
    doc.text(`Remaining Balance: ${money(b.balance_due)}`, w - 60, y + 66, { align: "right" });
    doc.setFontSize(8); doc.setTextColor("#a89e88");
    doc.setFont("times", "italic");
    doc.text("payable before trip commencement", w - 60, y + 80, { align: "right" });
  }
  y += panelH + 24;

  // Payment terms / thank you body
  if (kind === "invoice") {
    doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(TEXT);
    doc.text("PAYMENT TERMS", 40, y); y += 14;
    doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    const pt = doc.splitTextToSize(s.invoice_footer || DEFAULTS.invoice_footer!, w - 80);
    doc.text(pt, 40, y); y += pt.length * 13 + 10;

    if (s.bank_name || s.bank_account) {
      doc.setFont("helvetica", "bold"); doc.setFontSize(10);
      doc.text("BANKING DETAILS", 40, y); y += 14;
      doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(MUTED);
      if (s.bank_name)    { doc.text(`Bank: ${s.bank_name}`, 40, y); y += 12; }
      if (s.bank_account) { doc.text(`Account: ${s.bank_account}`, 40, y); y += 12; }
      if (s.bank_branch)  { doc.text(`Branch: ${s.bank_branch}`, 40, y); y += 12; }
      if (s.bank_swift)   { doc.text(`SWIFT: ${s.bank_swift}`, 40, y); y += 12; }
      if (s.vat_number)   { doc.text(`VAT No: ${s.vat_number}`, 40, y); y += 12; }
    }
  } else if (kind === "confirmation") {
    doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(TEXT);
    doc.text("WHAT HAPPENS NEXT", 40, y); y += 14;
    doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    const msg = s.thank_you_message || DEFAULTS.thank_you_message!;
    const lines = doc.splitTextToSize(msg, w - 80);
    doc.text(lines, 40, y); y += lines.length * 13 + 10;
  } else {
    doc.setFont("times", "italic"); doc.setFontSize(13); doc.setTextColor(TEXT);
    const msg = s.thank_you_message || DEFAULTS.thank_you_message!;
    const lines = doc.splitTextToSize(msg, w - 80);
    doc.text(lines, w / 2, y, { align: "center" });
  }

  // Footer
  const fy = h - 40;
  doc.setDrawColor("#c9bfa8"); doc.setLineWidth(0.5); doc.line(40, fy - 18, w - 40, fy - 18);
  doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(MUTED);
  const foot = [s.company_email, s.company_phone, (s.website || "").replace(/^https?:\/\//, "")].filter(Boolean).join("   •   ");
  doc.text(foot, w / 2, fy, { align: "center" });

  const filenameKind = kind === "invoice" ? "INV" : kind === "confirmation" ? "CONF" : "THANKYOU";
  doc.save(`SVRM-${filenameKind}-${b.booking_code}.pdf`);
}

export function downloadInvoicePdf(b: InvoiceBooking) { return build("invoice", b); }
export function downloadConfirmationPdf(b: InvoiceBooking) { return build("confirmation", b); }
export function downloadThankYouPdf(b: InvoiceBooking) { return build("thank_you", b); }
