type Status = "Publié" | "À valider";

type SeedRecord = {
  id: string;
  kind: "brand" | "product" | "product_model" | "commercial_reference" | "source";
  title: string;
  summary: string;
  sourcePage: number;
  status: Status;
  data: Record<string, string | number | boolean | null | string[]>;
};

const TYPE_ID = "TYPE-SUSPENSION-SOLIVAGE";
const FAMILY_ID = "FAMILY-SUSPENSIONS";
const IMPORT_ID = "suspentes-acier-2026-08";

const brands = [
  ["PLACO", "BRAND-PLACO", "Placo®"],
  ["KNAUF", "BRAND-KNAUF", "Knauf"],
  ["SINIAT", "BRAND-SINIAT", "Siniat"],
  ["ISOLPRO", "BRAND-ISOLPRO", "Isolpro"],
  ["PAI", "BRAND-PAI", "PAI"],
  ["GYPSO", "BRAND-GYPSO", "Gypso"],
  ["SEMIN", "BRAND-SEMIN", "Semin"],
  ["ISOTECH", "BRAND-ISOTECH", "Isotech"],
] as const;

const productDefinitions = [
  ["KNAUF-U-F47", "KNAUF", "Suspente U/F47 plafond"],
  ["KNAUF-PIVOT-F47", "KNAUF", "Suspente pivot F47"],
  ["KNAUF-PIVOT-ACOUSTIQUE", "KNAUF", "Suspente pivot acoustique F47"],
  ["KNAUF-RESSORT-F47", "KNAUF", "Suspente à ressort F47"],
  ["KNAUF-PIED-REGLABLE", "KNAUF", "Pied de suspente réglable F47"],
  ["KNAUF-REGLABLE-F47", "KNAUF", "Suspente réglable F47"],
  ["KNAUF-U-F47-HYDRO", "KNAUF", "Suspente U/F47 Hydro"],
  ["SINIAT-PREGYMETAL", "SINIAT", "Suspente PRÉGYMÉTAL"],
  ["ISOLPRO-STANDARD", "ISOLPRO", "Suspentes standard"],
  ["ISOLPRO-LANGUETTE", "ISOLPRO", "Suspentes standard avec languette"],
  ["ISOLPRO-GRANDES-LONGUEURS", "ISOLPRO", "Suspentes grandes longueurs"],
  ["ISOLPRO-SECABLES", "ISOLPRO", "Suspentes sécables"],
  ["PAI-NT-1845", "PAI", "Suspentes NT 18-45"],
  ["PAI-1845", "PAI", "Suspentes 18-45"],
  ["PAI-SECABLES", "PAI", "Suspentes sécables toutes fourrures"],
  ["GYPSO-UNIVERSELLE", "GYPSO", "Suspente universelle Gypso"],
  ["GYPSO-RENFORCEE", "GYPSO", "Suspente universelle renforcée Gypso"],
  ["GYPSO-SECABLE", "GYPSO", "Suspente modulaire sécable Gypso"],
  ["SEMIN-ACIER-F45", "SEMIN", "Suspente acier F45"],
  ["SEMIN-SECABLE-F45", "SEMIN", "Suspente sécable F45"],
  ["ISOTECH-UNIVERSELLE", "ISOTECH", "Suspente universelle F47/F45"],
] as const;

type ModelDefinition = {
  product: string;
  code: string;
  title: string;
  length?: number;
  min?: number;
  max?: number;
  compatibility: string;
  support?: string;
  material?: string;
  reference?: string;
  ean?: string;
  distributorCode?: string;
  packageName?: string;
  packageQuantity?: number;
  packagesPerPallet?: number;
  status?: Status;
  note?: string;
  source: string;
  existingModelId?: string;
};

