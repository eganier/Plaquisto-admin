# Prompt Codex — Implémentation Plaquisto Admin
## Module Plafonds V1 : F530 + Autoportant

Tu travailles dans le dépôt existant du projet **Plaquisto**.

Ta mission est de **coder la partie Plaquisto Admin permettant de gérer le référentiel métier des plafonds F530 et des plafonds autoportants**, en utilisant comme sources fonctionnelles et techniques les deux fichiers Markdown suivants présents dans le projet / fournis avec cette demande :

1. `Plaquisto_Admin_Seed_Famille_01_Plafonds_F530_Autoportant_v1.0.md`
2. `Plaquisto_Admin_Seed_Famille_01_Plafonds_Autoportants_v1.0.md`

---

# 1. Règle de priorité entre les deux fichiers

Les deux fichiers se recoupent partiellement.

Applique cette règle :

- pour **F530**, utiliser principalement `Plaquisto_Admin_Seed_Famille_01_Plafonds_F530_Autoportant_v1.0.md` ;
- pour **Autoportant**, utiliser principalement `Plaquisto_Admin_Seed_Famille_01_Plafonds_Autoportants_v1.0.md` ;
- lorsque le second fichier contient une donnée Autoportant plus précise que le premier, **le second fichier est prioritaire** ;
- ne pas fusionner arbitrairement deux valeurs différentes ;
- conserver la provenance de chaque règle et de chaque donnée ;
- en cas de contradiction réelle non résolue par la hiérarchie ci-dessus, conserver les deux informations, désactiver la règle ambiguë si nécessaire et la marquer comme nécessitant validation Admin plutôt que d'inventer une réponse.

Les fichiers source ne doivent pas être modifiés.

---

# 2. Objectif produit

Plaquisto Admin doit devenir le **back-office métier** permettant d'administrer les règles techniques utilisées par l'application Plaquisto.

Pour cette première implémentation, le périmètre est strictement limité à :

## Plafonds F530
- configurations ;
- supports ;
- suspentes ;
- entraxes ;
- parements ;
- isolants ;
- charges ;
- plénum ;
- quantitatifs ;
- composants ;
- règles Plaquisto ;
- performances feu/acoustique lorsqu'elles sont sourcées ;
- provenance des règles.

## Plafonds autoportants
- M48 ;
- M70 ;
- M90 ;
- M100 ;
- simple ;
- double dos à dos ;
- portée ;
- entraxe ;
- poids isolant ;
- entretoises ;
- rails ;
- TRPF ;
- parements ;
- quantitatifs ;
- feu/acoustique lorsqu'ils sont sourcés ;
- configurations fabricant exactes ;
- règles génériques ;
- provenance.

## Hors périmètre V1
Ne pas implémenter maintenant :

- Stil Prim ;
- Megastil ;
- Gyplat ;
- plafonds démontables ;
- systèmes décoratifs ;
- autres familles d'ouvrages ;
- règles non présentes dans les seeds.

Préparer cependant l'architecture pour que ces familles puissent être ajoutées plus tard sans refonte majeure.

---

# 3. Principe fondamental d'architecture

Les règles métier ne doivent **pas être codées en dur dans les écrans ou dans des `if` dispersés dans l'application**.

Le système doit être piloté par un référentiel administrable.

La structure doit permettre au minimum de gérer :

```text
Famille
  ↓
Système constructif
  ↓
Configuration
  ↓
Règles de compatibilité
  ↓
Règles de dimensionnement
  ↓
Composants
  ↓
Profils quantitatifs
  ↓
Sources
  ↓
Version publiée
```

Les noms de tables / modèles peuvent être adaptés à l'architecture déjà présente dans le dépôt, mais les concepts fonctionnels doivent être conservés.

---

# 4. Modèles métier à prévoir

Réutiliser les modèles déjà présents si leur fonction correspond.

Sinon créer les modèles nécessaires, par exemple :

```text
ConstructionFamily
ConstructionSystem
SystemConfiguration
ProductFamily
Product
TechnicalRule
CompatibilityRule
DimensioningRule
QuantitativeProfile
QuantitativeProfileLine
SourceReference
AdminParameter
CatalogRelease
ValidationTest
```

