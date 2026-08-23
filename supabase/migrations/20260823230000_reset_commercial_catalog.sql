-- Retour à une base technique centrée sur les types de fournitures.
delete from public.reference_records
where kind in (
  'brand',
  'product',
  'product_model',
  'commercial_reference',
  'product_reference',
  'board',
  'suspension',
  'supply_combination'
)
or id = 'SOURCE-SUSPENSION-CATALOG-2026';

update public.reference_records
set
  title = 'Suspentes',
  summary = 'Éléments reliant le support à l’ossature du plafond.',
  data = jsonb_build_object(
    'family_id', 'FAMILY-SUSPENSIONS',
    'code', 'suspentes',
    'fonction_ouvrage', 'Suspendre l’ossature',
    'ouvrages_compatibles', jsonb_build_array('Plafond'),
    'supports_compatibles', jsonb_build_array(
      'Solivage bois',
      'Dalle béton',
      'Plancher hourdis béton',
      'Charpente métallique'
    ),
    'mode_utilisation', 'seul_ou_combinaison',
    'unite_calcul', 'pièce'
  ),
  updated_at = now()
where id = 'TYPE-SUSPENSION-SOLIVAGE';
