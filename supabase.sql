create table if not exists public.portfolio_records (
  id text primary key, profile_id text not null, student_name text not null, class_name text not null,
  type text not null check (type in ('spreken','schrijven')), school_year integer not null default 1 check (school_year in (1,2)),
  academic_year text not null default '2026-2027', title text not null, date date, strong_point text, work_point text,
  updated_at timestamptz default now(), created_at timestamptz default now()
);
alter table public.portfolio_records add column if not exists school_year integer not null default 1;
alter table public.portfolio_records add column if not exists academic_year text not null default '2026-2027';

create table if not exists public.peer_feedback (
  id text primary key, task_id text not null references public.portfolio_records(id) on delete cascade,
  reviewer_id text not null, reviewer_class text, academic_year text not null default '2026-2027',
  strong_point text not null, work_point text not null, updated_at timestamptz default now(), created_at timestamptz default now(),
  unique(task_id, reviewer_id)
);

alter table public.portfolio_records enable row level security;
alter table public.peer_feedback enable row level security;
do $$ begin create policy "prototype read" on public.portfolio_records for select to anon using (true); exception when duplicate_object then null; end $$;
do $$ begin create policy "prototype insert" on public.portfolio_records for insert to anon with check (true); exception when duplicate_object then null; end $$;
do $$ begin create policy "prototype update" on public.portfolio_records for update to anon using (true) with check (true); exception when duplicate_object then null; end $$;
do $$ begin create policy "prototype delete" on public.portfolio_records for delete to anon using (true); exception when duplicate_object then null; end $$;
do $$ begin create policy "peer read" on public.peer_feedback for select to anon using (true); exception when duplicate_object then null; end $$;
do $$ begin create policy "peer insert" on public.peer_feedback for insert to anon with check (true); exception when duplicate_object then null; end $$;
do $$ begin create policy "peer update" on public.peer_feedback for update to anon using (true) with check (true); exception when duplicate_object then null; end $$;
do $$ begin create policy "peer delete" on public.peer_feedback for delete to anon using (true); exception when duplicate_object then null; end $$;
