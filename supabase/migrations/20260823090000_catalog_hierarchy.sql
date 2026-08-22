alter table public.reference_records drop constraint if exists reference_records_kind_check;
alter table public.reference_records add constraint reference_records_kind_check
check (kind in ('work','system','product_family','brand','product_reference','board','suspension','support','rule','quantity','source'));
