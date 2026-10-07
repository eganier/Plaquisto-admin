import type {ReferenceRecord} from "./plaquisto-data";
import {paintingRecords, validPaintingRules} from "./painting-data";

const names: Record<string, string> = {
  "Bande PP grand rouleau": "Bande à joint",
  "Demi collier": "Demi-collier",
  "Vis TTPC 35 mm (2e parement)": "Vis TTPC 35",
  "Vis TRPF 13 · solidarisation des montants": "Vis TRPF 13",
  "Vis TRPF 13 · fixation des suspentes": "Vis TRPF 13",
  "Fourrure F45": "Fourrures F45/F47",
  "Vis TTPC 25 mm (1er parement)": "Vis TTPC 25",
  "Vis TTPC 25 ou 35": "Vis TTPC 25",
  "Enduit poudre collage, charge, finition": "Enduit à joints en poudre",
  "Enduit pâte prêt à l’emploi, collage, charge, finition": "Enduit à joints en pâte",
  "Enduit en poudre": "Enduit à joints en poudre",
  "Enduit en pâte": "Enduit à joints en pâte",
};

/** Targeted publication, also used before the authenticated database migration.
 * Keep custom coefficients, products, status and all unrelated fields intact.
 */
export function publishedRecord<T extends ReferenceRecord>(record: T): T {
  let title = record.title;
  let summary = record.summary;
  let data = record.data;
  if (record.kind === "quantity_item") {
    title = names[title] ?? title;
    const components = data.component_names;
    if (components && typeof components === "object" && !Array.isArray(components)) {
      const renamed = Object.fromEntries(Object.entries(components).map(([key, value]) =>
        [key, typeof value === "string" ? names[value] ?? value : value]));
      if (JSON.stringify(renamed) !== JSON.stringify(components)) data = {...data, component_names: renamed};
    }
  }
  if (record.id === "RULE-PLAFOND-RAILS-MONTANTS" && Array.isArray(data.supports)) {
    const supports = data.supports.map(support =>
      support && typeof support === "object" && support.fixing === "Demi collier"
        ? {...support, fixing: "Demi-collier"} : support);
    if (supports.some((support, index) => support !== (data.supports as unknown[])[index])) {
      data = {...data, supports};
    }
  }
  if (record.id === "RULE-PEINTURE-RATISSAGES" && data.revision === "2026-10-07" && validPaintingRules(data)) {
    const seed = paintingRecords.find(item => item.id === record.id)!;
    const defaults = seed.data.compounds as Record<string, unknown>[];
    const compounds = (data.compounds as Record<string, unknown>[]).map(compound => {
      const next = defaults.find(item => item.id === compound.id);
      return next ? {...compound, name: next.name, thicknessMin: next.thicknessMin,
        thicknessMax: next.thicknessMax, thicknessDefault: next.thicknessDefault} : compound;
    });
    data = {...data, revision: seed.data.revision, airlessPercent: 0, compounds};
    summary = seed.summary;
  }
  return title === record.title && summary === record.summary && data === record.data
    ? record : {...record, title, summary, data};
}
