# Peinture et ratissages — contrat iOS

## Publication

Les deux fiches `WORK-PEINTURE-RATISSAGES` et `RULE-PEINTURE-RATISSAGES`
sont définies dans `src/lib/painting-data.ts`. Après déploiement Admin, son
chargement authentifié habituel crée les fiches manquantes en base Supabase,
sans écraser les coefficients déjà modifiés. La famille apparaît dans Ouvrages ;
les coefficients sont modifiables dans Règles de calcul.

Le catalogue public `/api/ios/catalogue` expose `peintureRatissages.regles.data`.
Comme les autres familles existantes, le catalogue se replie sur la fiche publiée
du seed si aucune règle publiée n’est trouvée en base. Aucun déploiement ni aucune
écriture sur la base de production ne sont effectués par les tests locaux.

Publication du 7 octobre, révision `2026-10-07.2` : les anciennes règles peinture
et les libellés de fournitures approuvés sont mis à niveau par une transformation
ciblée commune au catalogue iOS et à Admin. Les coefficients personnalisés sont
conservés. Le catalogue public applique cette transformation sans écriture ;
l’ouverture authentifiée d’Admin la persiste en base avec contrôle de concurrence.
Les révisions futures et les libellés personnalisés ne sont pas remplacés.

## Unités et calcul

- Enduit, par passe : surface nette × pourcentage/100 × épaisseur en mm ×
  consommation en kg/m²/mm. Les pourcentages sont indépendants (pas de somme à 100 %).
- Peinture : surface nette × nombre de couches / rendement en **m²/L**.
- Airless retiré du nouveau formulaire (`airlessPercent: 0`, champ conservé pour compatibilité).
- Réserve : multiplier tous les consommables par `1 + reservePercent/100` (1,10).
- Impression et finition sont indépendantes, chacune avec un rendement de 8 à 12 m²/L par pas de 1.
- Rebouchage : 1–5 cm (10–50 mm dans le moteur), garnissant : 1–5 mm, finition : 0,5 ou 1 mm.
- Les passes sont ajoutées progressivement dans une même étape, sans nombre prédéfini.
- Agréger les quantités brutes avant l’arrondi d’affichage. Pas d’arrondi en sacs/pots
  sans connaissance du conditionnement du produit.

Les six consommations sont les moyennes du tableau fourni par l’utilisateur :
rebouchage poudre/pâte 1,15/1,5 ; charge poudre/pâte 1,2/1,6 ; finition poudre/pâte
0,4/1,15. Ce sont des hypothèses indicatives, pas des rendements certifiés universels.

## Sauvegarde iOS

L’identifiant historique `peinture-beta` est conservé, les libellés deviennent
« Peinture et ratissages ». Les anciennes sauvegardes de surface restent lisibles.
Les nouvelles sauvegardes contiennent les réglages par passe, les peintures et
une copie des règles utilisées. Les changements Admin ne recalculent donc pas
silencieusement les ouvrages existants. Les noms/rendements personnels restent
sur l’appareil et ne sont pas envoyés au catalogue Admin. Les teintes restent dans
l’ouvrage. Les bases sont mises en cache après téléchargement valide ; sans base
disponible, iOS bloque le nouveau formulaire avec une action Réessayer.

## Vérifications

`src/lib/painting-data.test.ts` vérifie les coefficients et le contrat ; PATCH/PUT
refusent les règles peinture incohérentes. Les tests Swift couvrent calculs,
réserve/Airless, passes partielles, cache, sauvegarde et quantitatif projet.
