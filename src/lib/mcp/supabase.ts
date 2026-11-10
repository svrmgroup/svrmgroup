import { createClient } from '@supabase/supabase-js';
import { ToolError, type ToolContext } from '@lovable.dev/mcp-js';

type Runtime = typeof globalThis & { Deno?: { env?: { get?: (name: string) => string | undefined } }; process?: { env?: Record<string, string | undefined> } };
function env(name: string) { const r = globalThis as Runtime; return r.Deno?.env?.get?.(name) ?? r.process?.env?.[name]; }
function first(names: string[]) { return names.map(env).find(v => v?.trim())?.trim(); }
function key() {
  const direct = first(['SUPABASE_PUBLISHABLE_KEY', 'VITE_SUPABASE_PUBLISHABLE_KEY']);
  if (direct) return direct;
  try {
    const keys: unknown = JSON.parse(env('SUPABASE_PUBLISHABLE_KEYS') ?? '{}');
    if (keys && typeof keys === 'object') {
      const values = keys as Record<string, unknown>;
      const found = [values.default, ...Object.values(values)].find((v): v is string => typeof v === 'string' && v.trim().startsWith('sb_publishable_'));
      if (found) return found.trim();
    }
  } catch { /* Legacy key remains supported. */ }
  const legacy = first(['SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY']);
  if (!legacy) throw new ToolError('Assistant access is not configured.');
  return legacy;
}
export async function supabaseForAdmin(ctx: ToolContext) {
  const token = ctx.getToken();
  const userId = ctx.getUserId();
  if (!ctx.isAuthenticated() || !token || !userId || !ctx.getClientId()) throw new ToolError('A verified OAuth connection is required.');
  const url = first(['SUPABASE_URL', 'VITE_SUPABASE_URL']);
  if (!url) throw new ToolError('Assistant access is not configured.');
  const client = createClient(url, key(), { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await client.from('user_roles').select('role').eq('user_id', userId).eq('role', 'admin').maybeSingle();
  if (error || !data) throw new ToolError('Admin permission is required.');
  return client;
}
