import {plaquistoRecords, type ReferenceRecord} from "./plaquisto-data";

export type PriceUnit = "m²" | "ml" | "unité" | "kg";
export type SupplierPrice = {
  id: string;
  referenceId: string;
  variantKey: string;
  label: string;
  unit: PriceUnit;
  unitPriceHT: number | null;
  repUnitHT: number | null;
  supplier: string;
  supplierReference: string;
  priceDate: string;
  validUntil: string | null;
  source: string;
  status: "proposed" | "validated";
  updatedAt: string;
};
export type PriceTarget = {referenceId:string; variantKey:string; label:string; unit:PriceUnit};
export type PublishedPrice = Omit<SupplierPrice,"supplier"|"supplierReference"|"source">;
const units: PriceUnit[] = ["m²", "ml", "unité", "kg"];

/** Technical identity, never inferred from a display name or a similar product. */
export function priceTargets(records: ReferenceRecord[] = plaquistoRecords): PriceTarget[] {
  return records.flatMap((record): PriceTarget[] => {
    const target = (variantKey:string, label:string, unit:PriceUnit):PriceTarget => ({referenceId:record.id,variantKey,label,unit});
    if (record.kind === "facing" && Array.isArray(record.data.dimensions)) {
      return record.data.dimensions.flatMap((dimension) => {
        const {width_mm, length_mm} = dimension as {width_mm:number;length_mm:number};
        return width_mm > 0 && length_mm > 0
          ? [target(`${width_mm}x${length_mm}`, `${record.title} · ${width_mm} × ${length_mm} mm`, "m²")] : [];
      });
    }
    if (record.kind === "insulation_series") {
      const lambdas = Array.isArray(record.data.lambdas) ? record.data.lambdas : [{
        lambda_w_mk:record.data.lambda_w_mk,
        thicknesses_mm:record.data.thicknesses_mm ?? (Array.isArray(record.data.values) ? record.data.values.map(v => (v as {thickness_mm:number}).thickness_mm) : []),
      }];
      return lambdas.flatMap(value => {
        const {lambda_w_mk,thicknesses_mm} = value as {lambda_w_mk:number;thicknesses_mm:number[]};
        if (!(lambda_w_mk > 0) || !Array.isArray(thicknesses_mm)) return [];
        return thicknesses_mm.filter(t => t > 0).map(thickness => target(
          `lambda=${lambda_w_mk.toFixed(3)};thickness=${thickness}`,
          `${record.title} · λ ${lambda_w_mk.toFixed(3)} · ${thickness} mm`, "m²"));
      });
    }
    if (record.kind !== "quantity_item" || record.data.category || ["QTY-FIXATION", "QTY-PLAQUE"].includes(record.id)) return [];
    const unit = record.data.unit as PriceUnit;
    if (!units.includes(unit)) return [];
    const variants:Record<string,string[]> = {
      "QTY-BANDE":["papier"], "QTY-ENDUIT-POUDRE":["standard", "lent", "rapide"],
      "QTY-FOURRURE":["standard", "F45", "F47"], "QTY-CORNIERE":["standard", "CR2-30x35"],
    };
    return (variants[record.id] ?? ["standard"]).map(variant => target(variant, `${record.title} · ${variant}`, unit));
  });
}

export function priceKey(target: Pick<PriceTarget,"referenceId"|"variantKey"|"unit">):string {
  return JSON.stringify([target.referenceId,target.variantKey,target.unit]);
}

/** A local import only prepares new proposals; it cannot overwrite or publish. */
export function importPriceProposals(value:unknown, targets:PriceTarget[], newID:()=>string):SupplierPrice[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 1000) throw new Error("Le fichier doit contenir un tableau de 1 à 1 000 tarifs.");
  return value.map((item,index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) throw new Error(`Ligne ${index+1} invalide.`);
    const target = targets.find(target => priceKey(target) === priceKey(item));
    if (!target) throw new Error(`Ligne ${index+1} : référence, variante ou unité absente du catalogue.`);
    const {unitPriceHT,repUnitHT,supplier,supplierReference,priceDate,validUntil,source} = item;
    const price:SupplierPrice = {...target,id:newID(),unitPriceHT,repUnitHT,supplier,supplierReference,priceDate,validUntil,source,status:"proposed",updatedAt:""};
    const error = validatePrice(price,targets);
    if (error) throw new Error(`Ligne ${index+1} : ${error}`);
    return price;
  });
}
export function isISODate(value:unknown):value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value;
}

