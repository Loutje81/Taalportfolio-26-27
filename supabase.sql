create table if not exists public.portfolio_records (
  id text primary key,
  profile_id text not null,
  student_name text not null,
  class_name text not null,
  type text not null check (type in ('spreken','schrijven')),
  school_year integer not null default 1 check (school_year in (1,2)),
  title text not null,
  date date,
  strong_point text,
  work_point text,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Voor een bestaande tabel uit versie 1/2:
alter table public.portfolio_records add column if not exists school_year integer not null default 1;

-- EENVOUDIGE PROTOTYPEPOLICIES. Voor productie op school: gebruik authenticatie/RLS op leerlingniveau.
alter table public.portfolio_records enable row level security;
do $$ begin
  create policy "prototype read" on public.portfolio_records for select to anon using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "prototype insert" on public.portfolio_records for insert to anon with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "prototype update" on public.portfolio_records for update to anon using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "prototype delete" on public.portfolio_records for delete to anon using (true);
exception when duplicate_object then null; end $$;
