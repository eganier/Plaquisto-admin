import test from "node:test";
import assert from "node:assert/strict";
import {publishedRecord} from "./catalogue-publication";
import {paintingRecords} from "./painting-data";
import {plaquistoRecords} from "./plaquisto-data";

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
