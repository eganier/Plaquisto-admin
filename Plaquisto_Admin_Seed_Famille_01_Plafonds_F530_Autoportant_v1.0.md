# Plaquisto Admin — Seed métier exploitable Codex
## Famille 01 — Plafonds V1 : F530 + Autoportant

**Version du seed : 1.0**  
**Date de constitution : 16 août 2026**  
**Cible : Plaquisto Admin / moteur de calcul Plaquisto**  
**Périmètre V1 : plafonds suspendus sur fourrures F530 + plafonds autoportants rails/montants**  
**Hors V1 : Stil Prim, Megastil, Gyplat, plafonds démontables, systèmes décoratifs spécialisés**

---

# 0. Statut et règles d'usage du seed

Ce fichier est conçu pour être **directement transformable par Codex** en :

- seed SQL / JSON ;
- tables de référentiel ;
- règles de compatibilité ;
- règles de dimensionnement ;
- profils quantitatifs ;
- fixtures de tests.

Il contient deux types de données clairement séparés :

1. **Données Placo vérifiées** : valeurs relevées sur des sources officielles Placo.
2. **Overlay métier Plaquisto** : décisions produit/métier propres à Plaquisto.

## 0.1 Ne jamais fusionner silencieusement les deux couches

Une valeur fabricant et une règle métier Plaquisto peuvent être différentes.

Exemple important :

- certaines pages solution Placo donnent des quantités d'éclisses spécifiques ;
- Plaquisto possède en parallèle une règle métier de travail `1 éclisse / 3 m.l. de F530`.

Ces valeurs doivent coexister dans la base avec une priorité explicite. Codex ne doit jamais remplacer l'une par l'autre sans règle de priorité.

## 0.2 Priorité des règles

Ordre proposé :

```yaml
RULE_PRIORITY:
  100: EXACT_VERIFIED_SOLUTION_RULE
  90: VERIFIED_MANUFACTURER_RULE
  80: VERIFIED_GUIDE_RULE
  60: PLAQUISTO_TRADE_RULE
  40: PROVISIONAL_TRADE_RULE
  10: TO_VERIFY_RULE
```

Pour un calcul :

1. chercher une règle exacte de configuration ;
2. sinon une règle fabricant générique applicable ;
3. sinon une règle métier Plaquisto explicitement activée ;
4. sinon signaler `RULE_MISSING`.

## 0.3 États de validation

```yaml
VERIFIED_OFFICIAL_PLACO
VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
VERIFIED_OFFICIAL_PLACO_GUIDE
PLAQUISTO_VALIDATED_TRADE_RULE
PROVISIONAL_TRADE_RULE
TO_VERIFY_IN_INTEGRALE
DEPRECATED
```

---

# 1. Registre des sources

## SRC_PLACO_COMPAGNON_PLAFONDS

```yaml
id: SRC_PLACO_COMPAGNON_PLAFONDS
publisher: Placo
title: Le Compagnon Placo - Mise en œuvre et conseils
type: OFFICIAL_PDF
url: https://www.placo.fr/media/16906/download?attachment=
sections_used:
  - Guide de choix plafonds
  - Plafond suspendu F530
  - Plafond autoportant rails/montants
validation_status: VERIFIED_OFFICIAL_PLACO_GUIDE
```

## SRC_PLACO_GUIDE_FAUX_PLAFOND_2026

```yaml
id: SRC_PLACO_GUIDE_FAUX_PLAFOND_2026
publisher: Placo
title: Quel type de faux plafond installer ?
type: OFFICIAL_WEB_PAGE
url: https://www.placo.fr/quel-type-de-faux-plafond-installer
validation_status: VERIFIED_OFFICIAL_PLACO
```

## Sources solution F530 utilisées

```yaml
- id: SRC_SP00022955
  pim_id: SP00022955
  description: F530 plancher bois - 1x BA13 - entraxe 0.60 - isolant 100
  url: https://www.placo.fr/professionnels/solution/sp00022955/plafonds-sur-fourrures-stil-f-530-plancher-bois-1x-placoplatre-ba-13-stil-f-530-et-r-f-530-06-m
  status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

- id: SRC_SP00022956
  pim_id: SP00022956
  description: F530 plancher bois - 1x BA13 - entraxe 0.50 - isolant 100
  url: https://www.placo.fr/professionnels/solution/sp00022956/plafonds-sur-fourrures-stil-f-530-plancher-bois-1x-placoplatre-ba-13-stil-f-530-et-r-f-530-05-m
  status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

- id: SRC_SP00022952
  pim_id: SP00022952
  description: F530 plancher bois - 1x Placomarine BA13 - entraxe 0.40 - isolant 100
  url: https://www.placo.fr/professionnels/solution/sp00022952/plafonds-sur-fourrures-stil-f-530-plancher-bois-1x-placomarine-ba-13-stil-f-530-et-r-f-530-04-m
  status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

- id: SRC_SP00022973
  pim_id: SP00022973
  description: F530 plancher bois - 2x BA13 - entraxe 0.60
  url: https://www.placo.fr/professionnels/solution/sp00022973/plafonds-sur-fourrures-stil-f-530-plancher-bois-2x-placoplatre-ba-13-stil-f-530-et-r-f-530-06-m
  status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

- id: SRC_SP00022975
  pim_id: SP00022975
  description: F530 plancher bois - 2x BA13 - entraxe 0.50
  url: https://www.placo.fr/professionnels/solution/sp00022975/plafonds-sur-fourrures-stil-f-530-plancher-bois-2x-placoplatre-ba-13-stil-f-530-et-r-f-530-05-m
  status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

- id: SRC_SP00022976
  pim_id: SP00022976
  description: F530 plancher bois - 2x BA13 - entraxe 0.40
  url: https://www.placo.fr/professionnels/solution/sp00022976/plafonds-sur-fourrures-stil-f-530-plancher-bois-2x-placoplatre-ba-13-stil-f-530-et-r-f-530-04-m
  status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

- id: SRC_SP00022968
  pim_id: SP00022968
  description: F530 plancher bois - 2x Placo Phonique BA13 - entraxe 0.60 - RA 57 dB
  url: https://www.placo.fr/professionnels/solution/sp00022968/plafonds-sur-fourrures-stil-f-530-plancher-bois-2x-placo-phonique-ba-13-stil-f-530-et-r-f-530-06-m
  status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

- id: SRC_SP00022984
  pim_id: SP00022984
  description: F530 plancher bois - 2x BA18S - entraxe 0.50 - REI60
  url: https://www.placo.fr/professionnels/solution/sp00022984/plafonds-sur-fourrures-stil-f-530-plancher-bois-2x-placoplatre-ba18s-stil-f-530-et-r-f-530-05-m
  status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

- id: SRC_SP00022985
  pim_id: SP00022985
  description: F530 plancher bois - 2x BA18S - entraxe 0.40 - REI60
  url: https://www.placo.fr/professionnels/solution/sp00022985/plafonds-sur-fourrures-stil-f-530-plancher-bois-2x-placoplatre-ba18s-stil-f-530-et-r-f-530-04-m
  status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

- id: SRC_SY244870480
  pim_id: SY2_44870480
  description: F530 dalle béton - 1x BA13 - entraxe 0.60 - sans isolant - tige + cavalier
  url: https://www.placo.fr/professionnels/solution/sy244870480/plafonds-sur-fourrures-stil-f-530-plancher-beton-1x-placoplatre-ba-13-stil-f-530-et-r-f-530-06-m
  status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

- id: SRC_SP00035378
  pim_id: SP00035378
  description: F530 dalle béton - 1x BA13 - entraxe 0.60 - Cavalier dB-F - RA 66 dB
  url: https://www.placo.fr/professionnels/solution/sp00035378/plafonds-sur-fourrures-stil-f-530-plancher-beton-1x-placoplatre-ba-13-stil-f-530-et-r-f-530-06-m
  status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

- id: SRC_SP00022938
  pim_id: SP00022938
  description: F530 dalle béton - 2x BA13 - entraxe 0.60 - Cavalier dB-F
  url: https://www.placo.fr/professionnels/solution/sp00022938/plafonds-sur-fourrures-stil-f-530-plancher-beton-2x-placoplatre-ba-13-stil-f-530-et-r-f-530-06-m
  status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

- id: SRC_SP00035679
  pim_id: SP00035679
  description: F530 béton/poutrelle/hourdis - 2x BA13 - entraxe 0.50 - REI30
  url: https://www.placo.fr/professionnels/solution/sp00035679/plafonds-sur-fourrures-stil-f-530-plancher-beton-ou-poutrelle-ou-hourdis-beton-2x-placoplatre-ba-13
  status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

- id: SRC_SP00035672
  pim_id: SP00035672
  description: F530 béton/poutrelle/hourdis - 2x Placomarine BA13 - entraxe 0.60 - REI30
  url: https://www.placo.fr/professionnels/solution/sp00035672/plafonds-sur-fourrures-stil-f-530-plancher-beton-ou-poutrelle-ou-hourdis-beton-2x-placomarine-ba-13
  status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

- id: SRC_SP00035673
  pim_id: SP00035673
  description: F530 béton/poutrelle/hourdis - 2x Placomarine BA13 - entraxe 0.50 - REI30
  url: https://www.placo.fr/professionnels/solution/sp00035673/plafonds-sur-fourrures-stil-f-530-plancher-beton-ou-poutrelle-ou-hourdis-beton-2x-placomarine-ba-13
  status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

- id: SRC_SP00035664
  pim_id: SP00035664
  description: F530 béton/poutrelle/hourdis - 2x Placo Phonique BA13 - entraxe 0.50 - REI30
  url: https://www.placo.fr/professionnels/solution/sp00035664/plafonds-sur-fourrures-stil-f-530-plancher-beton-ou-poutrelle-ou-hourdis-beton-2x-placo-phonique-ba
  status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

- id: SRC_SP00035686
  pim_id: SP00035686
  description: F530 béton/poutrelle/hourdis - 2x BA18 - entraxe 0.40 - REI60
  url: https://www.placo.fr/professionnels/solution/sp00035686/plafonds-sur-fourrures-stil-f-530-plancher-beton-2x-placoplatre-ba-18-stil-f-530-et-r-f-530-04-m
  status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

---

# 2. Schéma d'import minimal attendu par Codex

## 2.1 ConstructionFamily

```yaml
- id: CEILING
  name: Plafonds
  sort_order: 10
  visible_in_admin: true
  visible_in_app: true
