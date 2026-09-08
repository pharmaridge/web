-- Enquiry inbox for the PharmaRidge website.
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  enquiry_type text not null default 'General enquiry',
  message text not null default '',
  status text not null default 'new' check (status in ('new','in_progress','resolved','archived')),
  admin_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.inquiries enable row level security;
drop policy if exists "Visitors can submit enquiries" on public.inquiries;
create policy "Visitors can submit enquiries" on public.inquiries for insert with check (char_length(email) between 5 and 254 and char_length(message) <= 5000);
drop policy if exists "Admins can read enquiries" on public.inquiries;
create policy "Admins can read enquiries" on public.inquiries for select to authenticated using (true);
drop policy if exists "Admins can update enquiries" on public.inquiries;
create policy "Admins can update enquiries" on public.inquiries for update to authenticated using (true) with check (true);
drop policy if exists "Admins can delete enquiries" on public.inquiries;
create policy "Admins can delete enquiries" on public.inquiries for delete to authenticated using (true);
drop trigger if exists inquiries_updated_at on public.inquiries;
create trigger inquiries_updated_at before update on public.inquiries for each row execute procedure public.set_updated_at();
