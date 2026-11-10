export interface BookingMoney { subtotal: number | string; amount_paid: number | string }
export interface ExpenseMoney { amount: number | string; category: string }
export function financialSummary(bookings: BookingMoney[], expenses: ExpenseMoney[]) {
  const revenue = bookings.reduce((s,b) => s + Number(b.amount_paid || 0), 0);
  const booked = bookings.reduce((s,b) => s + Number(b.subtotal || 0), 0);
  const expenseTotal = expenses.reduce((s,e) => s + Number(e.amount || 0), 0);
  const categories: Record<string, number> = {};
  for (const e of expenses) categories[e.category] = (categories[e.category] ?? 0) + Number(e.amount || 0);
  return { revenue_paid: revenue, booked_value: booked, outstanding: Math.max(0, booked-revenue), expenses: expenseTotal, net_profit: revenue-expenseTotal, margin_percent: revenue > 0 ? (revenue-expenseTotal)/revenue*100 : 0, expense_categories: categories };
}
export function paymentStatus(total: number, paid: number) { return total > 0 && paid >= total ? 'paid' : paid > 0 ? 'part_paid' : 'unpaid'; }
