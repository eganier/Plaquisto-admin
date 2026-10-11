import test from "node:test";
import assert from "node:assert/strict";
import {compositeHangerRecords, compositeHangerValidationError} from "./composite-hangers";
import {galvanizedHangerRecords} from "./galvanized-hangers";
import {plaquistoRecords} from "./plaquisto-data";
import {priceTargets, priceKey} from "./supplier-prices";
import {publishedRecord} from "./catalogue-publication";

test("five distinct composite models follow the supplied table without invented physical lengths", () => {
  assert.deepEqual(compositeHangerRecords.map(r=>[r.data.model,r.data.plenum_min_mm,r.data.plenum_max_mm]),
    [["fermette",20,80],["12-16",81,160],["16-20",161,200],["20-24",201,240],["24-28",241,280]]);
  for (const record of compositeHangerRecords) {
    assert.equal(record.data.length_mm, undefined);
    assert.equal(compositeHangerValidationError(record,[...compositeHangerRecords,...galvanizedHangerRecords]),null);
  }
  const targets=priceTargets(compositeHangerRecords);
  assert.equal(targets.length,5);assert.equal(new Set(targets.map(priceKey)).size,5);
  assert.ok(targets.every(t=>t.unit==="unité"&&t.variantKey==="standard"));
});

test("fractional, reversed, invalid support and overlapping composite ranges are rejected", () => {
  const record=compositeHangerRecords[1];
  for(const change of [{plenum_min_mm:80},{plenum_min_mm:80.5},{plenum_max_mm:80},
    {model:" "},{unit:"ml"},{support:"Plancher hourdis béton"}]) {
    assert.ok(compositeHangerValidationError({...record,data:{...record.data,...change}},compositeHangerRecords));
  }
});

test("legacy composite system migration preserves accessories, coefficients and custom bounds", () => {
  const seed=plaquistoRecords.find(r=>r.id==="FIX-BOIS-PARE-VAPEUR")!;
  const components=(seed.data.components as Record<string,unknown>[]).map(c=>{const copy={...c};delete copy.selection;return copy;});
  const old={...seed,data:{...seed.data,components}};
  assert.deepEqual(publishedRecord(old),seed);
  assert.equal(publishedRecord(seed),seed);
  const custom=publishedRecord({...old,data:{...old.data,plenum_max_mm:270,components:components.map(c=>({...c,quantity:3}))}});
  assert.equal(custom.data.plenum_max_mm,270);
  assert.ok((custom.data.components as Record<string,unknown>[]).every(c=>c.quantity===3));
});
