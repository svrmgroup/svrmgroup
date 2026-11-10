import { defineTool, ToolError } from '@lovable.dev/mcp-js';
import { z } from 'zod';
import { supabaseForAdmin } from '../supabase';
import { annotations,result,assertRead } from '../read';
import { financialSummary } from '../finance';
const date=z.string().date();
export default defineTool({name:'read_financial_report',title:'Read financial report',description:'Summarise paid revenue and expenses in a date range and single currency using the existing admin P&L basis (booking creation dates and expense dates).',inputSchema:{start_date:date,end_date:date,currency:z.enum(['ZAR','USD','EUR','GBP']).default('ZAR')},annotations,
 handler:async ({start_date,end_date,currency},ctx)=>{
 if(end_date<start_date)throw new ToolError('End date must not precede start date.');
 const db=await supabaseForAdmin(ctx);
 const end=new Date(new Date(end_date+'T00:00:00Z').getTime()+86400000).toISOString();
 const bookings: {subtotal:number;amount_paid:number}[]=[];
 const expenses: {amount:number;category:string}[]=[];
 // Explicit pages prevent PostgREST's row cap from silently producing incomplete totals.
 for(let offset=0;offset<10000;offset+=500){
 const [b,e]=await Promise.all([
 db.from('manual_bookings').select('id,subtotal,amount_paid').eq('currency',currency).gte('created_at',start_date+'T00:00:00Z').lt('created_at',end).order('id').range(offset,offset+499),
 db.from('expenses').select('id,amount,category').eq('currency',currency).gte('date',start_date).lte('date',end_date).order('id').range(offset,offset+499)]);
 assertRead(b.error);assertRead(e.error);bookings.push(...(b.data??[]));expenses.push(...(e.data??[]));
 if((b.data?.length??0)<500&&(e.data?.length??0)<500)return result(financialSummary(bookings,expenses),{currency,start_date,end_date,booking_count:bookings.length,expense_count:expenses.length,basis:'Admin P&L: bookings by creation date; expenses by expense date. Recorded payments, not settlement dates. Supplier payouts are not double-counted.'});
 if(ctx.signal.aborted)throw new ToolError('Report cancelled.');
 }
 throw new ToolError('Too many records for a complete report. Choose a shorter date range.');
 }
});
