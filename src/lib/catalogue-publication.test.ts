import test from "node:test";
import assert from "node:assert/strict";
import {publishedRecord} from "./catalogue-publication";
import {paintingRecords} from "./painting-data";
import {plaquistoRecords} from "./plaquisto-data";

test("concrete fixing pair becomes two components without overwriting custom rules", () => {
  const seed = plaquistoRecords.find(r => r.id === "RULE-PLAFOND-RAILS-MONTANTS")!;
  const legacy = {...seed, data: {...seed.data, supports: (seed.data.supports as Record<string, unknown>[]).map(s => {
    const copy = {...s}; delete copy.fixing_components; return copy;
  })}};
  const migrated = publishedRecord(legacy);
  assert.deepEqual(migrated, seed);
  assert.equal(publishedRecord(migrated), migrated);
  const custom = {...seed, data: {...seed.data, supports: [{id: "concrete", fixing: "Cheville et piton",
    fixing_components: [{name: "Fixation spéciale", quantity: 2, unit: "unité"}]}]}};
  assert.equal(publishedRecord(custom), custom);
  assert.equal(legacy.data.supports.find(s => s.id === "concrete")?.fixing_components, undefined);
});

test("furring support aliases preserve coefficients and custom support references", () => {
  const seed = plaquistoRecords.find(r => r.id === "QTY-DOUBLAGE-LISSES-FOURRURES")!;
  const old = "Appuis intermédiaires pour doublage sur fourrure";
  for (const name of [old, `${old} — verticaux`, `${old} — horizontaux`, `${old} — embrasure`]) {
    const legacy = {...seed, data: {...seed.data, component_names: {
      ...(seed.data.component_names as Record<string, string>), supports: name}}};
    const result = publishedRecord(legacy);
    assert.deepEqual(result, seed);
    assert.equal(publishedRecord(result), result);
    assert.equal(legacy.data.component_names.supports, name);
  }
  const distinct = {...seed, data: {...seed.data, component_names: {supports: "Appuis pour montants"}}};
  assert.equal(publishedRecord(distinct), distinct);
});

test("simple and claw hangers publish the same name without changing fixing rules", () => {
  for (const id of ["FIX-HOURDIS-SEUL", "FIX-HOURDIS-GALVA"]) {
    const seed = plaquistoRecords.find(r => r.id === id)!;
    const legacy = {...seed, title: id === "FIX-HOURDIS-SEUL" ? "Suspente hourdis seule" : "Suspente hourdis et suspente galvanisée",
      data: {...seed.data, components: (seed.data.components as Record<string, unknown>[]).map(c =>
        c.name === "Suspentes hourdis simples" ? {...c, name: "Suspente hourdis"} : c)}};
    assert.deepEqual(publishedRecord(legacy), seed);
  }
  const rule = plaquistoRecords.find(r => r.id === "RULE-PLAFOND-RAILS-MONTANTS")!;
  const legacy = {...rule, data: {...rule.data, supports: (rule.data.supports as Record<string, unknown>[]).map(s =>
    s.id === "concrete_hollow_block" ? {...s, fixing: "Suspente hourdis à griffe"} : s)}};
  assert.deepEqual(publishedRecord(legacy), rule);
  const clamping = plaquistoRecords.find(r => r.id === "FIX-HOURDIS-GRIFFE-TIGE")!;
  assert.equal(publishedRecord(clamping), clamping);
});

test("ceiling angle is renamed without changing its coefficients", () => {
  const seed = plaquistoRecords.find(r => r.id === "QTY-CORNIERE")!;
  assert.deepEqual(publishedRecord({...seed, title: "Cornière d’angle"}), seed);
  const modular = {...seed, title: "Cornières de rive de 3,00 m"};
  assert.equal(publishedRecord(modular), modular);
});

test("clamping hangers are renamed but remain distinct from claw and plain hangers", () => {
  for (const id of ["FIX-HOURDIS-GRIFFE-GALVA", "FIX-HOURDIS-GRIFFE-TIGE"]) {
    const seed = plaquistoRecords.find(r => r.id === id)!;
    const legacy = {...seed, title: seed.title.replace("à serrer", "à griffe"), data: {...seed.data,
      components: (seed.data.components as Record<string, unknown>[]).map(c =>
        c.name === "Suspente hourdis à serrer" ? {...c, name: "Suspente hourdis à griffe à serrer"} : c)}};
    const result = publishedRecord(legacy);
    assert.deepEqual(result, seed);
    assert.equal(publishedRecord(result), result);
    assert.ok(legacy.data.components.some(c => c.name === "Suspente hourdis à griffe à serrer"));
  }
  for (const id of ["RULE-PLAFOND-RAILS-MONTANTS", "FIX-HOURDIS-SEUL", "FIX-HOURDIS-GALVA"]) {
    const record = plaquistoRecords.find(r => r.id === id)!;
    assert.equal(publishedRecord(record), record);
  }
});

