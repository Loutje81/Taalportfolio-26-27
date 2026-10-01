create table if not exists public.portfolio_records (
  id text primary key,
  profile_id text not null,
  student_name text not null,
  class_name text not null,
  type text not null check (type in ('spreken','schrijven')),
  title text not null,
  date date,
  strong_point text,
  work_point text,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

-- EENVOUDIGE PROTOTYPEPOLICIES. Voor productie op school: gebruik authenticatie/RLS op leerlingniveau.
alter table public.portfolio_records enable row level security;
create policy "prototype read" on public.portfolio_records for select to anon using (true);
create policy "prototype insert" on public.portfolio_records for insert to anon with check (true);
create policy "prototype update" on public.portfolio_records for update to anon using (true) with check (true);
create policy "prototype delete" on public.portfolio_records for delete to anon using (true);
