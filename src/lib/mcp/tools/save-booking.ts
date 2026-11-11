import { defineTool } from '@lovable.dev/mcp-js';
import { supabaseForManagement,writeIdentity,bookingFields,writeAnnotations,validateWriteIdentity,validateBookingDates,bookingBalance,assertSaved } from '../write';
import { result } from '../read';
import { buildConfirmationMessage } from '../../confirmationMessage';
export default defineTool({name:'save_booking_invoice',title:'Create or update booking and invoice',description:'Create a booking/invoice or replace editable fields after reading its updated_at. Stores invoice data and confirmation text; never sends it or initiates payment. Omitted editable fields use defaults; include existing values to preserve them.',inputSchema:{...writeIdentity,...bookingFields},annotations:writeAnnotations,
handler:async ({id,expected_updated_at,...fields},ctx)=>{
 validateWriteIdentity(id,expected_updated_at);validateBookingDates(fields.start_date,fields.end_date);
 const db=await supabaseForManagement(ctx);
 const patch={...fields,client_email:fields.client_email||null,balance_due:bookingBalance(fields.subtotal,fields.amount_paid,fields.deposit_amount)};
 // Only whitelisted fields, never portal secrets, identity fields or arbitrary table names.
 const query=id?db.from('manual_bookings').update(patch).eq('id',id).eq('updated_at',expected_updated_at):db.from('manual_bookings').insert({...patch,created_by:ctx.getUserId()});
 const {data,error}=await query.select('id,booking_code,client_name,client_email,client_phone,currency,line_items,subtotal,quoted_total,amount_paid,deposit_amount,balance_due,start_date,end_date,status,notes,updated_at').maybeSingle();
 assertSaved(error,data);if(!data)return result([]);
 const message=buildConfirmationMessage({...data,line_items:fields.line_items.map(item=>({label:item.label??'',amount:item.amount??0,qty:item.qty,unit:item.unit}))});
 const saved=await db.from('manual_bookings').update({confirmation_message:message}).eq('id',data.id).eq('updated_at',data.updated_at).select('id,booking_code,updated_at').maybeSingle();
 return result(data,{confirmation_text_saved:!saved.error&&!!saved.data,updated_at:saved.data?.updated_at??data.updated_at});
}});