Pour Autoportant, prévoir les données spécifiques :

```text
studFamily
railFamily
studMode
spacingMm
maxSpanM
bracingRequired
insulationWeightBand
```

Pour F530 :

```text
supportType
suspensionFamily
furringSpacingMm
suspensionSpacing
plenumMin
plenumMax
adjustmentCapacity
insulationWeightBand
```

Ne pas créer deux moteurs totalement indépendants si une règle générique commune peut proprement les couvrir.

---

# 5. Provenance obligatoire

Chaque donnée métier importante doit pouvoir indiquer :

```text
sourceId
sourceType
validationStatus
rulePriority
```

Respecter les statuts définis dans les seeds, notamment :

```text
VERIFIED_OFFICIAL_PLACO_SOLUTION_PAGE
VERIFIED_OFFICIAL_PLACO_GUIDE
VERIFIED_OFFICIAL_PLACO
PLAQUISTO_VALIDATED_TRADE_RULE
PROVISIONAL_TRADE_RULE
SOURCE_DATA_ANOMALY
TO_VERIFY_IN_INTEGRALE
TO_VALIDATE_PRODUCT_DECISION
```

Prévoir également la priorité des règles.

Principe :

```text
solution fabricant exacte
    >
règle fabricant vérifiée
    >
guide fabricant
    >
règle métier Plaquisto
    >
règle provisoire
```

Une configuration exacte doit pouvoir écraser une règle générique **uniquement dans son domaine d'application**.

---

# 6. Import des deux seeds

Créer un mécanisme d'initialisation / seed **idempotent**.

Il doit être possible de relancer le seed sans dupliquer les données.

Les IDs présents dans les fichiers Markdown doivent autant que possible être conservés comme clés métier stables.

Exemples :

```text
CEILING_F530
CEILING_SELF_SUPPORTING

AUTO_GENERIC_M48_SINGLE_600
AUTO_GENERIC_M100_DOUBLE_600

QP_F530_050_SINGLE_13
QP_F530_060_DOUBLE_13
```

Si l'application utilise des UUID internes, conserver malgré tout ces IDs comme `code`, `slug` ou `externalKey`.

---

# 7. Plaquisto Admin — navigation

Créer une section :

```text
Référentiel métier
└── Plafonds
    ├── F530
    └── Autoportant
```

Pour chaque système, prévoir des onglets ou sections cohérentes :

```text
Configurations
Règles
Quantitatifs
Composants
Sources
Tests
Versions
```

L'interface doit rester exploitable par un administrateur métier qui n'est pas développeur.

---

# 8. Écran liste F530

Afficher les configurations F530 sous forme de tableau filtrable.

Colonnes utiles :

```text
Nom / code
Support
Parement
Nombre de peaux
Entraxe
Suspente
Poids isolant
Performance feu
Performance acoustique
Source
Statut
Visible dans Plaquisto
Actif pour calcul
```

Filtres :

```text
support
parement
entraxe
suspente
statut
source
visible / masqué
```

Action :

```text
Voir
Modifier
Dupliquer
Activer / désactiver
Afficher / masquer dans Plaquisto
```

Ne pas supprimer physiquement une configuration déjà utilisée dans un calcul.

---

# 9. Écran détail F530

Le détail d'une configuration doit présenter au minimum :

## Identification
- code ;
- nom ;
- système ;
- source ;
- statut.

## Support
- type de support ;
- type de fixation ;
- quantité éventuelle de fixation par suspente.

## Ossature
- F530 ;
- entraxe ;
- portée / espacement suspentes ;
- rail ;
- éclisse.

## Suspente
- famille ;
- plage de plénum ;
- capacité de réglage ;
- charge éventuelle.

## Parement
- nombre de couches ;
- plaque ;
- visserie par couche.

## Isolation
- épaisseur ;
- poids surfacique ;
- bande de poids autorisée.

## Performances
- feu ;
- acoustique ;
- uniquement lorsque sourcées.

## Quantitatif
Table lisible :

```text
Composant | unité | quantité / formule | source
```

## Provenance
Afficher clairement :

```text
Source
PIM ID si disponible
Statut de validation
Priorité
```

---

# 10. Écran Autoportant

