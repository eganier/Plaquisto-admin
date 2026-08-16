# Plaquisto Admin — Seed métier exploitable Codex
## Famille 01 — Plafonds V1
## Système : plafonds autoportants sur rails et montants

**Version du seed : 1.0**  
**Date : 16 août 2026**  
**Cible : Plaquisto Admin + moteur de calcul Plaquisto**  
**Périmètre : plafonds autoportants sur rails/montants Stil® M48, M70, M90, M100 ; simple/double ; parements courants et techniques ; règles de portée ; quantitatifs ; feu/acoustique lorsque sourcés.**  
**Hors périmètre : plafonds suspendus sur montants, Stil Prim, Megastil, Gyplat, plafonds démontables.**

---

# 0. Finalité du fichier

Ce fichier est un **seed métier**, et non une note de conception.

Codex doit pouvoir le transformer en :

- migrations de données ;
- tables de référentiel ;
- règles de compatibilité ;
- règles de dimensionnement ;
- profils quantitatifs ;
- configurations fabricant ;
- fixtures de tests.

Le moteur ne doit pas dépendre de constantes dispersées dans le code.

---

# 1. Principes de fiabilité des données

## 1.1 Priorité des sources

```yaml
RULE_PRIORITY:
  100: EXACT_VERIFIED_PLACO_SOLUTION_PAGE
  90: VERIFIED_PLACO_TECHNICAL_RULE
  80: VERIFIED_PLACO_GUIDE_RULE
  60: PLAQUISTO_VALIDATED_TRADE_RULE
  40: PROVISIONAL_TRADE_RULE
  10: TO_VERIFY_RULE
```

Lorsqu'une page solution Placo exacte contredit ou affine un tableau générique, **la solution exacte est prioritaire pour cette configuration uniquement**.

## 1.2 Statuts

```yaml
VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
VERIFIED_OFFICIAL_PLACO_GUIDE
VERIFIED_OFFICIAL_PLACO
PLAQUISTO_VALIDATED_TRADE_RULE
SOURCE_DATA_ANOMALY
TO_VERIFY_IN_INTEGRALE
TO_VALIDATE_PRODUCT_DECISION
DEPRECATED
```

## 1.3 Interdiction d'inventer

Codex ne doit jamais déduire :

- une portée non publiée ;
- un classement feu ;
- une performance acoustique ;
- un nombre de fixations ;
- un ratio de rails ;
- une longueur de vis ;
- une compatibilité de parement ;

si aucune règle source n'existe.

Le moteur doit retourner `RULE_MISSING` ou une configuration générique explicitement marquée comme telle.

---

# 2. Registre des sources principales

## SRC_AUTO_GUIDE_PLACO

```yaml
id: SRC_AUTO_GUIDE_PLACO
publisher: Placo
title: "Pose plafond autoportant sur ossature rails et montants"
type: OFFICIAL_WEB_GUIDE
url: https://www.placo.fr/comment-creer-un-plafond-autoportant-sur-ossature-rails-et-montants-stil
validation_status: VERIFIED_OFFICIAL_PLACO_GUIDE
```

Données utilisées :

- tableau M48/M70/M90/M100 ;
- simple/double ;
- entraxe 60 cm ;
- entretoises montants simples ;
- quantitatif générique au m² ;
- longueur de vis > épaisseur plaque + 10 mm.

## SRC_AUTO_CHOICE_PLACO

```yaml
id: SRC_AUTO_CHOICE_PLACO
publisher: Placo
title: "Quel type de faux-plafond installer ?"
type: OFFICIAL_WEB_GUIDE
url: https://www.placo.fr/quel-type-de-faux-plafond-installer
validation_status: VERIFIED_OFFICIAL_PLACO
```

Données utilisées :

- portées génériques ;
- poids isolant ≤6 kg/m² ;
- entraxe 50 cm pour 6–10 kg/m² ;
- entraxe 40 cm pour 10–15 kg/m² ;
- bonus de portée +5 % à 50 cm et +10 % à 40 cm lorsque isolant ≤6 kg/m².

---

# 3. Registre des pages solutions vérifiées

```yaml
sources:

  - id: SRC_SP00021949
    pim_id: SP00021949
    title: "Autoportant M48 simple BA13 0.60 - portée 1.85 - béton/poutrelle/hourdis"
    validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

  - id: SRC_SP00021923
    pim_id: SP00021923
    title: "Autoportant M48 simple Placo Phonique BA13 0.60 - portée 1.75"
    validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

  - id: SRC_SP00036190
    pim_id: SP00036190
    title: "Autoportant M48 double Infinaé 13 0.60 - portée 2.20 - REI30"
    validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

  - id: SRC_SP00015376
    pim_id: SP00015376
    title: "Autoportant M48 double Phonique BA13 0.60 - portée 2.10"
    validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

  - id: SRC_SP00022016
    pim_id: SP00022016
    title: "Autoportant M48 double 2x BA13 0.60 - portée 2.10 - charpente métallique"
    validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

  - id: SRC_SP00021908
    pim_id: SP00021908
    title: "Autoportant M48 double Phonique BA13 0.60 - portée 2.10 - plancher bois - 52 dB"
    validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

  - id: SRC_SP00021942
    pim_id: SP00021942
    title: "Autoportant M48 double BA13 0.60 - portée 2.10 - plancher bois - 48 dB"
    validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

  - id: SRC_SP00021968
    pim_id: SP00021968
    title: "Autoportant M48 double BA18 0.60 - portée 2.05"
    validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

  - id: SRC_SP00022033
    pim_id: SP00022033
    title: "Autoportant M48 double 2x BA25 0.50 - portée 1.90 - REI120"
    validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

  - id: SRC_SP00035954
    pim_id: SP00035954
    title: "Autoportant M48 double 2x Infinaé 18S 0.60 - portée 1.80 - REI60"
    validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

  - id: SRC_SP00003068
    pim_id: SP00003068
    title: "Autoportant M70 simple BA13 0.60 - portée 2.55 - béton/poutrelle/hourdis"
    validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

  - id: SRC_SP00022070
    pim_id: SP00022070
    title: "Autoportant M70 simple BA13 0.60 - portée 2.55 - charpente métallique"
    validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

  - id: SRC_SP00022071
    pim_id: SP00022071
    title: "Autoportant M70 simple BA13 0.60 - portée 2.45 - charpente métallique"
    validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

  - id: SRC_SP00036609
    pim_id: SP00036609
    title: "Autoportant M70 simple Multiconforts 0.60 - portée 2.45"
    validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

  - id: SRC_SP00015410
    pim_id: SP00015410
    title: "Autoportant M70 double BA13 0.60 - portée 3.00 - REI30"
    validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

  - id: SRC_SP00022134
    pim_id: SP00022134
    title: "Autoportant M70 simple 2x BA13 0.60 - portée 2.25"
    validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

  - id: SRC_SP00022201
    pim_id: SP00022201
    title: "Autoportant M90 simple BA13 0.60 - portée 3.10 - charpente métallique"
    validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

  - id: SRC_SP00022204
    pim_id: SP00022204
    title: "Autoportant M90 double BA13 0.60 - portée 3.80 - charpente métallique"
    validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

  - id: SRC_SP00015426
    pim_id: SP00015426
    title: "Autoportant M90 double BA13 0.60 - portée 3.65 - REI30"
    validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

  - id: SRC_SP00036755
    pim_id: SP00036755
    title: "Autoportant M90 double 2x Multiconforts 0.60 - portée 3.10 - REI30"
    validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

  - id: SRC_SP00021660
    pim_id: SP00021660
    title: "Autoportant M100 simple BA13 0.60 - portée 3.20"
    validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

  - id: SRC_SP00021661
    pim_id: SP00021661
    title: "Autoportant M100 simple BA13 0.60 - portée 3.05"
    validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

  - id: SRC_SP00021663
    pim_id: SP00021663
    title: "Autoportant M100 double BA13 0.60 - portée 3.95"
    validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

  - id: SRC_SP00021642
    pim_id: SP00021642
    title: "Autoportant M100 double Phonique BA13 0.60 - portée 3.85"
    validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE

  - id: SRC_SP00021719
    pim_id: SP00021719
    title: "Autoportant M100 double 2x BA13 0.60 - portée 3.75 - charpente métallique"
    validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

---

# 4. Modèle de données

## 4.1 ConstructionSystem

```yaml
id: CEILING_SELF_SUPPORTING
family_id: CEILING
generic_name: "Plafond autoportant rails / montants"
commercial_reference_label: "Rails et montants Stil"
system_kind: SELF_SUPPORTING_STUD
visible_in_admin: true
visible_in_app: true
enabled_for_calculation: true
source_id: SRC_AUTO_GUIDE_PLACO
```

## 4.2 AutoportantConfiguration

```yaml
AutoportantConfiguration:
  id:
  system_id:
  pim_id:
  context_floor_type:
  wall_support_type:
  stud_family:
  rail_family:
  stud_mode:
  spacing_mm:
  max_span_m:
  bracing_required:
  facing_layers:
  board_family:
  board_product:
  insulation_thickness_mm:
  insulation_weight_band:
  fire_rating:
  acoustic_rating:
  exact_quantitative_profile_id:
  source_id:
  validation_status:
  visible_in_plaquisto:
