-- Optional content extension for executives, partners and promotional ads.
-- Safe to run after supabase-schema.sql.
create table if not exists public.team_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  bio text not null default '',
  image_url text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.team_profiles enable row level security;
drop policy if exists "Published team profiles are public" on public.team_profiles;
create policy "Published team profiles are public" on public.team_profiles for select using (published = true);
drop policy if exists "Authenticated admins manage team profiles" on public.team_profiles;
create policy "Authenticated admins manage team profiles" on public.team_profiles for all to authenticated using (true) with check (true);

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Partner',
  description text not null default '',
  logo_url text,
  website_url text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.partners enable row level security;
drop policy if exists "Published partners are public" on public.partners;
create policy "Published partners are public" on public.partners for select using (published = true);
drop policy if exists "Authenticated admins manage partners" on public.partners;
create policy "Authenticated admins manage partners" on public.partners for all to authenticated using (true) with check (true);

create table if not exists public.site_ads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null default '',
  image_url text,
  cta_label text,
  cta_url text,
  published boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.site_ads enable row level security;
drop policy if exists "Active ads are public" on public.site_ads;
create policy "Active ads are public" on public.site_ads for select using (published = true and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at >= now()));
drop policy if exists "Authenticated admins manage ads" on public.site_ads;
create policy "Authenticated admins manage ads" on public.site_ads for all to authenticated using (true) with check (true);

insert into storage.buckets (id,name,public) values ('site-media','site-media',true) on conflict (id) do nothing;
drop policy if exists "Public can view site media" on storage.objects;
create policy "Public can view site media" on storage.objects for select using (bucket_id = 'site-media');
drop policy if exists "Admins can upload site media" on storage.objects;
create policy "Admins can upload site media" on storage.objects for insert to authenticated with check (bucket_id = 'site-media');
drop policy if exists "Admins can delete site media" on storage.objects;
create policy "Admins can delete site media" on storage.objects for delete to authenticated using (bucket_id = 'site-media');