```

## 2.2 ConstructionSystem

```yaml
- id: CEILING_F530
  family_id: CEILING
  generic_name: Plafond suspendu sur fourrures
  commercial_reference_label: Stil F530
  system_kind: SUSPENDED_FURRING
  visible_in_admin: true
  visible_in_app: true
  source_id: SRC_PLACO_COMPAGNON_PLAFONDS
  validation_status: VERIFIED_OFFICIAL_PLACO_GUIDE

- id: CEILING_SELF_SUPPORTING
  family_id: CEILING
  generic_name: Plafond autoportant rails / montants
  commercial_reference_label: Rails et montants Stil
  system_kind: SELF_SUPPORTING_STUD
  visible_in_admin: true
  visible_in_app: true
  source_id: SRC_PLACO_COMPAGNON_PLAFONDS
  validation_status: VERIFIED_OFFICIAL_PLACO_GUIDE
```

## 2.3 Important : marque et système générique

Plaquisto doit conserver deux niveaux :

```yaml
construction_system:
  CEILING_F530

compatible_commercial_family:
  STIL_F530
```

Le workflow utilisateur ne doit pas dépendre d'une marque comme identifiant structurel du système.

---

# 3. Enums / dictionnaires

## 3.1 SupportType

```yaml
WOOD_HORIZONTAL
WOOD_INCLINED
CONCRETE_SLAB
CONCRETE_BEAM_HOURDIS
CONCRETE_HOURDIS
RAFTER
FERMETTE
UNKNOWN_SUPPORT
```

## 3.2 FacingBoardFamily

```yaml
STANDARD_BA13
HYDRO_BA13
PHONIC_BA13
BA18
BA18S
FIRE_BOARD
LIGHT_BOARD
OTHER_BOARD
```

## 3.3 CeilingCompatibilityStatus

```yaml
COMPATIBLE
COMPATIBLE_WITH_RESERVATION
INCOMPATIBLE
```

## 3.4 AlertSeverity

```yaml
INFO
WARNING
CONFIRMATION_REQUIRED
BLOCKING
```

---

# 4. Produits / familles de composants de base

```yaml
product_families:

  - id: PF_F530
    name: Fourrure F530
    canonical_unit: LINEAR_METER

  - id: PF_RAIL_F530
    name: Rail périphérique compatible F530
    canonical_unit: LINEAR_METER

  - id: PF_ECLISSE_F530
    name: Eclisse F530
    canonical_unit: UNIT

  - id: PF_SUSPENSION_F530
    name: Suspente F530
    canonical_unit: UNIT

  - id: PF_CAVALIER_F530
    name: Cavalier F530
    canonical_unit: UNIT

  - id: PF_THREAD_ROD_M6
    name: Tige filetée Ø6
    canonical_unit: LINEAR_METER

  - id: PF_ANCHOR_M6
    name: Cheville métallique tige filetée Ø6
    canonical_unit: UNIT

  - id: PF_BOARD
    name: Plaque de plâtre
    canonical_unit: SQUARE_METER

  - id: PF_TTPC25
    name: Vis TTPC 25
    canonical_unit: UNIT

  - id: PF_TTPC35
    name: Vis TTPC 35
    canonical_unit: UNIT

  - id: PF_TTPC45
    name: Vis TTPC 45
    canonical_unit: UNIT

  - id: PF_TTPC55
    name: Vis TTPC 55
    canonical_unit: UNIT

  - id: PF_TTPC70
    name: Vis TTPC 70
    canonical_unit: UNIT

  - id: PF_TRPF13
    name: Vis TRPF 13
    canonical_unit: UNIT

  - id: PF_JOINT_TAPE
    name: Bande à joint
    canonical_unit: LINEAR_METER

  - id: PF_JOINT_COMPOUND_POWDER
    name: Enduit joint poudre
    canonical_unit: KILOGRAM

  - id: PF_JOINT_COMPOUND_READY
    name: Enduit joint prêt à l'emploi
    canonical_unit: KILOGRAM

  - id: PF_INSULATION
    name: Isolant
    canonical_unit: SQUARE_METER
```

---

# 5. F530 — règles de support et de suspente

## 5.1 Support bois — suspentes courte / longue / maxi

Source : Compagnon Placo.

```yaml
- id: F530_SUSP_WOOD_SHORT_LONG_MAXI
  system_id: CEILING_F530
  support: WOOD_HORIZONTAL
  suspension_family: SHORT_LONG_MAXI_F530
  plenum_min_mm: 20
  plenum_max_mm: 280
  suspension_spacing_max_m: 1.20
  insulation_weight_max_kg_m2: 6
  furring_spacing_mm: 600
  load_per_suspension_kg: 33
  admissible_ceiling_weight_kg_m2: 55
  support_fixing:
    component: TTPC35
    quantity_per_suspension: 2
  source_id: SRC_PLACO_COMPAGNON_PLAFONDS
  validation_status: VERIFIED_OFFICIAL_PLACO_GUIDE
```

## 5.2 Support bois — suspente sécable

```yaml
- id: F530_SUSP_WOOD_BREAKABLE
  system_id: CEILING_F530
  support: WOOD_HORIZONTAL
  suspension_family: BREAKABLE_F530
  allowed_only_on_horizontal_beams: true
  plenum_min_mm: 80
  plenum_max_mm: 580
  suspension_spacing_max_m: 1.20
  insulation_weight_max_kg_m2: 6
  furring_spacing_mm: 600
  load_per_suspension_kg: 35
  admissible_ceiling_weight_kg_m2: 48
  support_fixing:
    component: TTPC35
    quantity_per_suspension: 2
  source_id: SRC_PLACO_COMPAGNON_PLAFONDS
  validation_status: VERIFIED_OFFICIAL_PLACO_GUIDE
