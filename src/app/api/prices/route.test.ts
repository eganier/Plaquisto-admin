import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createRequire} from "node:module";
import {join} from "node:path";
import {runInNewContext} from "node:vm";
import * as pricing from "../../../lib/supplier-prices";
import {proposedPriceFixtures} from "../../../lib/supplier-prices.test-fixtures";
import * as catalogue from "../../../lib/plaquisto-data";

// Execute the actual route with a read/write boundary mock; no database or
// credentials are used. Compilation matches the CommonJS Node test runner.
const ts = createRequire(join(process.cwd(),"package.json"))("typescript") as typeof import("typescript");
function route(existing:pricing.SupplierPrice[], email="e.ganier@gmail.com", saveCode?:string) {
  const writes:unknown[] = [];
  const supabase = {
    auth:{getUser:async () => ({data:{user:{email}}})},
    from:(name:string) => name === "reference_records"
      ? {select:async () => ({data:catalogue.plaquistoRecords,error:null})}
      : {
        select:() => ({eq:() => ({neq:async (_:string,id:string) => ({data:existing.filter(price => price.id !== id).map(payload => ({payload})),error:null})})}),
        upsert:async (value:unknown) => {writes.push(value);return {error:saveCode ? {code:saveCode} : null};},
      },
  };
  const dependencies:Record<string,unknown> = {
    "next/server":{NextResponse:Response},
    "@/lib/supabase/server":{createClient:async () => supabase},
    "@/lib/supplier-prices":pricing,
    "@/lib/plaquisto-data":catalogue,
  };
  const source = readFileSync(join(process.cwd(),"src/app/api/prices/route.ts"),"utf8");
  const compiled = ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const testModule = {exports:{} as {PUT:(request:Request)=>Promise<Response>}};
  runInNewContext(compiled,{exports:testModule.exports,module:testModule,require:(name:string) => {
    if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`);
    return dependencies[name];
  },Date});
  return {put:testModule.exports.PUT,writes};
}
const valid = ():pricing.SupplierPrice => ({...proposedPriceFixtures[0],status:"validated"});
const request = (price:pricing.SupplierPrice) => new Request("http://localhost/api/prices",{method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify(price)});

test("API rejects overlapping validation with 409 before writing",async () => {
  const existing = valid();
  const api = route([existing]);
  const response = await api.put(request({...existing,id:"OTHER"}));
  assert.equal(response.status,409);
  assert.equal((await response.json()).conflictId,existing.id);
  assert.equal(api.writes.length,0);
});

test("API imposes the technical label instead of a supplied private label",async () => {
  const api = route([]);
  const response = await api.put(request({...valid(),label:"Private supplier name"}));
  assert.equal(response.status,200);
  assert.equal((await response.json()).price.label,valid().label);
  assert.equal(api.writes.length,1);
});

test("API translates a concurrent SQL exclusion conflict to 409",async () => {
  const api = route([],undefined,"23P01");
  assert.equal((await api.put(request(valid()))).status,409);
});

test("API denies writes to a non-admin and rejects invalid normalized prices",async () => {
  const unauthorized = route([],"other@example.com");
  assert.equal((await unauthorized.put(request(valid()))).status,401);
  assert.equal(unauthorized.writes.length,0);
  const api = route([]);
  assert.equal((await api.put(request({...valid(),unitPriceHT:0}))).status,400);
  assert.equal(api.writes.length,0);
});
