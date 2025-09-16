"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Profil() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const logout = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try { sessionStorage.removeItem('user'); } catch {}
    window.location.href = '/';
  };
  useEffect(() => {
    // Ensure Bootstrap JS is loaded on this page
    const bs = document.createElement("script");
    bs.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js";
    bs.integrity = "sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM";
    bs.crossOrigin = "anonymous";
    document.body.appendChild(bs);

    // Ensure Bootstrap Icons are available (inject link once)
    const existingIcons = document.querySelector('link[href*="bootstrap-icons"]');
    if (!existingIcons) {
      const icons = document.createElement("link");
      icons.rel = "stylesheet";
      icons.href = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css";
      document.head.appendChild(icons);
    }

    // Load user and guard
    try {
      const raw = sessionStorage.getItem('user');
      if (raw) {
        setUser(JSON.parse(raw));
      } else {
        window.location.href = '/';
      }
    } catch {
      window.location.href = '/';
    }
    setLoading(false);

    return () => {
      if (bs.parentNode) bs.parentNode.removeChild(bs);
    };
  }, []);
  return (
    <main className="theme-light" style={{ background: "#f4f5f7", paddingBottom: 120 }}>
      {/* Global loader overlay */}
      {loading && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", zIndex: 2000 }}>
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      )}
      {/* Header banner with wave */}
      <div className="position-relative" style={{ background: "#5a98de" }}>
        <svg viewBox="0 0 1440 160" width="100%" height="120" preserveAspectRatio="none">
          <path d="M0,32 C180,64 360,96 540,96 C720,96 900,64 1080,48 C1260,32 1350,32 1440,48 L1440,160 L0,160 Z" fill="#7fb0eb" />
        </svg>
      </div>

      {/* Avatar and name */}
      <div className="position-relative" style={{ marginTop: -80 }}>
        <div className="d-flex flex-column align-items-center">
          <div className="shadow rounded-circle" style={{ boxShadow: "0 26px 40px rgba(0,0,0,0.22)", border: "6px solid #ffffff", width: 112, height: 112, overflow: "hidden" }}>
            <Image src="/31t.jpg" alt="Profil" width={112} height={112} style={{ objectFit: "cover" }} />
          </div>
          <div style={{ position: "absolute", top: 0, filter: "blur(22px)", transform: "translateY(32px)", width: 160, height: 38, borderRadius: 40, background: "rgba(0,0,0,0.18)", zIndex: 0 }} />
          <h1 className="mt-3 mb-0 text-center" style={{ color: "#111827", letterSpacing: 0.3, fontSize: 36, fontWeight: 800 }}>
            {user ? `${user.nom} ${user.prenom}` : 'SICILIANO VITO PIETRO'}
          </h1>
          <div className="d-flex align-items-center gap-2" style={{ color: "#6b7280", fontSize: 14 }}>
            <span className="text-success">●</span>
            Titulaire de compte vérifié
          </div>
        </div>
      </div>

      {/* Profile card */}
      <div className="container" style={{ marginTop: 20, marginBottom: 100 }}>
        <div className="mx-auto" style={{ maxWidth: 1180 }}>
          <div className="bg-white rounded-5 shadow-sm" style={{ borderRadius: 26, border: "1px solid rgba(0,0,0,0.06)" }}>
            <div className="px-4 px-md-5 py-4 py-md-5">
              <div className="mb-4">
                <h5 className="mb-3" style={{ color: "#111827" }}>Informations personnelles</h5>
                <div className="rounded-3 overflow-hidden">
                  {/* Identifiant */}
                  <div className="px-0 py-3 border-bottom" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
                    <div className="text-uppercase small fw-bold px-3" style={{ color: "#2563eb", letterSpacing: 0.3 }}>Identifiant</div>
                    <div className="text-muted px-3" style={{ marginTop: 6 }}>{user ? user.loginId : '-'}</div>
                  </div>
                  {/* Prenoms */}
                  <div className="px-0 py-3 border-bottom" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
                    <div className="text-uppercase small fw-bold px-3" style={{ color: "#2563eb", letterSpacing: 0.3 }}>Prénom(s)</div>
                    <div className="text-muted px-3" style={{ marginTop: 6 }}>{user ? user.prenom : '-'}</div>
                  </div>
                  {/* Nom */}
                  <div className="px-0 py-3" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
                    <div className="text-uppercase small fw-bold px-3" style={{ color: "#2563eb", letterSpacing: 0.3 }}>Nom</div>
                    <div className="text-muted px-3" style={{ marginTop: 6 }}>{user ? user.nom : '-'}</div>
                  </div>
                </div>
              </div>

              <div className="mb-2">
                <h5 className="mb-3" style={{ color: "#111827" }}>Sécurité du compte</h5>
                <div className="rounded-3 overflow-hidden">
                  <div className="px-0 py-3" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
                    <div className="text-uppercase small fw-bold px-3" style={{ color: "#2563eb", letterSpacing: 0.3 }}>Mot de passe actuel</div>
                    <div className="text-muted px-3" style={{ marginTop: 6 }}>**********</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bar (identique à Compte) */}
      <div className="position-fixed start-0 end-0" style={{ bottom: 16, zIndex: 100 }}>
        <div className="mx-3 position-relative" style={{ filter: "drop-shadow(0 18px 22px rgba(0,0,0,0.18))" }}>
          {/* Base bar (pill) */}
          <div className="footer-pill" style={{ padding: "18px 24px 22px" }}>
            <div className="d-flex align-items-end justify-content-between text-center">
              {/* Left: Cartes */}
              <Link href="/cartes" className="text-decoration-none flex-fill text-dark">
                <div className="mb-1"><i className="bi bi-wallet2 nav-icon"></i></div>
                <div className="nav-label">Cartes</div>
              </Link>
              {/* Center: Home label (under floating button) */}
              <div className="flex-fill"><div style={{ fontSize: 13, color: "#374151" }}>Home</div></div>
              {/* Right: Plus */}
              <a
                href="#"
                className="text-decoration-none flex-fill text-dark"
                data-bs-toggle="offcanvas"
                data-bs-target="#menu-sidebar"
              >
                <div className="mb-1"><i className="bi bi-three-dots nav-icon"></i></div>
                <div className="nav-label">Plus</div>
              </a>
            </div>
          </div>

          {/* Floating Home button */}
          <div className="position-absolute start-50 translate-middle-x d-flex align-items-center justify-content-center floating-home-btn floating-home-wrapper" style={{ top: 0, transform: "translate(-50%, -58%)" }}>
            <i className="bi bi-house-fill text-white" style={{ fontSize: 24 }}></i>
          </div>
        </div>
      </div>

      {/* Offcanvas Sidebar (left) - identique à Compte */}
      <div className="offcanvas offcanvas-start" tabIndex="-1" id="menu-sidebar" style={{ width: 336 }}>
        <div
          className="h-100 d-flex flex-column mx-2 my-2"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(246,248,252,0.95))",
            borderRadius: 24,
            boxShadow: "0 16px 36px rgba(0,0,0,0.2)",
          }}
        >
          {/* Header */}
          <div className="p-3 d-flex align-items-start" style={{ gap: 12 }}>
            <div className="flex-grow-1">
              <div className="fw-semibold" style={{ color: "#6b87c9", letterSpacing: 0.6 }}>
                {user ? `${user.nom} ${user.prenom}` : 'SICILIANO VITO PIETRO'}
              </div>
              <div className="fw-bold" style={{ color: "#e11d48", fontSize: 20 }}>
                Compte bloqué
              </div>
            </div>
            <div>
              <div className="rounded-circle overflow-hidden shadow" style={{ width: 46, height: 46, boxShadow: "0 10px 18px rgba(69,157,255,0.35), 0 6px 12px rgba(0,0,0,0.18)" }}>
                <Image src="/31t.jpg" alt="profil" width={46} height={46} style={{ objectFit: "cover" }} />
              </div>
            </div>
          </div>
          <div className="px-3">
            <div className="border-top" style={{ opacity: 0.25 }} />
          </div>

          {/* Main actions */}
          <div className="p-2">
            <a href="#" className="d-flex align-items-center py-2 px-2 text-decoration-none rounded-3" style={{ gap: 12 }}>
              <span className="d-inline-flex align-items-center justify-content-center rounded-3" style={{ width: 36, height: 36, background: "#e6f9ee" }}>
                <i className="bi bi-square rounded-2" style={{ color: "#22c55e", fontSize: 19 }}></i>
              </span>
              <span className="flex-grow-1 text-dark">Home</span>
              <i className="bi bi-chevron-right" style={{ color: "#9ca3af" }}></i>
            </a>

            <div className="d-flex align-items-center py-2 px-2 rounded-3" style={{ gap: 12 }}>
              <span className="d-inline-flex align-items-center justify-content-center rounded-3" style={{ width: 36, height: 36, background: "#fff7e6" }}>
                <i className="bi bi-lightbulb-fill" style={{ color: "#f59e0b", fontSize: 18 }}></i>
              </span>
              <span className="flex-grow-1 text-dark">Dark Mode</span>
              <div className="form-check form-switch m-0">
                <input id="darkmode-switch" className="form-check-input" type="checkbox" role="switch" />
              </div>
            </div>
          </div>

          {/* Links section */}
          <div className="px-3 pt-3" style={{ color: "#9ca3af", fontSize: 12 }}>Liens utiles</div>
          <div className="p-2">
            <Link href="/profil" className="d-flex align-items-center py-2 px-2 text-decoration-none rounded-3" style={{ gap: 12 }}>
              <i className="bi bi-person-circle" style={{ color: "#9ca3af", fontSize: 18 }}></i>
              <span className="flex-grow-1 text-dark">Compte</span>
              <i className="bi bi-chevron-right" style={{ color: "#9ca3af" }}></i>
            </Link>
            <Link href="/" onClick={logout} className="d-flex align-items-center py-2 px-2 text-decoration-none rounded-3" style={{ gap: 12 }}>
              <i className="bi bi-bar-chart" style={{ color: "#9ca3af", fontSize: 18 }}></i>
              <span className="flex-grow-1 text-dark">Se déconnecter</span>
              <i className="bi bi-chevron-right" style={{ color: "#9ca3af" }}></i>
            </Link>
          </div>

          <div className="mt-auto p-2" />
        </div>
      </div>
    </main>
  );
}
