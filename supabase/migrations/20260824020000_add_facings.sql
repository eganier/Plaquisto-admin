alter table public.reference_records
  drop constraint if exists reference_records_kind_check;

alter table public.reference_records
  add constraint reference_records_kind_check
  check (kind in (
    'work',
    'insulation_series',
    'fixing_system',
    'facing',
    'quantity_item',
    'rule'
  ));
