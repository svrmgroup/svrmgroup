import jsPDF from "jspdf";
import { loadSettings, loadLogoDataUrl } from "@/lib/invoicePdf";
import { croppedDataUrl } from "@/lib/itineraryImages";
import type { ItData, ItImage } from "@/lib/itinerary";
import { fileName } from "@/lib/itinerary";

const SYM: Record<string, string> = { ZAR: "R", USD: "$", EUR: "€", GBP: "£" };
const longDate = (iso?: string) => iso ? new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }).toUpperCase() : "";
const shortDate = (iso?: string) => iso ? new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";

const orderImgs = (imgs: ItImage[]) => {
  const main = imgs.find((i) => i.main) || imgs[0];
  return main ? [main, ...imgs.filter((i) => i !== main)] : [];
};

async function build(d: ItData): Promise<jsPDF> {
  const s = await loadSettings();
  const GOLD = s.brand_primary || "#b8935a";
  const CHARCOAL = "#1b1916";
  const CREAM = "#f3e9d2";
  const TEXT = "#2a2018";
  const MUTED = "#8a7a63";
  const LINE = "#d9c9a6";

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 48;
  const CW = W - M * 2;
  const BOTTOM = H - 64;

  // ---------- COVER ----------
  doc.setFillColor(CHARCOAL); doc.rect(0, 0, W, H, "F");
  if (d.cover?.path) {
    const img = await croppedDataUrl(d.cover.path, W / H, 1400, 0.55);
    if (img) doc.addImage(img, "JPEG", 0, 0, W, H);
  }
  const logo = await loadLogoDataUrl(s.logo_url, CHARCOAL);
  if (logo) doc.addImage(logo, "PNG", W / 2 - 40, 150, 80, 80);
  doc.setTextColor(CREAM); doc.setFont("helvetica", "bold"); doc.setFontSize(13);
  doc.text((s.company_name || "SVRM GROUP").toUpperCase(), W / 2, 260, { align: "center", charSpace: 3 });
  doc.setDrawColor(GOLD); doc.setLineWidth(0.8); doc.line(W / 2 - 40, 278, W / 2 + 40, 278);

  doc.setTextColor(GOLD); doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  doc.text("PERSONALISED ITINERARY", W / 2, H / 2 - 10, { align: "center", charSpace: 4 });
  doc.setTextColor(CREAM); doc.setFont("times", "normal"); doc.setFontSize(38);
  const nameLines = doc.splitTextToSize(d.client.name || "Valued Guest", CW);
  doc.text(nameLines, W / 2, H / 2 + 34, { align: "center" });
  let cy = H / 2 + 34 + (nameLines.length - 1) * 40 + 30;
  doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(CREAM);
  if (d.client.destination) { doc.text(d.client.destination.toUpperCase(), W / 2, cy, { align: "center", charSpace: 2 }); cy += 18; }
  const firstDate = d.client.arrival || d.days.find((x) => x.date)?.date;
  const lastDate = d.client.departure || [...d.days].reverse().find((x) => x.date)?.date;
  if (firstDate) {
    doc.setTextColor(GOLD);
    doc.text(lastDate && lastDate !== firstDate ? `${shortDate(firstDate)} – ${shortDate(lastDate)}` : shortDate(firstDate), W / 2, cy, { align: "center" });
    cy += 18;
  }
  if (d.client.ref) { doc.setFontSize(9); doc.setTextColor(MUTED); doc.text(`Ref ${d.client.ref}`, W / 2, cy, { align: "center" }); }
  doc.setTextColor(GOLD); doc.setFontSize(8.5);
  doc.text("CHAUFFEUR  •  CONCIERGE  •  EXPERIENCES  •  ACCOMMODATION", W / 2, H - 90, { align: "center", charSpace: 1.5 });

  // ---------- CONTENT PAGES ----------
  let y = 0;
  const newPage = () => { doc.addPage(); doc.setFillColor(CREAM); doc.rect(0, 0, W, H, "F"); y = 60; };
  const ensure = (need: number) => { if (y + need > BOTTOM) newPage(); };
  const para = (text: string, x: number, width: number, size = 10, color = TEXT, style: "normal" | "bold" | "italic" = "normal", font = "helvetica", lh = 1.45) => {
    doc.setFont(font, style); doc.setFontSize(size); doc.setTextColor(color);
    const lines = doc.splitTextToSize(text, width) as string[];
    for (const ln of lines) { ensure(size * lh); doc.text(ln, x, y); y += size * lh; }
  };
  const sectionTitle = (t: string) => {
    ensure(50);
    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(GOLD);
    doc.text(t, M, y, { charSpace: 2.5 }); y += 8;
    doc.setDrawColor(GOLD); doc.setLineWidth(0.6); doc.line(M, y, M + 36, y); y += 20;
  };
  const drawImg = async (img: ItImage, x: number, top: number, w: number, h: number) => {
    const data = await croppedDataUrl(img.path, w / h, Math.min(1800, Math.round(w * 3)));
    if (!data) return false;
    doc.addImage(data, "JPEG", x, top, w, h);
    doc.setDrawColor(LINE); doc.setLineWidth(0.4); doc.rect(x, top, w, h);
    return true;
  };
  const captionUnder = (img: ItImage, x: number, top: number, w: number) => {
    if (!img.caption) return 0;
    doc.setFont("helvetica", "italic"); doc.setFontSize(7.5); doc.setTextColor(MUTED);
    doc.text(doc.splitTextToSize(img.caption, w)[0], x, top + 10);
    return 12;
  };
  /** Gallery: 1 → full width, 2 → side by side, 3+ → rows of three. */
  const gallery = async (imgs: ItImage[], x = M, width = CW) => {
    if (!imgs.length) return;
    const gap = 8;
    for (let i = 0; i < imgs.length;) {
      const left = imgs.length - i;
      const n = left === 1 ? 1 : left === 2 || left === 4 ? 2 : 3;
      const row = imgs.slice(i, i + n);
      const w = (width - gap * (n - 1)) / n;
      const h = n === 1 ? w * 0.5 : n === 2 ? w * 0.66 : w * 0.75;
      const capH = row.some((r) => r.caption) ? 12 : 0;
      ensure(h + capH + 10);
      const top = y;
      for (let k = 0; k < row.length; k++) {
        const xx = x + k * (w + gap);
        await drawImg(row[k], xx, top, w, h);
        captionUnder(row[k], xx, top + h, w);
      }
      y = top + h + capH + gap + 4;
      i += n;
    }
  };

  newPage();

  // Intro
  if (d.intro?.trim()) {
    sectionTitle("WELCOME");
    for (const p of d.intro.split(/\n\s*\n/)) { para(p.trim(), M, CW, 11, TEXT, "normal", "times", 1.5); y += 8; }
    y += 10;
  }

  // Trip summary
  const facts: [string, string][] = ([
    ["Lead guest", d.client.name], ["Guests", d.client.guests], ["Reference", d.client.ref],
    ["Arrival", shortDate(d.client.arrival)], ["Departure", shortDate(d.client.departure)],
    ["Accommodation", d.client.accommodation], ["Vehicle", d.client.vehicle],
    ["Chauffeur", d.client.chauffeur], ["Concierge", d.client.concierge], ["Security", d.client.security],
  ] as [string, string][]).filter(([, v]) => v);
  if (facts.length) {
    sectionTitle("YOUR JOURNEY");
    const colW = CW / 2;
    for (let i = 0; i < facts.length; i += 2) {
      ensure(30);
      const top = y;
      let maxY = top;
      for (let k = 0; k < 2 && i + k < facts.length; k++) {
        const [l, v] = facts[i + k];
        const x = M + k * colW;
        doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.setTextColor(GOLD); doc.text(l.toUpperCase(), x, top, { charSpace: 1.2 });
        doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(TEXT);
        const lines = doc.splitTextToSize(v, colW - 16) as string[];
        doc.text(lines, x, top + 13);
        maxY = Math.max(maxY, top + 13 + lines.length * 13);
      }
      y = maxY + 8;
    }
    y += 12;
  }

  // Days
  for (let di = 0; di < d.days.length; di++) {
    const day = d.days[di];
    const imgs = orderImgs(day.images);
    const heroH = CW * 0.5;
    // Keep the heading with at least the hero or first activity.
    ensure(90 + (imgs.length ? Math.min(heroH, 220) : 60));
    if (y > 80) y += 14;
    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(GOLD);
    doc.text(`DAY ${String(di + 1).padStart(2, "0")}`, M, y, { charSpace: 3 });
    y += 22;
    doc.setFont("times", "normal"); doc.setFontSize(22); doc.setTextColor(TEXT);
    const tl = doc.splitTextToSize((day.title || "").toUpperCase() || "ITINERARY", CW) as string[];
    doc.text(tl, M, y); y += tl.length * 24 - 6;
    if (day.date) { doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(MUTED); y += 8; doc.text(longDate(day.date), M, y, { charSpace: 1.5 }); }
    y += 10; doc.setDrawColor(GOLD); doc.setLineWidth(0.6); doc.line(M, y, W - M, y); y += 20;

    if (imgs[0]) {
      ensure(heroH + 20);
      await drawImg(imgs[0], M, y, CW, heroH);
      y += heroH + captionUnder(imgs[0], M, y + heroH, CW) + 18;
    }
    if (day.notes?.trim()) { para(day.notes, M, CW, 10, MUTED, "italic"); y += 8; }

    const acts = [...day.activities].filter((a) => a.title || a.description || a.time);
    for (const a of acts) {
      const TX = M + 74, TW = CW - 74;
      ensure(40);
      const top = y;
      doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(GOLD);
      if (a.time) doc.text(a.time, M, top);
      doc.setTextColor(TEXT); doc.setFont("helvetica", "bold"); doc.setFontSize(11);
      const titleLines = doc.splitTextToSize(a.title || "", TW) as string[];
      doc.text(titleLines, TX, top); y = top + titleLines.length * 14;
      const route = a.pickup && a.dropoff ? `${a.pickup}  →  ${a.dropoff}` : a.pickup ? `Collection: ${a.pickup}` : a.dropoff ? `Drop-off: ${a.dropoff}` : "";
      if (route) para(route, TX, TW, 9.5, MUTED);
      if (a.description) para(a.description, TX, TW, 10, TEXT);
      const meta = [
        a.venue && `Venue: ${a.venue}`, a.accommodation && `Accommodation: ${a.accommodation}`,
        a.vehicle && `Vehicle: ${a.vehicle}`, a.driver && `Chauffeur: ${a.driver}`, a.confirmation && `Ref: ${a.confirmation}`,
      ].filter(Boolean).join("   ·   ");
      if (meta) para(meta, TX, TW, 8.5, MUTED);
      if (a.notes) para(a.notes, TX, TW, 9, MUTED, "italic");
      if (a.images.length) { y += 4; await gallery(orderImgs(a.images).slice(0, 3), TX, TW); }
      y += 12;
      doc.setDrawColor(LINE); doc.setLineWidth(0.3); doc.line(TX, y - 6, W - M, y - 6);
      y += 6;
    }
    if (imgs.length > 1) { y += 4; await gallery(imgs.slice(1)); }
  }

  // Inclusions
  if (d.inclusions.length) {
    y += 10; sectionTitle("INCLUSIONS");
    const colW = CW / 2;
    for (let i = 0; i < d.inclusions.length; i += 2) {
      ensure(16);
      for (let k = 0; k < 2 && i + k < d.inclusions.length; k++) {
        const x = M + k * colW;
        doc.setFillColor(GOLD); doc.circle(x + 2, y - 3, 1.6, "F");
        doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(TEXT);
        doc.text(doc.splitTextToSize(d.inclusions[i + k], colW - 20)[0], x + 10, y);
      }
      y += 16;
    }
    y += 10;
  }

  // Important information
  const info = d.info.filter((x) => x.value?.trim());
  if (info.length) {
    y += 6; sectionTitle("IMPORTANT INFORMATION");
    for (const it of info) {
      ensure(30);
      doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.setTextColor(GOLD);
      doc.text((it.label || "Note").toUpperCase(), M, y, { charSpace: 1.2 }); y += 13;
      para(it.value, M, CW, 10); y += 8;
    }
  }

  // Pricing (optional)
  if (d.pricing.show) {
    const sym = SYM[d.pricing.currency] || d.pricing.currency + " ";
    const money = (n: number) => `${sym}${Number(n || 0).toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    y += 6; sectionTitle("INVESTMENT");
    for (const it of d.pricing.items) {
      ensure(18);
      doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(TEXT);
      doc.text(doc.splitTextToSize(it.label, CW - 120)[0], M, y);
      doc.text(money(it.amount), W - M, y, { align: "right" }); y += 16;
    }
    const rows: [string, number][] = [["Total package", d.pricing.total], ["Deposit", d.pricing.deposit], ["Paid to date", d.pricing.paid], ["Balance", d.pricing.balance]];
    ensure(rows.length * 18 + 40);
    doc.setFillColor(CHARCOAL); doc.rect(M, y, CW, rows.length * 18 + 18, "F");
    let py = y + 20;
    for (const [l, v] of rows) {
      if (!v && l !== "Total package") continue;
      doc.setFont("helvetica", l === "Total package" ? "bold" : "normal"); doc.setFontSize(10);
      doc.setTextColor(l === "Total package" ? GOLD : CREAM);
      doc.text(l, M + 16, py); doc.text(money(v), W - M - 16, py, { align: "right" }); py += 18;
    }
    y += rows.length * 18 + 30;
    if (d.pricing.dueDate) para(`Balance due by ${shortDate(d.pricing.dueDate)}.`, M, CW, 9, MUTED, "italic");
  }

  // Sign-off
  ensure(70); y += 18;
  doc.setFont("times", "italic"); doc.setFontSize(12); doc.setTextColor(TEXT);
  doc.text("With warm regards,", M, y); y += 16;
  doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(GOLD);
  doc.text("THE SVRM GROUP CONCIERGE TEAM", M, y, { charSpace: 1.5 });

  // ---------- FOOTERS ----------
  const total = doc.getNumberOfPages();
  const footer = [s.company_name || "SVRM GROUP", s.company_phone, s.company_email, s.website].filter(Boolean).join("   ·   ");
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    const dark = p === 1;
    doc.setDrawColor(GOLD); doc.setLineWidth(0.4); doc.line(M, H - 40, W - M, H - 40);
    doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(dark ? CREAM : MUTED);
    doc.text(footer, M, H - 26);
    doc.text(`${p} / ${total}`, W - M, H - 26, { align: "right" });
  }
  return doc;
}

export async function renderItineraryBlob(d: ItData) { return (await build(d)).output("blob"); }
export async function downloadItineraryPdf(d: ItData) { (await build(d)).save(fileName(d)); }
