ALTER TYPE staff_role ADD VALUE IF NOT EXISTS 'founder';
ALTER TYPE staff_role ADD VALUE IF NOT EXISTS 'manager';
ALTER TYPE staff_role ADD VALUE IF NOT EXISTS 'operations';
ALTER TYPE staff_role ADD VALUE IF NOT EXISTS 'sales';
ALTER TYPE staff_role ADD VALUE IF NOT EXISTS 'chef';
ALTER TYPE staff_role ADD VALUE IF NOT EXISTS 'host';
ALTER TYPE staff_role ADD VALUE IF NOT EXISTS 'pilot';
ALTER TYPE staff_role ADD VALUE IF NOT EXISTS 'captain';
ALTER TYPE staff_role ADD VALUE IF NOT EXISTS 'photographer';
ALTER TYPE staff_role ADD VALUE IF NOT EXISTS 'other';

ALTER TABLE public.staff ADD COLUMN IF NOT EXISTS role_description text;
ALTER TABLE public.staff ADD COLUMN IF NOT EXISTS custom_role_title text;