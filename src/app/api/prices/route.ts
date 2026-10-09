import {NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";
import {plaquistoRecords, type ReferenceRecord} from "@/lib/plaquisto-data";
import {conflictingPrice, priceKey, priceTargets, validatePrice, type SupplierPrice} from "@/lib/supplier-prices";

export const dynamic = "force-dynamic";
async function context() {
  const supabase = await createClient();
  const {data:{user}} = await supabase.auth.getUser();
  return {supabase,ok:user?.email?.toLowerCase() === "e.ganier@gmail.com"};
}
async function targets(supabase:Awaited<ReturnType<typeof createClient>>) {
  const {data,error} = await supabase.from("reference_records").select("id,kind,title,data");
  if (error) throw new Error("Lecture du catalogue technique impossible.");
  return priceTargets(data?.length ? data as ReferenceRecord[] : plaquistoRecords);
}

export async function GET() {
  const {supabase,ok} = await context();
  if (!ok) return NextResponse.json({error:"Non autorisé"},{status:401});
  try {
    const referenceOptions = await targets(supabase);
    const {data,error} = await supabase.from("supplier_prices").select("payload,updated_at").order("id");
    if (error) return NextResponse.json({error:"La table des tarifs est indisponible. Appliquez la migration des tarifs avant utilisation."},{status:503});
    return NextResponse.json({prices:(data ?? []).map(row => ({...row.payload,updatedAt:row.updated_at})),referenceOptions},{headers:{"Cache-Control":"no-store"}});
  } catch {
    return NextResponse.json({error:"Lecture du catalogue technique impossible."},{status:503});
  }
}

export async function PUT(request:Request) {
  const {supabase,ok} = await context();
  if (!ok) return NextResponse.json({error:"Non autorisé"},{status:401});
  let input:SupplierPrice;
  try { input = await request.json(); } catch { return NextResponse.json({error:"JSON invalide."},{status:400}); }
  try {
    const referenceOptions = await targets(supabase);
    const error = validatePrice(input,referenceOptions);
    if (error) return NextResponse.json({error},{status:400});
    if (input.status === "validated") {
      const {data:existing,error:readError} = await supabase.from("supplier_prices").select("payload").eq("status","validated").neq("id",input.id);
      if (readError) return NextResponse.json({error:"Vérification des tarifs existants impossible."},{status:503});
      const conflict = conflictingPrice(input,(existing ?? []).map(row => row.payload as SupplierPrice));
      if (conflict) return NextResponse.json({error:`Le tarif ${conflict.id} est déjà validé pour cette référence sur une période commune. Terminez sa validité ou repassez-le en proposé avant de valider ce tarif.`,conflictId:conflict.id},{status:409});
    }
    // Whitelist fields: never save request extras or trust the client timestamp.
    const {id,referenceId,variantKey,unit,unitPriceHT,repUnitHT,supplier,supplierReference,priceDate,validUntil,source,status} = input;
    const label = referenceOptions.find(target => priceKey(target) === priceKey(input))!.label;
    const price:SupplierPrice = {id,referenceId,variantKey,label,unit,unitPriceHT,repUnitHT,supplier,supplierReference,priceDate,validUntil,source,status,updatedAt:new Date().toISOString()};
    const {error:saveError} = await supabase.from("supplier_prices").upsert({id,status,price_date:priceDate,valid_until:validUntil,payload:price,updated_at:price.updatedAt});
    if (saveError?.code === "23P01") return NextResponse.json({error:"Un autre tarif validé couvre cette référence et cette période. Actualisez le tableau et terminez sa validité ou repassez-le en proposé."},{status:409});
    if (saveError) return NextResponse.json({error:"Enregistrement du tarif impossible."},{status:500});
    return NextResponse.json({price});
  } catch {
    return NextResponse.json({error:"Lecture du catalogue technique impossible."},{status:503});
  }
}
