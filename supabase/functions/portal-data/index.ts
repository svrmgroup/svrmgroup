import { createClient } from 'npm:@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const PUBLIC_SETTINGS_COLS = [
  'company_name','company_email','company_phone','company_whatsapp',
  'company_address','website','tagline','logo_url',
  'brand_primary','brand_bg','instagram_handle',
  'thank_you_message','confirmation_footer','invoice_footer',
  'portal_expiry_days','thank_you_title','thank_you_signature',
]

const INVOICE_SETTINGS_COLS = [
  ...PUBLIC_SETTINGS_COLS,
  'vat_number','vat_rate',
  'bank_name','bank_account','bank_branch','bank_swift',
]

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS })

  const url = Deno.env.get('SUPABASE_URL')
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !key) return new Response(JSON.stringify({ error: 'config' }), { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } })

  const supabase = createClient(url, key)

  let body: { token?: string; include?: Array<'booking' | 'public_settings' | 'invoice_settings'> } = {}
  try { body = await req.json() } catch { /* empty */ }
  const include = body.include ?? ['public_settings']
  const token = body.token ?? null

  const out: Record<string, unknown> = {}

  if (include.includes('public_settings')) {
    const { data } = await supabase.from('app_settings').select(PUBLIC_SETTINGS_COLS.join(',')).eq('id', 1).maybeSingle()
    out.public_settings = data ?? null
  }

  if (token) {
    // UUID validation
    if (!/^[0-9a-f-]{36}$/i.test(token)) {
      return new Response(JSON.stringify({ error: 'invalid_token' }), { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } })
    }
    const { data: booking } = await supabase.from('manual_bookings').select('*').eq('client_token', token).maybeSingle()
    if (!booking) {
      return new Response(JSON.stringify({ error: 'not_found' }), { status: 404, headers: { ...CORS, 'Content-Type': 'application/json' } })
    }
    if (include.includes('booking')) out.booking = booking
    if (include.includes('invoice_settings')) {
      const { data } = await supabase.from('app_settings').select(INVOICE_SETTINGS_COLS.join(',')).eq('id', 1).maybeSingle()
      out.invoice_settings = data ?? null
    }
  }

  return new Response(JSON.stringify(out), { headers: { ...CORS, 'Content-Type': 'application/json' } })
})
