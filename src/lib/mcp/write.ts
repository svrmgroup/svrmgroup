import { z } from 'zod';
import { ToolError, type ToolContext } from '@lovable.dev/mcp-js';
import { supabaseForAdmin } from './supabase';
import { requiredPhone, optionalEmail } from '../contactValidation';
export const writeAnnotations = { readOnlyHint:false,destructiveHint:false,idempotentHint:false,openWorldHint:false };
export const writeIdentity = { id:z.string().uuid().optional(), expected_updated_at:z.string().datetime({offset:true}).optional() };
export const currency=z.enum(['ZAR','USD','EUR','GBP']);
const money=z.number().finite().min(0).max(100000000);
const text=z.string().trim().max(5000);
export const bookingFields={client_name:z.string().trim().min(1).max(255),client_phone:requiredPhone,client_email:optionalEmail,currency,line_items:z.array(z.object({label:z.string().trim().min(1).max(255),qty:z.number().positive().optional(),unit:z.string().max(40).optional(),amount:money}).strict()).min(1).max(100),subtotal:money,quoted_total:money.nullable().optional(),deposit_amount:money.default(0),amount_paid:money.default(0),start_date:z.string().date().nullable().optional(),end_date:z.string().date().nullable().optional(),notes:text.optional(),status:z.enum(['draft','confirmed','completed','cancelled']).default('draft')};
export const customerFields={full_name:z.string().trim().min(1).max(255),phone:requiredPhone,email:optionalEmail,whatsapp:requiredPhone.optional(),country:z.string().max(100).optional(),status:z.enum(['lead','client','vip','archived']).default('client'),vip:z.boolean().default(false),notes:text.optional()};
export const expenseFields={date:z.string().date(),category:z.enum(['fuel','cleaning','supplier','marketing','staff','commission','maintenance','utilities','software','insurance','other']),amount:money.positive(),currency,note:text.optional(),manual_booking_id:z.string().uuid().nullable().optional(),supplier_id:z.string().uuid().nullable().optional()};
export function managementTokenAllowed(iat:unknown,approvedAt:string){return typeof iat==='number'&&iat>=Math.ceil(Date.parse(approvedAt)/1000);}
export async function supabaseForManagement(ctx:ToolContext){
 const db=await supabaseForAdmin(ctx);
 const {data,error}=await db.from('assistant_management_grants').select('approved_at').eq('user_id',ctx.getUserId()).eq('client_id',ctx.getClientId()).maybeSingle();
 if(error||!data||!managementTokenAllowed(ctx.getClaims()?.iat,data.approved_at))throw new ToolError('Management access requires a new approval. Reconnect your assistant and approve manage-records access.');
 return db;
}
export function validateWriteIdentity(id?:string,updated?:string){if(id&&!updated)throw new ToolError('Read the record first and supply expected_updated_at before updating.');if(!id&&updated)throw new ToolError('A record ID is required for an update.');}
export function bookingBalance(total:number,paid:number,deposit:number){return Math.max(0,total-(paid>0?paid:deposit));}
export function validateBookingDates(start?:string|null,end?:string|null){if(start&&end&&end<start)throw new ToolError('End date must not precede start date.');}
export function assertSaved(error:unknown,data:unknown){if(error)throw new ToolError('Record was not saved. Check the supplied details and admin permissions.');if(!data)throw new ToolError('Record changed or is not accessible. Read it again before updating.');}
