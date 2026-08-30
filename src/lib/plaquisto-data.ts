export type RecordKind = "work" | "insulation_series" | "fixing_system" | "facing" | "quantity_item" | "rule";
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
export type WallInsulationLambda = {lambda_w_mk:number;thicknesses_mm:number[]};
export type FixingComponent = {name:string;quantity:number;unit:"unité"|"ml";calculation:"fixed"|"plenum_m"};
export type FacingDimension = {width_mm:number;length_mm:number};
export type FacingFunction = "standard"|"hydrofuge"|"incendie"|"phonique"|"haute_durete"|"quatre_bords_amincis"|"tres_haute_resistance_eau";
export type VaporBarrierComponent = {
  name:string;
  quantity:number;
  unit:"unité"|"ml"|"m²";
  calculation:"area"|"fourrure_ml";
  exclude_when_system_handles_vapor_barrier?:boolean;
};

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

const wallInsulationSeries = (
  id:string,code:string,title:string,lambdas:number[],thicknesses:number[],sourcePage:number,
):ReferenceRecord => ({
  id,kind:"insulation_series",title,
  summary:`${code} · λ de ${lambdas[0].toFixed(3).replace(".",",")} à ${lambdas.at(-1)!.toFixed(3).replace(".",",")} W/(m·K)`,
  sourcePage,status:"Publié",
  data:{category:"wall_insulation",schema_version:1,code,material:title,compatible_work_codes:["doublage-peripherique-rails-montants"],lambdas:lambdas.map(lambda_w_mk=>({lambda_w_mk,thicknesses_mm:thicknesses}))},
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

const facingFormats:Record<string,FacingDimension[]>={
 BA6:[{width_mm:1200,length_mm:2500},{width_mm:600,length_mm:2500},{width_mm:1200,length_mm:3000}],
 BA10:[{width_mm:1200,length_mm:2500}],
 BA13:[2000,2400,2500,2600,2700,3000,3200,3600].map(length_mm=>({width_mm:1200,length_mm})).concat([{width_mm:600,length_mm:2500}]),
 BA15:[2400,2500,2600,2800,3000].map(length_mm=>({width_mm:1200,length_mm})),
 BA18:[{width_mm:900,length_mm:2600},{width_mm:900,length_mm:2800},{width_mm:900,length_mm:3000},{width_mm:1200,length_mm:2500},{width_mm:1200,length_mm:2600}],
 BA25:[{width_mm:900,length_mm:2500},{width_mm:900,length_mm:2600}],
};
const facingThickness:Record<string,number>={BA6:6,BA10:9.5,BA13:12.5,BA15:15,BA18:18,BA25:25};
export const facingFunctionLabels:Record<FacingFunction,string>={standard:"Standard",hydrofuge:"Hydrofuge H1",incendie:"Protection incendie",phonique:"Phonique",haute_durete:"Haute dureté",quatre_bords_amincis:"Quatre bords amincis",tres_haute_resistance_eau:"Très haute résistance à l’eau"};
const facing=(family:string,feature:FacingFunction):ReferenceRecord=>{
 const suffix=feature==="standard"?"":` ${facingFunctionLabels[feature].toLowerCase()}`;
 const title=`${family}${suffix}`;
 return {
  id:`FACING-${family}-${feature}`.toUpperCase().replaceAll("_","-"),kind:"facing",title,
  summary:`Plaque de plâtre générique · ${facingFunctionLabels[feature]} · ${facingThickness[family]} mm`,sourcePage:0,status:"Publié",
  data:{catalog_schema_version:2,code:`${family}_${feature}`.toUpperCase(),material:"plaque_de_platre",nominal_family:family,mechanical_family:family,thickness_mm:facingThickness[family],function:feature,humidity_class:feature==="hydrofuge"?"H1":"",edge_type:feature==="quatre_bords_amincis"?"4_bords_amincis":"2_bords_amincis",reaction_fire:"",weight_kg_m2:0,color:"",compatible_work_codes:["plafond-fourrure-horizontal","doublage-peripherique-rails-montants"],dimensions:facingFormats[family]},
 };
};
const standardOnly=["BA6","BA10"];
const commonVariants:FacingFunction[]=["standard","hydrofuge","incendie","phonique"];
export const genericFacingRecords:ReferenceRecord[]=[
 ...standardOnly.map(family=>facing(family,"standard")),
 ...["BA13","BA15","BA18","BA25"].flatMap(family=>commonVariants.map(feature=>facing(family,feature))),
 facing("BA13","haute_durete"),facing("BA13","quatre_bords_amincis"),facing("BA13","tres_haute_resistance_eau"),
];
const doublageFrames=["R36 + M36","R48 + M48","R48 + M48-50","R62 + M62","R70 + M70","R90 + M90","R100 + M100"];
const heights=(spacing_m:number,simple:number[],double:number[])=>doublageFrames.map((frame,index)=>({frame,spacing_m,simple_m:simple[index],double_m:double[index]}));
const doublagePerformanceGroups=[
 {id:"BA13_BA15",label:"Simple peau · BA13 ou BA15",width_mm:1200,components:[{code:"BA13",count:1},{code:"BA15",count:1,alternative:true}],alternatives:["1 × BA13","1 × BA15"],values:[...heights(.6,[1.9,2.1,2.25,2.45,2.7,3.1,3.3],[2.2,2.5,2.65,2.9,3.2,3.7,3.9]),...heights(.4,[2.1,2.3,2.45,2.7,2.95,3.4,3.65],[2.5,2.75,2.95,3.2,3.55,4.05,4.3])]},
 {id:"BA18",label:"Simple peau · BA18 · largeur 600 ou 1 200 mm",width_mm:1200,components:[{code:"BA18",count:1}],values:[...heights(.6,[2,2.15,2.3,2.55,2.8,3.2,3.4],[2.3,2.6,2.7,3,3.3,3.8,4.05]),...heights(.4,[2.2,2.35,2.5,2.8,3.05,3.5,3.75],[2.6,2.8,3,3.35,3.65,4.2,4.45])]},
 {id:"DOUBLE_1200",label:"Double peau · largeur 600 ou 1 200 mm",width_mm:1200,components:[{code:"BA13",count:2}],alternatives:["BA13, BA15 ou BA18, fonctions librement combinées","BA10 traité comme BA13"],values:[...heights(.6,[2.1,2.3,2.45,2.7,2.95,3.4,3.6],[2.45,2.75,2.9,3.2,3.5,4.05,4.3]),...heights(.4,[2.3,2.5,2.7,2.95,3.25,3.75,3.95],[2.75,3,3.2,3.55,3.85,4.45,4.7])]},
 {id:"BA18_900",label:"1 × BA18 · largeur 900 mm",width_mm:900,components:[{code:"BA18",count:1}],values:[...heights(.9,[1.8,2.05,2.2,2.4,2.6,3,3.2],[2.1,2.4,2.6,2.9,3.1,3.6,3.8]),...heights(.45,[2.1,2.4,2.6,2.9,3.1,3.6,3.8],[2.5,2.9,3.1,3.45,3.7,4.25,4.5])]},
 {id:"BA25_900",label:"1 × BA25 · largeur 900 mm",width_mm:900,components:[{code:"BA25",count:1}],values:[...heights(.9,[0,2.5,2.65,0,3.15,3.65,3.85],[0,2.95,3.15,0,3.75,4.35,4.6]),...heights(.45,[0,2.95,3.15,0,3.75,4.35,4.6],[0,3.5,3.8,0,4.5,5.2,5.5])]},
 {id:"DOUBLE_900",label:"Double peau · BA18 ou BA25 · largeur 900 mm",width_mm:900,components:[{code:"BA18",count:2}],alternatives:["2 × BA18","BA18 + BA25","2 × BA25"],values:[...heights(.9,[2,2.25,2.45,2.7,2.9,3.35,3.55],[2.35,2.7,2.9,3.2,3.45,4,4.25]),...heights(.45,[2.35,2.7,2.9,3.2,3.45,4,4.25],[2.8,3.2,3.45,3.85,4.1,4.75,5.05])]},
];

const glassThicknesses=[45,60,80,100,120,140,160,200,240,300];
const rockThicknesses=[45,60,80,100,120,140,160,180,200,240,300];
const woodThicknesses=[40,45,60,80,100,120,140,160,180,200,220,240,300];
const looseThicknesses=[40,60,80,100,120,140,160,180,200,220,240,260,280,300,320,350,400];

export const plaquistoRecords:ReferenceRecord[]=[
  {id:"WORK-PLAFOND-FOURRURE-HORIZONTAL",kind:"work",title:"Plafond sur fourrures horizontal",summary:"Ouvrage de plafond suspendu sur fourrures F45. La configuration détermine l’isolant, le système de fixation et les quantités indicatives.",sourcePage:1,status:"Publié",data:{code:"plafond-fourrure-horizontal",fourrure:"F45",source:"Plaquisto_Tableaux_Plafond_fourrure horizontal.numbers"}},
  {id:"WORK-DOUBLAGE-PERIPHERIQUE-RAILS-MONTANTS",kind:"work",title:"Doublage périphérique sur rails et montants",summary:"Doublage périphérique sur ossature métallique. L’application vérifie la hauteur admissible et calcule les quantités indicatives.",sourcePage:1,status:"Publié",data:{code:"doublage-peripherique-rails-montants",family:"Doublages périphériques",frame_type:"Rails et montants",source:"Plaquisto_Tableaux_doublage peripherique rails montant.numbers"}},

  ...genericFacingRecords,

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

  wallInsulationSeries("WALL-INSULATION-LDV","LDV","Laine de verre",[0.030,0.031,0.032,0.033,0.034,0.035,0.036,0.037,0.038,0.039,0.040],[45,60,75,85,100,120,140,160],1),
  wallInsulationSeries("WALL-INSULATION-LDR","LDR","Laine de roche",[0.032,0.033,0.034,0.035],[40,45,60,75,100,120,130,140,160,180,200],2),
  wallInsulationSeries("WALL-INSULATION-LDB","LDB","Laine de bois",[0.036,0.037,0.038],[40,50,60,80,100,120,140,145,160,180,200,220,240],3),
  wallInsulationSeries("WALL-INSULATION-BIO","BIO","Isolant biosourcé",[0.037,0.038,0.039,0.040],[45,60,80,100,120,140,145,160,180,200,220],4),

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

  {id:"VAPOR-BARRIER-QUANTITIES",kind:"quantity_item",title:"Fournitures pour pare-vapeur",summary:"Fournitures ajoutées au quantitatif lorsque l’utilisateur prévoit un pare-vapeur.",sourcePage:5,status:"Publié",data:{category:"vapor_barrier",components:[
    {name:"Pare-vapeur",quantity:1.3,unit:"m²",calculation:"area"},
    {name:"Scotch d’étanchéité",quantity:1.3,unit:"ml",calculation:"area"},
    {name:"Mastic d’étanchéité",quantity:0.03,unit:"unité",calculation:"area"},
    {name:"Scotch double-face",quantity:1,unit:"ml",calculation:"fourrure_ml",exclude_when_system_handles_vapor_barrier:true},
  ]}},

  {id:"RULE-ISOLATION-SPACING",kind:"rule",title:"Entraxe selon le poids de l’isolant",summary:"La valeur maximale de la plage de poids est toujours retenue.",sourcePage:2,status:"Publié",data:{weight_policy:"maximum",bands:[{min_kg_m2:0,max_kg_m2:6,max_exclusive:true,spacing_m:0.6},{min_kg_m2:6,max_kg_m2:10,max_exclusive:true,spacing_m:0.5},{min_kg_m2:10,max_kg_m2:15,max_exclusive:false,spacing_m:0.4}]}},
  {id:"RULE-ROD-LENGTH",kind:"rule",title:"Calcul des tiges filetées",summary:"Les tiges filetées sont calculées en mètres linéaires.",sourcePage:3,status:"Publié",data:{formula:"nombre_systemes × plenum_mm / 1000",unit:"ml"}},
  {id:"RULE-DOUBLAGE-HEIGHTS",kind:"rule",title:"Hauteurs maximales — doublage sur rails et montants",summary:"Hauteurs maximales selon le parement, son format, l’entraxe, la largeur d’ossature et le montage simple ou double.",sourcePage:1,status:"Publié",data:{category:"doublage_performance",schema_version:2,work_code:"doublage-peripherique-rails-montants",frames:doublageFrames,groups:doublagePerformanceGroups,compatibility:{max_layers:2,same_width_required:true,functions_share_mechanical_family:true,single:[{families:["BA13","BA15"],widths_mm:[600,1200],performance_group_id:"BA13_BA15"},{families:["BA18"],widths_mm:[600,1200],performance_group_id:"BA18"},{families:["BA18"],widths_mm:[900],performance_group_id:"BA18_900"},{families:["BA25"],widths_mm:[900],performance_group_id:"BA25_900"}],double:{normalize_families:{BA10:"BA13"},exact:[{families:["BA6","BA6"],widths_mm:[600,1200],performance_group_id:"BA13_BA15"},{families:["BA6","BA13"],widths_mm:[600,1200],performance_group_id:"BA18"}],sets:[{families:["BA13","BA15","BA18"],widths_mm:[600,1200],performance_group_id:"DOUBLE_1200"},{families:["BA18","BA25"],widths_mm:[900],performance_group_id:"DOUBLE_900"}]}},exceeded_height_actions:["Passer en montants doubles","Augmenter la largeur des rails et montants","Ajouter des appuis intermédiaires pour montant sur mur support"],notes:["Aucune marque commerciale n’est utilisée.","BA6 et BA10 sont interdits en simple peau.","2 × BA6 équivaut mécaniquement à 1 × BA13.","BA6 + BA13 équivaut mécaniquement à 1 × BA18.","En double peau, BA10 équivaut mécaniquement à BA13.","Les deux peaux doivent avoir la même largeur.","BA18 reste nommé BA18 ; la largeur 900 ou 1200 mm détermine la règle."]}},
  {id:"QTY-DOUBLAGE-RAILS-MONTANTS",kind:"quantity_item",title:"Quantitatifs — doublage sur rails et montants",summary:"Coefficients indicatifs et règles géométriques pour le doublage périphérique.",sourcePage:2,status:"Publié",data:{category:"doublage_quantity",schema_version:2,work_code:"doublage-peripherique-rails-montants",reference_case:{length_m:4,height_min_m:2.5,height_max_m:2.7},coefficients:{parement_simple_m2_m2:1.05,parement_double_m2_m2:2.10,rail_ml_m2:0.84,band_ml_m2:1.73,enduit_poudre_kg_m2:0.33,enduit_pate_kg_m2:0.47,insulation_m2_m2:1.10,vapor_barrier_m2_m2:1.20},stud_ml_m2:{"0.40_simple":2.89,"0.40_double":5.25,"0.60_simple":2.10,"0.60_double":3.68},ttpc25_unit_m2:{"0.40_simple":15,"0.40_double":30,"0.60_simple":11,"0.60_double":22},ttpc35_unit_m2:{"0.40_simple":15,"0.40_double":30,"0.60_simple":11,"0.60_double":22},trpf13_unit_m2:{"0.40_simple":3,"0.40_double":7,"0.60_simple":2,"0.60_double":5},geometry:{rail_formula:"2 × longueur × 1.05",stud_simple_formula:"(arrondi_sup(longueur / entraxe) + 1) × hauteur × 1.05",stud_double_formula:"2 × arrondi_sup(longueur / entraxe) × hauteur × 1.05",intermediate_support_formula:"arrondi_sup((rail_ml / 2) / entraxe)",double_sided_tape_simple_formula:"stud_ml",double_sided_tape_double_formula:"stud_ml / 2"},limitations:["La visserie des entraxes 0,45 m et 0,90 m doit être complétée depuis une source technique.","La visserie d’une troisième peau doit être complétée depuis une source technique."]}},
];

export const recordLabels:Record<RecordKind,string>={work:"Ouvrages",insulation_series:"Isolation",fixing_system:"Systèmes de fixation de plafond sur fourrures",facing:"Parements",quantity_item:"Quantitatifs",rule:"Règles de calcul"};