export function validatePrice(value:unknown, targets:PriceTarget[] = priceTargets()): string | null {
  const error = validatePublishedPrice(value,targets);
  if (error) return error;
  const price = value as SupplierPrice;
  for (const key of ["supplier","supplierReference","source"] as const) {
    if (typeof price[key] !== "string" || !price[key].trim() || price[key].length > 500) return `Champ requis ou trop long : ${key}.`;
  }
  return null;
}

function validatePublishedPrice(value:unknown, targets:PriceTarget[]): string | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "Tarif invalide.";
  const price = value as PublishedPrice;
  for (const key of ["id","referenceId","variantKey","label"] as const) {
    if (typeof price[key] !== "string" || !price[key].trim() || price[key].length > 500) return `Champ requis ou trop long : ${key}.`;
  }
  if (!/^[A-Za-z0-9_-]{1,120}$/.test(price.id)) return "Identifiant de tarif invalide.";
  if (!targets.some(target => priceKey(target) === priceKey(price))) return "Référence, variante ou unité absente du catalogue technique.";
  if (!["proposed","validated"].includes(price.status)) return "Statut invalide.";
  if (!isISODate(price.priceDate) || (price.validUntil !== null && !isISODate(price.validUntil))) return "Date invalide.";
  if (price.validUntil && price.validUntil < price.priceDate) return "La validité précède la date du tarif.";
  if (price.unitPriceHT !== null && (typeof price.unitPriceHT !== "number" || !Number.isFinite(price.unitPriceHT) || price.unitPriceHT <= 0)) return "Le prix HT doit être positif ou manquant.";
  if (price.repUnitHT !== null && (typeof price.repUnitHT !== "number" || !Number.isFinite(price.repUnitHT) || price.repUnitHT < 0)) return "La REP doit être positive, nulle ou manquante.";
  if (price.status === "validated" && (price.unitPriceHT === null || price.repUnitHT === null)) return "Renseignez le prix et la REP avant validation (0 uniquement si REP connue nulle).";
  return null;
}

export function activePrices(prices:SupplierPrice[], date:string, targets:PriceTarget[] = priceTargets()):SupplierPrice[] {
  return prices.filter(price => price.status === "validated" && !validatePrice(price, targets)
    && price.priceDate <= date && (!price.validUntil || price.validUntil >= date));
}

/** Inclusive periods: two reference tariffs cannot apply on the same day. */
export function conflictingPrice(candidate:SupplierPrice, prices:SupplierPrice[]):SupplierPrice|undefined {
  if (candidate.status !== "validated") return undefined;
  return prices.find(price => price.id !== candidate.id && price.status === "validated"
    && priceKey(price) === priceKey(candidate)
    && candidate.priceDate <= (price.validUntil ?? "9999-12-31")
    && price.priceDate <= (candidate.validUntil ?? "9999-12-31"));
}

export function publicPrices(prices:PublishedPrice[], date:string, targets:PriceTarget[] = priceTargets()) {
  const published = prices.filter(price => !validatePublishedPrice(price,targets)
    && price.status === "validated" && price.priceDate <= date && (!price.validUntil || price.validUntil >= date)).map(price => ({
    id:price.id,referenceId:price.referenceId,variantKey:price.variantKey,
    label:targets.find(target => priceKey(target) === priceKey(price))!.label,unit:price.unit,
    unitPriceHT:price.unitPriceHT!,repUnitHT:price.repUnitHT!,priceDate:price.priceDate,
    validUntil:price.validUntil,status:price.status,updatedAt:price.updatedAt,
  })).sort((a,b) => a.id.localeCompare(b.id));
  return {version:"1.0",currency:"EUR",lowerMultiplier:0.95,upperMultiplier:1.05,prices:published};
}

/** Proportional consumption only. No package rounding or additional wastage. */
export function estimateLine(quantity:number, target:PriceTarget, prices:SupplierPrice[], date:string) {
  if (!Number.isFinite(quantity) || quantity < 0) return null;
  const matches = activePrices(prices,date,[target]).filter(price => priceKey(price) === priceKey(target));
  if (matches.length !== 1) return null;
  const price = matches[0];
  const materialsHT = quantity * price.unitPriceHT!;
  const repHT = quantity * price.repUnitHT!;
  const totalHT = materialsHT + repHT;
  return {priceId:price.id,materialsHT,repHT,totalHT,lowerHT:totalHT*0.95,upperHT:totalHT*1.05};
}
