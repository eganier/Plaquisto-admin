export type RecordKind = "work" | "insulation_series" | "fixing_system" | "quantity_item" | "rule";
export type RecordStatus = "Publié" | "À valider";
export type ReferenceRecord = {
  id: string;
  kind: RecordKind;
  title: string;
  summary: string;
  sourcePage: number;
  status: RecordStatus;
  data: Record<string, unknown>;
};

export type InsulationPoint = {thickness_mm:number;max_weight_kg_m2:number};
export type FixingComponent = {name:string;quantity:number;unit:"unité"|"ml";calculation:"fixed"|"plenum_m"};

const insulationSeries = (
  id:string,
  title:string,
  material:string,
  conductivity:string,
  density:string,
  thicknesses:number[],
  weights:number[],
):ReferenceRecord => ({
  id,kind:"insulation_series",title,
  summary:`${material} · ${conductivity} · ${density}`,
  sourcePage:1,status:"Publié",
  data:{material,conductivity,density,weight_policy:"maximum",values:thicknesses.map((thickness_mm,index)=>({thickness_mm,max_weight_kg_m2:weights[index]}))},
});

const fixingSystem = (
  id:string,title:string,support:string,min:number,max:number,components:FixingComponent[],
  options:{pareVapeur?:boolean;maxInsulation?:number;maxExclusive?:boolean}={},
):ReferenceRecord => ({
  id,kind:"fixing_system",title,
  summary:`${support} · plénum de ${min} à ${max} mm`,
  sourcePage:support==="Plancher bois horizontal"?2:3,status:"Publié",
  data:{support,plenum_min_mm:min,plenum_max_mm:max,pare_vapeur_compatible:options.pareVapeur??false,max_insulation_kg_m2:options.maxInsulation??15,max_insulation_exclusive:options.maxExclusive??false,components},
});

const fixed = (name:string,quantity=1):FixingComponent => ({name,quantity,unit:"unité",calculation:"fixed"});
const rod = ():FixingComponent => ({name:"Tige filetée Ø 6 mm",quantity:1,unit:"ml",calculation:"plenum_m"});

const quantityItem = (id:string,title:string,unit:string,values:number[]):ReferenceRecord => ({
  id,kind:"quantity_item",title,summary:`Quantité indicative par m² · ${unit}`,sourcePage:4,status:"Publié",
  data:{unit,values:{simple_040:values[0],simple_050:values[1],simple_060:values[2],double_040:values[3],double_050:values[4],double_060:values[5]}},
});

const glassThicknesses=[45,60,80,100,120,140,160,200,240,300];
const rockThicknesses=[45,60,80,100,120,140,160,180,200,240,300];
const woodThicknesses=[40,45,60,80,100,120,140,160,180,200,220,240,300];
const looseThicknesses=[40,60,80,100,120,140,160,180,200,220,240,260,280,300,320,350,400];