```

## 4.3 Séparer le "support plancher" du support mécanique

Les pages solutions Placo utilisent un champ `Support (plancher)`.

Pour un **autoportant**, cette donnée correspond surtout au contexte de performance du plancher existant. Le plafond est repris entre murs.

Ne jamais l'utiliser comme équivalent de `wall_support_type`.

```yaml
context_floor_type:
  - WOOD_FLOOR
  - CONCRETE_SLAB
  - CONCRETE_BEAM_HOURDIS
  - METAL_FRAME_CONTEXT
  - UNSPECIFIED

wall_support_type:
  - MASONRY
  - CONCRETE
  - TIMBER_WALL
  - OTHER
  - USER_TO_DEFINE
```

---

# 5. Entrées utilisateur Plaquisto V1

## 5.1 Entrées obligatoires

```yaml
surface_m2:
actual_span_between_supporting_walls_m:
facing:
insulation_product_or_none:
```

## 5.2 Important : portée réelle

Plaquisto ne doit **pas** demander longueur + largeur pour décider automatiquement du sens du plafond.

La donnée structurelle demandée est :

> Distance réelle entre les deux murs porteurs qui reprennent l'autoportant.

```yaml
input_id: ACTUAL_SUPPORTING_WALL_SPAN
type: DECIMAL_METERS
required: true
```

## 5.3 Sélection proposée

Le professionnel choisit son système. Plaquisto filtre les solutions compatibles.

Tri :

```yaml
sort_order:
  1: smallest_stud_width
  2: single_before_double_for_same_width
  3: lower_spacing_last_if_not_required
```

Toutes les configurations compatibles restent visibles.

---

# 6. Dictionnaires

## StudFamily

```yaml
M48
M70
M90
M100
```

## RailFamily

```yaml
R48
R70
R90
R100
```

## StudMode

```yaml
SINGLE
DOUBLE_BACK_TO_BACK
```

## BoardFamily

```yaml
STANDARD_BA13
PHONIC_BA13
HYDRO_BA13
INFINAE13
MULTICONFORTS
BA18
BA18S
INFINAE18S
BA25
FIRE_BOARD_OTHER
OTHER
```

## InsulationWeightBand

```yaml
LT_6
FROM_6_TO_10
FROM_10_TO_15
GT_15
UNKNOWN
```

---

# 7. Tableau générique Placo — portées de base

Source : guide Placo "Quel type de faux-plafond installer ?".

Entraxe : 600 mm.  
Poids isolant : ≤6 kg/m².

```yaml
generic_span_rules:

  - id: AUTO_GENERIC_M48_SINGLE_600
    stud_family: M48
    stud_mode: SINGLE
    spacing_mm: 600
    max_span_m: 2.10
    insulation_weight_max_kg_m2: 6
    bracing_required: true
    source_id: SRC_AUTO_CHOICE_PLACO
    priority: 80

  - id: AUTO_GENERIC_M48_DOUBLE_600
    stud_family: M48
    stud_mode: DOUBLE_BACK_TO_BACK
    spacing_mm: 600
    max_span_m: 2.50
    insulation_weight_max_kg_m2: 6
    bracing_required: false
    source_id: SRC_AUTO_CHOICE_PLACO
    priority: 80

  - id: AUTO_GENERIC_M70_SINGLE_600
    stud_family: M70
    stud_mode: SINGLE
    spacing_mm: 600
    max_span_m: 2.70
    insulation_weight_max_kg_m2: 6
    bracing_required: true
    source_id: SRC_AUTO_CHOICE_PLACO
    priority: 80

  - id: AUTO_GENERIC_M70_DOUBLE_600
    stud_family: M70
    stud_mode: DOUBLE_BACK_TO_BACK
    spacing_mm: 600
    max_span_m: 3.20
    insulation_weight_max_kg_m2: 6
    bracing_required: false
    source_id: SRC_AUTO_CHOICE_PLACO
    priority: 80

  - id: AUTO_GENERIC_M90_SINGLE_600
    stud_family: M90
    stud_mode: SINGLE
    spacing_mm: 600
    max_span_m: 3.15
    insulation_weight_max_kg_m2: 6
    bracing_required: true
    source_id: SRC_AUTO_CHOICE_PLACO
    priority: 80

  - id: AUTO_GENERIC_M90_DOUBLE_600
    stud_family: M90
    stud_mode: DOUBLE_BACK_TO_BACK
    spacing_mm: 600
    max_span_m: 3.70
    insulation_weight_max_kg_m2: 6
    bracing_required: false
    source_id: SRC_AUTO_CHOICE_PLACO
    priority: 80

  - id: AUTO_GENERIC_M100_SINGLE_600
    stud_family: M100
    stud_mode: SINGLE
    spacing_mm: 600
    max_span_m: 3.30
    insulation_weight_max_kg_m2: 6
    bracing_required: true
    source_id: SRC_AUTO_CHOICE_PLACO
    priority: 80

  - id: AUTO_GENERIC_M100_DOUBLE_600
    stud_family: M100
    stud_mode: DOUBLE_BACK_TO_BACK
    spacing_mm: 600
    max_span_m: 3.90
    insulation_weight_max_kg_m2: 6
    bracing_required: false
    source_id: SRC_AUTO_CHOICE_PLACO
    priority: 80
