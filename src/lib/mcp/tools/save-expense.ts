import { defineTool } from '@lovable.dev/mcp-js';
import { supabaseForManagement,writeIdentity,expenseFields,writeAnnotations,validateWriteIdentity,assertSaved } from '../write';
import { result } from '../read';
export default defineTool({name:'save_expense',title:'Create or update expense record',description:'Record or correct an expense, optionally linked to a booking or supplier. Never pays a supplier. Updates require expected_updated_at; include current values to preserve fields.',inputSchema:{...writeIdentity,...expenseFields},annotations:writeAnnotations,
handler:async ({id,expected_updated_at,...fields},ctx)=>{
 validateWriteIdentity(id,expected_updated_at);const db=await supabaseForManagement(ctx);
 const query=id?db.from('expenses').update(fields).eq('id',id).eq('updated_at',expected_updated_at):db.from('expenses').insert({...fields,created_by:ctx.getUserId()});
 const {data,error}=await query.select('id,date,category,amount,currency,note,manual_booking_id,supplier_id,updated_at').maybeSingle();assertSaved(error,data);return result(data);
}});
