create table if not exists public.reference_records (
 id text primary key,
 kind text not null check (kind in ('work','system','product_family','brand','product_reference','board','suspension','support','rule','quantity','source')),
 title text not null,
 summary text not null default '',
 source_page integer not null,
 status text not null check (status in ('Publié','À valider')),
 data jsonb not null default '{}'::jsonb,
 updated_at timestamptz not null default now()
);
alter table public.reference_records enable row level security;
drop policy if exists "admin read reference" on public.reference_records;
drop policy if exists "admin write reference" on public.reference_records;
create policy "admin read reference" on public.reference_records for select to authenticated using (lower(auth.jwt()->>'email') = 'e.ganier@gmail.com');
create policy "admin write reference" on public.reference_records for all to authenticated using (lower(auth.jwt()->>'email') = 'e.ganier@gmail.com') with check (lower(auth.jwt()->>'email') = 'e.ganier@gmail.com');
drop policy if exists "ios read published reference" on public.reference_records;
create policy "ios read published reference" on public.reference_records for select to anon using (status = 'Publié');