```

---

# 8. Règles génériques isolant / entraxe

```yaml
insulation_spacing_rules:

  - id: AUTO_INSULATION_LT6
    weight_min_kg_m2: 0
    weight_max_kg_m2: 6
    max_inclusive: true
    default_spacing_mm: 600
    source_id: SRC_AUTO_CHOICE_PLACO
    validation_status: VERIFIED_OFFICIAL_PLACO

  - id: AUTO_INSULATION_6_10
    weight_min_kg_m2: 6
    min_exclusive: true
    weight_max_kg_m2: 10
    max_inclusive: true
    required_spacing_mm: 500
    source_id: SRC_AUTO_CHOICE_PLACO
    validation_status: VERIFIED_OFFICIAL_PLACO

  - id: AUTO_INSULATION_10_15
    weight_min_kg_m2: 10
    min_exclusive: true
    weight_max_kg_m2: 15
    max_inclusive: true
    required_spacing_mm: 400
    source_id: SRC_AUTO_CHOICE_PLACO
    validation_status: VERIFIED_OFFICIAL_PLACO
```

## 8.1 Bonus de portée pour isolant ≤6 kg/m²

```yaml
span_modifiers:

  - id: AUTO_SPAN_MOD_500
    condition:
      insulation_weight_max_kg_m2: 6
      spacing_mm: 500
    multiplier: 1.05
    source_id: SRC_AUTO_CHOICE_PLACO

  - id: AUTO_SPAN_MOD_400
    condition:
      insulation_weight_max_kg_m2: 6
      spacing_mm: 400
    multiplier: 1.10
    source_id: SRC_AUTO_CHOICE_PLACO
```

## 8.2 Ne pas généraliser face aux pages solutions

Certaines pages solutions publiées affichent un entraxe 0,60 m avec une bande de poids isolant `6–10 kg/m²` ou `10–15 kg/m²`.

Ces enregistrements ne doivent **pas** être écrasés par la règle générique.

Principe :

```yaml
if exact_configuration_exists:
  use_exact_configuration
else:
  use_generic_weight_spacing_rule
```

---

# 9. Divergences guide / solutions exactes

Exemples :

```yaml
- item: M48_SINGLE
  generic_guide_span_m: 2.10
  exact_solution_examples:
    - 1.85
    - 1.75
  interpretation: >
    La portée dépend de la configuration complète. Le tableau générique
    n'est pas une licence pour imposer 2,10 m à tous les parements.

- item: M70_SINGLE
  generic_guide_span_m: 2.70
  exact_solution_examples:
    - 2.55
    - 2.45

- item: M100_DOUBLE
  generic_guide_span_m: 3.90
  exact_solution_examples:
    - 3.95
    - 3.85
    - 3.75
```

**Règle moteur : la portée exacte publiée pour le parement/configuration choisie prime.**

---

# 10. Règles de mise en œuvre communes

## 10.1 Entretoise montants simples

```yaml
- id: AUTO_SINGLE_BRACING
  stud_mode: SINGLE
  required: true
  position: MID_SPAN
  compatible_material:
    - MATCHING_RAIL
    - F530
  source_id: SRC_AUTO_GUIDE_PLACO
  validation_status: VERIFIED_OFFICIAL_PLACO_GUIDE
```

## 10.2 Montants doubles

```yaml
- id: AUTO_DOUBLE_STUD_CONNECTION_DEFAULT
  stud_mode: DOUBLE_BACK_TO_BACK
  component: TRPF13
  spacing_mm: 400
  source_basis: MULTIPLE_OFFICIAL_SOLUTION_PAGES
  validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

Attention : le nombre de vis superposées varie selon certaines solutions :

```yaml
variants:
  - one_TRPF13_every_400mm
  - two_superposed_TRPF13_every_400mm
```

Ne pas coder une variante unique globalement.

## 10.3 Liaison rail/montant

Pages simples :

```yaml
connection:
  allowed:
    - SCREWING
    - CRIMPING
```

Certaines solutions M90/M100 doubles prescrivent :

```yaml
connection:
  screw_family: TRPF25
  faces: UPPER_AND_LOWER_FLANGES
```

Cette règle doit être portée par la configuration exacte.

## 10.4 Fixation rail sur gros œuvre

Cas fréquent :

```yaml
rail_support_fixing:
  spacing_max_mm: 600
```

Certaines configurations demandent :

```yaml
fixings_per_station: 2
arrangement: SUPERPOSED
spacing_max_mm: 600
```

Le type de fixation dépend du support du mur et reste un choix produit séparé.

---

# 11. Quantitatif générique officiel

Source guide Placo, par 1 m², entraxe 60 cm, simple parement.

```yaml
id: QP_AUTO_GENERIC_060_SINGLE
basis: PER_1_M2
spacing_mm: 600
facing_layers: 1
quantities:
  board_m2: 1.05
  rail_ml: PROJECT_DEPENDENT
  stud_single_ml: 2.00
  stud_double_ml: 4.00
  ttpc_unit: 10
  joint_tape_ml: 1.40
  powder_compound_kg: 0.33
  ready_mix_compound_kg: 0.47
source_id: SRC_AUTO_GUIDE_PLACO
priority: 80
```

## 11.1 Règle de longueur de vis

```yaml
id: AUTO_GENERIC_BOARD_SCREW_LENGTH
formula: screw_length_mm > board_thickness_mm + 10
source_id: SRC_AUTO_GUIDE_PLACO
validation_status: VERIFIED_OFFICIAL_PLACO_GUIDE
```

---

# 12. Profils quantitatifs exacts issus de pages solutions

## 12.1 Profil simple M48/M70 à entraxe 0.60

Les pages M48 BA13 et M70 BA13 publiées partagent ce profil indicatif :

```yaml
id: QP_AUTO_SINGLE_060_PROFILE_A
basis: PER_1_M2
stud_mode: SINGLE
spacing_mm: 600

quantities:
  board_m2: 1.05
  stud_ml: 1.89
  rail_ml: 0.43
  ttpc25_unit: 15
  joint_tape_ml: 1.58
  placomix_ready_kg: 0.53
  placojoint_pr4_powder_kg: 0.37
  insulation_m2_if_present: 1.05

source_examples:
  - SP00021949
  - SP00022070
  - SP00022071

validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
priority: 100
```

### Anomalie source : Suspente MD

Ces pages listent également :

```yaml
suspente_MD_unit: 1.56
```

alors qu'elles sont nommées `autoportant`.

Ne pas intégrer cette ligne comme besoin automatique V1 sans clarification fabricant.

```yaml
source_anomaly:
  id: AUTO_SOLUTION_LISTS_MD_SUSPENSION
  component: SUSPENTE_MD_STIL
  active_in_quantitative_engine: false
  preserve_source_value: true
  validation_status: SOURCE_DATA_ANOMALY
```

## 12.2 Profil double M90/M100 à entraxe 0.60

Pages exactes M90/M100 double BA13 :

```yaml
id: QP_AUTO_DOUBLE_060_PROFILE_B
basis: PER_1_M2
stud_mode: DOUBLE_BACK_TO_BACK
spacing_mm: 600

quantities:
  board_m2_single_skin: 1.05
  stud_ml: 3.57
  rail_ml: 0.59
  ttpc25_unit: 15
  joint_tape_ml: 1.58
  placomix_ready_kg: 0.53
  placojoint_pr4_powder_kg: 0.37
  insulation_m2_if_present: 1.05

source_examples:
  - SP00021663
  - SP00015426

validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

Ces pages peuvent aussi afficher :

```yaml
suspente_MD_unit: 0.87
```

Même traitement :

```yaml
active_in_autoportant_engine: false
reason: SOURCE_DATA_ANOMALY_OR_SHARED_SOLUTION_BOM
```

---

# 13. Configuration exacte — M48 simple BA13

```yaml
id: CFG_AUTO_M48_SINGLE_BA13_060_SP00021949
system_id: CEILING_SELF_SUPPORTING
pim_id: SP00021949