```

## 5.3 Support bois / inclinaison — Stil SA + tige filetée + cavalier

```yaml
- id: F530_SUSP_WOOD_SA_ROD_CAVALIER
  system_id: CEILING_F530
  support:
    - WOOD_HORIZONTAL
    - WOOD_INCLINED
  suspension_family: SA_ROD_CAVALIER_F530
  suitable_for_all_inclination_degrees: true
  plenum_max_mm: 1000
  plenum_max_is_dependent_on_thread_rod_length: true
  suspension_spacing_max_m: 1.20
  insulation_weight_max_kg_m2: 6
  furring_spacing_mm: 600
  load_per_suspension_kg:
    source_value: "55 or 28"
    exact_subcase_mapping: TO_VERIFY_IN_INTEGRALE
  admissible_ceiling_weight_kg_m2:
    source_value: "76 or 45"
    exact_subcase_mapping: TO_VERIFY_IN_INTEGRALE
  source_id: SRC_PLACO_COMPAGNON_PLAFONDS
  validation_status: VERIFIED_OFFICIAL_PLACO_GUIDE
```

Ne pas convertir les valeurs `55 ou 28` et `76 ou 45` en une seule valeur sans avoir reconstitué précisément les sous-cas du tableau source.

## 5.4 Dalle béton — tige filetée + cavalier

```yaml
- id: F530_SUSP_CONCRETE_ROD_CAVALIER
  system_id: CEILING_F530
  support: CONCRETE_SLAB
  suspension_family:
    - THREADED_ROD_M6_PLUS_CAVALIER_F530
    - SA_PLUS_CAVALIER_F530_FOR_LEVEL_CORRECTION
  plenum_min_mm: 20
  suspension_spacing_max_m: 1.20
  insulation_weight_max_kg_m2: 6
  furring_spacing_mm: 600
  load_per_suspension_kg: 55
  admissible_ceiling_weight_kg_m2: 76
  support_fixing:
    component: METAL_ANCHOR_FOR_M6_THREAD_ROD
  source_id: SRC_PLACO_COMPAGNON_PLAFONDS
  validation_status: VERIFIED_OFFICIAL_PLACO_GUIDE
```

## 5.5 Plancher hourdis béton — HL F530 direct

```yaml
- id: F530_SUSP_HOURDIS_HL_DIRECT
  system_id: CEILING_F530
  support: CONCRETE_HOURDIS
  suspension_family: HL_F530
  plenum_min_mm: 20
  plenum_max_mm: 40
  suspension_spacing_max_m: 1.20
  insulation_weight_max_kg_m2: 6
  furring_spacing_mm: 600
  load_per_suspension_kg: 63
  admissible_ceiling_weight_kg_m2: 88
  support_fixing_method: FORCE_INSERT_BETWEEN_BEAM_AND_HOURDIS
  source_id: SRC_PLACO_COMPAGNON_PLAFONDS
  validation_status: VERIFIED_OFFICIAL_PLACO_GUIDE
```

## 5.6 Plancher hourdis béton — HL + suspente F530

```yaml
- id: F530_SUSP_HOURDIS_HL_PLUS_SUSP
  system_id: CEILING_F530
  support: CONCRETE_HOURDIS
  suspension_family: HL_F530_PLUS_F530_SUSPENSION
  plenum_min_mm: 60
  plenum_max_mm: 330
  suspension_spacing_max_m: 1.20
  insulation_weight_max_kg_m2: 6
  furring_spacing_mm: 600
  load_per_suspension_kg: 40
  admissible_ceiling_weight_kg_m2: 55
  support_fixing_method: FORCE_INSERT_BETWEEN_BEAM_AND_HOURDIS
  source_id: SRC_PLACO_COMPAGNON_PLAFONDS
  validation_status: VERIFIED_OFFICIAL_PLACO_GUIDE
```

---

# 6. F530 — règles de charge isolant / entraxe

Les pages solution officielles montrent le schéma suivant pour plusieurs familles de plaques courantes :

```yaml
- id: F530_LOAD_BAND_LOW
  insulation_weight_kg_m2:
    min_inclusive: 0
    max_exclusive: 6
  furring_spacing_mm: 600
  source_examples:
    - SP00022955
    - SP00012109
    - SP00035672
  validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

- id: F530_LOAD_BAND_MEDIUM
  insulation_weight_kg_m2:
    min_inclusive: 6
    max_inclusive: 10
  furring_spacing_mm: 500
  source_examples:
    - SP00022956
    - SP00022975
    - SP00022984
    - SP00035679
    - SP00035673
    - SP00035664
  validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

- id: F530_LOAD_BAND_HIGH
  insulation_weight_kg_m2:
    min_exclusive: 10
    max_inclusive: 15
  furring_spacing_mm: 400
  source_examples:
    - SP00022952
    - SP00022976
    - SP00022985
    - SP00035686
  validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

## Règle de prudence

Ne pas généraliser ces bandes à **toutes** les plaques ou à toutes les performances sans vérifier la configuration exacte.

Le moteur doit d'abord chercher une configuration exacte.

---

# 7. F530 — profils quantitatifs vérifiés

## 7.1 Profil QP_F530_060_SINGLE_13

Référence source principale : SP00022955.

```yaml
id: QP_F530_060_SINGLE_13
system_id: CEILING_F530
furring_spacing_mm: 600
facing_layers: 1
board_nominal_family: BA13_13MM_CLASS
basis: PER_1_M2_OF_CEILING
quantities:
  board_m2: 1.05
  f530_ml: 1.79
  suspension_unit: 1.56
  rail_f530_ml: 0.47
  eclisse_f530_unit: 0.21
  ttpc25_unit: 15
  joint_tape_ml: 1.58
  placomix_ready_kg: 0.53
  placojoint_pr4_powder_kg: 0.37
  insulation_m2_if_present: 1.05
source_id: SRC_SP00022955
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

## 7.2 Profil QP_F530_050_SINGLE_13

Vérifié sur BA13 et Placomarine 13.

```yaml
id: QP_F530_050_SINGLE_13
system_id: CEILING_F530
furring_spacing_mm: 500
facing_layers: 1
board_nominal_family: BA13_13MM_CLASS
basis: PER_1_M2_OF_CEILING
quantities:
  board_m2: 1.05
  f530_ml: 2.10
  suspension_unit: 1.84
  rail_f530_ml: 0.47
  eclisse_f530_unit: 0.25
  ttpc25_unit: 17
  joint_tape_ml: 1.58
  placomix_ready_kg: 0.53
  placojoint_pr4_powder_kg: 0.37
  insulation_m2_if_present: 1.05
source_ids:
  - SRC_SP00022956
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

## 7.3 Profil QP_F530_040_SINGLE_13

Source Placomarine 13, plancher bois.

```yaml
id: QP_F530_040_SINGLE_13
system_id: CEILING_F530
furring_spacing_mm: 400
facing_layers: 1
board_nominal_family: BA13_13MM_CLASS
basis: PER_1_M2_OF_CEILING
quantities:
  board_m2: 1.05
  f530_ml: 2.52
  suspension_unit: 2.20
  rail_f530_ml: 0.47
  ttpc25_unit: 20
  joint_tape_ml: 1.58
  placomix_ready_kg: 0.53
  placojoint_pr4_powder_kg: 0.37
  insulation_m2_if_present: 1.05
  eclisse_f530_unit:
    value: null
    reason: NOT_PRESENT_IN_EXTRACTED_SOURCE_LIST
source_id: SRC_SP00022952
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

## 7.4 Profil QP_F530_060_DOUBLE_13

Vérifié sur BA13 et Placo Phonique BA13.

```yaml
id: QP_F530_060_DOUBLE_13
system_id: CEILING_F530
furring_spacing_mm: 600
facing_layers: 2
board_nominal_family: BA13_13MM_CLASS
basis: PER_1_M2_OF_CEILING
quantities:
  board_total_m2: 2.10
  f530_ml: 1.79
  suspension_unit: 1.56
  rail_f530_ml: 0.47
  eclisse_f530_unit: 0.21
  first_layer_screw:
    family: TTPC25
    unit_per_m2: 10
  second_layer_screw:
    family: TTPC35
    unit_per_m2: 15
  joint_tape_ml: 1.58
  placomix_ready_kg: 0.53
  placojoint_pr4_powder_kg: 0.37
  insulation_m2_if_present: 1.05
