"use client";
import { useEffect, useMemo, useState } from "react";

export default function InscriptionSuccess() {
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    // Bootstrap JS
    const bs = document.createElement("script");
    bs.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js";
    bs.integrity = "sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM";
    bs.crossOrigin = "anonymous";
    document.body.appendChild(bs);

    // Bootstrap Icons
    const existingIcons = document.querySelector('link[href*="bootstrap-icons"]');
    if (!existingIcons) {
      const icons = document.createElement("link");
      icons.rel = "stylesheet";
      icons.href = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css";
      document.head.appendChild(icons);
    }

    return () => { if (bs.parentNode) bs.parentNode.removeChild(bs); };
  }, []);

  const params = useMemo(() => new URLSearchParams(typeof window !== 'undefined' ? window.location.search : ''), []);
  const loginId = params.get("loginId") || "";
  const password = params.get("password") || "";
  const loginUrl = params.get("loginUrl") || "https://fa-compte.vercel.app";

  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); alert("Copié dans le presse-papiers"); }
    catch { alert("Impossible de copier"); }
  };

  const masked = password ? "●".repeat(Math.max(6, password.length)) : "";

  return (
    <main className="theme-light" style={{ background: "#f4f5f7", minHeight: "100vh" }}>
      {/* Header */}
      <div className="position-relative" style={{ background: "#5a98de" }}>
        <div className="container py-4" style={{ position: "relative", zIndex: 2 }}>
          <h1 className="m-0 fw-bold text-white" style={{ letterSpacing: 0.3, textShadow: "0 1px 2px rgba(0,0,0,0.25)" }}>Compte créé avec succès</h1>
          <p className="mb-0" style={{ color: "#ffffff", textShadow: "0 1px 2px rgba(0,0,0,0.25)" }}>Conservez vos identifiants en lieu sûr.</p>
        </div>
        <div className="position-absolute start-0 end-0" style={{ bottom: -14, zIndex: 1, pointerEvents: "none" }}>
          <svg viewBox="0 0 1440 120" width="100%" height="120" preserveAspectRatio="none">
            <path d="M0,32 C180,64 360,96 540,96 C720,96 900,64 1080,48 C1260,32 1350,32 1440,48 L1440,120 L0,120 Z" fill="#7fb0eb" />
          </svg>
        </div>
      </div>

      {/* Card */}
      <div className="container" style={{ marginTop: 30, paddingBottom: 120 }}>
        <div className="mx-auto" style={{ maxWidth: 680 }}>
          <div className="bg-white rounded-4 shadow-sm overflow-hidden">
            <div className="p-4">
              {/* ID */}
              <div className="mb-3 d-flex align-items-center">
                <div className="flex-grow-1">
                  <div className="text-muted small">Identifiant (ID)</div>
                  <div className="fw-bold" style={{ fontSize: 18 }}>{loginId || "-"}</div>
                </div>
                <button type="button" className="btn btn-light" onClick={() => copy(loginId)} title="Copier">
                  <i className="bi bi-clipboard"></i>
                </button>
              </div>
              <div className="border-top my-3" />
              {/* Password */}
              <div className="mb-3 d-flex align-items-center">
                <div className="flex-grow-1">
                  <div className="text-muted small">Mot de passe</div>
                  <div className="fw-bold" style={{ fontSize: 18 }}>{showPwd ? password : masked}</div>
                </div>
                <div className="btn-group">
                  <button type="button" className="btn btn-light" onClick={() => setShowPwd((s) => !s)} title={showPwd ? "Masquer" : "Afficher"}>
                    <i className={showPwd ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                  </button>
                  <button type="button" className="btn btn-light" onClick={() => copy(password)} title="Copier">
                    <i className="bi bi-clipboard"></i>
                  </button>
                </div>
              </div>
              <div className="border-top my-3" />
              {/* Login link */}
              <div className="mb-3 d-flex align-items-center">
                <div className="flex-grow-1">
                  <div className="text-muted small">Lien de connexion</div>
                  <a href={loginUrl} target="_blank" rel="noreferrer" className="fw-bold" style={{ fontSize: 16 }}>{loginUrl}</a>
                </div>
                <button type="button" className="btn btn-light" onClick={() => copy(loginUrl)} title="Copier">
                  <i className="bi bi-clipboard"></i>
                </button>
              </div>

              <div className="alert alert-warning mt-4" role="alert" style={{ borderRadius: 12 }}>
                Pour votre sécurité, conservez ces informations en lieu sûr. Vous en aurez besoin pour vous connecter.
              </div>

              <div className="d-grid mt-3">
                <a href={loginUrl} target="_blank" rel="noreferrer" className="btn btn-success">Aller à la page de connexion</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