context_floor_type:
  - CONCRETE_SLAB
  - CONCRETE_BEAM_HOURDIS

stud_family: M48
rail_family: R48
stud_mode: SINGLE
spacing_mm: 600
max_span_m: 1.85
bracing_required: true

facing:
  layers: 1
  board_family: STANDARD_BA13

insulation:
  thickness_mm: 100
  weight_band: LT_6

notes:
  rail_wall_fixing_spacing_max_mm: 600
  rail_stud_connection:
    - SCREWING
    - CRIMPING
  visible_skin_screw_spacing_mm: 300

quantitative_profile_id: QP_AUTO_SINGLE_060_PROFILE_A
source_id: SRC_SP00021949
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
visible_in_plaquisto: true
```

---

# 14. Configuration exacte — M48 simple Phonique

```yaml
id: CFG_AUTO_M48_SINGLE_PHONIC13_060_SP00021923
pim_id: SP00021923

stud_family: M48
rail_family: R48
stud_mode: SINGLE
spacing_mm: 600
max_span_m: 1.75
bracing_required: true

facing:
  layers: 1
  board_family: PHONIC_BA13

insulation:
  thickness_mm: 100
  published_weight_band: FROM_6_TO_10

source_id: SRC_SP00021923
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

---

# 15. Configuration exacte — M48 double Infinaé 13

```yaml
id: CFG_AUTO_M48_DOUBLE_INFINAE13_060_SP00036190
pim_id: SP00036190

context_floor_type:
  - CONCRETE_SLAB
  - CONCRETE_BEAM_HOURDIS

stud_family: M48
rail_family: R48
stud_mode: DOUBLE_BACK_TO_BACK
spacing_mm: 600
max_span_m: 2.20
bracing_required: false

facing:
  layers: 1
  board_family: INFINAE13

insulation:
  thickness_mm: 100
  published_weight_band: FROM_6_TO_10

fire:
  rating: REI30

source_id: SRC_SP00036190
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

---

# 16. Configuration exacte — M48 double Phonique

```yaml
id: CFG_AUTO_M48_DOUBLE_PHONIC13_060_SP00015376
pim_id: SP00015376

stud_family: M48
rail_family: R48
stud_mode: DOUBLE_BACK_TO_BACK
spacing_mm: 600
max_span_m: 2.10

facing:
  layers: 1
  board_family: PHONIC_BA13

insulation:
  thickness_mm: 100
  published_weight_band: FROM_10_TO_15

double_stud_connection:
  trpf13_every_mm: 400
  quantity_pattern: ONE

visible_skin_screw_spacing_mm: 150

source_id: SRC_SP00015376
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

---

# 17. Configuration exacte — M48 double 2x BA13

```yaml
id: CFG_AUTO_M48_DOUBLE_BA13_2L_060_SP00022016
pim_id: SP00022016

context_floor_type: METAL_FRAME_CONTEXT

stud_family: M48
rail_family: R48
stud_mode: DOUBLE_BACK_TO_BACK
spacing_mm: 600
max_span_m: 2.10

facing:
  layers: 2
  board_family: STANDARD_BA13

insulation:
  thickness_mm: 100
  published_weight_band: LT_6

fire:
  rating: R30
  reference: NF_EN_1995_1_2_NA_NOV_2022

double_stud_connection:
  trpf13_every_mm: 400
  quantity_pattern: ONE

source_id: SRC_SP00022016
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

---

# 18. Configuration exacte — M48 plancher bois BA13 48 dB

```yaml
id: CFG_AUTO_M48_DOUBLE_BA13_WOOD_060_SP00021942
pim_id: SP00021942

context_floor_type: WOOD_FLOOR

stud_family: M48
rail_family: R48
stud_mode: DOUBLE_BACK_TO_BACK
spacing_mm: 600
max_span_m: 2.10

facing:
  layers: 1
  board_family: STANDARD_BA13

insulation:
  thickness_mm: 100
  published_weight_band: FROM_10_TO_15

acoustic:
  RA_dB: 48
  applies_to_complete_floor_ceiling_solution: true

source_id: SRC_SP00021942
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

---

# 19. Configuration exacte — M48 plancher bois Phonique 52 dB

```yaml
id: CFG_AUTO_M48_DOUBLE_PHONIC_WOOD_060_SP00021908
pim_id: SP00021908

context_floor_type: WOOD_FLOOR

stud_family: M48
rail_family: R48
stud_mode: DOUBLE_BACK_TO_BACK
spacing_mm: 600
max_span_m: 2.10

facing:
  layers: 1
  board_family: PHONIC_BA13

insulation:
  thickness_mm: 100
  published_weight_band: FROM_6_TO_10

acoustic:
  RA_dB: 52
  applies_to_complete_floor_ceiling_solution: true

source_id: SRC_SP00021908
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

---

# 20. Configuration exacte — M48 double BA18

```yaml
id: CFG_AUTO_M48_DOUBLE_BA18_060_SP00021968
pim_id: SP00021968

context_floor_type: METAL_FRAME_CONTEXT

stud_family: M48
rail_family: R48
stud_mode: DOUBLE_BACK_TO_BACK
spacing_mm: 600
max_span_m: 2.05

facing:
  layers: 1
  board_family: BA18

insulation:
  thickness_mm: 100
  published_weight_band: FROM_6_TO_10

fire:
  rating: R30
  reference: NF_EN_1995_1_2_NA_NOV_2022

source_id: SRC_SP00021968
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

---

# 21. Configuration exacte — M48 double 2x BA25 REI120

```yaml
id: CFG_AUTO_M48_DOUBLE_BA25_2L_050_SP00022033
pim_id: SP00022033

context_floor_type:
  - CONCRETE_SLAB
  - CONCRETE_BEAM_HOURDIS

stud_family: M48
rail_family: R48
stud_mode: DOUBLE_BACK_TO_BACK
spacing_mm: 500
max_span_m: 1.90

facing:
  layers: 2
  board_family: BA25

insulation:
  thickness_mm: 100
  published_weight_band: LT_6

fire:
  rating: REI120
  pv: RS_21_008

membrane:
  possible: true
  note: "Se référer au PV pour le détail"

double_stud_connection:
  trpf13_every_mm: 400
  quantity_pattern: ONE

visible_skin_screw_spacing_mm: 150
inner_skin_screw_spacing_mm: 300

source_id: SRC_SP00022033
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

---

# 22. Configuration exacte — M48 double 2x Infinaé 18S REI60

```yaml
id: CFG_AUTO_M48_DOUBLE_INFINAE18S_2L_060_SP00035954
pim_id: SP00035954

context_floor_type: WOOD_FLOOR

stud_family: M48
rail_family: R48
stud_mode: DOUBLE_BACK_TO_BACK
spacing_mm: 600
max_span_m: 1.80

facing:
  layers: 2
  board_family: INFINAE18S

insulation:
  thickness_mm: 100
  published_weight_band: FROM_6_TO_10

fire:
  rating: REI60
  reference: NF_EN_1995_1_2_NA_NOV_2022

source_id: SRC_SP00035954
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

---

# 23. Configuration exacte — M70 simple BA13 2.55

```yaml
id: CFG_AUTO_M70_SINGLE_BA13_060_SP00003068
pim_id: SP00003068

context_floor_type:
  - CONCRETE_SLAB
  - CONCRETE_BEAM_HOURDIS

stud_family: M70
rail_family: R70
stud_mode: SINGLE
spacing_mm: 600
max_span_m: 2.55
bracing_required: true

facing:
  layers: 1
  board_family: STANDARD_BA13

insulation:
  thickness_mm: 100
  published_weight_band: LT_6

source_id: SRC_SP00003068
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

---

# 24. Configuration exacte — M70 simple BA13 charpente 2.55

```yaml
id: CFG_AUTO_M70_SINGLE_BA13_METAL_060_SP00022070
pim_id: SP00022070

