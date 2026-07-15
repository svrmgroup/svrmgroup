import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { LineItem } from "@/lib/confirmationMessage";
import { supabase } from "@/integrations/supabase/client";

const CURRENCY_SYMBOLS: Record<string, string> = { ZAR: "R", USD: "$", EUR: "€", GBP: "£" };

export interface InvoiceBooking {
  booking_code: string;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  start_date: string | null;
  end_date: string | null;
  line_items: LineItem[];
  currency: string;
  subtotal: number;
  deposit_amount: number;
  balance_due: number;
  notes: string | null;
  created_at: string;
}

interface Settings {
  company_name?: string; company_email?: string; company_phone?: string; company_address?: string;
  vat_number?: string; vat_rate?: number;
  bank_name?: string; bank_account?: string; bank_branch?: string; bank_swift?: string;
  invoice_footer?: string; brand_primary?: string; brand_bg?: string;
}

const DEFAULTS: Settings = {
  company_name: "SVRM Group", company_email: "concierge@svrm.group", company_phone: "+27 73 064 1481",
  brand_primary: "#c9a961", brand_bg: "#1f1b18",
  invoice_footer: "Payment terms: deposit secures your booking. Balance due before service start.",
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

async function build(kind: "invoice" | "confirmation", b: InvoiceBooking) {
  const s = await loadSettings();
  const GOLD = s.brand_primary || "#c9a961";
  const DARK = s.brand_bg || "#1f1b18";
  const MUTED = "#8a8478";
  const sym = CURRENCY_SYMBOLS[b.currency] || b.currency + " ";
  const money = (n: number) => `${sym}${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const w = doc.internal.pageSize.getWidth();

  // Header band
  doc.setFillColor(DARK); doc.rect(0, 0, w, 90, "F");
  doc.setTextColor(GOLD); doc.setFont("times", "bold"); doc.setFontSize(26);
  doc.text("SVRM", 40, 50);
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor("#e9e2d5");
  doc.text((s.company_name || "SVRM Group") + " — Luxury Lifestyle Management", 40, 68);

  doc.setFontSize(10); doc.text(kind === "invoice" ? "INVOICE" : "BOOKING CONFIRMATION", w - 40, 50, { align: "right" });
  doc.setFontSize(11); doc.setTextColor(GOLD);
  doc.text(b.booking_code, w - 40, 68, { align: "right" });

  // Meta block
  let y = 120;
  doc.setTextColor(DARK); doc.setFontSize(9); doc.setFont("helvetica", "bold");
  doc.text(kind === "invoice" ? "BILLED TO" : "GUEST", 40, y);
  doc.text("BOOKING", w / 2, y);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  y += 14;
  doc.text(b.client_name || "—", 40, y);
  const dates = b.start_date && b.end_date ? `${b.start_date} → ${b.end_date}` : b.start_date || "Dates TBC";
  doc.text(dates, w / 2, y);
  y += 12;
  if (b.client_email) doc.text(b.client_email, 40, y);
  doc.text(`Issued ${new Date(b.created_at).toLocaleDateString()}`, w / 2, y);
  y += 12;
  if (b.client_phone) doc.text(b.client_phone, 40, y);

  // Items
  autoTable(doc, {
    startY: y + 24,
    head: [["Item", "Qty", "Unit", "Amount"]],
    body: (b.line_items || []).map((it) => [it.label, String(it.qty ?? 1), it.unit ?? "", money(Number(it.amount) || 0)]),
    theme: "plain",
    styles: { font: "helvetica", fontSize: 10, cellPadding: 8, textColor: DARK },
    headStyles: { fillColor: DARK, textColor: GOLD, fontStyle: "bold", fontSize: 9 },
    columnStyles: { 1: { halign: "center", cellWidth: 50 }, 2: { halign: "center", cellWidth: 70 }, 3: { halign: "right", cellWidth: 90 } },
    margin: { left: 40, right: 40 },
  });

  // @ts-expect-error jspdf-autotable augments doc at runtime
  let ty = (doc.lastAutoTable?.finalY || y + 40) + 20;
  const rightX = w - 40; const labelX = w - 200;
  const row = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(bold ? 11 : 10);
    doc.setTextColor(bold ? DARK : MUTED);
    doc.text(label, labelX, ty);
    doc.setTextColor(DARK);
    doc.text(value, rightX, ty, { align: "right" });
    ty += 16;
  };
  row("Subtotal", money(b.subtotal));
  if (s.vat_rate && s.vat_rate > 0) {
    const vat = (b.subtotal * s.vat_rate) / (100 + s.vat_rate);
    row(`VAT (${s.vat_rate}% incl.)`, money(vat));
  }
  row("Deposit received", money(b.deposit_amount));
  row("Balance due", money(b.balance_due), true);

  // Banking / notes
  ty += 10;
  if (kind === "invoice" && (s.bank_name || s.bank_account)) {
    doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(DARK);
    doc.text("BANKING", 40, ty); ty += 12;
    doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(MUTED);
    if (s.bank_name) { doc.text(`Bank: ${s.bank_name}`, 40, ty); ty += 12; }
    if (s.bank_account) { doc.text(`Account: ${s.bank_account}`, 40, ty); ty += 12; }
    if (s.bank_branch) { doc.text(`Branch: ${s.bank_branch}`, 40, ty); ty += 12; }
    if (s.bank_swift) { doc.text(`SWIFT: ${s.bank_swift}`, 40, ty); ty += 12; }
    if (s.vat_number) { doc.text(`VAT No: ${s.vat_number}`, 40, ty); ty += 12; }
  }

  if (b.notes) {
    ty += 6;
    doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(DARK);
    doc.text("NOTES", 40, ty); ty += 12;
    doc.setFont("helvetica","normal"); doc.setFontSize(10); doc.setTextColor(MUTED);
    const wrapped = doc.splitTextToSize(b.notes, w - 80);
    doc.text(wrapped, 40, ty);
  }

  // Footer
  const fy = doc.internal.pageSize.getHeight() - 50;
  doc.setDrawColor(GOLD); doc.setLineWidth(0.5); doc.line(40, fy - 12, w - 40, fy - 12);
  doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(MUTED);
  doc.text(`${s.company_name}  •  ${s.company_email}  •  ${s.company_phone}  •  svrm.group`, w / 2, fy, { align: "center" });
  if (s.invoice_footer) doc.text(s.invoice_footer, w / 2, fy + 12, { align: "center" });

  doc.save(`SVRM-${kind === "invoice" ? "INV" : "CONF"}-${b.booking_code}.pdf`);
}

export function downloadInvoicePdf(b: InvoiceBooking) { return build("invoice", b); }
export function downloadConfirmationPdf(b: InvoiceBooking) { return build("confirmation", b); }
