import { describe,it,expect,vi } from 'vitest';
import { z } from 'zod';
import { managementTokenAllowed,bookingFields,customerFields,expenseFields,validateWriteIdentity,bookingBalance,validateBookingDates,supabaseForManagement } from './write';
import type { ToolContext } from '@lovable.dev/mcp-js';
const mocks=vi.hoisted(()=>({admin:vi.fn()}));
vi.mock('./supabase',()=>({supabaseForAdmin:mocks.admin}));
describe('Everyday record management boundaries',()=>{
 it('keeps earlier read-only tokens from gaining write access',()=>{expect(managementTokenAllowed(100,'1970-01-01T00:01:41Z')).toBe(false);expect(managementTokenAllowed(102,'1970-01-01T00:01:41Z')).toBe(true);expect(managementTokenAllowed(undefined,'1970-01-01T00:01:41Z')).toBe(false);});
 it('requires explicit per-client management approval',async()=>{const chain={select:()=>chain,eq:()=>chain,maybeSingle:async()=>({data:null,error:null})};mocks.admin.mockResolvedValue({from:()=>chain});const ctx={getUserId:()=> 'user',getClientId:()=> 'client',getClaims:()=>({iat:200})} as unknown as ToolContext;await expect(supabaseForManagement(ctx)).rejects.toThrow('new approval');});
 it('requires current record version before an update',()=>{expect(()=>validateWriteIdentity('test-id')).toThrow('Read the record');expect(()=>validateWriteIdentity('test-id','2026-11-10T00:00:00Z')).not.toThrow();});
 it('requires phone and permits blank email for bookings',()=>{const schema=z.object(bookingFields).strict();const booking={client_name:'Test guest',client_phone:'+27730000000',client_email:'',currency:'ZAR',line_items:[{label:'Tour',amount:10500}],subtotal:10500};expect(schema.safeParse(booking).success).toBe(true);expect(schema.safeParse({...booking,client_phone:''}).success).toBe(false);expect(schema.safeParse({...booking,client_token:'hidden'}).success).toBe(false);});
 it('requires phone but permits blank customer email',()=>{const schema=z.object(customerFields).strict();expect(schema.safeParse({full_name:'Test',phone:'+27730000000',email:''}).success).toBe(true);expect(schema.safeParse({full_name:'Test',phone:''}).success).toBe(false);expect(schema.safeParse({full_name:'Test',phone:'+27730000000',role:'admin'}).success).toBe(false);});
 it('does not accept payment execution or deletion in expense input',()=>{const schema=z.object(expenseFields).strict();const expense={date:'2026-11-10',category:'supplier',amount:100,currency:'ZAR'};expect(schema.safeParse(expense).success).toBe(true);expect(schema.safeParse({...expense,pay_now:true}).success).toBe(false);expect(schema.safeParse({...expense,delete:true}).success).toBe(false);});
 it('keeps booking balance consistent with the existing admin',()=>{expect(bookingBalance(10500,5000,1000)).toBe(5500);expect(bookingBalance(10500,0,1000)).toBe(9500);});
 it('rejects reversed booking dates',()=>{expect(()=>validateBookingDates('2026-11-11','2026-11-10')).toThrow('End date');});
});
