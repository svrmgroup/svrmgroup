import jsPDF from "jspdf";
import { loadLogoDataUrl, loadSettings } from "@/lib/invoicePdf";

/**
 * Branded self-drive rental agreement PDF — same cream/gold SVRM styling as
 * the invoice/quotation renderer. Every field is supplied by the admin so the
 * contract can be filled in manually before download.
 */

export interface RentalAgreementData {
  agreement_no: string;
  agreement_date?: string;
  // Renter
  renter_name: string;
  renter_id?: string;
  renter_licence?: string;
  renter_licence_expiry?: string;
  renter_phone?: string;
  renter_email?: string;
  renter_address?: string;
  // Vehicle
  vehicle: string;
  registration?: string;
  colour?: string;
  collection_at?: string;
  return_at?: string;
  collection_location?: string;
  return_location?: string;
  odometer_out?: string;
  fuel_out?: string;
  mileage_allowance?: string;
  excess_mileage_charge?: string;
  // Money
  currency: string;
  daily_rate?: number;
  days?: number;
  extras_total?: number;
  total?: number;
  security_deposit?: number;
  amount_paid?: number;
  balance_due?: number;
  // Extra
  policy_charges?: string;
  notes?: string;
  terms?: string[];
}

export const DEFAULT_RENTAL_TERMS: string[] = [
  "The vehicle may only be driven by the renter named in this agreement, or by an additional driver approved in writing by SVRM Group.",
  "The renter must hold a valid, unendorsed driver's licence for the full rental period and produce it on collection.",
  "The vehicle may not be driven under the influence of alcohol or any narcotic substance.",
  "The vehicle may not leave the borders of South Africa without prior written consent from SVRM Group.",
  "The vehicle may not be used for racing, off-road driving, towing, driving instruction, or any unlawful purpose.",
  "The vehicle may not be sub-let, hired out, or used for reward or the conveyance of passengers for payment.",
  "Fuel is supplied full and must be returned full; a refuelling fee plus fuel cost applies otherwise.",
  "Smoking in the vehicle is prohibited; a cleaning fee applies where the vehicle is returned excessively soiled.",
  "All traffic fines, toll fees and related administration charges incurred during the rental remain the renter's responsibility.",
  "In the event of an accident, theft or damage the renter must notify SVRM Group immediately and obtain a police case number within 24 hours.",
  "The renter is liable for the insurance excess on any damage or loss, and for the full value of the vehicle where a term of this agreement was breached.",
  "The security deposit is refundable within 7 working days of return, less any charges due under this agreement.",
  "Late returns are charged at the daily rate per commenced 24-hour period unless agreed in writing.",
];

const SYMBOLS: Record<string, string> = { ZAR: "R", USD: "$", EUR: "€", GBP: "£" };

