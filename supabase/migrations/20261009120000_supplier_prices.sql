-- Separate price records: no modification of technical records or coefficients.
-- This migration deliberately contains no supplier data and no published prices.
create table if not exists public.supplier_prices (
  id text primary key,
  status text not null check (status in ('proposed','validated')),
  price_date date not null,
  valid_until date,
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  check (valid_until is null or valid_until >= price_date),
  check (payload->>'id' = id and payload->>'status' = status)
);

-- Protect concurrent validations as well as the API's friendly preflight check.
create extension if not exists btree_gist with schema extensions;
alter table public.supplier_prices add constraint supplier_prices_no_overlapping_validated
  exclude using gist (
    (payload->>'referenceId') extensions.gist_text_ops with =,
    (payload->>'variantKey') extensions.gist_text_ops with =,
    (payload->>'unit') extensions.gist_text_ops with =,
    daterange(price_date, valid_until, '[]') with &&
  ) where (status = 'validated');

alter table public.supplier_prices enable row level security;
revoke all on public.supplier_prices from anon;
grant select on public.supplier_prices to authenticated;
grant insert, update on public.supplier_prices to authenticated;

create policy "admin_read_prices" on public.supplier_prices for select to authenticated
  using (lower(auth.jwt()->>'email') = 'e.ganier@gmail.com');
create policy "admin_insert_prices" on public.supplier_prices for insert to authenticated
  with check (lower(auth.jwt()->>'email') = 'e.ganier@gmail.com');

-- A definer view intentionally exposes only a whitelist. The base table and
-- supplier provenance remain inaccessible to anonymous clients, even via REST.
create or replace view public.supplier_prices_public with (security_barrier = true) as
select jsonb_build_object(
  'id', id, 'status', status,
  'referenceId', payload->'referenceId', 'variantKey', payload->'variantKey',
  'label', payload->'label', 'unit', payload->'unit',
  'unitPriceHT', payload->'unitPriceHT', 'repUnitHT', payload->'repUnitHT',
  'priceDate', price_date, 'validUntil', valid_until, 'updatedAt', updated_at
) as payload, updated_at
from public.supplier_prices
where status = 'validated'
  and price_date <= (now() at time zone 'Europe/Paris')::date
  and (valid_until is null or valid_until >= (now() at time zone 'Europe/Paris')::date);
grant select on public.supplier_prices_public to anon, authenticated;
create policy "admin_update_prices" on public.supplier_prices for update to authenticated
  using (lower(auth.jwt()->>'email') = 'e.ganier@gmail.com')
  with check (lower(auth.jwt()->>'email') = 'e.ganier@gmail.com');
