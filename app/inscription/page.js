"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

export default function Inscription() {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    soldeCompte: "",
    deviseCompte: "EUR",
    soldeElec: "",
    fraisDeblocage: "",
  });

  useEffect(() => {
    // Dynamically load Bootstrap JS like Connexion page
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js";
    script.integrity = "sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM";
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);
    return () => { if (script.parentNode) script.parentNode.removeChild(script); };
  }, []);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || (err.errors && err.errors[0]?.msg) || `Erreur ${res.status}`);
      }
      const data = await res.json();
      const q = new URLSearchParams({ loginId: data.loginId, password: data.password, loginUrl: data.loginUrl });
      window.location.href = `/inscription/success?${q.toString()}`;
    } catch (err) {
      alert("Erreur lors de l'inscription: " + err.message);
    }
  };

  return (
    <main>
      {/* Top navigation image (identique Connexion) */}
      <img src="/nav.png" alt="Navigation" style={{ width: "100%", display: "block", marginBottom: 0 }} />

      {/* Carousel (identique Connexion) */}
      <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner" style={{ paddingTop: 10, paddingBottom: 10 }}>
          <div className="carousel-item active">
            <img src="/1.jpg" alt="Slide 1" style={{ display: "block", width: "100%", maxWidth: 500, margin: "0 auto" }} />
          </div>
          <div className="carousel-item">
            <img src="/2.jpg" alt="Slide 2" style={{ display: "block", width: "100%", maxWidth: 500, margin: "0 auto" }} />
          </div>
          <div className="carousel-item">
            <img src="/3.jpg" alt="Slide 3" style={{ display: "block", width: "100%", maxWidth: 500, margin: "0 auto" }} />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Content container (identique Connexion) */}
      <div className="container" style={{ paddingTop: 5, backgroundColor: "white" }}>
        <div className="row" style={{ padding: 15 }}>
          <div className="col-12" style={{ textAlign: "left" }}>
            <h2>
              <strong>Inscription</strong>
              <br />
              <br />
              Renseignez vos informations pour créer votre compte
            </h2>
          </div>
          <div className="col-sm-6 offset-sm-3">
            <form method="POST" onSubmit={onSubmit}>
              {/* Nom */}
              <div className="mb-3" style={{ marginTop: 15 }}>
                <label htmlFor="nom" className="form-label" style={{ color: "black" }}>Nom</label>
                <input type="text" className="form-control" id="nom" name="nom" value={form.nom} onChange={onChange} style={{ height: 47 }} required />
              </div>
              {/* Prénom(s) */}
              <div className="mb-3">
                <label htmlFor="prenom" className="form-label" style={{ color: "black" }}>Prénom(s)</label>
                <input type="text" className="form-control" id="prenom" name="prenom" value={form.prenom} onChange={onChange} style={{ height: 47 }} required />
              </div>
              {/* Solde du compte + devise */}
              <div className="mb-3">
                <label htmlFor="soldeCompte" className="form-label" style={{ color: "black" }}>Solde du compte</label>
                <input type="number" step="0.01" className="form-control" id="soldeCompte" name="soldeCompte" value={form.soldeCompte} onChange={onChange} style={{ height: 47 }} required />
              </div>
              <div className="mb-3">
                <label htmlFor="deviseCompte" className="form-label" style={{ color: "black" }}>Devise du compte</label>
                <select id="deviseCompte" name="deviseCompte" className="form-select" value={form.deviseCompte} onChange={onChange} style={{ height: 47 }}>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="XOF">XOF</option>
                  <option value="XAF">XAF</option>
                </select>
              </div>
              {/* Solde monnaie électronique + devise */}
              <div className="mb-3">
                <label htmlFor="soldeElec" className="form-label" style={{ color: "black" }}>Solde de la monnaie électronique</label>
                <input type="number" step="0.01" className="form-control" id="soldeElec" name="soldeElec" value={form.soldeElec} onChange={onChange} style={{ height: 47 }} required />
              </div>
              
              {/* Frais de déblocage */}
              <div className="mb-3">
                <label htmlFor="fraisDeblocage" className="form-label" style={{ color: "black" }}>Montant des frais de déblocage</label>
                <input type="number" step="0.01" className="form-control" id="fraisDeblocage" name="fraisDeblocage" value={form.fraisDeblocage} onChange={onChange} style={{ height: 47 }} required />
              </div>
              <div className="mb-3 text-center">
                <button type="submit" className="btn form-control" style={{ color: "white", height: 47, backgroundColor: "#008154" }}>
                  Valider
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer image (identique Connexion) */}
      <img src="/f.png" alt="Footer" style={{ width: "100%", display: "block", marginTop: 50 }} />
    </main>
  );
}