context_floor_type: METAL_FRAME_CONTEXT

stud_family: M70
rail_family: R70
stud_mode: SINGLE
spacing_mm: 600
max_span_m: 2.55
bracing_required: true

facing:
  layers: 1
  board_family: STANDARD_BA13

quantitative_profile_id: QP_AUTO_SINGLE_060_PROFILE_A

source_id: SRC_SP00022070
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

---

# 25. Configuration exacte — M70 simple BA13 charpente 2.45

```yaml
id: CFG_AUTO_M70_SINGLE_BA13_METAL_060_SP00022071
pim_id: SP00022071

context_floor_type: METAL_FRAME_CONTEXT

stud_family: M70
rail_family: R70
stud_mode: SINGLE
spacing_mm: 600
max_span_m: 2.45
bracing_required: true

facing:
  layers: 1
  board_family: STANDARD_BA13

insulation:
  thickness_mm: 100
  published_weight_band: FROM_6_TO_10

fire:
  rating: R15
  reference: NF_EN_1995_1_2_NA_NOV_2022

quantitative_profile_id: QP_AUTO_SINGLE_060_PROFILE_A

source_id: SRC_SP00022071
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

---

# 26. Configuration exacte — M70 simple Multiconforts

```yaml
id: CFG_AUTO_M70_SINGLE_MULTICONFORTS_060_SP00036609
pim_id: SP00036609

context_floor_type:
  - CONCRETE_SLAB
  - CONCRETE_BEAM_HOURDIS

stud_family: M70
rail_family: R70
stud_mode: SINGLE
spacing_mm: 600
max_span_m: 2.45
bracing_required: true

facing:
  layers: 1
  board_family: MULTICONFORTS

insulation:
  thickness_mm: 100
  published_weight_band: LT_6

source_id: SRC_SP00036609
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

---

# 27. Configuration exacte — M70 double BA13 REI30

```yaml
id: CFG_AUTO_M70_DOUBLE_BA13_060_SP00015410
pim_id: SP00015410

context_floor_type:
  - CONCRETE_SLAB
  - CONCRETE_BEAM_HOURDIS

stud_family: M70
rail_family: R70
stud_mode: DOUBLE_BACK_TO_BACK
spacing_mm: 600
max_span_m: 3.00

facing:
  layers: 1
  board_family: STANDARD_BA13

insulation:
  thickness_mm: 100
  published_weight_band: FROM_6_TO_10

fire:
  rating: REI30
  evidence_type: ESTIMATION_PLACO

double_stud_connection:
  trpf13_every_mm: 400
  quantity_pattern: ONE

visible_skin_screw_spacing_mm: 150
inner_skin_screw_spacing_mm: 300

source_id: SRC_SP00015410
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

---

# 28. Configuration exacte — M70 simple 2x BA13

```yaml
id: CFG_AUTO_M70_SINGLE_BA13_2L_060_SP00022134
pim_id: SP00022134

context_floor_type: METAL_FRAME_CONTEXT

stud_family: M70
rail_family: R70
stud_mode: SINGLE
spacing_mm: 600
max_span_m: 2.25
bracing_required: true

facing:
  layers: 2
  board_family: STANDARD_BA13

insulation:
  thickness_mm: 100

exact_quantities:
  board_total_m2_per_m2: 2.10
  stud_ml_per_m2: 1.89
  rail_ml_per_m2: 0.43
  ttpc25_unit_per_m2: 3
  ttpc35_unit_per_m2: 15
  joint_tape_ml_per_m2: 1.58
  placomix_ready_kg_per_m2: 0.53
  placojoint_pr4_powder_kg_per_m2: 0.37
  insulation_m2_per_m2: 1.05

source_anomaly:
  suspente_MD_unit_per_m2: 1.56
  active_in_autoportant_engine: false

source_id: SRC_SP00022134
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

---

# 29. Configuration exacte — M90 simple BA13

```yaml
id: CFG_AUTO_M90_SINGLE_BA13_060_SP00022201
pim_id: SP00022201

context_floor_type: METAL_FRAME_CONTEXT

stud_family: M90
rail_family: R90
stud_mode: SINGLE
spacing_mm: 600
max_span_m: 3.10
bracing_required: true

facing:
  layers: 1
  board_family: STANDARD_BA13

insulation:
  thickness_mm: 100
  published_weight_band: LT_6

fire:
  rating: R15
  reference: NF_EN_1995_1_2_NA_NOV_2022

source_id: SRC_SP00022201
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

---

# 30. Configuration exacte — M90 double BA13 3.80

```yaml
id: CFG_AUTO_M90_DOUBLE_BA13_060_SP00022204
pim_id: SP00022204

context_floor_type: METAL_FRAME_CONTEXT

stud_family: M90
rail_family: R90
stud_mode: DOUBLE_BACK_TO_BACK
spacing_mm: 600
max_span_m: 3.80

facing:
  layers: 1
  board_family: STANDARD_BA13

insulation:
  thickness_mm: 100
  published_weight_band: LT_6

fire:
  rating: R15
  reference: NF_EN_1995_1_2_NA_NOV_2022

double_stud_connection:
  trpf13_every_mm: 400
  quantity_pattern: ONE

source_id: SRC_SP00022204
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

---

# 31. Configuration exacte — M90 double BA13 3.65 REI30

```yaml
id: CFG_AUTO_M90_DOUBLE_BA13_060_SP00015426
pim_id: SP00015426

context_floor_type:
  - CONCRETE_SLAB
  - CONCRETE_BEAM_HOURDIS

stud_family: M90
rail_family: R90
stud_mode: DOUBLE_BACK_TO_BACK
spacing_mm: 600
max_span_m: 3.65

facing:
  layers: 1
  board_family: STANDARD_BA13

insulation:
  thickness_mm: 100
  published_weight_band: FROM_6_TO_10

fire:
  rating: REI30
  evidence_type: ESTIMATION_PLACO

exact_quantities:
  board_m2_per_m2: 1.05
  stud_ml_per_m2: 3.57
  rail_ml_per_m2: 0.59
  ttpc25_unit_per_m2: 15
  joint_tape_ml_per_m2: 1.58
  placomix_hydro_kg_per_m2: 0.53
  placojoint_pr4_powder_kg_per_m2: 0.37
  insulation_m2_per_m2: 1.05

source_anomaly:
  suspente_MD_unit_per_m2: 0.87
  active_in_autoportant_engine: false

source_id: SRC_SP00015426
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

---

# 32. Configuration exacte — M90 double 2x Multiconforts

```yaml
id: CFG_AUTO_M90_DOUBLE_MULTICONFORTS_2L_060_SP00036755
pim_id: SP00036755

context_floor_type:
  - CONCRETE_SLAB
  - CONCRETE_BEAM_HOURDIS

stud_family: M90
rail_family: R90
stud_mode: DOUBLE_BACK_TO_BACK
spacing_mm: 600
max_span_m: 3.10

facing:
  layers: 2
  board_family: MULTICONFORTS

insulation:
  thickness_mm: 100
  published_weight_band: FROM_10_TO_15

fire:
  rating: REI30
  evidence_type: ESTIMATION_PLACO

double_stud_connection:
  trpf13_every_mm: 400
  quantity_pattern: ONE

