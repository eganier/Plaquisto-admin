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

## Développement

```bash
pnpm install
pnpm dev
```

L'application est ensuite disponible sur `http://localhost:3000`.
