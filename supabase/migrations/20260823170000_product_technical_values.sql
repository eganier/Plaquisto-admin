update public.reference_records
set data = '{"technical_record_id":"SUSP-CLM","support_id":"SUP-BOIS-SOLIVAGE","reglage_mode":"continu","reglage_min_mm":20,"reglage_max_mm":280,"entraxe_suspentes_m":1.2,"fixation":"2 vis TTPC 35 par suspente"}'::jsonb || data
where id = 'PRODUCT-SUSP-STIL-F530' and kind = 'product';

update public.reference_records
set data = '{"technical_record_id":"SUSP-INTEGRA2","support_id":"SUP-BOIS-SOLIVAGE","reglage_mode":"continu","reglage_min_mm":0,"reglage_max_mm":300,"entraxe_suspentes_m":1.2,"fixation":"2 vis TTPC 35 par suspente"}'::jsonb || data
where id = 'CATALOG-PRODUCT-SUSP-INTEGRA2' and kind = 'product';

update public.reference_records
set data = '{"technical_record_id":"SUSP-SEC600","support_id":"SUP-BOIS-SOLIVAGE","reglage_mode":"continu","reglage_min_mm":80,"reglage_max_mm":580,"entraxe_suspentes_m":1.2,"fixation":"2 vis TTPC 35 par suspente"}'::jsonb || data
where id = 'CATALOG-PRODUCT-SUSP-SEC600' and kind = 'product';

update public.reference_records
set data = '{"technical_record_id":"SUSP-CLIPLAINE","support_id":"SUP-BOIS-SOLIVAGE","reglage_mode":"valeurs_discretes","reglage_min_mm":280,"reglage_max_mm":370,"reglages_mm":["280","370"],"entraxe_suspentes_m":1.2,"fixation":"2 vis TTPC 35 par suspente"}'::jsonb || data
where id = 'CATALOG-PRODUCT-SUSP-CLIPLAINE' and kind = 'product';
