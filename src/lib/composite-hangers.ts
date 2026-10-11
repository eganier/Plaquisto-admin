import type {ReferenceRecord} from "./plaquisto-data";

// Model names and inclusive plenum ranges supplied by the administrator.
// No physical length or price was supplied: neither is inferred from the name.
export const compositeHangerRecords: ReferenceRecord[] = (
  [["FERMETTE", "fermette", 20, 80], ["12-16", "12-16", 81, 160],
   ["16-20", "16-20", 161, 200], ["20-24", "20-24", 201, 240],
   ["24-28", "24-28", 241, 280]] as const
).map(([id, model, minimum, maximum]) => ({
  id: `QTY-SUSPENTE-COMPOSITE-${id}`, kind: "quantity_item",
  title: `Suspente composite pour pare-vapeur ${model}`,
  summary: `Modèle ${model} · support bois · plénum ${minimum}–${maximum} mm`,
  sourcePage: 0, status: "Publié",
  data: {category: "composite_hanger", schema_version: 1, unit: "unité", model,
    support: "Plancher bois horizontal", plenum_min_mm: minimum, plenum_max_mm: maximum},
}));

export function compositeHangerValidationError(record: ReferenceRecord, others: ReferenceRecord[]): string | null {
  if (record.data.category !== "composite_hanger") return null;
  const {model, unit, support, plenum_min_mm: min, plenum_max_mm: max} = record.data;
  if (typeof model !== "string" || !model.trim() || unit !== "unité" || support !== "Plancher bois horizontal"
      || typeof min !== "number" || !Number.isInteger(min) || min < 0
      || typeof max !== "number" || !Number.isInteger(max) || max < min) {
    return "Suspente composite invalide : modèle requis, support bois, unité et bornes de plénum en millimètres entiers.";
  }
  if (record.status === "Publié" && others.some(other => other.id !== record.id
      && other.status === "Publié" && other.data.category === "composite_hanger"
      && Number(other.data.plenum_min_mm) <= max && Number(other.data.plenum_max_mm) >= min)) {
    return "Cette plage de plénum chevauche celle d’une autre suspente composite publiée.";
  }
  return null;
}
