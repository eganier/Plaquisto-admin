import {NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";
import {f530Records,productTechnicalDefaults} from "@/lib/f530-data";
import {suspensionCatalogBootstrapIds} from "@/lib/suspension-catalog";
const ADMIN="e.ganier@gmail.com";
async function auth(){const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();return {supabase,ok:user?.email?.toLowerCase()===ADMIN}}
export async function GET(){
 const {supabase,ok}=await auth();
 if(!ok)return NextResponse.json({error:"Non autorisé"},{status:401});
 const {data,error}=await supabase.from("reference_records").select("*").order("kind").order("title");
 if(error)return NextResponse.json({records:f530Records,storage:"local"});
 const toRow=(r:(typeof f530Records)[number])=>({id:r.id,kind:r.kind,title:r.title,summary:r.summary,source_page:r.sourcePage,status:r.status,data:r.data,updated_at:new Date().toISOString()});
 if(!data.length){
  const {error:seedError}=await supabase.from("reference_records").insert(f530Records.map(toRow));
  if(seedError)return NextResponse.json({records:f530Records,storage:"local"});
  return NextResponse.json({records:f530Records,storage:"supabase"});
 }

 let available=data;
 const catalogAlreadyImported=data.some(row=>row.id==="SOURCE-SUSPENSION-CATALOG-2026");
 if(!catalogAlreadyImported){
  const markerId="SOURCE-SUSPENSION-CATALOG-2026";
  const catalogRows=f530Records.filter(record=>suspensionCatalogBootstrapIds.has(record.id)&&record.id!==markerId).map(toRow);
  const importedRows:ReturnType<typeof toRow>[]=[];
  let catalogErrorMessage="";
  for(let index=0;index<catalogRows.length;index+=20){
   const batch=catalogRows.slice(index,index+20);
   const {error:catalogError}=await supabase.from("reference_records").upsert(batch);
   if(catalogError){catalogErrorMessage=catalogError.message;console.error("Suspension catalog import failed",catalogError);break}
   importedRows.push(...batch);
  }
  if(!catalogErrorMessage){
   const marker=f530Records.find(record=>record.id===markerId);
   if(marker){
    const markerRow=toRow(marker);
    const {error:markerError}=await supabase.from("reference_records").upsert(markerRow);
    if(markerError){catalogErrorMessage=markerError.message;console.error("Suspension catalog marker failed",markerError)}
    else importedRows.push(markerRow);
   }
  }
  if(importedRows.length){
   const importedIds=new Set(importedRows.map(row=>row.id));
   available=[...data.filter(row=>!importedIds.has(row.id)),...importedRows];
  }
  if(catalogErrorMessage)return NextResponse.json({records:f530Records,storage:"supabase",catalogImportError:catalogErrorMessage});
 }

 const missingTypes=f530Records.filter(seed=>seed.kind==="supply_type"&&!available.some(row=>row.id===seed.id));
 if(missingTypes.length){
  const rows=missingTypes.map(toRow);
  await supabase.from("reference_records").insert(rows);
  available=[...available,...rows];
 }
 const normalized=await Promise.all(available.map(async row=>{
  const defaults=productTechnicalDefaults[row.id];
  if(row.kind==="product"&&defaults&&Object.keys(defaults).some(key=>!(key in row.data))){
   const merged={...defaults,...row.data};
   await supabase.from("reference_records").update({data:merged,updated_at:new Date().toISOString()}).eq("id",row.id);
   return {...row,data:merged};
  }
  return row;
 }));
 return NextResponse.json({records:normalized.map(r=>({id:r.id,kind:r.kind,title:r.title,summary:r.summary,sourcePage:r.source_page,status:r.status,data:r.data})),storage:"supabase"});
}
export async function POST(){const {supabase,ok}=await auth();if(!ok)return NextResponse.json({error:"Non autorisé"},{status:401});const rows=f530Records.map(r=>({id:r.id,kind:r.kind,title:r.title,summary:r.summary,source_page:r.sourcePage,status:r.status,data:r.data,updated_at:new Date().toISOString()}));const {error}=await supabase.from("reference_records").upsert(rows);if(error)return NextResponse.json({error:error.message},{status:400});return NextResponse.json({count:rows.length})}
export async function PATCH(request:Request){const {supabase,ok}=await auth();if(!ok)return NextResponse.json({error:"Non autorisé"},{status:401});const r=await request.json();const {error}=await supabase.from("reference_records").update({title:r.title,summary:r.summary,status:r.status,data:r.data,updated_at:new Date().toISOString()}).eq("id",r.id);if(error)return NextResponse.json({error:error.message},{status:400});return NextResponse.json({ok:true})}
export async function PUT(request:Request){const {supabase,ok}=await auth();if(!ok)return NextResponse.json({error:"Non autorisé"},{status:401});const r=await request.json();const {error}=await supabase.from("reference_records").insert({id:r.id,kind:r.kind,title:r.title,summary:r.summary,source_page:r.sourcePage,status:r.status,data:r.data});if(error)return NextResponse.json({error:error.message},{status:400});return NextResponse.json({record:r})}
export async function DELETE(request:Request){const {supabase,ok}=await auth();if(!ok)return NextResponse.json({error:"Non autorisé"},{status:401});const {id}=await request.json();if(typeof id!=="string")return NextResponse.json({error:"Identifiant invalide"},{status:400});const {data:target,error:lookupError}=await supabase.from("reference_records").select("kind").eq("id",id).maybeSingle();if(lookupError||!target||!["commercial_reference","product_model","product"].includes(target.kind))return NextResponse.json({error:"Élément introuvable"},{status:404});if(target.kind==="product"){const {data:models,error:modelsLookupError}=await supabase.from("reference_records").select("id").eq("kind","product_model").eq("data->>product_id",id);if(modelsLookupError)return NextResponse.json({error:modelsLookupError.message},{status:400});const modelIds=(models||[]).map(model=>model.id);if(modelIds.length){const {error:referencesError}=await supabase.from("reference_records").delete().eq("kind","commercial_reference").in("data->>model_id",modelIds);if(referencesError)return NextResponse.json({error:referencesError.message},{status:400});const {error:modelsError}=await supabase.from("reference_records").delete().eq("kind","product_model").in("id",modelIds);if(modelsError)return NextResponse.json({error:modelsError.message},{status:400})}}if(target.kind==="product_model"){const {error:referencesError}=await supabase.from("reference_records").delete().eq("kind","commercial_reference").eq("data->>model_id",id);if(referencesError)return NextResponse.json({error:referencesError.message},{status:400})}const {error}=await supabase.from("reference_records").delete().eq("id",id).eq("kind",target.kind);if(error)return NextResponse.json({error:error.message},{status:400});return NextResponse.json({ok:true})}
