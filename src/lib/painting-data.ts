import type { ReferenceRecord } from "./plaquisto-data";

export function validPaintingRules(data: Record<string, unknown>): boolean {
  const finite = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);
  const {schemaVersion, revision, reservePercent, airlessPercent, yieldMin, yieldMax, yieldDefault, compounds} = data;
  if (data.category !== "painting_rules" || schemaVersion !== 1 || typeof revision !== "string" || !revision.trim() ||
      !finite(reservePercent) || reservePercent < 0 || reservePercent > 100 ||
      !finite(airlessPercent) || airlessPercent < 0 || airlessPercent > 100 ||
      !finite(yieldMin) || !finite(yieldMax) || !finite(yieldDefault) ||
      yieldMin <= 0 || yieldMax <= yieldMin || yieldDefault < yieldMin || yieldDefault > yieldMax ||
      !Array.isArray(compounds) || !compounds.length) return false;
  const ids = new Set<string>();
  return compounds.every((value: unknown) => {
    if (!value || typeof value !== "object") return false;
    const c = value as Record<string, unknown>;
    if (typeof c.id !== "string" || !c.id.trim() || ids.has(c.id) || typeof c.name !== "string" || !c.name.trim() ||
        !finite(c.kgPerM2MM) || c.kgPerM2MM <= 0 || !finite(c.thicknessMin) || !finite(c.thicknessMax) || !finite(c.thicknessDefault) ||
        c.thicknessMin <= 0 || c.thicknessMax <= c.thicknessMin || c.thicknessDefault < c.thicknessMin || c.thicknessDefault > c.thicknessMax) return false;
    ids.add(c.id);
    return true;
  });
}

// Valeurs indicatives fournies pour Plaquisto, à adapter aux fiches produits.
// Consommations en kg/m²/mm ; rendements peinture en m²/L.
export const paintingRecords: ReferenceRecord[] = [
  {id:"WORK-PEINTURE-RATISSAGES",kind:"work",title:"Peinture et ratissages",summary:"Préparation par passe, impression et finition, avec réserve de consommables.",sourcePage:0,status:"Publié",data:{code:"peinture-ratissages",family:"Peinture et ratissages"}},
  {id:"RULE-PEINTURE-RATISSAGES",kind:"rule",title:"Peinture et ratissages · bases de calcul",summary:"Chaque passe possède son épaisseur et son pourcentage de surface. Réserve générale +10 %. Impression et finition indépendantes.",sourcePage:0,status:"Publié",data:{
    category:"painting_rules",schemaVersion:1,revision:"2026-10-07.2",
    reservePercent:10,airlessPercent:0,yieldMin:8,yieldMax:12,yieldDefault:10,
    compounds:[
      {id:"rebouchage-poudre",name:"Rebouchage · poudre",kgPerM2MM:1.15,thicknessMin:10,thicknessMax:50,thicknessDefault:10},
      {id:"rebouchage-pate",name:"Rebouchage · pâte",kgPerM2MM:1.5,thicknessMin:10,thicknessMax:50,thicknessDefault:10},
      {id:"charge-poudre",name:"Garnissant · poudre",kgPerM2MM:1.2,thicknessMin:1,thicknessMax:5,thicknessDefault:1},
      {id:"charge-pate",name:"Garnissant · pâte",kgPerM2MM:1.6,thicknessMin:1,thicknessMax:5,thicknessDefault:1},
      {id:"finition-poudre",name:"Finition · poudre",kgPerM2MM:0.4,thicknessMin:0.5,thicknessMax:1,thicknessDefault:1},
      {id:"finition-pate",name:"Finition · pâte",kgPerM2MM:1.15,thicknessMin:0.5,thicknessMax:1,thicknessDefault:1},
    ],
  }},
];
