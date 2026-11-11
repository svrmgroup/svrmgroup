import { defineTool } from '@lovable.dev/mcp-js';
import { supabaseForManagement,writeIdentity,customerFields,writeAnnotations,validateWriteIdentity,assertSaved } from '../write';
import { result } from '../read';
export default defineTool({name:'save_customer',title:'Create or update customer',description:'Create a CRM client or replace editable details using expected_updated_at. Requires phone; email is optional. Include current values to preserve fields.',inputSchema:{...writeIdentity,...customerFields},annotations:writeAnnotations,
handler:async ({id,expected_updated_at,...fields},ctx)=>{
 validateWriteIdentity(id,expected_updated_at);const db=await supabaseForManagement(ctx);
 const patch={...fields,email:fields.email||null};
 const query=id?db.from('clients').update(patch).eq('id',id).eq('updated_at',expected_updated_at):db.from('clients').insert(patch);
 const {data,error}=await query.select('id,full_name,email,phone,whatsapp,country,status,vip,notes,updated_at').maybeSingle();assertSaved(error,data);return result(data);
}});