source_ids:
  - SRC_SP00022973
  - SRC_SP00022968
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

## 7.5 Profil QP_F530_050_DOUBLE_13

```yaml
id: QP_F530_050_DOUBLE_13
system_id: CEILING_F530
furring_spacing_mm: 500
facing_layers: 2
board_nominal_family: BA13_13MM_CLASS
basis: PER_1_M2_OF_CEILING
quantities:
  board_total_m2: 2.10
  f530_ml: 2.10
  suspension_unit: 1.84
  rail_f530_ml: 0.47
  eclisse_f530_unit: 0.25
  first_layer_screw:
    family: TTPC25
    unit_per_m2: 11
  second_layer_screw:
    family: TTPC35
    unit_per_m2: 17
  joint_tape_ml: 1.58
  placomix_ready_kg: 0.53
  placojoint_pr4_powder_kg: 0.37
  insulation_m2_if_present: 1.05
source_ids:
  - SRC_SP00022975
  - SRC_SP00035679
  - SRC_SP00035673
  - SRC_SP00035664
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

## 7.6 Profil QP_F530_040_DOUBLE_13

```yaml
id: QP_F530_040_DOUBLE_13
system_id: CEILING_F530
furring_spacing_mm: 400
facing_layers: 2
board_nominal_family: BA13_13MM_CLASS
basis: PER_1_M2_OF_CEILING
quantities:
  board_total_m2: 2.10
  f530_ml: 2.52
  suspension_unit: 2.20
  rail_f530_ml: 0.47
  first_layer_screw:
    family: TTPC25
    unit_per_m2: 13
  second_layer_screw:
    family: TTPC35
    unit_per_m2: 20
  joint_tape_ml: 1.58
  placomix_ready_kg: 0.53
  placojoint_pr4_powder_kg: 0.37
  insulation_m2_if_present: 1.05
  eclisse_f530_unit:
    value: null
    reason: NOT_PRESENT_IN_VERIFIED_SOURCE_LIST
source_id: SRC_SP00022976
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

## 7.7 Profil QP_F530_050_DOUBLE_BA18S

```yaml
id: QP_F530_050_DOUBLE_BA18S
system_id: CEILING_F530
furring_spacing_mm: 500
facing_layers: 2
board_nominal_family: BA18S
basis: PER_1_M2_OF_CEILING
quantities:
  board_total_m2: 2.10
  f530_ml: 2.10
  suspension_unit: 1.84
  rail_f530_ml: 0.47
  eclisse_f530_unit: 0.25
  first_layer_screw:
    family: TTPC35
    unit_per_m2: 11
  second_layer_screw:
    family: TTPC45
    unit_per_m2: 17
  joint_tape_ml: 1.58
  placomix_ready_kg: 0.53
  placojoint_pr4_powder_kg: 0.37
  insulation_m2_if_present: 1.05
source_id: SRC_SP00022984
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

## 7.8 Profil QP_F530_040_DOUBLE_BA18S

```yaml
id: QP_F530_040_DOUBLE_BA18S
system_id: CEILING_F530
furring_spacing_mm: 400
facing_layers: 2
board_nominal_family: BA18S
basis: PER_1_M2_OF_CEILING
quantities:
  board_total_m2: 2.10
  f530_ml: 2.52
  suspension_unit: 2.20
  rail_f530_ml: 0.47
  first_layer_screw:
    family: TTPC35
    unit_per_m2: 13
  second_layer_screw:
    family: TTPC45
    unit_per_m2: 20
  joint_tape_ml: 1.58
  placomix_ready_kg: 0.53
  placojoint_pr4_powder_kg: 0.37
  insulation_m2_if_present: 1.05
  eclisse_f530_unit:
    value: null
    reason: NOT_PRESENT_IN_VERIFIED_SOURCE_LIST
source_id: SRC_SP00022985
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

---

# 8. F530 — profil générique Compagnon (fallback uniquement)

Le Compagnon Placo publie pour 1 m² de plafond suspendu F530 à entraxe 60 cm, simple parement :

```yaml
id: QP_F530_COMPAGNON_GENERIC_060_SINGLE
system_id: CEILING_F530
basis: PER_1_M2
furring_spacing_mm: 600
facing_layers: 1
quantities:
  board_m2: 1.05
  f530_ml: 2.00
  rail_ml: PROJECT_GEOMETRY_DEPENDENT
  suspension_unit: 1.80
  screw_unit: 10
  joint_tape_ml: 1.40
  joint_compound_powder_kg: 0.33
  joint_compound_ready_kg: 0.47
source_id: SRC_PLACO_COMPAGNON_PLAFONDS
validation_status: VERIFIED_OFFICIAL_PLACO_GUIDE
priority: 80
```

## Important

Les pages solutions récentes peuvent donner des ratios différents (par exemple 1,79 m.l. de F530, 1,56 suspente et 1,58 m.l. de bande sur certaines configurations 0,60 m).

**Codex doit donc appliquer :**

`solution exacte > profil générique Compagnon`.

Il ne faut pas lisser ou moyenner ces valeurs.

---

# 9. F530 — configurations techniques vérifiées

## 9.1 Bois BA13 simple 0.50 / isolant 6–10 kg/m²

```yaml
id: CFG_F530_WOOD_BA13_1L_050
system_id: CEILING_F530
support: WOOD_HORIZONTAL
pim_id: SP00022956
facing:
  layers: 1
  product_family: STANDARD_BA13
furring_spacing_mm: 500
suspension_family: SHORT_LONG_MAXI_F530
adjustment_capacity_mm:
  min: 20
  max: 280
support_fixing:
  TTPC35_per_suspension: 2
span_m: 1.20
insulation:
  thickness_mm: 100
  max_weight_band_kg_m2: "6-10"
fire:
  rating: REI15
  source_reference: NF_EN_1995_1_2_NA_NOV_2022
quantitative_profile_id: QP_F530_050_SINGLE_13
source_id: SRC_SP00022956
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

## 9.2 Bois BA13 double 0.40 / isolant 10–15 kg/m²

```yaml
id: CFG_F530_WOOD_BA13_2L_040
system_id: CEILING_F530
support: WOOD_HORIZONTAL
pim_id: SP00022976
facing:
  layers: 2
  product_family: STANDARD_BA13
furring_spacing_mm: 400
suspension_family: SHORT_LONG_MAXI_F530
adjustment_capacity_mm:
  min: 20
  max: 280
support_fixing:
  TTPC35_per_suspension: 2
span_m: 1.20
insulation:
  thickness_mm: 100
  max_weight_band_kg_m2: "10-15"
fire:
  rating: REI30
quantitative_profile_id: QP_F530_040_DOUBLE_13
source_id: SRC_SP00022976
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

## 9.3 Bois Phonique double 0.60

```yaml
id: CFG_F530_WOOD_PHONIC13_2L_060
system_id: CEILING_F530
support: WOOD_HORIZONTAL
pim_id: SP00022968
facing:
  layers: 2
  product_family: PHONIC_BA13
furring_spacing_mm: 600
span_m: 1.20
insulation:
  thickness_mm: 100
acoustic:
  RA_dB: 57
  source_method: ESTIMATION_PLACO
fire:
  rating: REI30
quantitative_profile_id: QP_F530_060_DOUBLE_13
source_id: SRC_SP00022968
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

## 9.4 Bois BA18S double 0.50

```yaml
id: CFG_F530_WOOD_BA18S_2L_050
system_id: CEILING_F530
support: WOOD_HORIZONTAL
pim_id: SP00022984
facing:
  layers: 2
  product_family: BA18S