source_id: SRC_SP00036755
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

---

# 33. Configuration exacte — M100 simple BA13 3.20

```yaml
id: CFG_AUTO_M100_SINGLE_BA13_060_SP00021660
pim_id: SP00021660

context_floor_type:
  - CONCRETE_SLAB
  - CONCRETE_BEAM_HOURDIS

stud_family: M100
rail_family: R100
stud_mode: SINGLE
spacing_mm: 600
max_span_m: 3.20
bracing_required: true

facing:
  layers: 1
  board_family: STANDARD_BA13

insulation:
  thickness_mm: 100
  published_weight_band: FROM_6_TO_10

rail_wall_fixing:
  fixings_per_station: 2
  arrangement: SUPERPOSED
  spacing_max_mm: 600

rail_stud_connection:
  screw_family: TRPF25

source_id: SRC_SP00021660
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

---

# 34. Configuration exacte — M100 simple BA13 3.05

```yaml
id: CFG_AUTO_M100_SINGLE_BA13_060_SP00021661
pim_id: SP00021661

context_floor_type:
  - CONCRETE_SLAB
  - CONCRETE_BEAM_HOURDIS

stud_family: M100
rail_family: R100
stud_mode: SINGLE
spacing_mm: 600
max_span_m: 3.05
bracing_required: true

facing:
  layers: 1
  board_family: STANDARD_BA13

insulation:
  thickness_mm: 100
  published_weight_band: FROM_10_TO_15

rail_wall_fixing:
  fixings_per_station: 2
  arrangement: SUPERPOSED
  spacing_max_mm: 600

rail_stud_connection:
  screw_family: TRPF25

source_id: SRC_SP00021661
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

---

# 35. Configuration exacte — M100 double BA13 3.95

```yaml
id: CFG_AUTO_M100_DOUBLE_BA13_060_SP00021663
pim_id: SP00021663

context_floor_type:
  - CONCRETE_SLAB
  - CONCRETE_BEAM_HOURDIS

stud_family: M100
rail_family: R100
stud_mode: DOUBLE_BACK_TO_BACK
spacing_mm: 600
max_span_m: 3.95

facing:
  layers: 1
  board_family: STANDARD_BA13

insulation:
  thickness_mm: 100
  published_weight_band: FROM_6_TO_10

rail_wall_fixing:
  fixings_per_station: 2
  arrangement: SUPERPOSED
  spacing_max_mm: 600

rail_stud_connection:
  screw_family: TRPF25

double_stud_connection:
  trpf13_every_mm: 400
  quantity_pattern: TWO_SUPERPOSED

exact_quantities:
  board_m2_per_m2: 1.05
  stud_ml_per_m2: 3.57
  rail_ml_per_m2: 0.59
  ttpc25_unit_per_m2: 15
  joint_tape_ml_per_m2: 1.58
  placomix_ready_kg_per_m2: 0.53
  placojoint_pr4_powder_kg_per_m2: 0.37
  insulation_m2_per_m2: 1.05

source_anomaly:
  suspente_MD_unit_per_m2: 0.87
  active_in_autoportant_engine: false

source_id: SRC_SP00021663
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

---

# 36. Configuration exacte — M100 double Phonique 3.85

```yaml
id: CFG_AUTO_M100_DOUBLE_PHONIC13_060_SP00021642
pim_id: SP00021642

context_floor_type:
  - CONCRETE_SLAB
  - CONCRETE_BEAM_HOURDIS

stud_family: M100
rail_family: R100
stud_mode: DOUBLE_BACK_TO_BACK
spacing_mm: 600
max_span_m: 3.85

facing:
  layers: 1
  board_family: PHONIC_BA13

insulation:
  thickness_mm: 100
  published_weight_band: FROM_6_TO_10

rail_wall_fixing:
  fixings_per_station: 2
  arrangement: SUPERPOSED
  spacing_max_mm: 600

rail_stud_connection:
  screw_family: TRPF25

double_stud_connection:
  trpf13_every_mm: 400
  quantity_pattern: TWO_SUPERPOSED

source_id: SRC_SP00021642
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

---

# 37. Configuration exacte — M100 double 2x BA13 3.75

```yaml
id: CFG_AUTO_M100_DOUBLE_BA13_2L_060_SP00021719
pim_id: SP00021719

context_floor_type: METAL_FRAME_CONTEXT

stud_family: M100
rail_family: R100
stud_mode: DOUBLE_BACK_TO_BACK
spacing_mm: 600
max_span_m: 3.75

facing:
  layers: 2
  board_family: STANDARD_BA13

insulation:
  thickness_mm: 100
  published_weight_band: LT_6

fire:
  rating: R30
  reference: NF_EN_1995_1_2_NA_NOV_2022

rail_wall_fixing:
  fixings_per_station: 2
  arrangement: SUPERPOSED
  spacing_max_mm: 600

rail_stud_connection:
  screw_family: TRPF25

double_stud_connection:
  trpf13_every_mm: 400
  quantity_pattern: TWO_SUPERPOSED

source_id: SRC_SP00021719
validation_status: VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
```

---

# 38. Parements multi-peaux — visserie

## 38.1 Règle source exacte

Les pages solutions distinguent :

```yaml
inner_skin_screw_spacing:
  common_value_mm: 600

visible_skin_screw_spacing:
  common_value_mm: 300
```

Certaines configurations feu renforcées publient :

```yaml
inner_skin_screw_spacing_mm: 300
visible_skin_screw_spacing_mm: 150
```

Ne pas appliquer 300/150 à toutes les configurations.

## 38.2 Quantité exacte exemple 2x BA13 M70 simple

Source SP00022134 :

```yaml
first_layer:
  TTPC25_unit_per_m2: 3

visible_layer:
  TTPC35_unit_per_m2: 15
```

Cette quantité exacte prime sur le default Plaquisto par couche.

---

# 39. Plaques techniques et portée

Le moteur ne doit pas seulement filtrer par M48/M70/M90/M100.

Il doit résoudre :

```text
stud + mode + spacing + board + layers + insulation + performance
```

Exemple :

```yaml
M48_DOUBLE:
  generic_span: 2.50
  exact_BA13_wood: 2.10
  exact_PHONIC13: 2.10
  exact_BA18: 2.05
  exact_2xBA25_REI120: 1.90
  exact_2xINFINAE18S_REI60: 1.80
```

---

# 40. Règle de sélection Plaquisto

Pseudo-code :

```text
INPUT
  surface
  actual_span
  facing
  insulation
  optional performance requirements

A. Build candidate configurations matching:
   - board family
   - number of layers
   - insulation band
   - optional fire/acoustic target

B. For each exact configuration:
   compatible if actual_span <= exact max_span.

C. If no exact published configuration exists:
   evaluate generic span table;
   apply generic spacing/load rules;
   flag result as GENERIC_GUIDE_MATCH.

D. Sort:
   1. smallest stud width
   2. single before double at same width
   3. 600 before 500 before 400 when all are technically valid

E. Show all compatible candidates.
F. Professional chooses final configuration.
```

Plaquisto ne choisit pas le montage à la place du professionnel.

---

# 41. Quantité de montants — architecture moteur

## Exact profiles

Lorsque `exact_quantities.stud_ml_per_m2` existe :

```yaml
technical_stud_ml = surface_m2 * exact_ratio
```

## Generic fallback

```yaml
single:
  ratio_ml_m2: 2.00

double:
  ratio_ml_m2: 4.00
```

Source : guide Placo.

---

# 42. Rails

