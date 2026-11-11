import { defineTool } from '@lovable.dev/mcp-js';
import { z } from 'zod';
import { supabaseForAdmin } from '../supabase';
import { pageSchema, annotations, result, assertRead } from '../read';
export default defineTool({ name: 'list_bookings', title: 'Read bookings', description: 'Read stored manual bookings or calendar bookings, restricted to existing admin access.', inputSchema: { ...pageSchema, kind: z.enum(['manual','calendar']).default('manual'), status: z.string().max(40).optional() }, annotations,
  handler: async ({limit,offset,kind,status},ctx) => {
    const db = await supabaseForAdmin(ctx);
    const query = kind === 'manual' ? db.from('manual_bookings').select('id,booking_code,client_name,client_email,client_phone,currency,subtotal,amount_paid,balance_due,start_date,end_date,status,created_at,updated_at') : db.from('admin_bookings').select('id,title,category,start_date,end_date,guest_name,guest_contact,location,status,created_at,updated_at');
    if (status) query.eq('status',status);
    const {data,error} = await query.order('created_at',{ascending:false}).order('id').range(offset,offset+limit);
    assertRead(error); return result(data?.slice(0,limit) ?? [], {has_more: (data?.length ?? 0)>limit, next_offset:offset+limit});
  }
});
