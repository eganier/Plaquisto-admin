import test from "node:test";
import assert from "node:assert/strict";
import {intermediateSupportRecords as records,intermediateSupportValidationError as validate} from "./intermediate-supports";
import {priceTargets,priceKey} from "./supplier-prices";

test("seven independent support models reproduce the administrator table and expose unit prices",()=>{
  assert.deepEqual(records.map(r=>[r.data.model,r.data.insulation_min_mm,r.data.insulation_max_mm,r.data.reveal_min_mm,r.data.reveal_max_mm,r.data.direct_masonry]),[
    ["15-45",0,60,50,94,true],["75",60,85,82,111,false],["100",85,100,102,134,false],
    ["120",100,120,102,160,false],["140",120,140,102,190,false],["75-160",75,160,102,209,true],["200",140,200,166,244,false]]);
  records.forEach(r=>assert.equal(validate(r,records),null));
  const targets=priceTargets(records);
  assert.equal(targets.length,7);assert.equal(new Set(targets.map(priceKey)).size,7);
  assert.ok(targets.every(t=>t.unit==="unité"&&t.variantKey==="standard"));
});
test("invalid support rules and true overlaps are rejected, shared endpoints remain valid",()=>{
  const r=records[2];
  for(const data of [{model:""},{direct_masonry:"oui"},{unit:"ml"},{insulation_min_mm:84},{insulation_min_mm:85.5},{insulation_max_mm:85},{reveal_max_mm:80}]) {
    assert.ok(validate({...r,data:{...r.data,...data}},records));
  }
  assert.equal(validate({...r,status:"À valider",data:{...r.data,insulation_min_mm:84}},records),null);
});
