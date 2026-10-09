// Entirely fictional data for tests. Never import customer quotes into source.
import {priceTargets, type SupplierPrice} from "./supplier-prices";

const fixture = (referenceId:string, variantKey:string, unitPriceHT:number, repUnitHT:number):Omit<SupplierPrice,"id"> => {
  const target = priceTargets().find(t => t.referenceId === referenceId && t.variantKey === variantKey)!;
  return {...target,unitPriceHT,repUnitHT,supplier:"Fournisseur fictif de test",supplierReference:"FICTIVE-SKU",
    priceDate:"2031-04-01",validUntil:"2031-05-31",source:"Données synthétiques, sans valeur commerciale",status:"proposed",updatedAt:""};
};
export const proposedPriceFixtures:SupplierPrice[] = [
  fixture("FACING-BA13-STANDARD","1200x2500",4.2,0.24),
  fixture("FACING-BA13-STANDARD","1200x2000",4.4,0.24),
  fixture("FACING-BA13-QUATRE-BORDS-AMINCIS","1200x2500",7.2,0.24),
  fixture("QTY-VIS-25","standard",10/1000,0.003/1000),
  fixture("QTY-VIS-35","standard",15/1000,0.005/1000),
  fixture("QTY-BANDE","papier",6/200,0.2/200),
  fixture("QTY-ENDUIT-POUDRE","lent",20/25,0),
  fixture("QTY-ENDUIT-POUDRE","rapide",22/25,0),
].map((price,index) => ({...price,id:`FICTIONAL-PRICE-${index+1}`}));
