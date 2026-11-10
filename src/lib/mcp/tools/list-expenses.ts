import { defineTool } from '@lovable.dev/mcp-js';
import { z } from 'zod';
import { supabaseForAdmin } from '../supabase';
import { pageSchema,annotations,result,assertRead } from '../read';
export default defineTool({name:'list_supplier_expenses',title:'Read supplier expenses',description:'Read expenses linked to the supplier directory or supplier payout obligations without combining them as duplicate expenses.',inputSchema:{...pageSchema,source:z.enum(['expenses','payouts']).default('expenses'),supplier_id:z.string().uuid().optional()},annotations,
 handler:async ({limit,offset,source,supplier_id},ctx)=>{
 const db=await supabaseForAdmin(ctx);
 const query=source==='expenses'?db.from('expenses').select('id,date,category,amount,currency,note,manual_booking_id,supplier_id,suppliers_directory(company_name)').not('supplier_id','is',null):db.from('supplier_payouts').select('id,supplier_id,manual_booking_id,amount,currency,due_date,status,paid_at,note,suppliers(name)');
 if(supplier_id)query.eq('supplier_id',supplier_id);
 const {data,error}=await query.order('created_at',{ascending:false}).order('id').range(offset,offset+limit);
 assertRead(error);return result(data?.slice(0,limit)??[],{has_more:(data?.length??0)>limit,next_offset:offset+limit});
 }
});