furring_spacing_mm: 500
span_m: 1.20
insulation:
  thickness_mm: 100
  max_weight_band_kg_m2: "6-10"
fire:
  rating: REI60
quantitative_profile_id: QP_F530_050_DOUBLE_BA18S
source_id: SRC_SP00022984
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

## 9.5 Bois BA18S double 0.40

```yaml
id: CFG_F530_WOOD_BA18S_2L_040
system_id: CEILING_F530
support: WOOD_HORIZONTAL
pim_id: SP00022985
facing:
  layers: 2
  product_family: BA18S
furring_spacing_mm: 400
span_m: 1.20
insulation:
  thickness_mm: 100
  max_weight_band_kg_m2: "10-15"
fire:
  rating: REI60
quantitative_profile_id: QP_F530_040_DOUBLE_BA18S
source_id: SRC_SP00022985
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

## 9.6 Dalle béton BA13 simple sans isolant — tige filetée

```yaml
id: CFG_F530_CONCRETE_BA13_1L_060_ROD
system_id: CEILING_F530
support: CONCRETE_SLAB
pim_id: SY2_44870480
facing:
  layers: 1
  product_family: STANDARD_BA13
furring_spacing_mm: 600
suspension:
  primary: ARTICULATED_SA
  threaded_rod_diameter_mm: 6
  secondary: CAVALIER_F530
  anchor: METAL_ANCHOR_FOR_M6
adjustment_capacity_mm:
  min: 20
span_m: 1.20
insulation:
  present: false
quantities:
  board_m2: 1.05
  f530_ml: 1.79
  articulated_suspension_unit: 1.56
  cavalier_f530_unit: 1.56
  rail_f530_ml: 0.47
  eclisse_f530_unit: 0.21
  ttpc25_unit: 15
  joint_tape_ml: 1.58
  placomix_ready_kg: 0.53
  placojoint_pr4_powder_kg: 0.37
  threaded_rod:
    quantity: null
    calculation: PLAQUISTO_PLENUM_RULE
source_id: SRC_SY244870480
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

## 9.7 Dalle béton BA13 simple acoustique — dB-F

```yaml
id: CFG_F530_CONCRETE_BA13_1L_060_DBF
system_id: CEILING_F530
support: CONCRETE_SLAB
pim_id: SP00035378
facing:
  layers: 1
  product_family: STANDARD_BA13
furring_spacing_mm: 600
suspension_family: CAVALIER_DBF_F530
plenum_min_mm: 130
span_m: 1.20
insulation:
  thickness_mm: 80
  max_weight_kg_m2: 6
acoustic:
  RA_dB: 66
source_id: SRC_SP00035378
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

## 9.8 Béton/poutrelle/hourdis BA13 double 0.50

```yaml
id: CFG_F530_CONCRETE_HOURDIS_BA13_2L_050
system_id: CEILING_F530
support:
  - CONCRETE_SLAB
  - CONCRETE_BEAM_HOURDIS
  - CONCRETE_HOURDIS
pim_id: SP00035679
facing:
  layers: 2
  product_family: STANDARD_BA13
furring_spacing_mm: 500
suspension_family: SHORT_LONG_MAXI_F530_AS_PUBLISHED
adjustment_capacity_mm:
  min: 20
  max: 280
span_m: 1.20
insulation:
  thickness_mm: 100
  weight_band_kg_m2: "6-10"
fire:
  rating: REI30
  evidence_type: ESTIMATION_PLACO
quantitative_profile_id: QP_F530_050_DOUBLE_13
source_id: SRC_SP00035679
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

## 9.9 Béton/poutrelle/hourdis Placo Phonique double 0.50

```yaml
id: CFG_F530_CONCRETE_HOURDIS_PHONIC13_2L_050
system_id: CEILING_F530
support:
  - CONCRETE_SLAB
  - CONCRETE_BEAM_HOURDIS
  - CONCRETE_HOURDIS
pim_id: SP00035664
facing:
  layers: 2
  product_family: PHONIC_BA13
furring_spacing_mm: 500
span_m: 1.20
insulation:
  thickness_mm: 100
  weight_band_kg_m2: "6-10"
fire:
  rating: REI30
  evidence_type: ESTIMATION_PLACO
quantitative_profile_id: QP_F530_050_DOUBLE_13
source_id: SRC_SP00035664
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

## 9.10 Béton/poutrelle/hourdis Placomarine double 0.60

```yaml
id: CFG_F530_CONCRETE_HOURDIS_MARINE13_2L_060
system_id: CEILING_F530
support:
  - CONCRETE_SLAB
  - CONCRETE_BEAM_HOURDIS
  - CONCRETE_HOURDIS
pim_id: SP00035672
facing:
  layers: 2
  product_family: HYDRO_BA13
furring_spacing_mm: 600
span_m: 1.20
insulation:
  thickness_mm: 100
  weight_band_kg_m2: "<6"
fire:
  rating: REI30
  evidence_type: ESTIMATION_PLACO
source_id: SRC_SP00035672
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

## 9.11 Béton BA18 double 0.40

```yaml
id: CFG_F530_CONCRETE_BA18_2L_040
system_id: CEILING_F530
support:
  - CONCRETE_SLAB
  - CONCRETE_BEAM_HOURDIS
  - CONCRETE_HOURDIS
pim_id: SP00035686
facing:
  layers: 2
  product_family: BA18
furring_spacing_mm: 400
span_m: 1.20
insulation:
  thickness_mm: 100
  weight_band_kg_m2: "10-15"
fire:
  rating: REI60
  evidence_type: ESTIMATION_PLACO
source_id: SRC_SP00035686
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

---

# 10. F530 — overlay métier Plaquisto

Ces règles ne sont pas présentées comme des prescriptions Placo. Elles viennent des décisions du projet Plaquisto.

## 10.1 Choix du système de suspension en premier

```yaml
- id: PLAQUISTO_CEILING_FIRST_TECHNICAL_CHOICE
  system_id: CEILING_F530
  rule_type: WORKFLOW
  value: USER_CHOOSES_SUSPENSION_SYSTEM_FIRST
  validation_status: PLAQUISTO_VALIDATED_TRADE_RULE
```

## 10.2 Éclisses — estimation chantier Plaquisto

```yaml
- id: PLAQUISTO_F530_ECLISSE_FALLBACK
  system_id: CEILING_F530
  rule_type: QUANTITY_FALLBACK
  component: PF_ECLISSE_F530
  formula: CEIL(F530_LINEAR_METERS / 3)
  display_text: "Estimation Plaquisto : 1 éclisse pour 3 m.l. de F530"
  editable_by_user: true
  admin_configurable: true
  priority: 60
  validation_status: PLAQUISTO_VALIDATED_TRADE_RULE
```

Cette règle **ne remplace pas** une quantité solution Placo exacte lorsque celle-ci est renseignée.

## 10.3 Cornières périphériques

```yaml
- id: PLAQUISTO_CEILING_PERIPHERAL_CORNERS
  rule_type: WORK_ITEM_ADJUSTMENT
  question: "Souhaitez-vous prévoir des cornières périphériques ?"
  if_yes:
    ask_perimeter_ml: true
  if_no:
    apply_percent: 5
    components:
      - PF_F530
      - PF_SUSPENSION_F530
      - PF_ECLISSE_F530
  excluded_components:
    - PF_BOARD
    - PF_INSULATION
    - PF_JOINT_TAPE
    - PF_JOINT_COMPOUND_POWDER
    - PF_JOINT_COMPOUND_READY
  admin_configurable: true
  validation_status: PLAQUISTO_VALIDATED_TRADE_RULE
