import {test} from "node:test";
import assert from "node:assert/strict";
import {paintingRecords,validPaintingRules} from "./painting-data";

const rules = paintingRecords.find(record=>record.id==="RULE-PEINTURE-RATISSAGES")!.data;
test("published contract: six compounds, m²/L, no Airless and 10% reserve",()=>{
  assert.equal(validPaintingRules(rules),true);
  assert.deepEqual([rules.yieldMin,rules.yieldMax,rules.yieldDefault],[8,12,10]);
  assert.deepEqual([rules.airlessPercent,rules.reservePercent],[0,10]);
  const compounds=rules.compounds as {kgPerM2MM:number}[];
  assert.deepEqual(compounds.map(c=>c.kgPerM2MM),[1.15,1.5,1.2,1.6,0.4,1.15]);
});
test("thickness ranges use mm, including 1–5 cm for filling",()=>{
  const compounds=rules.compounds as {thicknessMin:number,thicknessMax:number}[];
  assert.deepEqual(compounds.map(c=>[c.thicknessMin,c.thicknessMax]),[[10,50],[10,50],[1,5],[1,5],[0.5,1],[0.5,1]]);
});
test("reject broken coefficients, duplicate IDs and incompatible schemas",()=>{
  for(const bad of [{category:"wrong"},{yieldMin:0},{yieldMax:7},{yieldDefault:13},{reservePercent:-1},{airlessPercent:Infinity},{schemaVersion:2},{compounds:[]}]) {
    assert.equal(validPaintingRules({...rules,...bad}),false);
  }
  const compounds=rules.compounds as Record<string,unknown>[];
  assert.equal(validPaintingRules({...rules,compounds:[compounds[0],compounds[0]]}),false);
  assert.equal(validPaintingRules({...rules,compounds:[{...compounds[0],kgPerM2MM:0}]}),false);
});