export async function buildRentalAgreementPdf(
  d: RentalAgreementData,
  output: "save" | "blob" = "save",
): Promise<Blob | void> {
  const s = await loadSettings();
  const GOLD = s.brand_primary || "#b8935a";
  const DARK = s.brand_bg || "#3b2e20";
  const CREAM = "#f3e9d2";
  const CREAM_SOFT = "#e8dcbe";
  const TEXT = "#2a2018";
  const MUTED = "#8a7a63";
  const sym = SYMBOLS[d.currency] || `${d.currency} `;
  const money = (n?: number | null) =>
    n === undefined || n === null || n === ("" as any)
      ? "—"
      : `${sym}${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  const paintBg = () => { doc.setFillColor(CREAM); doc.rect(0, 0, w, h, "F"); };
  const footer = () => {
    const fy = h - 40;
    doc.setDrawColor("#c9bfa8"); doc.setLineWidth(0.5); doc.line(40, fy - 18, w - 40, fy - 18);
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(MUTED);
    const foot = [s.company_email, s.company_phone, (s.website || "").replace(/^https?:\/\//, "")].filter(Boolean).join("   •   ");
    doc.text(foot, w / 2, fy, { align: "center" });
  };

  paintBg();

  // Header — circular SVRM mark
  const logoY = 36;
  const logo = await loadLogoDataUrl(s.logo_url, CREAM);
  if (logo) {
    try { doc.addImage(logo, "PNG", w / 2 - 28, logoY, 56, 56); } catch { /* ignore */ }
  }
  doc.setTextColor(TEXT); doc.setFont("helvetica", "bold"); doc.setFontSize(20);
  doc.text((s.company_name || "SVRM GROUP").toUpperCase(), w / 2, logoY + 84, { align: "center" });
  doc.setTextColor(GOLD); doc.setFont("helvetica", "normal"); doc.setFontSize(8);
  doc.text((s.tagline || "").toUpperCase(), w / 2, logoY + 98, { align: "center" });
  doc.setDrawColor(GOLD); doc.setLineWidth(1);
  doc.line(w / 2 - 40, logoY + 108, w / 2 + 40, logoY + 108);

  let y = logoY + 140;
  doc.setTextColor(TEXT); doc.setFont("helvetica", "bold"); doc.setFontSize(16);
  doc.text("SELF-DRIVE RENTAL AGREEMENT", 40, y);
  y += 20;
  doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  const date = d.agreement_date || new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  doc.text(`Agreement No: ${d.agreement_no}`, 40, y); y += 14;
  doc.text(`Date: ${date}`, 40, y); y += 24;

  const ensure = (need: number) => {
    if (y + need < h - 70) return;
    footer();
    doc.addPage();
    paintBg();
    y = 60;
  };

  const section = (label: string) => {
    ensure(50);
    doc.setDrawColor(GOLD); doc.setLineWidth(0.4); doc.line(40, y - 12, w - 40, y - 12);
    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(GOLD);
    doc.text(label.toUpperCase(), 40, y);
    y += 16;
  };

  const rows = (pairs: [string, string | undefined][]) => {
    const filtered = pairs.filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "");
    for (let i = 0; i < filtered.length; i += 2) {
      ensure(30);
      const pair = filtered.slice(i, i + 2);
      pair.forEach(([k, v], col) => {
        const x = col === 0 ? 40 : w / 2 + 5;
        doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(MUTED);
        doc.text(k.toUpperCase(), x, y);
        doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(TEXT);
        const lines = doc.splitTextToSize(String(v), w / 2 - 50);
        doc.text(lines, x, y + 13);
      });
      y += 34;
    }
    y += 6;
  };

  section("Renter details");
  rows([
    ["Full name", d.renter_name],
    ["ID / Passport no.", d.renter_id],
    ["Driver's licence no.", d.renter_licence],
    ["Licence expiry", d.renter_licence_expiry],
    ["Mobile", d.renter_phone],
    ["Email", d.renter_email],
    ["Address", d.renter_address],
  ]);

  section("Vehicle & rental period");
  rows([
    ["Vehicle", d.vehicle],
    ["Registration", d.registration],
    ["Colour", d.colour],
    ["Odometer out", d.odometer_out],
    ["Collection", d.collection_at],
    ["Return", d.return_at],
    ["Collection location", d.collection_location],
    ["Return location", d.return_location],
    ["Fuel level out", d.fuel_out],
    ["Mileage allowance", d.mileage_allowance],
    ["Excess mileage charge", d.excess_mileage_charge],
  ]);

  section("Charges");
  ensure(120);
  const boxY = y - 4;
  const lines: [string, string][] = [
    ["Daily rate", money(d.daily_rate)],
    ["Rental days", d.days ? String(d.days) : "—"],
    ["Extras", money(d.extras_total)],
    ["Total rental", money(d.total)],
    ["Security deposit (refundable)", money(d.security_deposit)],
    ["Amount paid", money(d.amount_paid)],
  ];
  doc.setFillColor(CREAM_SOFT);
  doc.roundedRect(40, boxY, w - 80, lines.length * 16 + 46, 6, 6, "F");
  y = boxY + 20;
  lines.forEach(([k, v]) => {
    doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(TEXT);
    doc.text(k, 56, y);
    doc.text(v, w - 56, y, { align: "right" });
    y += 16;
  });
  doc.setDrawColor("#c9bfa8"); doc.line(56, y - 6, w - 56, y - 6);
  doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(TEXT);
  doc.text("Balance due on collection", 56, y + 10);
  doc.text(money(d.balance_due), w - 56, y + 10, { align: "right" });
  y = boxY + lines.length * 16 + 46 + 26;

  if (d.policy_charges) {
    section("Standard policy charges");
    ensure(40);
    doc.setFont("helvetica", "normal"); doc.setFontSize(9.5); doc.setTextColor(TEXT);
    const pl = doc.splitTextToSize(d.policy_charges, w - 80);
    pl.forEach((l: string) => { ensure(16); doc.text(l, 40, y); y += 13; });
    y += 10;
  }

  if (d.notes) {
    section("Notes");
    doc.setFont("helvetica", "normal"); doc.setFontSize(9.5); doc.setTextColor(TEXT);
    const nl = doc.splitTextToSize(d.notes, w - 80);
    nl.forEach((l: string) => { ensure(16); doc.text(l, 40, y); y += 13; });
    y += 10;
  }

  section("Terms & conditions");
  const terms = (d.terms && d.terms.length ? d.terms : DEFAULT_RENTAL_TERMS);
  terms.forEach((t, i) => {
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(TEXT);
    const tl = doc.splitTextToSize(`${i + 1}.  ${t}`, w - 90);
    ensure(tl.length * 12 + 6);
    doc.text(tl, 44, y);
    y += tl.length * 12 + 4;
  });
  y += 16;

  // Signatures
  ensure(110);
  doc.setFillColor(DARK);
  doc.roundedRect(40, y, w - 80, 30, 6, 6, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(GOLD);
  doc.text("ACCEPTANCE", 56, y + 19);
  doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor("#cfc7b6");
  doc.text("Signing below confirms acceptance of all terms above.", w - 56, y + 19, { align: "right" });
  y += 62;

  doc.setDrawColor("#a99a80"); doc.setLineWidth(0.6);
  doc.line(40, y, w / 2 - 20, y);
  doc.line(w / 2 + 20, y, w - 40, y);
  doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(MUTED);
  doc.text("RENTER SIGNATURE & DATE", 40, y + 12);
  doc.text("FOR SVRM GROUP", w / 2 + 20, y + 12);
  doc.setFontSize(9); doc.setTextColor(TEXT);
  doc.text(d.renter_name || "", 40, y - 8);

  footer();

  if (output === "blob") return doc.output("blob") as Blob;
  doc.save(`SVRM-RENTAL-AGREEMENT-${d.agreement_no}.pdf`);
}

export function downloadRentalAgreementPdf(d: RentalAgreementData) {
  return buildRentalAgreementPdf(d, "save");
}