Deux types de données coexistent :

## 42.1 Guide générique

```yaml
rail_quantity: PROJECT_DEPENDENT
```

## 42.2 Pages solutions

Ratios observés :

```yaml
single_M48_M70_examples:
  rail_ml_per_m2: 0.43

double_M90_M100_examples:
  rail_ml_per_m2: 0.59
```

Ne pas extrapoler 0.43/0.59 à toutes les portées sans profil exact.

---

# 43. Anomalie "Suspente MD" dans les nomenclatures autoportantes

Plusieurs pages Placo autoportantes publient des quantités de `Suspente MD Stil®`.

Exemples :

```yaml
single_examples:
  1.56 unit/m2

double_examples:
  0.87 unit/m2
```

Or les notes de mise en œuvre décrivent aussi une fixation des montants sur suspentes MD dans certaines configurations.

Cela peut correspondre à une variante technique/reprise, à une nomenclature partagée ou à une spécificité de certaines fiches.

**Décision seed V1 :**

```yaml
auto_import_source_component: true
active_in_standard_autoportant_calculation: false
status: SOURCE_DATA_ANOMALY
requires_admin_validation: true
```

Codex doit conserver l'information, mais ne pas ajouter automatiquement des suspentes à l'autoportant standard.

---

# 44. TRPF — calcul

## Montants doublés

```yaml
DoubleStudConnectionRule:
  spacing_mm: 400
  quantity_pattern:
    - ONE
    - TWO_SUPERPOSED
```

La variante est portée par la configuration.

## Calcul indicatif

```text
number_of_connection_stations_per_pair
= CEIL(span_mm / 400)
```

Puis :

```text
TRPF13_count
= connection_stations * quantity_per_station * number_of_double_stud_pairs
```

Ce calcul ne doit être utilisé que si la configuration ne fournit pas un profil plus précis.

---

# 45. Entretoises — montants simples

## Règle

```yaml
id: AUTO_BRACING_MIDSPAN
condition:
  stud_mode: SINGLE
required: true
lines: 1
position: MID_SPAN
material_options:
  - matching_rail
  - F530
source_id: SRC_AUTO_GUIDE_PLACO
```

## Quantitatif

Le guide ne fournit pas dans les extraits consultés un ratio universel `ml/m²`.

Donc :

```yaml
automatic_ratio: null
quantity_mode: GEOMETRY_DEPENDENT
status: TO_VALIDATE_PRODUCT_DECISION
```

Ne pas inventer un coefficient.

---

# 46. Fixations de rails sur murs

## Règle générale sourcée

```yaml
spacing_max_mm: 600
```

## Quantité

```text
fixing_stations = CEIL(total_rail_length / 0.60)
```

Puis :

```text
support_fixing_count = fixing_stations * fixings_per_station
```

`fixings_per_station` vaut 1 ou 2 selon configuration exacte.

Le **type** de cheville/vis dépend du support réel et doit venir du catalogue de compatibilité fixation/support.

---

# 47. Stock / conditionnements applicables

## Rails

Règle projet Plaquisto :

```yaml
commercial_length_default_m: 3.0
track_scrap_reuse: false
```

## Montants

Plaquisto :

```yaml
default_commercial_selection:
  choose_smallest_commercial_length_gte_required_length

allow_user_longer_length: true
stud_scrap_reuse: false
```

Pour l'autoportant, la longueur requise est liée à la portée réelle.

## Vis

Stock saisissable :

```yaml
unit:
  - BOX
  - UNIT
```

## Plaques

Stock :

```yaml
unit:
  - BOARD
  - SQUARE_METER
```

---

# 48. Arrondis

```yaml
rounding_rules:

  STUD_BAR_COUNT:
    method: CEIL

  RAIL_BAR_COUNT:
    method: CEIL

  FIXING_COUNT:
    method: CEIL

  SCREW_COUNT:
    method: CEIL

  BOARD_COUNT:
    method: CEIL_AFTER_PRODUCT_DIMENSION_CONVERSION

  JOINT_TAPE_ROLL:
    method: CEIL_AFTER_ROLL_LENGTH_CONVERSION

  COMPOUND_BAG:
    method: CEIL_AFTER_BAG_WEIGHT_CONVERSION
```

---

# 49. Feu — représentation

```yaml
FirePerformance:
  rating:
  evidence_type:
    - PV
    - NF_EN_REFERENCE
    - ESTIMATION_PLACO
  evidence_reference:
  configuration_id:
```

Exemples exacts présents dans ce seed :

```yaml
- M48 2x BA25: REI120
- M48 2x Infinaé18S: REI60
- M70 BA13 double: REI30
- M90 BA13 double: REI30
- M90 2x Multiconforts: REI30
```

Ne pas transposer ces classements à une autre ossature ou plaque.

---

# 50. Acoustique — représentation

```yaml
AcousticPerformance:
  RA_dB:
  context_floor_type:
  insulation:
  full_system_only: true
  source_id:
```

Exemples :

```yaml
CFG_AUTO_M48_DOUBLE_BA13_WOOD_060_SP00021942:
  RA_dB: 48

CFG_AUTO_M48_DOUBLE_PHONIC_WOOD_060_SP00021908:
  RA_dB: 52
```

Ces valeurs ne sont pas la performance "de la plaque".

---

# 51. ConfigurationState

```yaml
DRAFT
CALCULATED
VALIDATED
OUTDATED
```

À validation :

```yaml
snapshot:
  selected_configuration
  source_release
  span_rules
  quantitative_profile
  products
  stock_state
  prices
```

Une mise à jour Admin ne doit pas modifier rétroactivement un ouvrage validé.

---

# 52. Alertes métier

## Portée exacte dépassée

```yaml
severity: BLOCKING
message: >
  La portée renseignée dépasse la portée maximale publiée pour cette
  configuration de plafond autoportant.
```

## Configuration générique seulement

```yaml
severity: WARNING
message: >
  Aucune fiche fabricant exacte n'est actuellement chargée pour cette
  combinaison. Le résultat repose sur le tableau générique Placo.
```

## Donnée suspente MD source

```yaml
severity: INFO
admin_only: true
message: >
  La nomenclature de la fiche source contient une Suspente MD. Cette
  ligne est conservée pour traçabilité mais désactivée dans le calcul
  autoportant standard V1.
```

---

# 53. Tests Codex — génériques

```yaml
tests:

  - id: TEST_AUTO_GENERIC_M48_SINGLE
    input:
      span_m: 2.00
      insulation_weight_kg_m2: 5
      facing: GENERIC_SINGLE_BA13
    expected_candidates:
      includes:
        - M48_SINGLE

  - id: TEST_AUTO_GENERIC_M48_SINGLE_FAIL
    input:
      span_m: 2.20
      insulation_weight_kg_m2: 5
      facing: GENERIC_SINGLE_BA13
    expected:
      M48_SINGLE: incompatible

  - id: TEST_AUTO_GENERIC_M70_SINGLE
    input:
      span_m: 2.60
      insulation_weight_kg_m2: 5
    expected_candidates:
      includes:
        - M70_SINGLE

  - id: TEST_AUTO_GENERIC_M100_DOUBLE
    input:
      span_m: 3.90
      insulation_weight_kg_m2: 5
    expected_candidates:
      includes:
        - M100_DOUBLE
```

---

# 54. Tests isolant / entraxe

