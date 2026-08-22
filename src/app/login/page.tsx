"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const ADMIN_EMAIL = "e.ganier@gmail.com";

export default function LoginPage() {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setError("Cette adresse n’est pas autorisée à accéder à Plaquisto Admin.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: ADMIN_EMAIL,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (authError) setError("Le lien de connexion n’a pas pu être envoyé. Réessayez.");
    else setSent(true);
  }

  return <main className="login-page">
    <section className="login-card">
      <div className="login-brand"><b>P</b><div><strong>Plaquisto</strong><small>Administration</small></div></div>
      {sent ? <div className="login-success"><span>✓</span><h1>Consultez votre boîte mail</h1><p>Un lien sécurisé vient d’être envoyé à <strong>{ADMIN_EMAIL}</strong>.</p><small>Vous pouvez fermer cette page après avoir ouvert le lien.</small></div> : <>
        <div className="login-heading"><small>ACCÈS RÉSERVÉ</small><h1>Connexion administrateur</h1><p>Recevez un lien sécurisé pour accéder au référentiel Plaquisto.</p></div>
        <form onSubmit={login}><label>Adresse e-mail<input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" required /></label>{error&&<p className="login-error">{error}</p>}<button disabled={loading}>{loading?"Envoi en cours…":"Recevoir mon lien de connexion"}</button></form>
        <p className="login-note">Seule l’adresse e.ganier@gmail.com est autorisée.</p>
      </>}
    </section>
  </main>;
}