```

## 10.4 Tiges filetées

```yaml
- id: PLAQUISTO_THREAD_ROD_PLENUM
  system_id: CEILING_F530
  applies_when:
    suspension_uses_threaded_rod: true
  user_questions:
    - "Le plénum est-il identique sur tout le plafond ?"
  if_constant:
    retained_length: CONSTANT_PLENUM_HEIGHT + ADMIN_ADJUSTMENT_RESERVE
  if_variable:
    retained_length: MAXIMUM_PLENUM_HEIGHT + ADMIN_ADJUSTMENT_RESERVE
  technical_length_formula: SUSPENSION_COUNT * RETAINED_LENGTH
  commercial_conversion: CEIL(TECHNICAL_LENGTH / ROD_COMMERCIAL_LENGTH)
  admin_adjustment_reserve_mm: CONFIGURABLE
  validation_status: PLAQUISTO_VALIDATED_TRADE_RULE
```

## 10.5 Fixations support

```yaml
- id: PLAQUISTO_SUPPORT_FIXING_COUNT
  rule_type: QUANTITY
  formula: SUPPORT_FIXING_COUNT = SUSPENSION_COUNT
  exception: USE_EXACT_MANUFACTURER_SUBCOMPONENT_RULE_IF_PRESENT
  validation_status: PLAQUISTO_VALIDATED_TRADE_RULE
```

---

# 11. F530 — membrane / rampant / isolation multicouche

## 11.1 Structure de données

```yaml
InsulationLayer:
  id:
  work_item_id:
  product_id:
  position:
    - BETWEEN_RAFTERS
    - UNDER_RAFTERS
  thickness_mm:
  surface_weight_kg_m2:
  thermal_resistance_R:
  layer_index:
```

## 11.2 Règle Plaquisto suspente compatible membrane

```yaml
- id: PLAQUISTO_MEMBRANE_SUSPENSION_LAYER_SIZING
  condition:
    work_item_kind:
      - CEILING_SLOPED
      - RAMPANT
    crossed_insulation: true
  sizing_input:
    use_layer_position: UNDER_RAFTERS
    do_not_use_total_insulation_thickness: true
  display_text: >
    Pour un plafond/rampant avec isolation croisée, la suspente est
    dimensionnée sur l'épaisseur de la couche d'isolant située sous
    les chevrons/solives, et non sur l'épaisseur totale.
  validation_status: PLAQUISTO_VALIDATED_TRADE_RULE
```

## 11.3 Pas de substitution automatique de taille de suspente

```yaml
- id: PLAQUISTO_SUSPENSION_NO_SIZE_SUBSTITUTION
  rule_type: STOCK_SUBSTITUTION
  component_family: PF_SUSPENSION_F530
  automatic_larger_size_substitution: false
  automatic_smaller_size_substitution: false
  explicit_admin_compatibility_required: true
  validation_status: PLAQUISTO_VALIDATED_TRADE_RULE
```

---

# 12. Autoportant — dimensionnement officiel

## 12.1 Portées de base à entraxe 600 mm

Source Placo.

```yaml
self_supporting_span_rules:

  - id: AUTO_M48_SINGLE_600
    stud: M48
    stud_mode: SINGLE
    spacing_mm: 600
    insulation_weight_max_kg_m2: 6
    max_span_m: 2.10
    bracing_mid_span_required: true
    source_id: SRC_PLACO_COMPAGNON_PLAFONDS
    validation_status: VERIFIED_OFFICIAL_PLACO_GUIDE

  - id: AUTO_M48_DOUBLE_600
    stud: M48
    stud_mode: DOUBLE_BACK_TO_BACK
    spacing_mm: 600
    insulation_weight_max_kg_m2: 6
    max_span_m: 2.50
    source_id: SRC_PLACO_COMPAGNON_PLAFONDS
    validation_status: VERIFIED_OFFICIAL_PLACO_GUIDE

  - id: AUTO_M70_SINGLE_600
    stud: M70
    stud_mode: SINGLE
    spacing_mm: 600
    insulation_weight_max_kg_m2: 6
    max_span_m: 2.70
    bracing_mid_span_required: true
    source_id: SRC_PLACO_COMPAGNON_PLAFONDS
    validation_status: VERIFIED_OFFICIAL_PLACO_GUIDE

  - id: AUTO_M70_DOUBLE_600
    stud: M70
    stud_mode: DOUBLE_BACK_TO_BACK
    spacing_mm: 600
    insulation_weight_max_kg_m2: 6
    max_span_m: 3.20
    source_id: SRC_PLACO_COMPAGNON_PLAFONDS
    validation_status: VERIFIED_OFFICIAL_PLACO_GUIDE

  - id: AUTO_M90_SINGLE_600
    stud: M90
    stud_mode: SINGLE
    spacing_mm: 600
    insulation_weight_max_kg_m2: 6
    max_span_m: 3.15
    bracing_mid_span_required: true
    source_id: SRC_PLACO_COMPAGNON_PLAFONDS
    validation_status: VERIFIED_OFFICIAL_PLACO_GUIDE

  - id: AUTO_M90_DOUBLE_600
    stud: M90
    stud_mode: DOUBLE_BACK_TO_BACK
    spacing_mm: 600
    insulation_weight_max_kg_m2: 6
    max_span_m: 3.70
    source_id: SRC_PLACO_COMPAGNON_PLAFONDS
    validation_status: VERIFIED_OFFICIAL_PLACO_GUIDE

  - id: AUTO_M100_SINGLE_600
    stud: M100
    stud_mode: SINGLE
    spacing_mm: 600
    insulation_weight_max_kg_m2: 6
    max_span_m: 3.30
    bracing_mid_span_required: true
    source_id: SRC_PLACO_COMPAGNON_PLAFONDS
    validation_status: VERIFIED_OFFICIAL_PLACO_GUIDE

  - id: AUTO_M100_DOUBLE_600
    stud: M100
    stud_mode: DOUBLE_BACK_TO_BACK
    spacing_mm: 600
    insulation_weight_max_kg_m2: 6
    max_span_m: 3.90
    source_id: SRC_PLACO_COMPAGNON_PLAFONDS
    validation_status: VERIFIED_OFFICIAL_PLACO_GUIDE
```

## 12.2 Influence du poids isolant / entraxe

Source Placo actuelle :

```yaml
- id: AUTO_LOAD_0_6
  insulation_weight_kg_m2:
    max_inclusive: 6
  default_spacing_mm: 600
  source_id: SRC_PLACO_GUIDE_FAUX_PLAFOND_2026
  validation_status: VERIFIED_OFFICIAL_PLACO

- id: AUTO_LOAD_6_10
  insulation_weight_kg_m2:
    min_exclusive: 6
    max_inclusive: 10
  required_spacing_mm: 500
  source_id: SRC_PLACO_GUIDE_FAUX_PLAFOND_2026
  validation_status: VERIFIED_OFFICIAL_PLACO

- id: AUTO_LOAD_10_15
  insulation_weight_kg_m2:
    min_exclusive: 10
    max_inclusive: 15
  required_spacing_mm: 400
  source_id: SRC_PLACO_GUIDE_FAUX_PLAFOND_2026
  validation_status: VERIFIED_OFFICIAL_PLACO
```

## 12.3 Augmentation des portées pour isolant ≤6 kg/m²

```yaml
- id: AUTO_SPAN_BONUS_500
  condition:
    insulation_weight_kg_m2_max: 6
    spacing_mm: 500
  span_multiplier: 1.05
  source_id: SRC_PLACO_GUIDE_FAUX_PLAFOND_2026
  validation_status: VERIFIED_OFFICIAL_PLACO

- id: AUTO_SPAN_BONUS_400
  condition:
    insulation_weight_kg_m2_max: 6
    spacing_mm: 400
  span_multiplier: 1.10
  source_id: SRC_PLACO_GUIDE_FAUX_PLAFOND_2026
  validation_status: VERIFIED_OFFICIAL_PLACO
