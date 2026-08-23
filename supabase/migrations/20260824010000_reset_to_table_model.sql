alter table public.reference_records
  drop constraint if exists reference_records_kind_check;

-- Ce changement de modèle est volontairement une remise à zéro complète.
delete from public.reference_records;

alter table public.reference_records
  add constraint reference_records_kind_check
  check (kind in (
    'work',
    'insulation_series',
    'fixing_system',
    'quantity_item',
    'rule'
  ));
