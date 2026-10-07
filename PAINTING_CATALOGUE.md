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

## Unités et calcul

- Enduit, par passe : surface nette × pourcentage/100 × épaisseur en mm ×
  consommation en kg/m²/mm. Les pourcentages sont indépendants (pas de somme à 100 %).
- Peinture : surface nette × nombre de couches / rendement en **m²/L**.
- Airless : multiplier uniquement les peintures par `1 + airlessPercent/100` (1,05).
- Réserve : multiplier tous les consommables par `1 + reservePercent/100` (1,10).
- Au total, peinture Airless = base × 1,155, pas 1,15 et pas 1,21.
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
