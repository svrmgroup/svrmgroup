import { describe,it,expect,vi } from 'vitest';
import { supabaseForAdmin } from './supabase';
import type { ToolContext } from '@lovable.dev/mcp-js';
import { financialSummary,paymentStatus } from './finance';
import { oauthReturnPath } from '../oauth-return-path';
const mocks=vi.hoisted(()=>({createClient:vi.fn()}));
vi.mock('@supabase/supabase-js',()=>({createClient:mocks.createClient}));
function context(authenticated:boolean,clientId:string|null='chatgpt'){return {isAuthenticated:()=>authenticated,getToken:()=>authenticated?'test-token':null,getUserId:()=>authenticated?'test-admin':null,getClientId:()=>clientId} as unknown as ToolContext;}
describe('Read-only assistant access',()=>{
 it('rejects unauthenticated callers before database access',async()=>{mocks.createClient.mockClear();await expect(supabaseForAdmin(context(false))).rejects.toThrow('OAuth');expect(mocks.createClient).not.toHaveBeenCalled();});
 it('rejects copied non-OAuth sessions',async()=>{mocks.createClient.mockClear();await expect(supabaseForAdmin(context(true,null))).rejects.toThrow('OAuth');expect(mocks.createClient).not.toHaveBeenCalled();});
 it('rejects authenticated users without the existing admin role',async()=>{vi.stubEnv('SUPABASE_URL','https://example.invalid');vi.stubEnv('SUPABASE_PUBLISHABLE_KEY','test-public-key');const chain={select:vi.fn(),eq:vi.fn(),maybeSingle:vi.fn().mockResolvedValue({data:null,error:null})};chain.select.mockReturnValue(chain);chain.eq.mockReturnValue(chain);mocks.createClient.mockReturnValue({from:()=>chain});await expect(supabaseForAdmin(context(true))).rejects.toThrow('Admin permission');vi.unstubAllEnvs();});
 it('allows verified OAuth admins with caller Authorization and existing role check',async()=>{vi.stubEnv('SUPABASE_URL','https://example.invalid');vi.stubEnv('SUPABASE_PUBLISHABLE_KEY','test-public-key');const chain={select:vi.fn(),eq:vi.fn(),maybeSingle:vi.fn().mockResolvedValue({data:{role:'admin'},error:null})};chain.select.mockReturnValue(chain);chain.eq.mockReturnValue(chain);const db={from:vi.fn().mockReturnValue(chain)};mocks.createClient.mockReturnValue(db);expect(await supabaseForAdmin(context(true))).toBe(db);expect(chain.eq).toHaveBeenCalledWith('user_id','test-admin');expect(chain.eq).toHaveBeenCalledWith('role','admin');expect(mocks.createClient).toHaveBeenLastCalledWith('https://example.invalid','test-public-key',expect.objectContaining({global:{headers:{Authorization:'Bearer test-token'}}}));vi.unstubAllEnvs();});
 it('uses recorded paid revenue and expenses, matching admin P&L',()=>{expect(financialSummary([{subtotal:10500,amount_paid:5000}],[{amount:1000,category:'supplier'}])).toEqual({revenue_paid:5000,booked_value:10500,outstanding:5500,expenses:1000,net_profit:4000,margin_percent:80,expense_categories:{supplier:1000}});});
 it('derives payment statuses without treating requested deposits as paid',()=>{expect(paymentStatus(10500,0)).toBe('unpaid');expect(paymentStatus(10500,5000)).toBe('part_paid');expect(paymentStatus(10500,10500)).toBe('paid');});
 it('preserves the complete consent return path',()=>{expect(oauthReturnPath('/.lovable/oauth/consent?authorization_id=123#return')).toBe('/.lovable/oauth/consent?authorization_id=123#return');});
 it('rejects external redirects and control characters',()=>{for(const path of ['//evil.invalid','/\\evil.invalid','https://evil.invalid','/\nmalicious'])expect(oauthReturnPath(path)).toBe('/admin');});
});