const placoSource = "https://www.placo.fr/documents/brochure-marketing/brochure-ls-2025-web.pdf";
const knaufGuide = "https://knauf.com/api/download-center/v1/assets/50c40dd0-5aca-4f9a-bbf4-6097a00d0950?country=FR&download=true&locale=fr-FR";
const isolproStandard = "https://www.isolpro.fr/catalogue/accessoires-de-pose/suspentes-standard/";
const isolproLong = "https://www.isolpro.fr/catalogue/accessoires-de-pose/suspentes-grandes-longueurs/";
const seminRange = "https://www.semin.com/sites/default/files/2025-03/SEMIN%20GAMME%20OSSATURES%20%26%20ACCESSOIRES%2020%2002%202025%20%283%29.pdf";
const seminSheet = "https://www.semin.com/modules/custom/import_product/fichiers/313545_semin_ft_suspentes_lo.pdf";
const isotechSheet = "https://www.isotech-accessoires.fr/data/suspentes-universelles-f47f45.pdf";

const models: ModelDefinition[] = [
  {product:"PLACO-STIL",code:"COURTE-81",title:"Courte 81 mm",length:81,min:20,max:60,compatibility:"F45 / Stil F 530",support:"Bois",material:"Acier galvanisé",reference:"E01180100",ean:"3496250213630",packageName:"Boîte",packageQuantity:100,packagesPerPallet:400,source:placoSource,existingModelId:"MODEL-SUSP-STIL-F530-COURTE"},
  {product:"PLACO-STIL",code:"LONGUE-171",title:"Longue 171 mm",length:171,min:20,max:150,compatibility:"F45 / Stil F 530",support:"Bois",material:"Acier galvanisé",reference:"E01500100",ean:"3496250213722",packageName:"Boîte",packageQuantity:100,packagesPerPallet:200,source:placoSource,existingModelId:"MODEL-SUSP-STIL-F530-LONGUE"},
  {product:"PLACO-STIL",code:"LONGUE-240",title:"Longue 240 mm",length:240,min:20,max:220,compatibility:"F45 / Stil F 530",support:"Bois",material:"Acier galvanisé",reference:"E01530240",ean:"3496250310643",packageName:"Boîte",packageQuantity:50,packagesPerPallet:168,source:placoSource},
  {product:"PLACO-STIL",code:"MAXI-300",title:"Maxi 300 mm",length:300,min:20,max:280,compatibility:"F45 / Stil F 530",support:"Bois",material:"Acier galvanisé",reference:"H85400000",ean:"3496250213753",packageName:"Boîte",packageQuantity:100,packagesPerPallet:78,source:placoSource,existingModelId:"MODEL-SUSP-STIL-F530-MAXI"},
  {product:"PLACO-STIL",code:"MAXI-400",title:"Maxi 400 mm",length:400,min:20,max:380,compatibility:"F45 / Stil F 530",support:"Bois",material:"Acier galvanisé",reference:"H85440000",ean:"3496250310582",packageName:"Boîte",packageQuantity:50,packagesPerPallet:92,source:placoSource},
  {product:"PLACO-SECABLE",code:"600",title:"600 mm",length:600,min:80,max:580,compatibility:"F45 / Stil F 530",support:"Bois",material:"Acier galvanisé",reference:"E01210050",ean:"3496250213920",packageName:"Boîte",packageQuantity:50,status:"À valider",note:"Nombre de boîtes par palette à confirmer.",source:"https://www.placo.fr/Produits/accessoires/suspente-secable-stil-f-530",existingModelId:"MODEL-SUSP-SEC600"},

  {product:"KNAUF-U-F47",code:"STANDARD",title:"Standard",compatibility:"F47",support:"Bois",material:"Acier galvanisé",reference:"00050760",packageName:"Boîte",packageQuantity:100,source:knaufGuide},
  {product:"KNAUF-PIVOT-F47",code:"STANDARD",title:"Standard",compatibility:"F47",support:"Béton / tige filetée",material:"Acier galvanisé",reference:"002820137",packageName:"Boîte",packageQuantity:100,source:knaufGuide},
  {product:"KNAUF-PIVOT-ACOUSTIQUE",code:"M6",title:"Standard M6",compatibility:"F47",support:"Tige filetée",material:"Acier galvanisé",reference:"00751638",ean:"3551660544504",packageName:"Paquet",packageQuantity:50,note:"Charge annoncée : 50 daN.",source:"https://knauf.com/fr-FR/p/produit/suspente-pivot-acoustique-f47-23719_4091"},
  {product:"KNAUF-RESSORT-F47",code:"STANDARD",title:"Standard",compatibility:"F47",support:"Tige lisse",material:"Acier galvanisé",reference:"00900349",ean:"3551660132961",packageName:"Paquet",packageQuantity:100,note:"Charge annoncée : 45 daN.",source:"https://knauf.com/fr-FR/p/produit/suspente-a-ressort-f47-10314_4091"},
  {product:"KNAUF-PIED-REGLABLE",code:"PIED",title:"Pied",compatibility:"F47",support:"Bois",material:"Acier galvanisé",reference:"00050049",ean:"3551660008358",packageName:"Paquet",packageQuantity:100,source:"https://knauf.com/fr-FR/p/produit/pied-de-suspente-reglable-f47-10524_4091"},
  {product:"KNAUF-REGLABLE-F47",code:"TETE-240-330",title:"Tête 240/330",min:240,max:330,compatibility:"F47",support:"Bois",material:"Acier galvanisé",reference:"00088063",packageName:"Boîte",packageQuantity:100,note:"Composant d’une combinaison de fournitures.",source:knaufGuide},
  {product:"KNAUF-REGLABLE-F47",code:"TETE-330-430",title:"Tête 330/430",min:330,max:430,compatibility:"F47",support:"Bois",material:"Acier galvanisé",reference:"00088064",packageName:"Boîte",packageQuantity:100,note:"Composant d’une combinaison de fournitures.",source:knaufGuide},
  {product:"KNAUF-U-F47-HYDRO",code:"HYDRO",title:"Hydro",compatibility:"F47",support:"Bois",material:"Protection renforcée",reference:"00775111",ean:"4029369082409",packageName:"Paquet",packageQuantity:50,source:"https://knauf.com/fr-FR/p/produit/suspente-u-f47-hydro-13276_4091"},

  {product:"SINIAT-PREGYMETAL",code:"P11",title:"P11 – 95 mm",length:95,compatibility:"S47 / F47",support:"Bois",material:"Acier galvanisé Z275",ean:"3334160208554",status:"À valider",source:"https://www.siniat.fr/fr-fr/produits-et-systemes/produits/accessoires/accessoires-plafonds/suspente-pregymetal-p11-3334160208554/"},
  {product:"SINIAT-PREGYMETAL",code:"P21",title:"P21 – 188 mm",length:188,compatibility:"S47 / F47",support:"Bois",material:"Acier galvanisé Z275",ean:"3334160200879",status:"À valider",source:"https://www.siniat.fr/fr-fr/produits-et-systemes/produits/accessoires/accessoires-plafonds/suspente-pregymetal-p21-3334160200879/"},
  {product:"SINIAT-PREGYMETAL",code:"P31",title:"P31 – 300 mm",length:300,compatibility:"S47 / F47",support:"Bois",material:"Acier galvanisé Z275",reference:"4045256",ean:"3334160197223",status:"À valider",source:"https://www.siniat.fr/fr-fr/produits-et-systemes/produits/accessoires/accessoires-plafonds/suspente-pregymetal-p31-3334160197223/"},
  {product:"SINIAT-PREGYMETAL",code:"P41",title:"P41 – 450 mm",length:450,compatibility:"S47 / F47",support:"Bois",material:"Acier galvanisé",ean:"3334160194680",status:"À valider",note:"Traitement Z140/Z275 à confirmer.",source:"https://www.siniat.fr/fr-fr/produits-et-systemes/produits/enduits-colles-et-mortiers-adhesifs/colles/suspente-pregymetal-p41-3334160194680/"},
  {product:"SINIAT-PREGYMETAL",code:"P61",title:"P61 sécable – 630 mm",length:630,compatibility:"S47 / F47",support:"Bois",material:"Acier galvanisé Z140",ean:"3334160203511",status:"À valider",note:"Sécable par modules de 70 mm.",source:"https://www.siniat.fr/fr-fr/produits-et-systemes/produits/accessoires/accessoires-plafonds/suspente-pregymetal-p61-3334160203511/"},

  {product:"ISOLPRO-STANDARD",code:"COURTE-F45-80",title:"Courte F45 – 80 mm",length:80,compatibility:"F45",support:"Bois",material:"Acier",packageName:"Boîte",packageQuantity:100,status:"À valider",source:isolproStandard},
  {product:"ISOLPRO-STANDARD",code:"LONGUE-F45-180",title:"Longue F45 – 180 mm",length:180,compatibility:"F45",support:"Bois",material:"Acier",packageName:"Boîte",packageQuantity:100,status:"À valider",source:isolproStandard},
  {product:"ISOLPRO-LANGUETTE",code:"F45-240",title:"F45 – 240 mm",length:240,compatibility:"F45",support:"Bois",material:"Acier",reference:"SUS45240B",ean:"3700597200650",packageName:"Boîte",packageQuantity:50,packagesPerPallet:291,source:"https://www.isolpro.fr/suspentes-de-240-pour-f45-avec-languette-boite-de-50--2023"},
  {product:"ISOLPRO-LANGUETTE",code:"F45-300",title:"F45 – 300 mm",length:300,compatibility:"F45",support:"Bois",material:"Acier",reference:"SUS45300B",packageName:"Boîte",packageQuantity:50,status:"À valider",note:"Référence à contrôler.",source:isolproStandard},
  {product:"ISOLPRO-LANGUETTE",code:"F45-400",title:"F45 – 400 mm",length:400,compatibility:"F45",support:"Bois",material:"Acier",reference:"SUS45400B",packageName:"Boîte",packageQuantity:50,status:"À valider",note:"Référence à contrôler.",source:isolproStandard},
  {product:"ISOLPRO-GRANDES-LONGUEURS",code:"F45-500",title:"F45 – 500 mm",length:500,compatibility:"F45",support:"Bois",material:"Acier renforcé",reference:"SUS45500B",ean:"3700597201923",packageName:"Paquet",packageQuantity:25,packagesPerPallet:100,source:"https://www.isolpro.fr/suspentes-de-500-pour-f45-avec-languette-paquet-de-25--2027"},
  {product:"ISOLPRO-GRANDES-LONGUEURS",code:"F45-600",title:"F45 – 600 mm",length:600,compatibility:"F45",support:"Bois",material:"Acier renforcé",reference:"SUS45600B",ean:"3700597201930",packageName:"Paquet",packageQuantity:25,packagesPerPallet:100,source:"https://www.isolpro.fr/suspentes-de-600-pour-f45-avec-languette-paquet-de-25--2029"},
  {product:"ISOLPRO-GRANDES-LONGUEURS",code:"F45-800",title:"F45 – 800 mm",length:800,compatibility:"F45",support:"Bois",material:"Acier 10/10e",reference:"SUS45800B",packageName:"Paquet",packageQuantity:25,status:"À valider",note:"Référence à contrôler.",source:isolproLong},
  {product:"ISOLPRO-GRANDES-LONGUEURS",code:"F45-1000",title:"F45 – 1000 mm",length:1000,compatibility:"F45",support:"Bois",material:"Acier 10/10e",reference:"SUS451000B",ean:"3700597201954",packageName:"Paquet",packageQuantity:25,packagesPerPallet:60,source:"https://www.isolpro.fr/suspentes-longues-10-10eme-de-1000-pour-f45-paquet-de-25--2032"},
  ...[480,560,640,1040].map((length):ModelDefinition=>({product:"ISOLPRO-SECABLES",code:`F45-${length}`,title:`F45 – ${length} mm`,length,compatibility:"F45",support:"Bois",material:"Acier galvanisé",packageName:length<=560?"Boîte":"Paquet",packageQuantity:length<=560?50:25,status:"À valider",source:"https://www.isolpro.fr/catalogue/accessoires-de-pose/"})),

  {product:"PAI-NT-1845",code:"COURTE-80",title:"Courte 80 mm",length:80,compatibility:"18-45 / F45",support:"Bois",material:"Acier galvanisé 0,75 mm",reference:"SC45NT080",packageName:"Boîte",packageQuantity:100,packagesPerPallet:100,note:"Charge maximale : 41 daN.",source:"https://psigroupe.com/sites/default/files/catalogue-guide/pdf/catalogue_spppai_2026.pdf"},
  {product:"PAI-NT-1845",code:"LONGUE-170",title:"Longue 170 mm",length:170,compatibility:"18-45 / F45",support:"Bois",material:"Acier galvanisé 0,75 mm",reference:"SL45NT170",packageName:"Boîte",packageQuantity:100,packagesPerPallet:100,note:"Charge maximale : 41 daN.",source:"https://www.psigroupe.com/fr/pai/suspente-nt-longue-fourrure-18-45-lg-170-mm"},
  {product:"PAI-1845",code:"COURTE-85",title:"Courte 85 mm",length:85,compatibility:"18-45 / F45",support:"Bois",material:"Acier galvanisé 0,75 mm",reference:"ACSP080",packageName:"Boîte",packageQuantity:100,packagesPerPallet:100,note:"Charge permanente : 38 daN.",source:"https://psigroupe.com/sites/default/files/catalogue-guide/pdf/catalogue_spppai_2026.pdf"},
  {product:"PAI-1845",code:"LONGUE-190",title:"Longue 190 mm",length:190,compatibility:"18-45 / F45",support:"Bois",material:"Acier galvanisé 0,75 mm",reference:"ACSP170",packageName:"Boîte",packageQuantity:100,note:"Charge permanente : 38 daN.",source:"https://www.psigroupe.com/pai/suspente-longue-fourrure-18-45-lg-190-mm"},
  ...[240,310,400,480].map((length):ModelDefinition=>({product:"PAI-1845",code:`SUPER-${length}`,title:`Super longue ${length} mm`,length,compatibility:"18-45 / F45",support:"Bois",material:"Acier galvanisé 0,75 mm",reference:`ACSP${length}`,status:"À valider",note:"Conditionnement à confirmer.",source:length===310?"https://psigroupe.com/sites/default/files/documentation/fiche-produit/suspente_superlongue310-18-45-acsp310ft_pai_0.pdf":"https://www.psigroupe.com/fr/mediatheque"})),
  {product:"PAI-SECABLES",code:"600",title:"Sécable 600 mm",length:600,compatibility:"F45 / F47",support:"Bois",material:"Acier galvanisé",reference:"SSECO600",status:"À valider",source:"https://psigroupe.com/sites/default/files/catalogue-guide/pdf/la_gamme_2026_spppai.pdf"},
  {product:"PAI-SECABLES",code:"1000",title:"Sécable 1000 mm",length:1000,compatibility:"F45 / F47",support:"Bois",material:"Acier galvanisé",reference:"SSECI000",status:"À valider",source:"https://psigroupe.com/sites/default/files/catalogue-guide/pdf/la_gamme_2026_spppai.pdf"},

  {product:"GYPSO-UNIVERSELLE",code:"170",title:"F45/F47 – 170 mm",length:170,compatibility:"F45 / F47",support:"Bois",material:"Acier galvanisé 1 mm",reference:"B0059050",distributorCode:"64971-1",packageName:"Boîte",packageQuantity:100,source:"https://www.chausson.fr/materiaux/suspente-universelle-gypso-acier-galvanise-fourrure-f45-f47-p-64971-1"},
  ...[[240,"B0059026","579015-1"],[300,"B0059036","579012-1"],[400,"B0059046","579016-1"],[480,"B0059048","191325-1"]].map(([length,reference,distributorCode]):ModelDefinition=>({product:"GYPSO-RENFORCEE",code:String(length),title:`F45 – ${length} mm`,length:Number(length),compatibility:"F45",support:"Bois",material:"Acier galvanisé",reference:String(reference),distributorCode:String(distributorCode),packageName:"Boîte",packageQuantity:50,source:`https://www.chausson.fr/materiaux/suspente-universelle-renforcee-gypso-acier-galvanise-fourrure-f45-p-${distributorCode}`})),
  {product:"GYPSO-SECABLE",code:"1000",title:"F45/F47 – 1000 mm",length:1000,compatibility:"F45 / F47",support:"Bois",material:"Acier galvanisé",distributorCode:"687776-1",packageName:"Boîte",packageQuantity:25,status:"À valider",source:"https://media.chausson.fr/catalogues/Catalogue-GYPSO-HD.pdf"},

  {product:"SEMIN-ACIER-F45",code:"SC09-80",title:"SC09 – 80 mm",length:80,compatibility:"F45",support:"Bois",material:"Acier galvanisé",packageName:"Boîte",packageQuantity:100,packagesPerPallet:450,status:"À valider",source:seminRange},
  ...[["SL18",170,"A02707","3585501027079",100,300],["SL24",240,"A02709","3585501027093",50,240],["SL30",300,"A02971","3585501029714",50,200],["SL40",400,"A02762","3585501027628",50,160],["SL50",500,"A06260","3585501062605",50,null],["SL60",600,"A06261","3585501062612",50,null]].map(([code,length,reference,ean,quantity,pallet]):ModelDefinition=>({product:"SEMIN-ACIER-F45",code:String(code),title:`${code} – ${length} mm`,length:Number(length),compatibility:"F45",support:"Bois",material:"Acier galvanisé 0,75 mm",reference:String(reference),ean:String(ean),packageName:"Boîte",packageQuantity:Number(quantity),packagesPerPallet:pallet===null?undefined:Number(pallet),source:seminSheet})),
  ...[[480,50,120],[560,50,30],[640,25,160],[720,25,null],[800,25,null],[880,25,null],[960,25,null],[1040,25,null]].map(([length,quantity,pallet]):ModelDefinition=>({product:"SEMIN-SECABLE-F45",code:String(length),title:`${length} mm`,length:Number(length),compatibility:"F45",support:"Bois",material:"Acier galvanisé",packageName:"Boîte",packageQuantity:Number(quantity),packagesPerPallet:pallet===null?undefined:Number(pallet),status:"À valider",source:seminRange})),

  ...[[200,0.70],[250,0.70],[300,0.70],[400,0.80],[500,0.80],[600,0.80],[700,1.00],[800,1.00]].map(([length,thickness]):ModelDefinition=>({product:"ISOTECH-UNIVERSELLE",code:`SU${length}`,title:`SU${length} – ${length} mm`,length:Number(length),compatibility:"F45 / F47",support:"Bois",material:`Acier galvanisé Z140 – ${Number(thickness).toFixed(2).replace(".",",")} mm`,reference:`SU${length}`,packageName:"Boîte",packageQuantity:50,packagesPerPallet:length===400?155:undefined,status:length===400?"À valider":"Publié",note:length===400?"Épaisseur 0,70/0,80 mm contradictoire selon les fiches fabricant.":undefined,source:length===400?"https://isotech-accessoires.fr/catalogue/suspentes-et-eclisses/suspente-universelle-f47-f45-su400":isotechSheet})),
];

