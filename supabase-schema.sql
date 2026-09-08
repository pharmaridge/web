-- PharmaRidge production admin schema for Supabase
-- Run this in Supabase SQL Editor before enabling the admin portal.
create extension if not exists "pgcrypto";

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
create policy "Published client profiles are public" on public.client_showcase
  for select using (featured = true);
create policy "Authenticated admins manage client profiles" on public.client_showcase
  for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public)
values ('client-logos', 'client-logos', true)
on conflict (id) do nothing;

create policy "Public can view client logos" on storage.objects
  for select using (bucket_id = 'client-logos');
create policy "Admins can upload client logos" on storage.objects
  for insert to authenticated with check (bucket_id = 'client-logos');
create policy "Admins can update client logos" on storage.objects
  for update to authenticated using (bucket_id = 'client-logos');
create policy "Admins can delete client logos" on storage.objects
  for delete to authenticated using (bucket_id = 'client-logos');

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists client_showcase_updated_at on public.client_showcase;
create trigger client_showcase_updated_at before update on public.client_showcase
for each row execute procedure public.set_updated_at();
