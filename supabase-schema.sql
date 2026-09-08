-- PharmaRidge production admin schema for Supabase
-- Run this in Supabase SQL Editor before enabling the admin portal.
create extension if not exists "pgcrypto";

create table if not exists public.site_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;
create policy "Public can read site settings" on public.site_settings
  for select using (true);
create policy "Authenticated admins manage site settings" on public.site_settings
  for all to authenticated using (true) with check (true);

insert into public.site_settings(key,value) values
  ('contact_email','care@pharmaridge.com'),
  ('contact_phone','+234 800 000 0000'),
  ('head_office','Abuja, Nigeria'),
  ('announcement','Pharmacy operations, brought into focus'),
  ('essential_price','Custom'),
  ('partner_price','Custom')
on conflict (key) do nothing;

create table if not exists public.client_showcase (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  story text not null default '',
  logo_url text,
  featured boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.client_showcase enable row level security;
drop policy if exists "Published client profiles are public" on public.client_showcase;
create policy "Published client profiles are public" on public.client_showcase
  for select using (featured = true);
drop policy if exists "Authenticated admins manage client profiles" on public.client_showcase;
create policy "Authenticated admins manage client profiles" on public.client_showcase
  for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public)
values ('client-logos', 'client-logos', true)
on conflict (id) do nothing;

drop policy if exists "Public can view client logos" on storage.objects;
create policy "Public can view client logos" on storage.objects
  for select using (bucket_id = 'client-logos');
drop policy if exists "Admins can upload client logos" on storage.objects;
create policy "Admins can upload client logos" on storage.objects
  for insert to authenticated with check (bucket_id = 'client-logos');
drop policy if exists "Admins can update client logos" on storage.objects;
create policy "Admins can update client logos" on storage.objects
  for update to authenticated using (bucket_id = 'client-logos');
drop policy if exists "Admins can delete client logos" on storage.objects;
create policy "Admins can delete client logos" on storage.objects
  for delete to authenticated using (bucket_id = 'client-logos');

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists client_showcase_updated_at on public.client_showcase;
create trigger client_showcase_updated_at before update on public.client_showcase
for each row execute procedure public.set_updated_at();