const brandIdByCode = new Map(brands.map(([code,id]) => [code,id]));
const productId = (code:string) => code === "PLACO-STIL" ? "PRODUCT-SUSP-STIL-F530" : code === "PLACO-SECABLE" ? "CATALOG-PRODUCT-SUSP-SEC600" : `CATALOG-PRODUCT-${code}`;
const modelId = (model:ModelDefinition) => model.existingModelId || `CATALOG-MODEL-${model.product}-${model.code}`;

const brandRecords:SeedRecord[] = brands.filter(([code])=>code!=="PLACO").map(([code,id,title])=>({
  id,kind:"brand",title,summary:`Marque du catalogue de suspentes en acier galvanisé.`,sourcePage:105,status:"Publié",data:{code:code.toLowerCase(),catalog_import:IMPORT_ID}
}));

const productRecords:SeedRecord[] = productDefinitions.map(([code,brandCode,title])=>{
  const compatibilities=[...new Set(models.filter(model=>model.product===code).map(model=>model.compatibility))];
  return {id:productId(code),kind:"product",title,summary:`Produit ${title} et ses modèles disponibles.`,sourcePage:105,status:"Publié",data:{family_id:FAMILY_ID,supply_type_id:TYPE_ID,brand_id:String(brandIdByCode.get(brandCode)),fourrures_compatibles:compatibilities,compatible_systeme_f45:compatibilities.some(value=>!value.match(/^(F47|S47)/)),catalog_import:IMPORT_ID}};
});

