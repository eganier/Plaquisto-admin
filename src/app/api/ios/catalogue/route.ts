import {createClient} from "@supabase/supabase-js";
import {NextResponse} from "next/server";
import {alveolarFacingRecords,genericFacingRecords,plaquistoRecords,type ReferenceRecord} from "@/lib/plaquisto-data";

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
 const wallInsulations=byKind("insulation_series").filter(record=>record.data.category==="wall_insulation");
 const partitionInsulations=byKind("insulation_series").filter(record=>record.data.category==="partition_insulation");
 const defaultWallInsulations=plaquistoRecords.filter(record=>record.status==="Publié"&&record.kind==="insulation_series"&&record.data.category==="wall_insulation");
 const defaultPartitionInsulations=plaquistoRecords.filter(record=>record.status==="Publié"&&record.kind==="insulation_series"&&record.data.category==="partition_insulation");
 const defaultVaporBarrier=plaquistoRecords.filter(record=>record.status==="Publié"&&record.kind==="quantity_item"&&record.data.category==="vapor_barrier");
 const seed=(id:string)=>plaquistoRecords.find(record=>record.id===id&&record.status==="Publié")??null;
 const works=byKind("work"),facings=byKind("facing"),rules=byKind("rule");
 const ceilingWork=works.find(record=>record.data.code==="plafond-fourrure-horizontal")??seed("WORK-PLAFOND-FOURRURE-HORIZONTAL");
 const doublageWork=works.find(record=>record.data.code==="doublage-peripherique-rails-montants")??seed("WORK-DOUBLAGE-PERIPHERIQUE-RAILS-MONTANTS");
 const partitionWork=works.find(record=>record.data.code==="cloison-de-distribution")??seed("WORK-CLOISON-DE-DISTRIBUTION");
 const alveolarWork=works.find(record=>record.data.code==="cloison-de-distribution-alveolaire")??seed("WORK-CLOISON-ALVEOLAIRE");
 const genericFacings=facings.filter(record=>record.data.catalog_schema_version===2);
 const alveolarFacings=facings.filter(record=>record.data.catalog_schema_version===3&&record.data.material==="panneau_cloison_alveolaire");
 const defaultDoublageFacings=genericFacingRecords.filter(record=>record.status==="Publié");
 const storedDoublagePerformance=rules.find(record=>record.data.category==="doublage_performance");
 const doublagePerformance=storedDoublagePerformance?.data.schema_version===2?storedDoublagePerformance:seed("RULE-DOUBLAGE-HEIGHTS");
 const storedDoublageQuantity=quantityItems.find(record=>record.data.category==="doublage_quantity");
 const doublageQuantity=storedDoublageQuantity?.data.schema_version===2?storedDoublageQuantity:seed("QTY-DOUBLAGE-RAILS-MONTANTS");
 const storedPartitionPerformance=rules.find(record=>record.data.category==="cloison_distribution_performance");
 const partitionPerformance=storedPartitionPerformance?.data.schema_version===3?storedPartitionPerformance:seed("RULE-CLOISON-DISTRIBUTION-HEIGHTS");
 const storedPartitionQuantity=quantityItems.find(record=>record.data.category==="cloison_distribution_quantity");
 const partitionQuantity=storedPartitionQuantity?.data.schema_version===1?storedPartitionQuantity:seed("QTY-CLOISON-DISTRIBUTION");
 const storedAlveolarRules=rules.find(record=>record.data.category==="cloison_alveolaire_rules");
 const alveolarRules=storedAlveolarRules?.data.schema_version===1?storedAlveolarRules:seed("RULE-CLOISON-ALVEOLAIRE");
 const storedAlveolarQuantity=quantityItems.find(record=>record.data.category==="cloison_alveolaire_quantity");
 const alveolarQuantity=storedAlveolarQuantity?.data.schema_version===1?storedAlveolarQuantity:seed("QTY-CLOISON-ALVEOLAIRE");
 return NextResponse.json({
  version:"4.3",ouvrage:ceilingWork,isolation:byKind("insulation_series").filter(record=>record.data.category!=="wall_insulation"),systemesFixation:byKind("fixing_system"),
  parements:genericFacings.length?genericFacings:defaultDoublageFacings,
  quantitatifs:quantityItems.filter(record=>!record.data.category),pareVapeur:vaporBarrier.length?vaporBarrier:defaultVaporBarrier,
  regles:rules.filter(record=>record.data.category!=="doublage_performance"),
  doublage:{ouvrage:doublageWork,parements:genericFacings.length?genericFacings:defaultDoublageFacings,performance:doublagePerformance,quantitatif:doublageQuantity,isolants:wallInsulations.length?wallInsulations:defaultWallInsulations},
  cloisonDistribution:{ouvrage:partitionWork,parements:genericFacings.length?genericFacings:defaultDoublageFacings,performance:partitionPerformance,quantitatif:partitionQuantity,isolants:partitionInsulations.length?partitionInsulations:defaultPartitionInsulations},
  cloisonAlveolaire:{ouvrage:alveolarWork,parements:alveolarFacings.length?alveolarFacings:alveolarFacingRecords,regles:alveolarRules,quantitatif:alveolarQuantity},
 },{headers:{"Cache-Control":"no-store"}});
}