test("half clamp spelling migration changes only the approved fixing name", () => {
  const seed = plaquistoRecords.find(r => r.id === "RULE-PLAFOND-RAILS-MONTANTS")!;
  const supports = (seed.data.supports as Record<string, unknown>[]).map(s =>
    s.id === "wood" ? {...s, fixing: "Demi collier"} : s);
  const legacy = {...seed, data: {...seed.data, supports}};
  const result = publishedRecord(legacy);
  assert.equal(result.data.supports.find(s => s.id === "wood")?.fixing, "Demi-collier");
  assert.deepEqual(result.data, seed.data);
  assert.equal(legacy.data.supports.find(s => s.id === "wood")?.fixing, "Demi collier");
  assert.equal(publishedRecord(result), result);
});

test("approved TRPF 13 aliases keep usage coefficients and TRPF 25 distinct", () => {
  const seed = plaquistoRecords.find(r => r.id === "QTY-PLAFOND-RAILS-MONTANTS")!;
  const legacy = {...seed, data: {...seed.data, component_names: {
    double_stud_screws: "Vis TRPF 13 · solidarisation des montants",
    suspension_screws: "Vis TRPF 13 · fixation des suspentes",
    rail_stud_screws: "Vis TRPF 25 · liaison rail/montant"
  }}};
  const result = publishedRecord(legacy);
  assert.deepEqual(result.data.component_names, {
    double_stud_screws: "Vis TRPF 13", suspension_screws: "Vis TRPF 13",
    rail_stud_screws: "Vis TRPF 25 · liaison rail/montant"
  });
  assert.deepEqual({...result.data, component_names: undefined}, {...seed.data, component_names: undefined});
  assert.equal(publishedRecord(result), result);
});

test("approved TTPC 35 alias keeps coefficients and other screw lengths distinct", () => {
  const seed = plaquistoRecords.find(r => r.id === "QTY-VIS-35")!;
  const result = publishedRecord({...seed, title: "Vis TTPC 35 mm (2e parement)"});
  assert.equal(result.title, "Vis TTPC 35");
  assert.deepEqual(result.data, seed.data);
  for (const title of ["Vis TTPC 25", "Vis TTPC 45", "Vis TTPC 70"]) {
    const distinct = {...seed, title};
    assert.equal(publishedRecord(distinct), distinct);
  }
});

test("approved joint tape alias keeps each work's coefficients", () => {
  const tape = plaquistoRecords.find(r => r.id === "QTY-BANDE")!;
  const oldTape = {...tape, title: "Bande PP grand rouleau"};
  const migrated = publishedRecord(oldTape);
  assert.equal(migrated.title, "Bande à joint");
  assert.deepEqual(migrated.data, tape.data);
  const alveolar = plaquistoRecords.find(r => r.id === "QTY-CLOISON-ALVEOLAIRE")!;
  const old = {...alveolar, data: {...alveolar.data, component_names: {band: "Bande PP grand rouleau"}}};
  const result = publishedRecord(old);
  assert.equal(result.data.component_names.band, "Bande à joint");
  assert.deepEqual({...result.data, component_names: undefined}, {...alveolar.data, component_names: undefined});
  assert.equal(publishedRecord(result), result);
});

test("publication upgrades legacy painting without changing custom coefficients", () => {
  const seed = paintingRecords.find(r => r.id === "RULE-PEINTURE-RATISSAGES")!;
  const legacy = {...seed, data: {...seed.data, revision: "2026-10-07", airlessPercent: 5,
    reservePercent: 12, compounds: (seed.data.compounds as Record<string, unknown>[]).map(c =>
      ({...c, kgPerM2MM: 1.23, thicknessMin: 0.5, thicknessMax: 50}))}};
  const result = publishedRecord(legacy);
  assert.equal(result.data.revision, "2026-10-07.2");
  assert.equal(result.data.airlessPercent, 0);
  assert.equal(result.data.reservePercent, 12);
  assert.equal(result.data.compounds[0].kgPerM2MM, 1.23);
  assert.equal(result.data.compounds[0].thicknessMin, 10);
  assert.equal(legacy.data.airlessPercent, 5);
  assert.equal(publishedRecord(result), result);
});

test("names migrate without touching quantities or distinct screws", () => {
  const seed = plaquistoRecords.find(r => r.id === "QTY-FOURRURE")!;
  const old = {...seed, title: "Fourrure F45", data: {...seed.data,
    component_names: {powder: "Enduit en poudre", screw: "Vis TTPC 25 ou 35", other: "Vis TTPC 35"}}};
  const result = publishedRecord(old);
  assert.equal(result.title, "Fourrures F45/F47");
  assert.deepEqual(result.data.component_names, {powder: "Enduit à joints en poudre", screw: "Vis TTPC 25", other: "Vis TTPC 35"});
  assert.deepEqual({...result.data, component_names: undefined}, {...old.data, component_names: undefined});
  assert.equal(publishedRecord(result), result);
});

test("future painting revisions and custom titles remain unchanged", () => {
  const seed = paintingRecords.find(r => r.id === "RULE-PEINTURE-RATISSAGES")!;
  const future = {...seed, data: {...seed.data, revision: "2027-custom"}};
  assert.equal(publishedRecord(future), future);
  const custom = {...plaquistoRecords.find(r => r.id === "QTY-FOURRURE")!, title: "Mon profil spécial"};
  assert.equal(publishedRecord(custom), custom);
});
