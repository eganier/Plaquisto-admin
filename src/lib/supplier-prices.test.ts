import test from "node:test";
import assert from "node:assert/strict";
import {activePrices,conflictingPrice,estimateLine,importPriceProposals,priceTargets,publicPrices,validatePrice,type SupplierPrice} from "./supplier-prices";
import {proposedPriceFixtures} from "./supplier-prices.test-fixtures";

const date = "2031-04-15";
const valid = (index=0):SupplierPrice => ({...proposedPriceFixtures[index],status:"validated",updatedAt:"2031-04-15T10:00:00Z"});

test("all synthetic fixtures are coherent proposals and absent from publication", () => {
  assert.equal(proposedPriceFixtures.length,8);
  for (const price of proposedPriceFixtures) {
    assert.equal(price.status,"proposed");
    assert.equal(validatePrice(price),null);
  }
  assert.deepEqual(publicPrices(proposedPriceFixtures,date).prices,[]);
});

test("normalization preserves screw precision and never rounds to boxes", () => {
  const price = valid(3);
  assert.equal(price.unitPriceHT,0.01);
  assert.ok(Math.abs(price.repUnitHT!-0.000003)<1e-15);
  const result = estimateLine(1500,price,[price],date)!;
  assert.ok(Math.abs(result.materialsHT-15)<1e-10);
  assert.ok(Math.abs(result.repHT-0.0045)<1e-10);
  assert.equal(result.lowerHT,result.totalHT*0.95);
  assert.equal(result.upperHT,result.totalHT*1.05);
});

test("paper roll price is normalized per ml with its separate REP", () => {
  const price = valid(5);
  const result = estimateLine(150,price,[price],date)!;
  assert.ok(Math.abs(result.materialsHT-4.5)<1e-12);
  assert.ok(Math.abs(result.repHT-0.15)<1e-12);
});

test("publication excludes expired and future prices, inclusively retains valid endpoints", () => {
  const price = valid();
  assert.equal(activePrices([price],"2031-03-31").length,0);
  assert.equal(activePrices([price],"2031-04-01").length,1);
  assert.equal(activePrices([price],"2031-05-31").length,1);
  assert.equal(activePrices([price],"2031-06-01").length,0);
});

test("missing and ambiguous prices remain unpriced instead of zero or a guessed match", () => {
  const price = valid();
  assert.equal(estimateLine(12,price,[],date),null);
  assert.equal(estimateLine(12,price,[price,{...price,id:"OTHER"}],date),null);
  assert.equal(estimateLine(12,{...price,variantKey:"1200x3000"},[price],date),null);
  assert.equal(estimateLine(12,{...price,unit:"unité"},[price],date),null);
  assert.equal(estimateLine(-1,price,[price],date),null);
});

test("unknown REP is not silently interpreted as zero", () => {
  const price = {...valid(),repUnitHT:null};
  assert.ok(validatePrice(price));
  assert.equal(estimateLine(12,price,[price],date),null);
  assert.equal(validatePrice({...price,status:"proposed"}),null);
  assert.equal(validatePrice({...valid(),repUnitHT:0}),null);
});

test("server validation rejects zero prices, non-finite values, invalid dates and unknown identities", () => {
  const price = valid();
  for (const change of [{unitPriceHT:0},{unitPriceHT:-1},{unitPriceHT:NaN},{unitPriceHT:Infinity},
    {unitPriceHT:"4.2"},{repUnitHT:-1},{priceDate:"2031-02-30"},{validUntil:"2030-01-01"},
    {referenceId:"MISSING"},{variantKey:"standard"},{unit:"boîte"},{status:"published"},
    {supplier:""},{id:"../unsafe"},{unitPriceHT:null}]) {
    assert.ok(validatePrice({...price,...change}),JSON.stringify(change));
  }
});

test("public output whitelists useful pricing data without private source or supplier", () => {
  const price = valid();
  const output = publicPrices([price],date);
  assert.equal(output.prices.length,1);
  assert.equal(output.version,"1.0");
  for (const key of ["source","supplier","supplierReference"]) assert.equal(key in output.prices[0],false);
  assert.equal(output.prices[0].referenceId,price.referenceId);
  const sensitive = publicPrices([{...price,label:"Private supplier information"}],date);
  assert.equal(sensitive.prices[0].label,priceTargets().find(target => target.referenceId === price.referenceId && target.variantKey === price.variantKey)!.label);
});

test("technical targets preserve format, lambda and thickness distinctions", () => {
  const targets = priceTargets();
  assert.ok(targets.some(t => t.referenceId === "FACING-BA13-STANDARD" && t.variantKey === "1200x2500"));
  assert.ok(targets.some(t => t.referenceId === "WALL-INSULATION-LDV" && t.variantKey === "lambda=0.032;thickness=100"));
  assert.equal(targets.some(t => t.referenceId === "QTY-FIXATION"),false);
  assert.equal(targets.some(t => t.referenceId === "QTY-PLAQUE"),false);
  for (const referenceId of ["QTY-FOURRURE","QTY-CORNIERE","QTY-ENDUIT-POUDRE"]) {
    assert.ok(targets.some(t => t.referenceId === referenceId && t.variantKey === "standard"));
  }
});

test("validation detects overlapping reference prices regardless of supplier", () => {
  const existing = valid();
  const candidate = {...existing,id:"NEW",supplier:"Another supplier"};
  assert.equal(conflictingPrice(candidate,[existing])?.id,existing.id);
  assert.equal(conflictingPrice({...candidate,priceDate:"2031-05-31",validUntil:"2031-12-31"},[existing])?.id,existing.id);
  assert.equal(conflictingPrice({...candidate,priceDate:"2031-06-01",validUntil:"2031-12-31"},[existing]),undefined);
  assert.equal(conflictingPrice({...candidate,priceDate:"2032-01-01",validUntil:null},[{...existing,validUntil:null}])?.id,existing.id);
});

test("proposals, distinct variants and same-record edits do not conflict", () => {
  const existing = valid();
  assert.equal(conflictingPrice({...existing,unitPriceHT:5},[existing]),undefined);
  assert.equal(conflictingPrice({...existing,id:"NEW",status:"proposed"},[existing]),undefined);
  assert.equal(conflictingPrice({...existing,id:"NEW"},[{...existing,status:"proposed"}]),undefined);
  assert.equal(conflictingPrice({...existing,id:"NEW",variantKey:"1200x2000"},[existing]),undefined);
  assert.equal(conflictingPrice({...existing,id:"NEW",unit:"unité"},[existing]),undefined);
});

test("local import creates fresh proposed IDs even from validated input", () => {
  const input = {...valid(),id:"EXISTING",label:"Ignored supplier label",updatedAt:"2031-04-15T10:00:00Z"};
  const imported = importPriceProposals([input],priceTargets(),() => "FRESH-ID");
  assert.equal(imported[0].id,"FRESH-ID");
  assert.equal(imported[0].status,"proposed");
  assert.equal(imported[0].updatedAt,"");
  assert.equal(imported[0].label,valid().label);
  assert.deepEqual(publicPrices(imported,date).prices,[]);
  assert.equal(input.status,"validated");
});

test("local import rejects unknown variants and malformed files before saving", () => {
  for (const input of [{},[],[null],[{...valid(),variantKey:"guessed"}],[{...valid(),unitPriceHT:"4.20"}]]) {
    assert.throws(() => importPriceProposals(input,priceTargets(),() => "FRESH-ID"));
  }
});
