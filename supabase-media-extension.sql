-- Video and document library for PharmaRidge public content.
create table if not exists public.video_library (
  id uuid primary key default gen_random_uuid(), title text not null, category text not null default 'Product', youtube_url text not null, description text not null default '', sort_order integer not null default 0, published boolean not null default true, created_at timestamptz not null default now()
);
alter table public.video_library enable row level security;
drop policy if exists "Published videos are public" on public.video_library;
create policy "Published videos are public" on public.video_library for select using (published = true);
drop policy if exists "Authenticated admins manage videos" on public.video_library;
create policy "Authenticated admins manage videos" on public.video_library for all to authenticated using (true) with check (true);

create table if not exists public.resource_library (
  id uuid primary key default gen_random_uuid(), title text not null, category text not null default 'Resources', google_url text not null, description text not null default '', sort_order integer not null default 0, published boolean not null default true, created_at timestamptz not null default now()
);
alter table public.resource_library enable row level security;
drop policy if exists "Published resources are public" on public.resource_library;
create policy "Published resources are public" on public.resource_library for select using (published = true);
drop policy if exists "Authenticated admins manage resources" on public.resource_library;
create policy "Authenticated admins manage resources" on public.resource_library for all to authenticated using (true) with check (true);
