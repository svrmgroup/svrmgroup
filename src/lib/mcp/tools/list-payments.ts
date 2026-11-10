import { defineTool } from '@lovable.dev/mcp-js';
import { supabaseForAdmin } from '../supabase';
import { annotations,pageSchema,result,assertRead } from '../read';
import { paymentStatus } from '../finance';
export default defineTool({name:'list_payment_statuses',title:'Read payment statuses',description:'Read recorded booking payments, outstanding balances and derived paid/part-paid/unpaid states; does not verify bank settlement.',inputSchema:pageSchema,annotations,
 handler:async ({limit,offset},ctx)=>{
 const db=await supabaseForAdmin(ctx);
 const {data,error}=await db.from('manual_bookings').select('id,booking_code,currency,subtotal,amount_paid,deposit_amount,balance_due,status').order('created_at',{ascending:false}).order('id').range(offset,offset+limit);
 assertRead(error);return result((data??[]).slice(0,limit).map(b=>({...b,payment_status:paymentStatus(Number(b.subtotal),Number(b.amount_paid))})),{has_more:(data?.length??0)>limit,next_offset:offset+limit});
 }
});