Créer une vue particulièrement lisible pour la matrice de dimensionnement.

Afficher une matrice générique :

```text
             Simple        Double
M48
M70
M90
M100
```

avec les portées génériques.

Mais cette matrice n'est **pas** la source unique de vérité.

En dessous, afficher les configurations exactes fabricant.

Exemple :

```text
M100 double

Règle générique : 3,90 m

Configurations exactes :
- BA13 : 3,95 m
- Phonique BA13 : 3,85 m
- 2x BA13 : 3,75 m
```

La configuration exacte doit primer lors du calcul.

---

# 11. Autoportant — édition d'une configuration

Prévoir :

```text
Montant
Rail
Simple / double
Entraxe
Portée maximale
Entretoise requise
Parement
Nombre de peaux
Isolant
Poids isolant
TRPF
Fixation rails
Feu
Acoustique
Quantitatif
Source
```

Pour les montants doublés :

```text
TRPF13
espacement
1 ou 2 vis superposées selon configuration
```

Pour les montants simples :

```text
entretoise mi-portée obligatoire
```

---

# 12. Gestion des règles génériques et exactes

Le moteur Admin doit permettre de distinguer :

```text
GENERIC_RULE
EXACT_CONFIGURATION_RULE
PLAQUISTO_OVERLAY_RULE
```

Exemple Autoportant :

```text
Règle générique :
M48 simple = 2,10 m

Configuration exacte :
M48 simple BA13 SP00021949 = 1,85 m
```

Le calcul doit utiliser **1,85 m** lorsque cette configuration exacte est sélectionnée.

Créer un test automatique pour garantir ce comportement.

---

# 13. Gestion F530 — règle entraxe / poids isolant

Implémenter les règles des seeds sans les extrapoler au-delà de leur domaine.

Prévoir :

```text
< 6 kg/m²
6 à 10 kg/m²
10 à 15 kg/m²
```

et les entraxes associés lorsqu'ils sont définis.

Toute règle exacte de solution fabricant est prioritaire.

---

# 14. Overlay métier Plaquisto

Les règles métier Plaquisto doivent être identifiables comme telles dans Admin.

Exemples issus du seed F530 :

## Éclisses

Fallback Plaquisto :

```text
1 éclisse / 3 ml de F530
```

Seulement si aucun quantitatif exact fabricant applicable n'est disponible.

## Cornières périphériques

Question métier :

```text
Souhaitez-vous prévoir des cornières périphériques ?
```

Si non, appliquer le coefficient Plaquisto prévu dans le seed uniquement aux composants définis.

Le coefficient doit être éditable dans Admin.

## Tiges filetées

Le calcul doit pouvoir utiliser :

```text
nombre de suspentes
×
hauteur retenue du plénum
+
réserve de réglage administrable
```

Les valeurs Admin doivent être modifiables sans recompilation.

---

# 15. Gestion des anomalies de source

Le seed Autoportant contient notamment des nomenclatures Placo qui mentionnent une `Suspente MD Stil®` dans certaines fiches autoportantes.

Ne pas ignorer la donnée.

Ne pas l'ajouter automatiquement au calcul standard.

La conserver sous forme :

```text
SOURCE_DATA_ANOMALY
```

et afficher dans Admin une alerte du type :

```text
La nomenclature source contient une Suspente MD.
Cette ligne est conservée pour traçabilité mais n'est pas active dans
le calcul autoportant standard.
```

Il doit être possible de l'activer plus tard après validation métier.

---

# 16. Quantitatifs

Les quantitatifs doivent être stockés comme profils versionnables.

Exemple conceptuel :

```text
QuantitativeProfile
  id
  system
  conditions
  basis

QuantitativeProfileLine
  component
  quantity
  unit
  formula
  source
```

Les unités doivent être structurées :

```text
m²
ml
unité
kg
```

Ne pas stocker uniquement une chaîne de texte comme `"1.84 suspentes/m²"`.

---

# 17. Formules

Lorsqu'une quantité dépend de la géométrie, stocker une formule/règle plutôt qu'une fausse constante.

Exemples :

```text
rails = géométrie réelle
fixations rails = fonction longueur rails / entraxe
tiges filetées = nombre suspentes × hauteur retenue
barres commerciales = arrondi supérieur
```

