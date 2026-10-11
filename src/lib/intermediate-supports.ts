import type {ReferenceRecord} from "./plaquisto-data";

// Administrator's table. Reveal depths are descriptive, never a selection input.
export const intermediateSupportRecords: ReferenceRecord[] = (
  [["15-45",0,60,50,94,true],["75",60,85,82,111,false],
   ["100",85,100,102,134,false],["120",100,120,102,160,false],
   ["140",120,140,102,190,false],["75-160",75,160,102,209,true],
   ["200",140,200,166,244,false]] as const
).map(([model,min,max,revealMin,revealMax,direct])=>({
  id:`QTY-APPUI-FOURRURE-${model}`,kind:"quantity_item",
  title:`Appuis intermédiaires pour fourrures ${model}`,
  summary:`Isolant ${min}–${max} mm · fixation ${direct?"directe dans la maçonnerie":"sur fourrure horizontale"}`,
  sourcePage:0,status:"Publié",
  data:{category:"intermediate_support",schema_version:1,unit:"unité",model,
    insulation_min_mm:min,insulation_max_mm:max,reveal_min_mm:revealMin,reveal_max_mm:revealMax,
    direct_masonry:direct},
}));

export function intermediateSupportValidationError(record:ReferenceRecord,others:ReferenceRecord[]):string|null {
  if(record.data.category!=="intermediate_support")return null;
  const d=record.data;
  const bounds=[d.insulation_min_mm,d.insulation_max_mm,d.reveal_min_mm,d.reveal_max_mm];
  if(typeof d.model!=="string"||!d.model.trim()||d.unit!=="unité"||typeof d.direct_masonry!=="boolean"
    ||bounds.some(v=>typeof v!=="number"||!Number.isInteger(v)||v<0)
    ||Number(d.insulation_max_mm)<=Number(d.insulation_min_mm)||Number(d.reveal_max_mm)<Number(d.reveal_min_mm)) {
    return "Appui invalide : modèle, fixation, unité et plages en millimètres entiers requis.";
  }
  // Shared endpoints are intentional: the model with the higher lower bound wins.
  if(record.status==="Publié"&&others.some(other=>other.id!==record.id&&other.status==="Publié"
    &&other.data.category==="intermediate_support"&&other.data.direct_masonry===d.direct_masonry
    &&Math.max(Number(other.data.insulation_min_mm),Number(d.insulation_min_mm))
      <Math.min(Number(other.data.insulation_max_mm),Number(d.insulation_max_mm)))) {
    return "Les plages d’isolant se chevauchent pour ce mode de fixation (seules les limites communes sont autorisées).";
  }
  return null;
}
