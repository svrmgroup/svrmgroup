create table public.whatsapp_clicks (
  id uuid primary key default gen_random_uuid(),
  path text,
  referrer text,
  source_label text,
  user_agent text,
  created_at timestamptz not null default now()
);

grant insert on public.whatsapp_clicks to anon, authenticated;
grant select on public.whatsapp_clicks to authenticated;
grant all on public.whatsapp_clicks to service_role;

alter table public.whatsapp_clicks enable row level security;

create policy "Anyone can insert a whatsapp click"
  on public.whatsapp_clicks
  for insert
  to anon, authenticated
  with check (true);

create policy "Admins can read whatsapp clicks"
  on public.whatsapp_clicks
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create index whatsapp_clicks_created_at_idx on public.whatsapp_clicks (created_at desc);
create index whatsapp_clicks_path_idx on public.whatsapp_clicks (path);