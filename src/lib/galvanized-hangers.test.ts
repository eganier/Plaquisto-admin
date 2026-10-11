import test from "node:test";
import assert from "node:assert/strict";
import {galvanizedHangerRecords, hangerValidationError} from "./galvanized-hangers";
import {plaquistoRecords} from "./plaquisto-data";
import {priceTargets, priceKey} from "./supplier-prices";
import {publishedRecord} from "./catalogue-publication";

test("seven distinct price identities with continuous, support-specific integer ranges", () => {
  assert.deepEqual(galvanizedHangerRecords.map(r=>[r.data.length_mm,r.data.plenum_min_mm,r.data.plenum_max_mm,r.data.hourdis_plenum_min_mm,r.data.hourdis_plenum_max_mm]),[
    [80,20,60,20,70],[180,61,150,71,170],[240,151,210,171,230],
    [300,211,270,231,290],[400,271,370,291,390],[500,371,470,391,490],[600,471,570,491,590],
  ]);
  for(const record of galvanizedHangerRecords)assert.equal(hangerValidationError(record,galvanizedHangerRecords),null);
  const targets=priceTargets(galvanizedHangerRecords);
  assert.equal(targets.length,7);
  assert.equal(new Set(targets.map(priceKey)).size,7);
  assert.ok(targets.every(t=>t.unit==="unité"&&t.variantKey==="standard"));
});

test("invalid dimensions and overlapping wood OR hourdis ranges are refused", () => {
  const record=galvanizedHangerRecords[1];
  for(const data of [{...record.data,plenum_min_mm:60},{...record.data,hourdis_plenum_min_mm:70},
    {...record.data,length_mm:180.5},{...record.data,hourdis_plenum_max_mm:200}]){
    assert.ok(hangerValidationError({...record,data},galvanizedHangerRecords));
  }
});

test("legacy system migration preserves screws and hourdis adapters, and is idempotent", () => {
  for(const id of ["FIX-BOIS-GALVA","FIX-HOURDIS-GALVA","FIX-HOURDIS-GRIFFE-GALVA"]){
    const seed=plaquistoRecords.find(r=>r.id===id)!;
    const components=(seed.data.components as Record<string,unknown>[]).map(c=>{
      const legacy={...c};delete legacy.selection;return legacy;
    });
    const old={...seed,summary:seed.summary.replace(/à \d+ mm/,"à 480 mm"),data:{...seed.data,plenum_max_mm:480,components}};
    const migrated=publishedRecord(old);
    assert.deepEqual(migrated,seed);
    assert.equal(publishedRecord(migrated),migrated);
    assert.equal((migrated.data.components as Record<string,unknown>[])[0].name,components[0].name);
    const custom=publishedRecord({...old,data:{...old.data,plenum_max_mm:450}});
    assert.equal(custom.data.plenum_max_mm,450);
  }
});