Si une formule n'est pas suffisamment définie dans les seeds, ne pas l'inventer.

Créer la structure nécessaire mais laisser le statut `TO_VERIFY` / `RULE_MISSING`.

---

# 18. Sources

Créer un écran `Sources`.

Une source doit afficher :

```text
id
éditeur
titre
URL
PIM ID si applicable
type
statut
configurations liées
règles liées
```

Le but est de pouvoir comprendre plusieurs mois plus tard **pourquoi une valeur existe**.

---

# 19. Versioning du référentiel

Créer un système de release métier.

Exemple :

```text
Plaquisto Ceiling DB 1.0
```

Workflow recommandé :

```text
DRAFT
    ↓
TEST
    ↓
PUBLISHED
    ↓
SUPERSEDED
```

Une modification de règle publiée ne doit pas modifier rétroactivement les anciens calculs.

Prévoir une notion de snapshot / version du référentiel utilisée par un calcul validé.

---

# 20. Écran publication

Créer un écran permettant de voir :

```text
Version brouillon
Nombre de modifications
Nombre de configurations
Tests réussis
Tests échoués
Erreurs bloquantes
Avertissements
```

Puis :

```text
Publier la version
```

Bloquer la publication si les validations obligatoires définies dans les seeds échouent.

---

# 21. Tests métier

Importer et implémenter les fixtures présentes dans les deux fichiers Markdown.

Les tests doivent couvrir au minimum :

## F530
- configurations 400 / 500 / 600 ;
- simple peau ;
- double peau ;
- BA18S ;
- support béton avec tige/cavalier ;
- poids isolant ;
- priorité profil exact > profil générique ;
- règle éclisse fallback ;
- règle périphérie.

## Autoportant
- M48 ;
- M70 ;
- M90 ;
- M100 ;
- simple ;
- double ;
- limite exacte de portée ;
- poids isolant ;
- entraxe ;
- entretoises ;
- TRPF ;
- règle exacte > règle générique ;
- anomalie Suspente MD non ajoutée automatiquement.

Créer également quelques tests d'intégration Admin.

---

# 22. Écran Tests

Dans Plaquisto Admin, prévoir une vue simple :

```text
Tests métier
────────────────────────

✓ F530 bois BA13 500
✓ F530 double BA13 400
✓ Autoportant M48 double
✓ Autoportant M100 double
✓ Règle exacte > générique
✓ Suspente MD désactivée

XX / XX réussis
```

Afficher le détail en cas d'échec.

---

# 23. Audit des modifications

Une modification Admin doit conserver :

```text
date
ancienne valeur
nouvelle valeur
utilisateur/admin
source
version
```

Pour les règles critiques :

```text
portée
entraxe
charge
quantitatif
feu
acoustique
```

prévoir une traçabilité suffisante pour revenir à l'ancienne version.

---

# 24. Comportement de suppression

Ne jamais supprimer physiquement un élément déjà référencé par un calcul, une release ou une configuration.

Utiliser :

```text
ACTIVE
ARCHIVED
DISCONTINUED
```

ou le mécanisme équivalent déjà présent dans le projet.

---

# 25. UX

Le back-office doit rester simple.

Éviter :

- les gros formulaires illisibles ;
- les objets JSON bruts comme seule interface ;
- l'obligation d'éditer directement la base ;
- une interface purement développeur.

Préférer :

- tableaux ;
- filtres ;
- fiches ;
- badges de statut ;
- provenance visible ;
- édition structurée ;
- avertissements clairs.

Une vue JSON/debug peut exister en complément, pas comme interface principale.

---

# 26. Ne pas modifier l'application Plaquisto plus que nécessaire

Pour cette tâche, la priorité est **Plaquisto Admin + couche référentiel**.

Si le projet contient déjà un moteur Plaquisto consommant des règles locales :

- préparer une couche d'accès compatible avec le nouveau référentiel ;
- ne pas refaire entièrement l'app mobile ;
- ne pas casser les fonctionnalités existantes.

Si une petite adaptation est indispensable pour compiler ou tester, la faire proprement.

---

# 27. Base locale / API / architecture existante

Avant de coder :

