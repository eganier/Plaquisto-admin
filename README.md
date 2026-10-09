# Plaquisto Admin

Back-office du référentiel métier Plaquisto.

La base est organisée à partir des tableaux de calcul fournis par l’administrateur :

- isolation et poids maximal par épaisseur ;
- systèmes de fixation compatibles avec le support et le plénum ;
- composition de chaque système en une ou plusieurs fournitures ;
- coefficients quantitatifs par m² ;
- règles de calcul publiées pour l’application iOS.

Les données publiées sont exposées à l’application iOS par l’API
`/api/ios/catalogue`. Elles proviennent de Supabase et restent modifiables dans
Plaquisto Admin.

## Tarifs HT

La page `/tarifs` gère les prix séparément des coefficients techniques. Appliquer
la migration `20261009120000_supplier_prices.sql` lors de la mise en service.
Elle crée une table privée pour l’Admin et une vue publique limitée aux tarifs
validés en cours de validité. Elle n’importe aucun tarif. Aucun devis ni tarif
réel ne doit être ajouté à ce dépôt public. Les tests utilisent uniquement des
données fictives.

Le bouton « Importer un fichier JSON local » charge dans le navigateur un tableau
de tarifs au format `SupplierPrice`. Il crée de nouveaux brouillons proposés,
même si le fichier indique un statut validé. L’import ne transmet rien au serveur :
chaque ligne doit ensuite être vérifiée et enregistrée individuellement, puis
explicitement validée pour devenir utilisable dans iOS. Garder les fichiers
de tarifs privés hors du dépôt Git. Le fournisseur, sa référence et la source
sont requis ; les prix sont déjà normalisés dans l’unité de calcul.

L’API `GET /api/ios/prices` renvoie :

```json
{
  "version": "1.0",
  "revision": "sha256-du-contenu-public",
  "currency": "EUR",
  "lowerMultiplier": 0.95,
  "upperMultiplier": 1.05,
  "prices": []
}
```

Chaque prix comprend `id`, `referenceId`, `variantKey`, `label`, `unit`,
`unitPriceHT`, `repUnitHT`, `priceDate`, `validUntil`, `status` et `updatedAt`.
La provenance fournisseur reste privée, y compris via l’API REST Supabase.
Une indisponibilité renvoie HTTP 503 et ne doit pas remplacer un tarif manquant
par zéro. Le catalogue technique conserve son API et son format.

Le rapprochement utilise strictement `referenceId + variantKey + unit` : formats
de plaque `1200x2500`, isolants `lambda=0.032;thickness=100`, TTPC `standard`,
bande `papier`. La poudre offre `lent`, `rapide` et un tarif de référence
`standard` choisi explicitement dans l’Admin. Les fourrures et cornières proposent
aussi `standard` pour le tarif de référence des quantitatifs génériques. Aucun choix automatique du tarif
le moins cher. Zéro ou plusieurs correspondances actives signifie prix à
renseigner/choisir. Une plaque quantifiée en pièces doit être convertie en m²
avec ses dimensions exactes avant rapprochement.

Deux tarifs validés de même référence, variante et unité ne peuvent pas couvrir
la même date (bornes incluses). L’Admin affiche le conflit, l’API renvoie HTTP 409
et une contrainte SQL protège les écritures concurrentes. Pour remplacer un
tarif, terminer sa validité avant le début du nouveau ou le repasser en proposé,
puis enregistrer avant de valider le nouveau. Le libellé public provient toujours
du catalogue technique, jamais d’un texte libre envoyé avec le prix.

Le coût est `quantité × (prix HT + REP HT)`, sans arrondi au conditionnement ni
marge de chute supplémentaire. Appliquer les facteurs 0,95 et 1,05 une seule
fois au total pour afficher la fourchette. La REP inconnue reste `null` en
proposition ; la validation exige une valeur explicite, éventuellement zéro.
Les tarifs proposés, futurs ou expirés ne figurent pas dans le flux iOS.
Le client conserve le tarif, sa révision et la date avec l’estimation s’il veut
préserver un chiffrage historique.

## Développement

```bash
pnpm install
pnpm dev
```

L'application est ensuite disponible sur `http://localhost:3000`.
