import type {ReferenceRecord} from "./plaquisto-data";

/** Administrator-supplied table. Dimensions and inclusive ranges are in mm.
 * Prices intentionally remain unset and are managed separately in Tarifs HT.
 */
export const galvanizedHangerRecords: ReferenceRecord[] = [
  [80, 20, 60, 20, 70], [180, 61, 150, 71, 170], [240, 151, 210, 171, 230],
  [300, 211, 270, 231, 290], [400, 271, 370, 291, 390],
  [500, 371, 470, 391, 490], [600, 471, 570, 491, 590],
].map(([length, minimum, maximum, hourdisMin, hourdisMax]) => ({
  id: `QTY-SUSPENTE-GALVA-${length}`,
  kind: "quantity_item",
  title: `Suspentes acier galvanisées ${length} mm`,
  summary: `Longueur ${length} mm · bois : ${minimum}–${maximum} mm · hourdis : ${hourdisMin}–${hourdisMax} mm`,
  sourcePage: 0,
  status: "Publié",
  data: {category: "galvanized_hanger", schema_version: 1, unit: "unité",
    length_mm: length, plenum_min_mm: minimum, plenum_max_mm: maximum,
    hourdis_plenum_min_mm: hourdisMin, hourdis_plenum_max_mm: hourdisMax},
}));

export function validGalvanizedHanger(data: Record<string, unknown>): boolean {
  const {length_mm: length} = data;
  return data.category === "galvanized_hanger" && data.unit === "unité"
    && typeof length === "number" && Number.isInteger(length) && length > 0
    && ["", "hourdis_"].every(prefix => {
      const min = data[`${prefix}plenum_min_mm`], max = data[`${prefix}plenum_max_mm`];
      return typeof min === "number" && Number.isInteger(min) && min >= 0
        && typeof max === "number" && Number.isInteger(max) && max >= min && max <= length;
    });
}

export function hangerValidationError(record: ReferenceRecord, others: ReferenceRecord[]): string | null {
  if (record.data.category !== "galvanized_hanger") return null;
  if (!validGalvanizedHanger(record.data)) return "Suspente invalide : longueur et bornes de plénum en millimètres entiers, unité obligatoire : unité.";
  if (record.status === "Publié" && others.some(other => other.id !== record.id
      && other.status === "Publié" && other.data.category === "galvanized_hanger"
      && ["", "hourdis_"].some(prefix =>
        Number(other.data[`${prefix}plenum_min_mm`]) <= Number(record.data[`${prefix}plenum_max_mm`])
        && Number(other.data[`${prefix}plenum_max_mm`]) >= Number(record.data[`${prefix}plenum_min_mm`])))) {
    return "Cette plage de plénum chevauche celle d’une autre suspente publiée.";
  }
  return null;
}
