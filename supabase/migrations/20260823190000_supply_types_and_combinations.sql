alter table public.reference_records drop constraint if exists reference_records_kind_check;

alter table public.reference_records add constraint reference_records_kind_check
check (kind in (
  'work',
  'system',
  'product_family',
  'supply_type',
  'brand',
  'product',
  'product_model',
  'commercial_reference',
  'product_reference',
  'board',
  'suspension',
  'support',
  'supply_combination',
  'rule',
  'quantity',
  'source'
));