const modelRecords:SeedRecord[] = models.filter(model=>!model.existingModelId).map(model=>({
  id:modelId(model),kind:"product_model",title:model.title,summary:`Modèle ${model.title} du produit correspondant.`,sourcePage:105,status:model.status||"Publié",data:{product_id:productId(model.product),dimension_mm:model.length??null,reglage_min_mm:model.min??null,reglage_max_mm:model.max??null,fourrure_compatible:model.compatibility,compatible_systeme_f45:!model.compatibility.match(/^(F47|S47)/),support:model.support||null,matiere:model.material||null,reference_a_confirmer:model.reference||null,ean_a_confirmer:model.ean||null,conditionnement_a_confirmer:model.packageName&&model.packageQuantity?`${model.packageName} de ${model.packageQuantity}`:model.packageName||null,source_url:model.source,note_verification:model.note||null,catalog_import:IMPORT_ID}
}));

const commercialRecords:SeedRecord[] = models.filter(model=>model.reference).map(model=>({
  id:`CATALOG-REF-${model.product}-${model.code}`,kind:"commercial_reference",title:String(model.reference),summary:`Référence commerciale du modèle ${model.title}.`,sourcePage:105,status:model.status||"Publié",data:{model_id:modelId(model),reference_fabricant:model.reference||null,ean:model.ean||null,code_distributeur:model.distributorCode||null,conditionnement:model.packageName&&model.packageQuantity?`${model.packageName} de ${model.packageQuantity}`:model.packageName||null,quantite_par_conditionnement:model.packageQuantity??null,unite_vente:model.packageName||null,conditionnements_par_palette:model.packagesPerPallet??null,prix_ht:null,source_url:model.source,catalog_import:IMPORT_ID}
}));