```

### Exemple calculé par moteur

```yaml
base_rule: AUTO_M100_DOUBLE_600
base_span_m: 3.90

spacing_500:
  max_span_m: 4.095

spacing_400:
  max_span_m: 4.29
```

Le guide mentionne des solutions allant jusqu'à 4,35 m dans l'Intégrale selon les montants utilisés.  
Ne pas arrondir automatiquement 4,29 à 4,35 : les configurations exactes de l'Intégrale doivent être ajoutées séparément.

---

# 13. Autoportant — règles de mise en œuvre utiles au quantitatif

## 13.1 Entretoise sur montants simples

```yaml
- id: AUTO_SINGLE_STUD_BRACING
  condition:
    stud_mode: SINGLE
  required: true
  position: MID_SPAN
  compatible_component_families:
    - RAIL_STIL
    - PF_F530
  fixing_component: PF_TRPF13
  source_id: SRC_PLACO_COMPAGNON_PLAFONDS
  validation_status: VERIFIED_OFFICIAL_PLACO_GUIDE
```

## 13.2 Montants doubles dos à dos

```yaml
- id: AUTO_DOUBLE_STUD_CONNECTION
  condition:
    stud_mode: DOUBLE_BACK_TO_BACK
  fixing_component: PF_TRPF13
  fixing_spacing_mm: 400
  source_id: SRC_PLACO_COMPAGNON_PLAFONDS
  validation_status: VERIFIED_OFFICIAL_PLACO_GUIDE
```

## 13.3 Fixation des montants doubles dans les rails

```yaml
- id: AUTO_DOUBLE_STUD_RAIL_END_FIXING
  condition:
    stud_mode: DOUBLE_BACK_TO_BACK
  trpf_quantity_per_end: 4
  interpretation: >
    4 vis TRPF au total par extrémité du couple de montants,
    conformément au guide de mise en œuvre.
  source_id: SRC_PLACO_COMPAGNON_PLAFONDS
  validation_status: VERIFIED_OFFICIAL_PLACO_GUIDE
```

## 13.4 Raccord de montants doubles

Le Compagnon décrit une méthode de raccord avec rail de 30 cm, recouvrement 15 cm de chaque côté et 8 vis TRPF.

Plaquisto V1 a décidé **de ne pas gérer automatiquement les raccords de montants/chutes**.

Conserver la règle comme donnée documentaire Admin :

```yaml
- id: AUTO_DOUBLE_STUD_SPLICE_INFO
  active_for_automatic_quantification: false
  rail_piece_length_mm: 300
  overlap_each_side_mm: 150
  trpf_unit: 8
  source_id: SRC_PLACO_COMPAGNON_PLAFONDS
  validation_status: VERIFIED_OFFICIAL_PLACO_GUIDE
```

## 13.5 Rails périphériques

Le guide indique une fixation horizontale des rails sur les parois verticales tous les 60 cm maximum.

```yaml
- id: AUTO_RAIL_WALL_FIXING_SPACING
  max_spacing_mm: 600
  fixing_type: DEPENDS_ON_SUPPORT
  source_id: SRC_PLACO_COMPAGNON_PLAFONDS
  validation_status: VERIFIED_OFFICIAL_PLACO_GUIDE
```

---

# 14. Autoportant — quantitatif générique officiel

Pour 1 m² de plafond autoportant, entraxe 60 cm, simple parement :

```yaml
id: QP_AUTO_060_SINGLE
system_id: CEILING_SELF_SUPPORTING
basis: PER_1_M2
spacing_mm: 600
facing_layers: 1
quantities:
  board_m2: 1.05
  rail_ml: PROJECT_GEOMETRY_DEPENDENT
  single_stud_ml: 2.00
  double_stud_ml: 4.00
  ttpc_unit: 10
  joint_tape_ml: 1.40
  joint_compound_powder_kg: 0.33
  joint_compound_ready_kg: 0.47
source_id: SRC_PLACO_COMPAGNON_PLAFONDS
validation_status: VERIFIED_OFFICIAL_PLACO_GUIDE
```

## Règle vis de parement du Compagnon

```yaml
- id: AUTO_BOARD_SCREW_LENGTH
  rule: SCREW_LENGTH_GT_BOARD_THICKNESS_PLUS_10MM
  source_id: SRC_PLACO_COMPAGNON_PLAFONDS
  validation_status: VERIFIED_OFFICIAL_PLACO_GUIDE
```

## Overlay Plaquisto pour multi-peaux

Plaquisto conserve ses besoins séparés par couche :

```yaml
- id: PLAQUISTO_FACING_LAYER_1_SCREW
  layer: 1
  default_screw_family: TTPC25

- id: PLAQUISTO_FACING_LAYER_2_SCREW
  layer: 2
  default_screw_family: TTPC35

- id: PLAQUISTO_FACING_LAYER_3_SCREW
  layer: 3
  default_screw_family: TTPC45
```

Une règle fabricant spécifique de plaque/configuration doit écraser ces defaults.

---

# 15. Performances acoustiques — seeds indicatifs du guide

Ces valeurs sont des **performances de solutions complètes dans les contextes indiqués**, pas des performances intrinsèques d'une plaque.

## 15.1 Sous solivage / plancher bois

Contexte du guide : laine de verre 100 mm et plénum 280 mm.

```yaml
context_id: ACOUSTIC_WOOD_FLOOR_GUIDE
floor_alone_RA_dB: 26

suspended:
  BA13_single: 48
  BA13_double: 55
  PHONIC13_single: 51
  PHONIC13_double: 58

self_supporting:
  BA13_single: 50
  BA13_double: 56
  PHONIC13_single: 55
  PHONIC13_double: 59

source_id: SRC_PLACO_COMPAGNON_PLAFONDS
validation_status: VERIFIED_OFFICIAL_PLACO_GUIDE
```

## 15.2 Sous plancher poutrelles béton / hourdis

```yaml
context_id: ACOUSTIC_CONCRETE_HOURDIS_GUIDE
floor_alone_RA_dB: 55

suspended:
  BA13_single: 66
  BA13_double: 69
  PHONIC13_single: 68
  PHONIC13_double: 71

self_supporting:
  BA13_single: 69
  BA13_double: 72
  PHONIC13_single: 71
  PHONIC13_double: 75

source_id: SRC_PLACO_COMPAGNON_PLAFONDS
validation_status: VERIFIED_OFFICIAL_PLACO_GUIDE
```

## 15.3 Sous dalle béton

Contexte du guide : dalle 140 mm, laine 100 mm, plénum 130 mm.

```yaml
context_id: ACOUSTIC_CONCRETE_SLAB_GUIDE
floor_alone_RA_dB: 49

suspended:
  BA13_single: 62
  BA13_double: 65
  PHONIC13_single: 64
  PHONIC13_double: 67

self_supporting:
  BA13_single: 69
  BA13_double: 72
  PHONIC13_single: 71
  PHONIC13_double: 74

source_id: SRC_PLACO_COMPAGNON_PLAFONDS
validation_status: VERIFIED_OFFICIAL_PLACO_GUIDE
```

---

# 16. Moteur de sélection — pseudo-code Codex

## 16.1 F530

```text
INPUT:
  user_selected_suspension_system
  support
  facing_layers
  board_family
  insulation_product
  insulation_surface_weight
  plenum
  optional_performance_target

1. Resolve exact published configuration if one exists.
2. If exact configuration exists:
     apply exact compatibility + exact quantitative profile.
3. Else:
     resolve support/suspension compatibility.
4. Resolve required furring spacing from exact rule or load-band rule.
5. Resolve facing-specific screws.
6. Calculate technical requirements.
7. Apply exact manufacturer eclisse quantity if present.
8. Otherwise optionally apply PLAQUISTO_F530_ECLISSE_FALLBACK.
9. Apply peripheral-corner choice / +5% overlay.
10. Apply membrane / threaded-rod overlays where relevant.
11. Produce alerts and provenance per line.
```

## 16.2 Autoportant

```text
INPUT:
  span
  facing
  insulation_weight
  desired_spacing (optional)

