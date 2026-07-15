
-- ENUMS
DO $$ BEGIN ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'super_admin'; EXCEPTION WHEN others THEN NULL; END $$;
DO $$ BEGIN ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'ops_manager'; EXCEPTION WHEN others THEN NULL; END $$;
DO $$ BEGIN ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'viewer'; EXCEPTION WHEN others THEN NULL; END $$;
DO $$ BEGIN ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'staff'; EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.staff_role AS ENUM ('driver','concierge','guide','security','both'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.staff_status AS ENUM ('active','on_leave','inactive'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.assignment_status AS ENUM ('assigned','confirmed','en_route','in_progress','completed','cancelled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.change_request_status AS ENUM ('pending','approved','declined'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.email_template_kind AS ENUM ('booking_confirmation','invoice_sent','payment_received','payment_overdue','staff_assignment','new_inquiry','quote_response','welcome','change_request_received','change_request_approved','change_request_declined'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.client_status AS ENUM ('lead','client','vip','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- EXPENSES: link to supplier directory
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS supplier_id uuid REFERENCES public.suppliers_directory(id) ON DELETE SET NULL;

-- MANUAL BOOKINGS: public client token
ALTER TABLE public.manual_bookings ADD COLUMN IF NOT EXISTS client_token uuid NOT NULL DEFAULT gen_random_uuid();
CREATE UNIQUE INDEX IF NOT EXISTS uq_manual_bookings_client_token ON public.manual_bookings(client_token);
DROP POLICY IF EXISTS "Public can read booking by token" ON public.manual_bookings;
CREATE POLICY "Public can read booking by token" ON public.manual_bookings FOR SELECT TO anon USING (true);
GRANT SELECT ON public.manual_bookings TO anon;

-- STAFF
CREATE TABLE IF NOT EXISTS public.staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  role public.staff_role NOT NULL DEFAULT 'driver',
  photo_url text,
  phone text, whatsapp text, email text,
  status public.staff_status NOT NULL DEFAULT 'active',
  license_number text,
  pdp_expiry_date date,
  license_expiry_date date,
  assigned_vehicle text,
  languages_spoken text[] NOT NULL DEFAULT '{}',
  specialties text[] NOT NULL DEFAULT '{}',
  hourly_rate numeric,
  currency text DEFAULT 'ZAR',
  notes text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.staff TO authenticated;
GRANT ALL ON public.staff TO service_role;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage staff" ON public.staff FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Staff can see themselves" ON public.staff FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE TRIGGER trg_staff_touch BEFORE UPDATE ON public.staff FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- BOOKING ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.booking_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.manual_bookings(id) ON DELETE CASCADE,
  staff_id uuid NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  role text,
  status public.assignment_status NOT NULL DEFAULT 'assigned',
  start_at timestamptz, end_at timestamptz,
  notes text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(booking_id, staff_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.booking_assignments TO authenticated;
GRANT ALL ON public.booking_assignments TO service_role;
ALTER TABLE public.booking_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage assignments" ON public.booking_assignments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Staff view own assignments" ON public.booking_assignments FOR SELECT TO authenticated
  USING (staff_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid()));
CREATE TRIGGER trg_bassign_touch BEFORE UPDATE ON public.booking_assignments FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
CREATE INDEX IF NOT EXISTS idx_bassign_booking ON public.booking_assignments(booking_id);
CREATE INDEX IF NOT EXISTS idx_bassign_staff ON public.booking_assignments(staff_id);
CREATE INDEX IF NOT EXISTS idx_bassign_start ON public.booking_assignments(start_at);

-- BOOKING CHANGE REQUESTS
CREATE TABLE IF NOT EXISTS public.booking_change_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.manual_bookings(id) ON DELETE CASCADE,
  requested_by_name text, requested_by_email text,
  changes jsonb NOT NULL DEFAULT '{}'::jsonb,
  message text,
  status public.change_request_status NOT NULL DEFAULT 'pending',
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.booking_change_requests TO authenticated;
GRANT INSERT, SELECT ON public.booking_change_requests TO anon;
GRANT ALL ON public.booking_change_requests TO service_role;
ALTER TABLE public.booking_change_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view change requests" ON public.booking_change_requests FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update change requests" ON public.booking_change_requests FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete change requests" ON public.booking_change_requests FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Public may submit change requests" ON public.booking_change_requests FOR INSERT TO anon
  WITH CHECK (booking_id IN (SELECT id FROM public.manual_bookings));
CREATE TRIGGER trg_bcr_touch BEFORE UPDATE ON public.booking_change_requests FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- EMAIL TEMPLATES
CREATE TABLE IF NOT EXISTS public.email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind public.email_template_kind NOT NULL UNIQUE,
  subject text NOT NULL,
  body_html text NOT NULL,
  body_text text,
  enabled boolean NOT NULL DEFAULT true,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_templates TO authenticated;
GRANT ALL ON public.email_templates TO service_role;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage email templates" ON public.email_templates FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_et_touch BEFORE UPDATE ON public.email_templates FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

INSERT INTO public.email_templates (kind, subject, body_html, body_text) VALUES
  ('booking_confirmation','Your SVRM booking is confirmed — {{booking_code}}','<p>Dear {{client_name}},</p><p>Your booking <strong>{{booking_code}}</strong> is confirmed.</p><p>— SVRM Concierge</p>','Dear {{client_name}}, your booking {{booking_code}} is confirmed.'),
  ('invoice_sent','Invoice {{booking_code}} from SVRM','<p>Dear {{client_name}},</p><p>Please find attached invoice <strong>{{booking_code}}</strong> for {{currency}} {{balance_due}}.</p>','Invoice {{booking_code}} for {{currency}} {{balance_due}}.'),
  ('payment_received','Payment received — {{booking_code}}','<p>Thank you {{client_name}}, we have received your payment for {{booking_code}}.</p>','Payment received.'),
  ('payment_overdue','Reminder: payment for {{booking_code}}','<p>Dear {{client_name}}, this is a gentle reminder that payment for {{booking_code}} is now due.</p>','Payment reminder.'),
  ('staff_assignment','New job assignment — {{booking_code}}','<p>Hi {{staff_name}}, you have been assigned to {{booking_code}} on {{start_date}}.</p>','New assignment.'),
  ('new_inquiry','New enquiry from {{client_name}}','<p>New enquiry from {{client_name}} ({{client_email}}).</p>','New enquiry.'),
  ('quote_response','Your SVRM quote','<p>Dear {{client_name}}, please find our quote below.</p>','Your SVRM quote.'),
  ('welcome','Welcome to SVRM','<p>Dear {{client_name}}, welcome to SVRM Group.</p>','Welcome to SVRM.'),
  ('change_request_received','Change request received — {{booking_code}}','<p>A change request was submitted for {{booking_code}}.</p>','Change request received.'),
  ('change_request_approved','Your change request was approved — {{booking_code}}','<p>Dear {{client_name}}, your changes to {{booking_code}} have been approved.</p>','Approved.'),
  ('change_request_declined','Update on your change request — {{booking_code}}','<p>Dear {{client_name}}, we could not accommodate your changes to {{booking_code}}. {{admin_notes}}</p>','Declined.')
ON CONFLICT (kind) DO NOTHING;

-- CLIENTS CRM
CREATE TABLE IF NOT EXISTS public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text, phone text, whatsapp text, country text,
  status public.client_status NOT NULL DEFAULT 'lead',
  vip boolean NOT NULL DEFAULT false,
  source text,
  tags text[] NOT NULL DEFAULT '{}',
  notes text,
  last_contacted_at timestamptz,
  total_spend numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage clients" ON public.clients FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_clients_touch BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(lower(email));

-- CMS OVERLAYS
CREATE TABLE IF NOT EXISTS public.cms_tours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE, title text NOT NULL, summary text, description text,
  image_url text, price_from numeric, currency text DEFAULT 'ZAR', duration text,
  published boolean NOT NULL DEFAULT true, sort_order int NOT NULL DEFAULT 0,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.cms_vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE, title text NOT NULL, summary text,
  image_url text, price_per_day numeric, currency text DEFAULT 'ZAR', category text,
  published boolean NOT NULL DEFAULT true, sort_order int NOT NULL DEFAULT 0,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.cms_stays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE, title text NOT NULL, summary text,
  image_url text, price_per_night numeric, currency text DEFAULT 'ZAR',
  bedrooms int, location text,
  published boolean NOT NULL DEFAULT true, sort_order int NOT NULL DEFAULT 0,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_tours TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_vehicles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_stays TO authenticated;
GRANT SELECT ON public.cms_tours TO anon;
GRANT SELECT ON public.cms_vehicles TO anon;
GRANT SELECT ON public.cms_stays TO anon;
GRANT ALL ON public.cms_tours TO service_role;
GRANT ALL ON public.cms_vehicles TO service_role;
GRANT ALL ON public.cms_stays TO service_role;
ALTER TABLE public.cms_tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_stays ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published tours" ON public.cms_tours FOR SELECT USING (published = true);
CREATE POLICY "Admins manage tours" ON public.cms_tours FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Public read published vehicles" ON public.cms_vehicles FOR SELECT USING (published = true);
CREATE POLICY "Admins manage vehicles" ON public.cms_vehicles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Public read published stays" ON public.cms_stays FOR SELECT USING (published = true);
CREATE POLICY "Admins manage stays" ON public.cms_stays FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_cms_tours_touch BEFORE UPDATE ON public.cms_tours FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
CREATE TRIGGER trg_cms_vehicles_touch BEFORE UPDATE ON public.cms_vehicles FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
CREATE TRIGGER trg_cms_stays_touch BEFORE UPDATE ON public.cms_stays FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- ACTIVITY LOG
CREATE TABLE IF NOT EXISTS public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email text, action text NOT NULL,
  entity_type text, entity_id uuid,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.activity_log TO authenticated;
GRANT ALL ON public.activity_log TO service_role;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view activity" ON public.activity_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Auth can insert own activity" ON public.activity_log FOR INSERT TO authenticated WITH CHECK (actor_id = auth.uid());
CREATE INDEX IF NOT EXISTS idx_activity_created ON public.activity_log(created_at DESC);

-- APP SETTINGS
CREATE TABLE IF NOT EXISTS public.app_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  company_name text DEFAULT 'SVRM Group',
  company_email text DEFAULT 'concierge@svrm.group',
  company_phone text DEFAULT '+27 73 064 1481',
  company_address text,
  vat_number text, vat_rate numeric DEFAULT 15,
  bank_name text, bank_account text, bank_branch text, bank_swift text,
  invoice_footer text,
  brand_primary text DEFAULT '#C9A961',
  brand_bg text DEFAULT '#1F1B18',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO public.app_settings (id) VALUES (1) ON CONFLICT DO NOTHING;
GRANT SELECT, INSERT, UPDATE ON public.app_settings TO authenticated;
GRANT ALL ON public.app_settings TO service_role;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read settings" ON public.app_settings FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update settings" ON public.app_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_settings_touch BEFORE UPDATE ON public.app_settings FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- STORAGE POLICIES
DO $$ BEGIN CREATE POLICY "Public read staff photos" ON storage.objects FOR SELECT USING (bucket_id = 'staff-photos'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Admins write staff photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'staff-photos' AND public.has_role(auth.uid(),'admin')); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Admins update staff photos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'staff-photos' AND public.has_role(auth.uid(),'admin')); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Admins delete staff photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'staff-photos' AND public.has_role(auth.uid(),'admin')); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE POLICY "Public read cms media" ON storage.objects FOR SELECT USING (bucket_id = 'cms-media'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Admins write cms media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'cms-media' AND public.has_role(auth.uid(),'admin')); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Admins update cms media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'cms-media' AND public.has_role(auth.uid(),'admin')); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Admins delete cms media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'cms-media' AND public.has_role(auth.uid(),'admin')); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