export const existingCatalogModelUpdates:SeedRecord[] = models.filter(model=>model.existingModelId).map(model=>({
  id:modelId(model),kind:"product_model",title:model.title,summary:`Modèle ${model.title} du produit correspondant.`,sourcePage:105,status:model.status||"Publié",data:{product_id:productId(model.product),dimension_mm:model.length??null,reglage_min_mm:model.min??null,reglage_max_mm:model.max??null,fourrure_compatible:model.compatibility,compatible_systeme_f45:true,support:model.support||null,matiere:model.material||null,reference_a_confirmer:model.reference||null,ean_a_confirmer:model.ean||null,conditionnement_a_confirmer:model.packageName&&model.packageQuantity?`${model.packageName} de ${model.packageQuantity}`:model.packageName||null,source_url:model.source,note_verification:model.note||null,catalog_import:IMPORT_ID}
}));

const sourceRecord:SeedRecord = {id:"SOURCE-SUSPENSION-CATALOG-2026",kind:"source",title:"Catalogue multimarque – suspentes acier galvanisé",summary:"Recherche fabricants Placo, Knauf, Siniat, Isolpro, PAI, Gypso, Semin et Isotech.",sourcePage:105,status:"À valider",data:{import_id:IMPORT_ID,scope:"Marché français · plafonds sur fourrures F45 et produits F47/S47 séparés",model_count:models.length}};

export const suspensionCatalogRecords:SeedRecord[] = [...brandRecords,...productRecords,...modelRecords,...commercialRecords,sourceRecord];
export const suspensionCatalogBootstrapIds = new Set([
  "F530-SYSTEM","TYPE-SUSPENSION-SOLIVAGE","PRODUCT-SUSP-STIL-F530","CATALOG-PRODUCT-SUSP-SEC600","SUSP-CLM",
  ...existingCatalogModelUpdates.map(record=>record.id),...suspensionCatalogRecords.map(record=>record.id)
]);
