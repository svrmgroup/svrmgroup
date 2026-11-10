import { defineTool } from '@lovable.dev/mcp-js';
import { supabaseForAdmin } from '../supabase';
import { pageSchema, annotations, result, assertRead } from '../read';
import { z } from 'zod';
export default defineTool({name:'list_customers',title:'Read customers',description:'Read clients or enquiry contacts including contact details and country, with admin permissions.',inputSchema:{...pageSchema,source:z.enum(['clients','contacts']).default('clients')},annotations,
 handler:async ({limit,offset,source},ctx)=>{
  const db=await supabaseForAdmin(ctx);
  const query=source==='clients'? db.from('clients').select('id,full_name,email,phone,whatsapp,country,status,vip,total_spend,created_at'):db.from('contacts').select('id,name,email,phone,country,country_iso,source_page,enquiry_count,first_enquiry_at,last_enquiry_at,created_at');
  const {data,error}=await query.order('created_at',{ascending:false}).order('id').range(offset,offset+limit);
  assertRead(error);return result(data?.slice(0,limit)??[],{has_more:(data?.length??0)>limit,next_offset:offset+limit});
 }
});
