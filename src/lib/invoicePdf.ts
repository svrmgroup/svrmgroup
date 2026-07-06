import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { LineItem } from "@/lib/confirmationMessage";

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

const GOLD = "#c9a961";
const DARK = "#1f1b18";
const MUTED = "#8a8478";

export function downloadInvoicePdf(b: InvoiceBooking) {
  const sym = CURRENCY_SYMBOLS[b.currency] || b.currency + " ";
  const money = (n: number) => `${sym}${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const w = doc.internal.pageSize.getWidth();

  // Header band
  doc.setFillColor(DARK);
  doc.rect(0, 0, w, 90, "F");
  doc.setTextColor(GOLD);
  doc.setFont("times", "bold");
  doc.setFontSize(26);
  doc.text("SVRM", 40, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor("#e9e2d5");
  doc.text("LUXURY LIFESTYLE MANAGEMENT — CAPE TOWN", 40, 68);

  doc.setFontSize(10);
  doc.text("INVOICE", w - 40, 50, { align: "right" });
  doc.setFontSize(11);
  doc.setTextColor(GOLD);
  doc.text(b.booking_code, w - 40, 68, { align: "right" });

  // Meta block
  let y = 120;
  doc.setTextColor(DARK);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("BILLED TO", 40, y);
  doc.text("BOOKING", w / 2, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  y += 14;
  doc.text(b.client_name || "—", 40, y);
  const dates = b.start_date && b.end_date ? `${b.start_date} → ${b.end_date}` : b.start_date || "Dates TBC";
  doc.text(dates, w / 2, y);
  y += 12;
  if (b.client_email) doc.text(b.client_email, 40, y);
  doc.text(`Issued ${new Date(b.created_at).toLocaleDateString()}`, w / 2, y);
  y += 12;
  if (b.client_phone) doc.text(b.client_phone, 40, y);

  // Items table
  autoTable(doc, {
    startY: y + 24,
    head: [["Item", "Qty", "Unit", "Amount"]],
    body: (b.line_items || []).map((it) => [
      it.label,
      String(it.qty ?? 1),
      it.unit ?? "",
      money(Number(it.amount) || 0),
    ]),
    theme: "plain",
    styles: { font: "helvetica", fontSize: 10, cellPadding: 8, textColor: DARK },
    headStyles: { fillColor: DARK, textColor: GOLD, fontStyle: "bold", fontSize: 9 },
    columnStyles: {
      1: { halign: "center", cellWidth: 50 },
      2: { halign: "center", cellWidth: 70 },
      3: { halign: "right", cellWidth: 90 },
    },
    margin: { left: 40, right: 40 },
  });

  // Totals
  // @ts-expect-error jspdf-autotable augments doc at runtime
  let ty = (doc.lastAutoTable?.finalY || y + 40) + 20;
  const rightX = w - 40;
  const labelX = w - 200;
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
  row("Deposit received", money(b.deposit_amount));
  row("Balance due", money(b.balance_due), true);

  // Notes
  if (b.notes) {
    ty += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(DARK);
    doc.text("NOTES", 40, ty);
    ty += 12;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(MUTED);
    const wrapped = doc.splitTextToSize(b.notes, w - 80);
    doc.text(wrapped, 40, ty);
  }

  // Footer
  const fy = doc.internal.pageSize.getHeight() - 50;
  doc.setDrawColor(GOLD);
  doc.setLineWidth(0.5);
  doc.line(40, fy - 12, w - 40, fy - 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(MUTED);
  doc.text("SVRM Group  •  concierge@svrm.group  •  +27 73 064 1481  •  svrm.group", w / 2, fy, { align: "center" });
  doc.text("Payment terms: deposit secures your booking. Balance due before service start.", w / 2, fy + 12, { align: "center" });

  doc.save(`SVRM-${b.booking_code}.pdf`);
}
