alter table public.reference_records
  drop constraint if exists reference_records_kind_check;

-- Supprime uniquement les fiches de l’ancien modèle. Cette condition rend la
-- migration sans danger si elle est rejouée après le chargement de la nouvelle base.
delete from public.reference_records
where kind not in (
  'work',
  'insulation_series',
  'fixing_system',
  'quantity_item',
  'rule'
);

alter table public.reference_records
  add constraint reference_records_kind_check
  check (kind in (
    'work',
    'insulation_series',
    'fixing_system',
    'quantity_item',
    'rule'
  ));
