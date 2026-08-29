import {createClient} from "@supabase/supabase-js";
import {NextResponse} from "next/server";
import {genericFacingRecords,plaquistoRecords,type ReferenceRecord} from "@/lib/plaquisto-data";

export const dynamic="force-dynamic";

export async function GET(){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key)return NextResponse.json({error:"Configuration Supabase manquante"},{status:500});
 const supabase=createClient(url,key,{auth:{persistSession:false}});
 const {data,error}=await supabase.from("reference_records").select("id,kind,title,summary,source_page,status,data,updated_at").eq("status","Publié").order("kind").order("title");
 if(error)return NextResponse.json({error:error.message},{status:500});
 const records=(data||[]).map(row=>({id:row.id,kind:row.kind,title:row.title,summary:row.summary,sourcePage:row.source_page,status:row.status,data:row.data,updatedAt:row.updated_at})) as (ReferenceRecord&{updatedAt:string})[];
 const byKind=(kind:ReferenceRecord["kind"])=>records.filter(record=>record.kind===kind);
 const quantityItems=byKind("quantity_item"),vaporBarrier=quantityItems.filter(record=>record.data.category==="vapor_barrier");
 const defaultVaporBarrier=plaquistoRecords.filter(record=>record.status==="Publié"&&record.kind==="quantity_item"&&record.data.category==="vapor_barrier");
 const seed=(id:string)=>plaquistoRecords.find(record=>record.id===id&&record.status==="Publié")??null;
 const works=byKind("work"),facings=byKind("facing"),rules=byKind("rule");
 const ceilingWork=works.find(record=>record.data.code==="plafond-fourrure-horizontal")??seed("WORK-PLAFOND-FOURRURE-HORIZONTAL");
 const doublageWork=works.find(record=>record.data.code==="doublage-peripherique-rails-montants")??seed("WORK-DOUBLAGE-PERIPHERIQUE-RAILS-MONTANTS");
 const genericFacings=facings.filter(record=>record.data.catalog_schema_version===2);
 const defaultDoublageFacings=genericFacingRecords.filter(record=>record.status==="Publié");
 const storedDoublagePerformance=rules.find(record=>record.data.category==="doublage_performance");
 const doublagePerformance=storedDoublagePerformance?.data.schema_version===2?storedDoublagePerformance:seed("RULE-DOUBLAGE-HEIGHTS");
 const doublageQuantity=quantityItems.find(record=>record.data.category==="doublage_quantity")??seed("QTY-DOUBLAGE-RAILS-MONTANTS");
 return NextResponse.json({
  version:"3.0",ouvrage:ceilingWork,isolation:byKind("insulation_series"),systemesFixation:byKind("fixing_system"),
  parements:genericFacings.length?genericFacings:defaultDoublageFacings,
  quantitatifs:quantityItems.filter(record=>!record.data.category),pareVapeur:vaporBarrier.length?vaporBarrier:defaultVaporBarrier,
  regles:rules.filter(record=>record.data.category!=="doublage_performance"),
  doublage:{ouvrage:doublageWork,parements:genericFacings.length?genericFacings:defaultDoublageFacings,performance:doublagePerformance,quantitatif:doublageQuantity},
 },{headers:{"Cache-Control":"no-store"}});
}
