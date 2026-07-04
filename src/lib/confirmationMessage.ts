export interface LineItem {
  label: string;
  qty?: number;
  unit?: string; // e.g. "night", "day"
  amount: number; // total for this line
}

export interface BookingForMessage {
  booking_code: string;
  client_name: string;
  currency: string;
  line_items: LineItem[];
  subtotal: number;
  deposit_amount: number;
  balance_due: number;
  start_date?: string | null;
  end_date?: string | null;
  notes?: string | null;
}

const fmt = (cur: string, n: number) =>
  `${cur} ${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

export function buildConfirmationMessage(b: BookingForMessage): string {
  const lines: string[] = [];
  lines.push(`Dear ${b.client_name},`);
  lines.push("");
  lines.push(`Thank you for choosing SVRM Group. It's our pleasure to confirm your reservation below — every detail has been arranged to our concierge standard.`);
  lines.push("");
  lines.push(`*Booking reference:* ${b.booking_code}`);
  if (b.start_date && b.end_date) {
    lines.push(`*Dates:* ${b.start_date} → ${b.end_date}`);
  }
  lines.push("");
  lines.push(`*Your reservation includes:*`);
  for (const item of b.line_items) {
    const qtyStr = item.qty && item.unit
      ? ` (${item.qty} ${item.unit}${item.qty > 1 ? "s" : ""})`
      : "";
    lines.push(`• ${item.label}${qtyStr} — ${fmt(b.currency, item.amount)}`);
  }
  lines.push("");
  lines.push(`*Subtotal:* ${fmt(b.currency, b.subtotal)}`);
  if (b.deposit_amount > 0) {
    lines.push(`*Deposit due now:* ${fmt(b.currency, b.deposit_amount)}`);
    lines.push(`*Balance due:* ${fmt(b.currency, b.balance_due)}`);
  } else {
    lines.push(`*Total due:* ${fmt(b.currency, b.balance_due || b.subtotal)}`);
  }
  lines.push("");
  lines.push(`Payment details will follow in a separate message. Kindly quote reference ${b.booking_code} on your transfer.`);
  if (b.notes) {
    lines.push("");
    lines.push(`Additional notes: ${b.notes}`);
  }
  lines.push("");
  lines.push(`Your concierge is on standby for anything you need before, during, or after your stay — arrivals, transfers, in-villa dining, security, private aviation.`);
  lines.push("");
  lines.push(`With warm regards,`);
  lines.push(`SVRM Group Concierge`);
  lines.push(`+27 73 064 1481 · concierge@svrm.group · svrm.group`);
  return lines.join("\n");
}
