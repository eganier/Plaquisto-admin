import {createHash} from "node:crypto";
import {createClient} from "@supabase/supabase-js";
import {NextResponse} from "next/server";
import {plaquistoRecords, type ReferenceRecord} from "@/lib/plaquisto-data";
import {priceTargets, publicPrices, type PublishedPrice} from "@/lib/supplier-prices";

export const dynamic = "force-dynamic";
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({error:"Configuration Supabase manquante"},{status:503});
  // Same public read-only access as /api/ios/catalogue; RLS excludes proposals.
  const supabase = createClient(url,key,{auth:{persistSession:false}});
  const [priceResult,referenceResult] = await Promise.all([
    supabase.from("supplier_prices_public").select("payload,updated_at"),
    supabase.from("reference_records").select("id,kind,title,data").eq("status","Publié"),
  ]);
  if (priceResult.error || referenceResult.error) return NextResponse.json({error:"Tarifs momentanément indisponibles"},{status:503});
  const prices = (priceResult.data ?? []).map(row => ({...row.payload,updatedAt:row.updated_at})) as PublishedPrice[];
  const targets = priceTargets(referenceResult.data?.length ? referenceResult.data as ReferenceRecord[] : plaquistoRecords);
  const today = new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Paris",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
  const payload = publicPrices(prices,today,targets);
  const revision = createHash("sha256").update(JSON.stringify(payload)).digest("hex");
  return NextResponse.json({...payload,revision},{headers:{"Cache-Control":"no-store"}});
}
