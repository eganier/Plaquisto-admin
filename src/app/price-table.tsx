"use client";

import {useEffect, useRef, useState} from "react";
import {conflictingPrice, importPriceProposals, priceKey, validatePrice, type PriceTarget, type SupplierPrice} from "@/lib/supplier-prices";

export default function PriceTable() {
  const [rows,setRows] = useState<SupplierPrice[]>([]);
  const [targets,setTargets] = useState<PriceTarget[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);
  const [message,setMessage] = useState("Chargement des tarifs…");
  const [busy,setBusy] = useState<string|null>(null);
  const [dirty,setDirty] = useState<Set<string>>(new Set());
  const [ready,setReady] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/prices").then(async response => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Chargement impossible.");
      if (active) {setRows(data.prices);setTargets(data.referenceOptions);setReady(true);setMessage("");}
    }).catch(error => {if (active) setMessage(error.message);});
    return () => {active=false;};
  },[]);

  const update = (id:string, change:Partial<SupplierPrice>) => {
    setRows(current => current.map(row => row.id === id ? {...row,...change,status:change.status ?? "proposed"} : row));
    setDirty(current => new Set(current).add(id));
  };
  const add = () => {
    if (!targets.length) return;
    const target = targets[0];
    const id = crypto.randomUUID();
    setRows(current => [...current,{...target,id,unitPriceHT:null,repUnitHT:null,supplier:"",supplierReference:"",
      priceDate:new Date().toISOString().slice(0,10),validUntil:null,source:"",status:"proposed",updatedAt:""}]);
    setDirty(current => new Set(current).add(id));
  };
  const importFile = async (file:File) => {
    try {
      if (file.size > 1_000_000) throw new Error("Le fichier dépasse 1 Mo.");
      const additions = importPriceProposals(JSON.parse(await file.text()),targets,() => crypto.randomUUID());
      setRows(current => [...current,...additions]);
      setDirty(current => new Set([...current,...additions.map(row => row.id)]));
      setMessage(`${additions.length} proposition(s) importée(s) localement. Vérifiez puis enregistrez chaque ligne. Aucun tarif n’a été envoyé au serveur ni validé.`);
    } catch (error) {setMessage(error instanceof Error ? error.message : "Import impossible.");}
    finally {if (fileInput.current) fileInput.current.value="";}
  };
  const save = async (price:SupplierPrice) => {
    const error = validatePrice(price,targets);
    if (error) {setMessage(error);return;}
    const conflict = conflictingPrice(price,rows);
    if (conflict) {setMessage(`Validation impossible : ${conflict.id} couvre déjà cette référence et cette période. Enregistrez d’abord sa nouvelle date de fin ou son statut proposé.`);return;}
    setBusy(price.id);
    try {
      const response = await fetch("/api/prices",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(price)});
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Enregistrement impossible.");
      setRows(current => current.map(row => row.id === price.id ? data.price : row));
      setDirty(current => {const next = new Set(current);next.delete(price.id);return next;});
      setMessage(price.status === "validated" ? "Tarif validé et enregistré. Il sera utilisable pendant sa période de validité." : "Proposition enregistrée, absente des tarifs iOS.");
    } catch (error) {setMessage(error instanceof Error ? error.message : "Enregistrement impossible.");}
    finally {setBusy(null);}
  };
  const number = (value:string) => value === "" ? null : Number(value);
  const money = (value:number|null) => value === null ? "Manquant" : value.toLocaleString("fr-FR",{maximumFractionDigits:8});

  return <section className="page prices-page">
    <div className="title"><div><small>FOURNITURES · ESTIMATION</small><h1>Tarifs HT</h1>
      <p>Prix proportionnels par m², ml, unité ou kg. La REP s’ajoute au prix HT. Estimation indicative de −5 % à +5 %.</p></div>
      <button className="primary" disabled={!ready || busy !== null} onClick={add}>+ Ajouter un tarif</button></div>
    <div className="notice"><b>€</b><span><strong>Prix indépendants des quantitatifs</strong><small>Les boîtes, sacs et rouleaux servent uniquement à convertir le tarif dans l’unité de calcul. Les quantités ne sont pas arrondies au conditionnement. Une fourniture sans tarif reste à chiffrer.</small></span></div>
    <div className="embedded-heading"><p>{rows.length} tarif(s) · {dirty.size} modification(s) non enregistrée(s)</p>
      <input ref={fileInput} type="file" accept="application/json,.json" hidden onChange={event => {const file=event.target.files?.[0];if(file)void importFile(file);}}/>
      <button disabled={!ready || busy !== null} onClick={() => fileInput.current?.click()}>Importer un fichier JSON local</button></div>
    <p className="save-message" role="status">{message}</p>
    {ready && rows.length === 0 && <div className="validation-empty">Aucun tarif enregistré. Ajoutez une proposition ou importez votre fichier privé.</div>}
    <div className="price-table-scroll"><table className="price-table"><thead><tr>
      <th>Référence et variante exacte</th><th>Prix HT / unité</th><th>REP HT / unité</th><th>Total HT / unité</th><th>Statut et validité</th><th>Enregistrement</th>
    </tr></thead><tbody>{rows.map(row => <tr key={row.id}>
      <td><label>Fourniture<select aria-label={`Fourniture ${row.id}`} value={priceKey(row)} disabled={busy === row.id} onChange={event => {
        const target = targets.find(item => priceKey(item) === event.target.value);
        if (target) update(row.id,target);
      }}><option value={priceKey(row)}>{row.label}</option>{targets.filter(target => priceKey(target) !== priceKey(row)).map(target => <option key={priceKey(target)} value={priceKey(target)}>{target.label} ({target.unit})</option>)}</select></label>
      <small>{row.referenceId} · {row.variantKey}</small>
      <details><summary>Fournisseur et source</summary><div className="price-details">
        <label>Fournisseur<input value={row.supplier} disabled={busy === row.id} onChange={event => update(row.id,{supplier:event.target.value})}/></label>
        <label>Référence fournisseur<input value={row.supplierReference} disabled={busy === row.id} onChange={event => update(row.id,{supplierReference:event.target.value})}/></label>
        <label>Source du tarif<input value={row.source} disabled={busy === row.id} onChange={event => update(row.id,{source:event.target.value})}/></label>
        <small>Ces informations restent dans l’Admin.</small>
      </div></details></td>
      <td><label>€ / {row.unit}<input aria-label={`Prix HT ${row.id}`} type="number" min="0" step="any" placeholder="Manquant" value={row.unitPriceHT ?? ""} disabled={busy === row.id} onChange={event => update(row.id,{unitPriceHT:number(event.target.value)})}/></label></td>
      <td><label>€ / {row.unit}<input aria-label={`REP HT ${row.id}`} type="number" min="0" step="any" placeholder="Manquante" value={row.repUnitHT ?? ""} disabled={busy === row.id} onChange={event => update(row.id,{repUnitHT:number(event.target.value)})}/></label></td>
      <td><strong>{money(row.unitPriceHT === null || row.repUnitHT === null ? null : row.unitPriceHT+row.repUnitHT)}</strong><small>€ / {row.unit}</small></td>
      <td><label>Statut<select value={row.status} disabled={busy === row.id} onChange={event => update(row.id,{status:event.target.value as SupplierPrice["status"]})}><option value="proposed">Proposé</option><option value="validated">Validé pour iOS</option></select></label>
        <label>Date du prix<input type="date" value={row.priceDate} disabled={busy === row.id} onChange={event => update(row.id,{priceDate:event.target.value})}/></label>
        <label>Valable jusqu’au<input type="date" value={row.validUntil ?? ""} disabled={busy === row.id} onChange={event => update(row.id,{validUntil:event.target.value || null})}/></label>
      </td>
      <td><button className="primary" disabled={!dirty.has(row.id) || busy !== null} onClick={() => void save(row)}>{busy === row.id ? "Enregistrement…" : "Enregistrer"}</button>
      <small>{dirty.has(row.id) ? "Non enregistré" : "Enregistré"}</small>
      {conflictingPrice(row,rows) && <small className="price-conflict" role="alert">Conflit : un autre tarif validé couvre cette variante sur la même période.</small>}</td>
    </tr>)}</tbody></table></div>
    <p className="price-help">Une modification remet le tarif à l’état proposé. Pour l’utiliser dans iOS, choisissez « Validé pour iOS » puis enregistrez. Les tarifs expirés sont exclus. Si plusieurs tarifs correspondent à la même fourniture, l’estimation indique un prix à choisir.</p>
  </section>;
}