1. inspecter l'architecture actuelle ;
2. identifier le framework Admin existant ;
3. identifier la base de données ;
4. identifier les migrations ;
5. identifier les conventions du dépôt ;
6. réutiliser l'existant.

Ne pas introduire une nouvelle stack uniquement pour cette fonctionnalité si ce n'est pas nécessaire.

---

# 28. Migrations

Créer des migrations propres et réversibles lorsque l'architecture le permet.

Le seed initial doit être séparé autant que possible de la structure des tables.

Objectif :

```text
migration structure
+
seed référentiel plafonds
```

afin de pouvoir mettre à jour les données sans réécrire la structure.

---

# 29. Import futur CSV / XLSX

Il n'est pas nécessaire de construire tout l'import Excel maintenant si cela agrandit fortement le scope.

En revanche, concevoir les modèles pour permettre plus tard :

```text
import
prévisualisation
mapping
validation
rapport d'erreurs
confirmation
```

Ne pas créer une structure de données qui rendrait cet import difficile.

---

# 30. Critères de réussite

La tâche est considérée comme réussie lorsque :

1. les deux fichiers seed sont réellement importés ;
2. les données F530 apparaissent dans Admin ;
3. les données Autoportant apparaissent dans Admin ;
4. une configuration peut être consultée ;
5. une règle peut être modifiée ;
6. une configuration peut être masquée de Plaquisto ;
7. la provenance reste visible ;
8. les règles exactes sont prioritaires sur les règles génériques ;
9. les tests métier passent ;
10. une release de référentiel peut être créée/publiée ;
11. aucune valeur technique inconnue n'a été inventée ;
12. Stil Prim / Megastil / Gyplat ne sont pas implémentés.

---

# 31. Contrôle spécifique avant de terminer

Vérifier impérativement :

```text
F530
✓ quantitatifs exacts conservés
✓ fallback éclisses distinct
✓ suspentes / supports structurés
✓ entraxes structurés
✓ règles Plaquisto identifiées comme telles

Autoportant
✓ M48/M70/M90/M100
✓ simple/double
✓ portées génériques
✓ portées exactes
✓ exact > générique
✓ entretoises simples
✓ TRPF doubles
✓ poids isolant / entraxe
✓ anomalie Suspente MD conservée mais non active
```

---

# 32. Livrable attendu de Codex

À la fin de l'implémentation, fournir un compte rendu concis comprenant :

```text
- architecture retenue ;
- migrations créées ;
- modèles créés/modifiés ;
- pages Admin créées ;
- routes/API créées ;
- seeds importés ;
- nombre de configurations F530 importées ;
- nombre de configurations Autoportant importées ;
- tests ajoutés ;
- résultats des tests ;
- éventuels TO_VERIFY restant ;
- fichiers modifiés ;
- instructions pour lancer Plaquisto Admin et tester la fonctionnalité.
```

Ne pas déclarer une donnée "validée" si le seed la marque `TO_VERIFY`, `SOURCE_DATA_ANOMALY` ou équivalent.

---

# 33. Ordre d'exécution recommandé

Procéder dans cet ordre :

```text
1. Audit rapide du dépôt
2. Modèles / migrations
3. Import des sources
4. Import F530
5. Import Autoportant
6. Moteur de priorité des règles
7. API / couche service
8. UI Admin F530
9. UI Admin Autoportant
10. Sources
11. Tests
12. Releases / publication
13. Vérification complète
```

Ne pas commencer Stil Prim, Megastil ou Gyplat.

---

# 34. Instruction finale

Les deux fichiers Markdown fournis constituent la **source fonctionnelle du module Plafonds Admin V1**.

Ils doivent être lus en entier avant d'implémenter.

Ne pas seulement créer les modèles : **charger réellement les données décrites dans les seeds et les rendre consultables dans Plaquisto Admin**.

En cas de valeur absente ou ambiguë :

```text
NE PAS INVENTER
NE PAS APPROXIMER SILENCIEUSEMENT
CONSERVER LA PROVENANCE
MARQUER LA DONNÉE À VÉRIFIER
```

Le résultat attendu est une première version réellement utilisable du **cerveau métier Plafonds de Plaquisto Admin**, limitée à F530 + Autoportant.
