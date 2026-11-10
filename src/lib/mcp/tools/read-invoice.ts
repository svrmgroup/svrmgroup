import { defineTool, ToolError } from '@lovable.dev/mcp-js';
import { z } from 'zod';
import { supabaseForAdmin } from '../supabase';
import { annotations,result,assertRead } from '../read';
export default defineTool({name:'read_invoice',title:'Read invoice data',description:'Read stored invoice line items and amounts for a booking; excludes browser-only unsaved PDF edits and client portal tokens.',inputSchema:{booking_id:z.string().uuid()},annotations,
 handler:async ({booking_id},ctx)=>{
 const db=await supabaseForAdmin(ctx);
 const {data,error}=await db.from('manual_bookings').select('id,booking_code,client_name,client_email,client_phone,line_items,currency,subtotal,quoted_total,deposit_amount,amount_paid,balance_due,start_date,end_date,status,created_at').eq('id',booking_id).maybeSingle();
 assertRead(error);if(!data)throw new ToolError('Invoice booking not found or not accessible.');return result(data,{basis:'Stored booking invoice data; temporary PDF edits are not persisted.'});
 }
});
