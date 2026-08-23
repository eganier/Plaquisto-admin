import {createClient} from "@supabase/supabase-js";
import {NextResponse} from "next/server";
import {plaquistoRecords,type ReferenceRecord} from "@/lib/plaquisto-data";

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
 return NextResponse.json({version:"2.2",ouvrage:byKind("work")[0]??null,isolation:byKind("insulation_series"),systemesFixation:byKind("fixing_system"),parements:byKind("facing"),quantitatifs:quantityItems.filter(record=>record.data.category!=="vapor_barrier"),pareVapeur:vaporBarrier.length?vaporBarrier:defaultVaporBarrier,regles:byKind("rule")},{headers:{"Cache-Control":"no-store"}});
}
