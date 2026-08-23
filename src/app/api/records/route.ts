import {NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";
import {plaquistoRecords,type ReferenceRecord} from "@/lib/plaquisto-data";

const ADMIN="e.ganier@gmail.com";
async function auth(){const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();return {supabase,ok:user?.email?.toLowerCase()===ADMIN}}
const toRow=(record:ReferenceRecord)=>({id:record.id,kind:record.kind,title:record.title,summary:record.summary,source_page:record.sourcePage,status:record.status,data:record.data,updated_at:new Date().toISOString()});
const fromRow=(row:{id:string;kind:ReferenceRecord["kind"];title:string;summary:string;source_page:number;status:ReferenceRecord["status"];data:ReferenceRecord["data"]}):ReferenceRecord=>({id:row.id,kind:row.kind,title:row.title,summary:row.summary,sourcePage:row.source_page,status:row.status,data:row.data});

export async function GET(){
 const {supabase,ok}=await auth();
 if(!ok)return NextResponse.json({error:"Non autorisé"},{status:401});
 const {data,error}=await supabase.from("reference_records").select("*").order("kind").order("title");
 if(error)return NextResponse.json({error:error.message},{status:500});
 if(!data.length){
  const {error:seedError}=await supabase.from("reference_records").insert(plaquistoRecords.map(toRow));
  if(seedError)return NextResponse.json({error:seedError.message},{status:500});
  return NextResponse.json({records:plaquistoRecords,storage:"supabase"});
 }
 const existingIds=new Set(data.map(row=>row.id));
 const missing=plaquistoRecords.filter(record=>!existingIds.has(record.id));
 if(missing.length){
  const {error:seedError}=await supabase.from("reference_records").insert(missing.map(toRow));
  if(seedError)return NextResponse.json({error:seedError.message},{status:500});
 }
 return NextResponse.json({records:[...data.map(fromRow),...missing],storage:"supabase"});
}

export async function POST(){const {supabase,ok}=await auth();if(!ok)return NextResponse.json({error:"Non autorisé"},{status:401});const {error}=await supabase.from("reference_records").upsert(plaquistoRecords.map(toRow));if(error)return NextResponse.json({error:error.message},{status:400});return NextResponse.json({count:plaquistoRecords.length})}
export async function PATCH(request:Request){const {supabase,ok}=await auth();if(!ok)return NextResponse.json({error:"Non autorisé"},{status:401});const record=await request.json() as ReferenceRecord;const {error}=await supabase.from("reference_records").update({title:record.title,summary:record.summary,status:record.status,data:record.data,updated_at:new Date().toISOString()}).eq("id",record.id);if(error)return NextResponse.json({error:error.message},{status:400});return NextResponse.json({ok:true})}
export async function PUT(request:Request){const {supabase,ok}=await auth();if(!ok)return NextResponse.json({error:"Non autorisé"},{status:401});const record=await request.json() as ReferenceRecord;const {error}=await supabase.from("reference_records").insert(toRow(record));if(error)return NextResponse.json({error:error.message},{status:400});return NextResponse.json({record})}
export async function DELETE(request:Request){const {supabase,ok}=await auth();if(!ok)return NextResponse.json({error:"Non autorisé"},{status:401});const {id}=await request.json() as {id?:string};if(!id)return NextResponse.json({error:"Identifiant invalide"},{status:400});const {error}=await supabase.from("reference_records").delete().eq("id",id);if(error)return NextResponse.json({error:error.message},{status:400});return NextResponse.json({ok:true})}