1. Find all base span rules whose max span >= requested span.
2. Apply load-to-spacing rule.
3. Apply span bonus only when insulation <= 6 kg/m2 and spacing is 500/400.
4. Sort compatible configurations:
     a. smallest stud width
     b. single before double at same width
5. User chooses final configuration.
6. Apply bracing rule if single.
7. Apply double-stud TRPF rule if double.
8. Calculate generic quantities + project-dependent rails.
9. Apply facing-layer rules.
10. Produce source trace.
```

---

# 17. Traçabilité par ligne de quantitatif

Chaque résultat doit pouvoir conserver :

```yaml
CalculatedRequirement:
  work_item_id:
  component_family_id:
  selected_product_id:
  quantity:
  unit:
  source_rule_id:
  source_id:
  rule_priority:
  manufacturer_quantity:
  plaquisto_override_quantity:
  active_quantity:
  explanation:
```

Exemple :

```yaml
component: ECLISSE_F530
manufacturer_quantity: null
plaquisto_override_quantity: 28
active_quantity: 28
explanation: >
  Aucun ratio exact d'éclisse n'était présent dans le profil sélectionné.
  Application de la règle métier Plaquisto 1 éclisse / 3 m.l. de F530.
```

---

# 18. Tests automatisés minimum à créer par Codex

## F530

```yaml
tests:

  - id: TEST_F530_WOOD_050_SINGLE
    input:
      surface_m2: 100
      config_id: CFG_F530_WOOD_BA13_1L_050
    expected:
      board_m2: 105
      f530_ml: 210
      suspension_unit: 184
      rail_f530_ml: 47
      eclisse_f530_unit: 25
      ttpc25_unit: 1700
      joint_tape_ml: 158

  - id: TEST_F530_WOOD_040_DOUBLE
    input:
      surface_m2: 100
      config_id: CFG_F530_WOOD_BA13_2L_040
    expected:
      board_total_m2: 210
      f530_ml: 252
      suspension_unit: 220
      ttpc25_unit: 1300
      ttpc35_unit: 2000

  - id: TEST_F530_BA18S_050
    input:
      surface_m2: 100
      config_id: CFG_F530_WOOD_BA18S_2L_050
    expected:
      board_total_m2: 210
      ttpc35_unit: 1100
      ttpc45_unit: 1700
      fire_rating: REI60

  - id: TEST_F530_CONCRETE_ROD
    input:
      surface_m2: 100
      config_id: CFG_F530_CONCRETE_BA13_1L_060_ROD
      plenum_type: CONSTANT
      plenum_mm: 800
      adjustment_reserve_mm: 100
    expected:
      suspension_unit: 156
      cavalier_unit: 156
      threaded_rod_technical_ml: 140.4

  - id: TEST_F530_LOAD_BAND_6_10
    input:
      insulation_weight_kg_m2: 8
    expected:
      furring_spacing_mm: 500

  - id: TEST_F530_LOAD_BAND_10_15
    input:
      insulation_weight_kg_m2: 12
    expected:
      furring_spacing_mm: 400
```

## Autoportant

```yaml
  - id: TEST_AUTO_M48_DOUBLE
    input:
      span_m: 2.50
      insulation_weight_kg_m2: 5
      spacing_mm: 600
    expected:
      compatible: true
      stud: M48
      stud_mode: DOUBLE_BACK_TO_BACK

  - id: TEST_AUTO_M70_DOUBLE
    input:
      span_m: 3.20
      insulation_weight_kg_m2: 5
      spacing_mm: 600
    expected:
      compatible: true
      stud: M70
      stud_mode: DOUBLE_BACK_TO_BACK

  - id: TEST_AUTO_WEIGHT_8
    input:
      insulation_weight_kg_m2: 8
    expected:
      required_spacing_mm: 500

  - id: TEST_AUTO_WEIGHT_12
    input:
      insulation_weight_kg_m2: 12
    expected:
      required_spacing_mm: 400

  - id: TEST_AUTO_M100_DOUBLE_400_BONUS
    input:
      base_rule: AUTO_M100_DOUBLE_600
      insulation_weight_kg_m2: 5
      spacing_mm: 400
    expected:
      calculated_span_m: 4.29

  - id: TEST_AUTO_SINGLE_BRACING
    input:
      stud_mode: SINGLE
    expected:
      bracing_mid_span_required: true
```

---

# 19. Validations Admin

Plaquisto Admin doit refuser la publication si :

```yaml
- exact_configuration_without_source
- quantitative_profile_without_unit
- rule_without_validation_status
- active_product_without_family
- exact_fire_rating_without_source_reference
- exact_acoustic_rating_without_context/source
```

Plaquisto Admin doit avertir sans bloquer si :

```yaml
- source is guide rather than exact solution page
- eclisse manufacturer ratio is absent and Plaquisto fallback will be used
- configuration exists structurally but exact manufacturer quantitative profile is missing
```

---

# 20. Visibilité Plaquisto

Tous les systèmes peuvent être présents dans Admin.

Chaque configuration possède :

```yaml
visible_in_plaquisto: true/false
enabled_for_calculation: true/false
experimental: true/false
```

Exemple :

```yaml
CFG_F530_WOOD_BA13_1L_050:
  visible_in_plaquisto: true
  enabled_for_calculation: true
  experimental: false

future_STIL_PRIM_configuration:
  visible_in_plaquisto: false
  enabled_for_calculation: false
  experimental: true
```

---

# 21. Données explicitement non inventées dans ce seed

Les éléments suivants doivent rester `TO_VERIFY` tant qu'une source exacte n'a pas été ajoutée :

- ratio d'éclisses exact de certains profils à entraxe 400 mm ;
- correspondance précise des deux valeurs de charge `55 ou 28` de la table bois SA+tige+cavalier ;
- toutes les variantes Placo existantes non listées ci-dessus ;
- toutes les plaques décoratives/perforées ;
- Stil Prim ;
- Megastil ;
- Gyplat ;
- plafonds démontables ;
- configurations feu non sourcées individuellement ;
- règles de membrane qui relèvent de documentations spécifiques non contenues dans le tableau générique F530.

Codex ne doit jamais compléter ces valeurs par intuition.

---

# 22. Périmètre recommandé après import de ce fichier

## Activable V1

### F530
- BA13 simple 0.50 / 0.60 ;
- Placomarine 13 simple 0.40 ;
- BA13 double 0.40 / 0.50 / 0.60 ;
- Phonique double 0.60 ;
- BA18S double 0.40 / 0.50 ;
- dalle béton avec tige/cavalier ;
- dalle béton avec dB-F ;
- plusieurs configurations béton/hourdis double parement.

### Autoportant
- M48 / M70 / M90 / M100 ;
- simple / double ;
- entraxe 600 pour ≤6 kg/m² ;
- entraxe 500 pour 6–10 kg/m² ;
- entraxe 400 pour 10–15 kg/m² ;
- +5 % portée à 500 et +10 % à 400 pour isolant ≤6 kg/m² ;
- entretoises montants simples ;
- solidarisation montants doubles.

## V2
- Stil Prim ;
- Megastil ;
- Gyplat ;
- décoratif ;
- longue portée spécifique ;
- autres familles Placo.

---

# 23. Instruction finale Codex

1. Importer ce seed en conservant les `source_id`.
2. Ne pas convertir les données en constantes Swift/TypeScript dispersées.
3. Créer un moteur de règles générique.
4. Créer des migrations versionnées.
5. Lancer les fixtures ci-dessus.
6. Exposer les règles dans Plaquisto Admin.
7. Permettre de masquer/activer chaque configuration.
8. Préserver les anciens calculs par snapshot de release.
9. Ne jamais modifier une valeur source sans créer une nouvelle version.
10. Afficher la provenance d'une quantité dans le détail de calcul.