export const plaquistoRecords:ReferenceRecord[]=[
  {id:"WORK-PLAFOND-FOURRURE-HORIZONTAL",kind:"work",title:"Plafond sur fourrures horizontal",summary:"Ouvrage de plafond suspendu sur fourrures F45. La configuration détermine l’isolant, le système de fixation et les quantités indicatives.",sourcePage:1,status:"Publié",data:{code:"plafond-fourrure-horizontal",fourrure:"F45",source:"Plaquisto_Tableaux_Plafond_fourrure horizontal.numbers"}},

  insulationSeries("ISO-VERRE-040","Laine de verre · λ 0,040","Laine de verre","λ ≈ 0,040","≈ 12 kg/m³",glassThicknesses,[0.54,0.72,0.96,1.20,1.44,1.68,1.92,2.40,2.88,3.60]),
  insulationSeries("ISO-VERRE-035","Laine de verre · λ 0,035","Laine de verre","λ ≈ 0,035","≈ 15-20 kg/m³",glassThicknesses,[0.90,1.20,1.60,2.00,2.40,2.80,3.20,4.00,4.80,6.00]),
  insulationSeries("ISO-VERRE-032","Laine de verre · λ 0,032","Laine de verre","λ ≈ 0,032","≈ 20-30 kg/m³",glassThicknesses,[1.35,1.80,2.40,3.00,3.60,4.20,4.80,6.00,7.20,9.00]),
  insulationSeries("ISO-ROCHE-040","Laine de roche · λ 0,040","Laine de roche","λ ≈ 0,040","≈ 30 kg/m³",rockThicknesses,[1.35,1.80,2.40,3.00,3.60,4.20,4.80,5.40,6.00,7.20,9.00]),
  insulationSeries("ISO-ROCHE-035","Laine de roche · λ 0,035","Laine de roche","λ ≈ 0,035","≈ 32-40 kg/m³",rockThicknesses,[1.80,2.40,3.20,4.00,4.80,5.60,6.40,7.20,8.00,9.60,12.00]),
  insulationSeries("ISO-ROCHE-034","Laine de roche · λ 0,034","Laine de roche","λ ≈ 0,034","≈ 50 kg/m³",rockThicknesses,[2.25,3.00,4.00,5.00,6.00,7.00,8.00,9.00,10.00,12.00,15.00]),
  insulationSeries("ISO-BOIS-040","Laine de bois · λ 0,040","Laine de bois","λ ≈ 0,040","≈ 45 kg/m³",woodThicknesses,[1.80,2.03,2.70,3.60,4.50,5.40,6.30,7.20,8.10,9.00,9.90,10.80,13.50]),
  insulationSeries("ISO-BOIS-038","Laine de bois · λ 0,038","Laine de bois","λ ≈ 0,038","≈ 50 kg/m³",woodThicknesses,[2.00,2.25,3.00,4.00,5.00,6.00,7.00,8.00,9.00,10.00,11.00,12.00,15.00]),
  insulationSeries("ISO-BOIS-036","Laine de bois · λ 0,036","Laine de bois","λ ≈ 0,036","≈ 50-55 kg/m³",woodThicknesses,[2.20,2.48,3.30,4.40,5.50,6.60,7.70,8.80,9.90,11.00,12.10,13.20,16.50]),
  insulationSeries("ISO-CELLULOSE","Ouate de cellulose","Ouate de cellulose","Non renseignée","32 kg/m³",looseThicknesses,[1.12,1.68,2.24,2.80,3.36,3.92,4.48,5.04,5.60,6.16,6.72,7.28,7.84,8.40,8.96,9.80,11.20]),
  insulationSeries("ISO-BIOSOURCE","Biosourcé · chanvre, lin, canton","Biosourcé (chanvre, lin, canton)","Non renseignée","32 kg/m³",looseThicknesses,[1.20,1.80,2.40,3.00,3.60,4.20,4.80,5.40,6.00,6.60,7.20,7.80,8.40,9.00,9.60,10.50,12.00]),

  fixingSystem("FIX-BOIS-GALVA","Suspente acier galvanisé","Plancher bois horizontal",20,480,[fixed("Vis TTPC 35",2),fixed("Suspente acier galvanisé")],{maxInsulation:15,maxExclusive:false}),
  fixingSystem("FIX-BOIS-PARE-VAPEUR","Suspente composite pour pare-vapeur","Plancher bois horizontal",20,280,[fixed("Vis TTPC 35",2),fixed("Suspente composite pour pare-vapeur")],{pareVapeur:true,maxInsulation:15,maxExclusive:false}),
  fixingSystem("FIX-BOIS-TIGE","Demi-collier, tige filetée et cavalier","Plancher bois horizontal",20,1000,[fixed("Vis TTPC 35",2),fixed("Demi-collier"),rod(),fixed("Cavalier pivot")],{maxInsulation:15,maxExclusive:false}),
  fixingSystem("FIX-BETON-TIGE","Cheville, piton, tige filetée et cavalier","Dalle béton",20,1000,[fixed("Cheville crampon 8 mm"),fixed("Piton de suspension 8 mm"),rod(),fixed("Cavalier pivot")]),
  fixingSystem("FIX-CREUX-TIGE","Cheville à bascule, tige filetée et cavalier","Plafond creux",20,1000,[fixed("Cheville à bascule"),rod(),fixed("Cavalier pivot")]),
  fixingSystem("FIX-HOURDIS-SEUL","Suspente hourdis seule","Plancher hourdis béton",20,40,[fixed("Suspente hourdis")]),
  fixingSystem("FIX-HOURDIS-GALVA","Suspente hourdis et suspente galvanisée","Plancher hourdis béton",20,480,[fixed("Suspente hourdis"),fixed("Suspente acier galvanisé")]),
  fixingSystem("FIX-HOURDIS-GRIFFE-GALVA","Suspente hourdis à griffe et suspente galvanisée","Plancher hourdis béton",60,480,[fixed("Suspente hourdis à griffe à serrer"),fixed("Suspente acier galvanisé")]),
  fixingSystem("FIX-HOURDIS-GRIFFE-TIGE","Suspente hourdis à griffe, tige filetée et cavalier","Plancher hourdis béton",60,1000,[fixed("Suspente hourdis à griffe à serrer"),rod(),fixed("Cavalier pivot")]),
  fixingSystem("FIX-METAL-TIGE","Suspente bord de tôle, tige filetée et cavalier","Charpente métallique",20,1000,[fixed("Suspente bord de tôle"),rod(),fixed("Cavalier pivot")]),

  quantityItem("QTY-PLAQUE","Plaque BA13","m²",[1.05,1.05,1.05,2.10,2.10,2.10]),
  quantityItem("QTY-FOURRURE","Fourrure F45","ml",[2.52,2.10,1.79,2.52,2.10,1.79]),
  quantityItem("QTY-CORNIERE","Cornière d’angle","ml",[0.47,0.47,0.47,0.47,0.47,0.47]),
  quantityItem("QTY-FIXATION","Fournitures pour système de fixation","unité",[2.20,1.84,1.56,2.20,1.84,1.56]),
  quantityItem("QTY-ECLISSE","Éclisse","unité",[0.25,0.25,0.21,0.25,0.25,0.21]),
  quantityItem("QTY-VIS-25","Vis TTPC 25 mm (1er parement)","unité",[20,17,15,13,11,10]),
  quantityItem("QTY-VIS-35","Vis TTPC 35 mm (2e parement)","unité",[0,0,0,20,17,15]),
  quantityItem("QTY-BANDE","Bande PP grand rouleau","ml",[1.58,1.58,1.58,1.58,1.58,1.58]),
  quantityItem("QTY-ENDUIT-POUDRE","Enduit poudre collage, charge, finition","kg",[0.37,0.37,0.37,0.37,0.37,0.37]),
  quantityItem("QTY-ENDUIT-PATE","Enduit pâte prêt à l’emploi, collage, charge, finition","kg",[0.53,0.53,0.53,0.53,0.53,0.53]),

  {id:"RULE-ISOLATION-SPACING",kind:"rule",title:"Entraxe selon le poids de l’isolant",summary:"La valeur maximale de la plage de poids est toujours retenue.",sourcePage:2,status:"Publié",data:{weight_policy:"maximum",bands:[{min_kg_m2:0,max_kg_m2:6,max_exclusive:true,spacing_m:0.6},{min_kg_m2:6,max_kg_m2:10,max_exclusive:true,spacing_m:0.5},{min_kg_m2:10,max_kg_m2:15,max_exclusive:false,spacing_m:0.4}]}},
  {id:"RULE-ROD-LENGTH",kind:"rule",title:"Calcul des tiges filetées",summary:"Les tiges filetées sont calculées en mètres linéaires.",sourcePage:3,status:"Publié",data:{formula:"nombre_systemes × plenum_mm / 1000",unit:"ml"}},
];

export const recordLabels:Record<RecordKind,string>={work:"Ouvrages",insulation_series:"Isolation",fixing_system:"Systèmes de fixation",quantity_item:"Quantitatifs",rule:"Règles de calcul"};