```yaml
- id: TEST_AUTO_WEIGHT_5
  input:
    insulation_weight_kg_m2: 5
  expected:
    generic_spacing_mm: 600

- id: TEST_AUTO_WEIGHT_8
  input:
    insulation_weight_kg_m2: 8
    no_exact_configuration: true
  expected:
    generic_spacing_mm: 500

- id: TEST_AUTO_WEIGHT_12
  input:
    insulation_weight_kg_m2: 12
    no_exact_configuration: true
  expected:
    generic_spacing_mm: 400

- id: TEST_AUTO_WEIGHT_16
  input:
    insulation_weight_kg_m2: 16
    no_exact_configuration: true
  expected:
    status: RULE_MISSING_OR_BLOCKING
```

---

# 55. Tests exacts M48

```yaml
- id: TEST_CFG_SP00021949_LIMIT
  configuration_id: CFG_AUTO_M48_SINGLE_BA13_060_SP00021949
  input:
    span_m: 1.85
  expected:
    compatible: true

- id: TEST_CFG_SP00021949_OVER
  configuration_id: CFG_AUTO_M48_SINGLE_BA13_060_SP00021949
  input:
    span_m: 1.86
  expected:
    compatible: false

- id: TEST_CFG_SP00022033_FIRE
  configuration_id: CFG_AUTO_M48_DOUBLE_BA25_2L_050_SP00022033
  expected:
    spacing_mm: 500
    max_span_m: 1.90
    fire_rating: REI120
```

---

# 56. Tests exacts M70

```yaml
- id: TEST_CFG_M70_BA13_SIMPLE
  configuration_id: CFG_AUTO_M70_SINGLE_BA13_060_SP00003068
  input:
    span_m: 2.55
  expected:
    compatible: true
    stud_family: M70
    stud_mode: SINGLE
    bracing_required: true

- id: TEST_CFG_M70_BA13_DOUBLE_REI30
  configuration_id: CFG_AUTO_M70_DOUBLE_BA13_060_SP00015410
  input:
    span_m: 3.00
  expected:
    compatible: true
    fire_rating: REI30
```

---

# 57. Tests exacts M90

```yaml
- id: TEST_CFG_M90_SIMPLE
  configuration_id: CFG_AUTO_M90_SINGLE_BA13_060_SP00022201
  input:
    span_m: 3.10
  expected:
    compatible: true
    bracing_required: true

- id: TEST_CFG_M90_DOUBLE
  configuration_id: CFG_AUTO_M90_DOUBLE_BA13_060_SP00022204
  input:
    span_m: 3.80
  expected:
    compatible: true
    stud_mode: DOUBLE_BACK_TO_BACK
```

---

# 58. Tests exacts M100

```yaml
- id: TEST_CFG_M100_DOUBLE_395
  configuration_id: CFG_AUTO_M100_DOUBLE_BA13_060_SP00021663
  input:
    span_m: 3.95
  expected:
    compatible: true
    stud_family: M100
    rail_family: R100
    stud_mode: DOUBLE_BACK_TO_BACK
    rail_fixings_per_station: 2
    trpf13_pattern: TWO_SUPERPOSED

- id: TEST_CFG_M100_PHONIC_385
  configuration_id: CFG_AUTO_M100_DOUBLE_PHONIC13_060_SP00021642
  input:
    span_m: 3.85
  expected:
    compatible: true
    board_family: PHONIC_BA13
```

---

# 59. Test de priorité exact > générique

```yaml
- id: TEST_EXACT_OVERRIDES_GENERIC
  input:
    selected_exact_configuration:
      CFG_AUTO_M48_SINGLE_BA13_060_SP00021949
    span_m: 2.00
  generic_rule:
    max_span_m: 2.10
  exact_rule:
    max_span_m: 1.85
  expected:
    compatible: false
    applied_priority: EXACT_VERIFIED_PLACO_SOLUTION_PAGE
```

C'est un test essentiel.

---

# 60. Test anomalie Suspente MD

```yaml
- id: TEST_MD_SUSPENSION_NOT_AUTO_ADDED
  input:
    configuration_id: CFG_AUTO_M48_SINGLE_BA13_060_SP00021949
    surface_m2: 100
  source_bom_contains:
    suspente_MD: 156
  expected_calculation:
    suspente_MD: 0
  expected_metadata:
    source_anomaly_preserved: true
```

---

# 61. Validation Admin obligatoire

Bloquer publication si :

```yaml
- exact_configuration_without_source_id
- max_span_without_source
- fire_rating_without_source
- acoustic_rating_without_context
- stud_mode_missing
- stud_family_missing
- exact_quantitative_profile_without_units
```

Avertir si :

```yaml
- source_bom_contains_suspension_on_autoportant
- exact_configuration_conflicts_with_generic_spacing_rule
- exact_page_published_weight_band_conflicts_with_generic_guide
- no_exact_quantitative_profile
```

---

# 62. Visibilité des configurations

```yaml
visible_in_plaquisto:
enabled_for_calculation:
experimental:
```

Recommandation V1 :

```yaml
generic_M48_M70_M90_M100:
  visible_in_plaquisto: true

exact_common_BA13:
  visible_in_plaquisto: true

exact_phonic:
  visible_in_plaquisto: true

exact_fire_BA25_or_special:
  visible_in_plaquisto: false
  reason: "À activer quand l'UX performance feu est finalisée"
```

Cette visibilité reste administrable.

---

# 63. Ce qui est exploitable immédiatement

## Mécanique générique

- M48 simple/double
- M70 simple/double
- M90 simple/double
- M100 simple/double
- entraxe 600 mm
- règle générique 500 / 400 selon poids
- bonus de portée 5 % / 10 % lorsque applicable
- entretoise à mi-portée sur simple
- TRPF sur doubles
- fixation des rails tous les 600 mm max

## Configurations exactes

Le seed contient des configurations exactes :

- BA13
- Phonique BA13
- BA18
- BA25
- Infinaé 13
- Infinaé 18S
- Multiconforts
- simple
- double
- 1 peau
- 2 peaux
- feu jusqu'à REI120 sur la configuration sourcée
- acoustique 48 / 52 dB sur les configurations plancher bois sourcées

---

# 64. Ce qui reste explicitement TO_VERIFY

```yaml
- totalité exhaustive des pages solutions Placo autoportantes non trouvées dans cette passe
- profils exacts 0.40 / 0.50 pour chaque combinaison de montant/parement
- quantité universelle d'entretoises par m2
- explication fabricant de la présence "Suspente MD Stil" dans certaines nomenclatures autoportantes
- quantités exactes TRPF par m2 pour toutes les configurations
- quantitatifs exacts de toutes les plaques techniques
- règles de membrane autres que les fiches exactes qui la mentionnent
```

Codex ne doit pas compléter ces cases par approximation.

---

# 65. Instruction finale Codex

1. Créer le système `CEILING_SELF_SUPPORTING`.
2. Importer le tableau générique M48/M70/M90/M100.
3. Importer les configurations exactes comme règles de priorité 100.
4. Séparer `context_floor_type` et `wall_support_type`.
5. Ne jamais écraser une portée exacte par la portée générique.
6. Ne pas activer automatiquement `Suspente MD` malgré sa présence dans certaines BOM source.
7. Implémenter entretoises pour montants simples.
8. Implémenter variante TRPF par configuration.
9. Conserver les sources et PIM IDs.
10. Implémenter les fixtures de ce document.
11. Rendre chaque configuration activable/masquable dans Plaquisto Admin.
12. Stocker les calculs validés par snapshot de release.
13. Ne pas implémenter Stil Prim, Megastil ou Gyplat en V1.
14. En cas de donnée absente, retourner `RULE_MISSING`, jamais une valeur inventée.
