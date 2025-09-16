"use client";
import { useEffect, useState } from "react";

export default function Compte() {
  const [isWalletClosed, setIsWalletClosed] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const formatCurrency = (amount, devise = 'EUR') => {
    if (amount === undefined || amount === null || isNaN(Number(amount))) return '';
    const code = (devise || 'EUR').toUpperCase();
    const symbol = code === 'EUR' ? '€' : code === 'USD' ? '$' : code;
    const n = Number(amount);
    return `${symbol}${n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  const logout = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try { sessionStorage.removeItem('user'); } catch {}
    window.location.href = '/';
  };
  useEffect(() => {
    // Ensure Bootstrap JS is loaded on this page
    const bs = document.createElement("script");
    bs.src =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js";
    bs.integrity =
      "sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM";
    bs.crossOrigin = "anonymous";
    document.body.appendChild(bs);

    // Ensure Bootstrap Icons are available (inject link once)
    const existingIcons = document.querySelector(
      'link[href*="bootstrap-icons"]'
    );
    let icons;
    if (!existingIcons) {
      icons = document.createElement("link");
      icons.rel = "stylesheet";
      icons.href =
        "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css";
      document.head.appendChild(icons);
    }

    // Dark mode toggle logic
    const switchEl = document.getElementById("darkmode-switch");
    const onToggle = (e) => {
      const checked = e.target.checked;
      document.body.classList.toggle("theme-dark", checked);
    };
    if (switchEl) switchEl.addEventListener("change", onToggle);

    // Set blocked modal title dynamically based on the clicked action
    const attachBlockedTitle = () => {
      document.querySelectorAll('[data-blocked-title]')?.forEach((el) => {
        el.addEventListener('click', () => {
          const t = el.getAttribute('data-blocked-title') || 'Information';
          const titleEl = document.getElementById('blockedModalTitle');
          if (titleEl) titleEl.textContent = t;
        });
      });
    };
    attachBlockedTitle();

    // Load user from sessionStorage
    try {
      const raw = sessionStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw);
        setUser(u);
      } else {
        window.location.href = '/';
      }
    } catch {
      window.location.href = '/';
    }

    // Initialize wallet state from localStorage
    try {
      const v = localStorage.getItem('walletClosed');
      if (v === '1') setIsWalletClosed(true);
    } catch {}

    // Done initializing
    setLoading(false);

    return () => {
      if (bs.parentNode) bs.parentNode.removeChild(bs);
      if (switchEl) switchEl.removeEventListener("change", onToggle);
      // Keep icons link for navigation stability
    };
  }, []);

  const closeWallet = () => {
    const card2 = document.getElementById("wallet-card-2");
    if (!card2) return;
    card2.classList.remove("card-slide-back", "card-peek");
    card2.classList.add("card-slide-behind");
    const onEnd = () => {
      card2.classList.remove("card-slide-behind");
      card2.classList.add("card-peek");
      card2.removeEventListener("animationend", onEnd);
      setIsWalletClosed(true);
      try { localStorage.setItem('walletClosed', '1'); } catch {}
    };
    card2.addEventListener("animationend", onEnd);
  };

  const openWallet = () => {
    const card2 = document.getElementById("wallet-card-2");
    if (!card2) return;
    // Animate back from peek position
    card2.classList.remove("card-slide-behind");
    card2.classList.add("card-slide-back");
    const onEnd = () => {
      card2.classList.remove("card-slide-back", "card-peek");
      card2.removeEventListener("animationend", onEnd);
    };
    card2.addEventListener("animationend", onEnd);
    setIsWalletClosed(false);
    try { localStorage.setItem('walletClosed', '0'); } catch {}
  };

  return (
    <main className="theme-light" style={{ background: "#f4f5f7" }}>
      {/* Global loader overlay */}
      {loading && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", zIndex: 2000 }}>
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      )}
      {/* Preloader placeholder */}
      <div id="preloader" style={{ display: "none" }}>
        <div className="spinner-border text-success" role="status"></div>
      </div>

      {/* Modal: Compte bloqué (unifié) */}
      <div className="modal fade blocked-modal" id="modal-blocked" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="blockedModalTitle">Information</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="sign-wrap mb-3 text-center">
                {/* No-entry sign SVG */}
                <svg width="160" height="120" viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg">
                  <rect x="10" y="10" rx="18" ry="18" width="140" height="100" fill="#ffffff"/>
                  <circle cx="80" cy="60" r="36" fill="#ef4444" stroke="#b91c1c" strokeWidth="4"/>
                  <rect x="52" y="54" width="56" height="12" fill="#ffffff" rx="6"/>
                </svg>
              </div>
              <div className="fw-bold" style={{ fontSize: 18, color: "#111827" }}>Compte bloqué</div>
              <div className="text-muted" style={{ fontSize: 14, lineHeight: 1.5 }}>
                Votre compte est bloqué, veuillez le débloquer en payant les frais de déblocage qui sont de :
              </div>
              <div className="mt-1" style={{ color: "#ef4444", fontWeight: 800, fontSize: 24 }}>{user ? formatCurrency(user.fraisDeblocage, user.deviseCompte) : '€15.000,00'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Offcanvas: Payer une facture */}
      <div className="offcanvas offcanvas-top" tabIndex="-1" id="menu-billpay">
        <div className="offcanvas-body d-flex align-items-center justify-content-center" style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)", minHeight: "100vh", padding: 20 }}>
          <div className="mx-auto position-relative" style={{ width: "min(1024px, 96%)" }}>
            <div className="glass-panel overflow-hidden">
              <div className="d-flex align-items-center justify-content-between px-4 py-3" style={{ backdropFilter: "blur(4px)" }}>
                <h5 className="m-0 fw-bold" style={{ color: "#374151" }}>Pay a Bill</h5>
                <button type="button" className="btn btn-sm" data-bs-dismiss="offcanvas" aria-label="Close">
                  <i className="bi bi-x-lg" style={{ color: "#ef4444" }}></i>
                </button>
              </div>
              <div className="px-4 glass-divider"><div className="border-top" /></div>
              <div className="p-0">
                {/* Rows list */}
                {[
                  { l: "Depuis", r: "Cool-Co LTD" },
                  { l: "Facture", r: "ID-315613" },
                  { l: "Montant", r: "€145.00", rClass: "text-primary" },
                  { l: "État de la facture", r: "En retard", rClass: "text-danger" },
                ].map((row, idx) => (
                  <div key={idx} className="d-flex align-items-center px-4" style={{ paddingTop: 14, paddingBottom: 14 }}>
                    <div className="flex-grow-1" style={{ color: "#6b7280", fontWeight: 600 }}>{row.l}</div>
                    <div className={`ms-auto ${row.rClass || ''}`} style={{ color: "#374151" }}>{row.r}</div>
                  </div>
                ))}
                <div className="px-4 glass-divider"><div className="border-top" /></div>
                <div className="p-4 pt-3">
                  <button className="btn w-100 py-3 fw-semibold btn-gradient-blue" data-bs-toggle="modal" data-bs-target="#modal-blocked" data-blocked-title="Information Facture">
                    APPUYEZ POUR PAYER - 145 €
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offcanvas: Factures */}
      <div className="offcanvas offcanvas-top" tabIndex="-1" id="menu-bills">
        <div className="offcanvas-body d-flex align-items-start justify-content-center" style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)", minHeight: "100vh", padding: 20 }}>
          <div className="mx-auto position-relative" style={{ width: "min(1024px, 96%)" }}>
            {/* List card */}
            <div className="bg-white rounded-4 shadow-sm overflow-hidden">
              <div className="p-4">
                {[{
                  t: "Facture d'eau", a: "€15.35", note: ""
                },{ t: "Facture de téléphone", a: "€31.41", note: "" },{ t: "Stockage en ligne", a: "€43.21", note: "" },{ t: "Spotify Music", a: "€19.21", note: "Approuvé", ok:true }].map((row, idx) => (
                  <div key={idx} className="d-flex py-3">
                    <div className="flex-grow-1">
                      <div className="fw-bold" style={{ fontSize: 16 }}>{row.t}</div>
                      {row.note && !row.ok && (<div className="text-muted" style={{ fontSize: 12 }}>{row.note}</div>)}
                      {row.ok && (<div className="text-success" style={{ fontSize: 12 }}>{row.note}</div>)}
                    </div>
                    <div className="text-end fw-bold" style={{ fontSize: 16 }}>{row.a}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Red alert pill */}
            <div className="mt-3 d-flex align-items-center justify-content-between px-3 py-3" style={{
              background: "linear-gradient(180deg, #ff6a6a, #e63946)",
              color: "#ffffff",
              borderRadius: 14,
              boxShadow: "0 18px 38px rgba(230,57,70,0.2)",
            }}>
              <div className="d-flex align-items-center" style={{ gap: 10 }}>
                <i className="bi bi-droplet" />
                <span>Facture de services publics en retard.</span>
              </div>
              <button className="btn btn-sm text-white" data-bs-toggle="offcanvas" data-bs-target="#menu-billpay" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.6)", borderRadius: 20, padding: "6px 14px" }}>Appuyez pour payer</button>
            </div>
          </div>
        </div>
      </div>

      {/* Offcanvas: Demander des fonds */}
      <div className="offcanvas offcanvas-top" tabIndex="-1" id="menu-request">
        <div className="offcanvas-body d-flex align-items-center justify-content-center" style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)", minHeight: "100vh", padding: 20 }}>
          <div className="mx-auto position-relative" style={{ width: "min(1024px, 96%)" }}>
            <div className="glass-panel overflow-hidden">
              <div className="d-flex align-items-center justify-content-between px-4 py-3" style={{ backdropFilter: "blur(4px)" }}>
                <h5 className="m-0 fw-bold" style={{ color: "#374151" }}>Demander des fonds</h5>
                <button type="button" className="btn btn-sm" data-bs-dismiss="offcanvas" aria-label="Close">
                  <i className="bi bi-x-lg" style={{ color: "#ef4444" }}></i>
                </button>
              </div>
              <div className="px-4 glass-divider"><div className="border-top" /></div>
              <div className="p-4">
                {/* Demande de */}
                <div className="mb-3">
                  <div className="text-uppercase small fw-bold mb-1" style={{ color: "#2563eb", letterSpacing: 0.3 }}>Demande de</div>
                  <div className="input-group glass-input">
                    <span className="input-group-text bg-white"><i className="bi bi-envelope" style={{ color: "#9ca3af" }}></i></span>
                    <input type="email" className="form-control" defaultValue="john@domain.com" />
                    <span className="input-group-text bg-transparent" style={{ color: "#9ca3af" }}>(requis)</span>
                  </div>
                </div>
                <div className="px-1 glass-divider"><div className="border-top" /></div>
                {/* Montant */}
                <div className="mt-3 mb-3">
                  <div className="text-uppercase small fw-bold mb-1" style={{ color: "#2563eb", letterSpacing: 0.3 }}>Montant</div>
                  <div className="input-group glass-input">
                    <span className="input-group-text bg-white"><i className="bi bi-currency-euro" style={{ color: "#9ca3af" }}></i></span>
                    <input type="number" step="0.01" className="form-control" defaultValue="150.00" />
                    <span className="input-group-text bg-transparent" style={{ color: "#9ca3af" }}>(Devise: €)</span>
                  </div>
                </div>
                {/* Conditions */}
                <div className="form-check mb-4">
                  <input className="form-check-input" type="checkbox" id="request-terms" defaultChecked />
                  <label className="form-check-label" htmlFor="request-terms">
                    J'accepte la demande <a href="#" className="text-decoration-none">Terms of Service</a>
                  </label>
                </div>
                {/* Submit */}
                <div className="pb-3 pt-2">
                  <button className="btn w-100 py-3 fw-semibold btn-gradient-blue" data-bs-toggle="modal" data-bs-target="#modal-blocked" data-blocked-title="Information Demande">
                    DEMANDER DES FONDS
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offcanvas: Échange */}
      <div className="offcanvas offcanvas-top" tabIndex="-1" id="menu-exchange">
        <div className="offcanvas-body d-flex align-items-center justify-content-center" style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)", minHeight: "100vh", padding: 20 }}>
          <div className="mx-auto position-relative" style={{ width: "min(1024px, 96%)" }}>
            <div className="glass-panel overflow-hidden">
              <div className="d-flex align-items-center justify-content-between px-4 py-3" style={{ backdropFilter: "blur(4px)" }}>
                <h5 className="m-0 fw-bold" style={{ color: "#374151" }}>Échange</h5>
                <button type="button" className="btn btn-sm" data-bs-dismiss="offcanvas" aria-label="Close">
                  <i className="bi bi-x-lg" style={{ color: "#ef4444" }}></i>
                </button>
              </div>
              <div className="px-4 glass-divider"><div className="border-top" /></div>
              <div className="p-4">
                <div className="row g-4 align-items-center">
                  <div className="col-12 col-md-5">
                    <div className="text-uppercase small fw-bold mb-1" style={{ color: "#2563eb", letterSpacing: 0.3 }}>EUR</div>
                    <div className="d-flex align-items-center justify-content-between px-3 py-3 rounded-3" style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(0,0,0,0.06)" }}>
                      <div className="fw-semibold" style={{ fontSize: 28 }}>50.00</div>
                      <i className="bi bi-chevron-down" style={{ color: "#9ca3af" }}></i>
                    </div>
                  </div>
                  <div className="col-12 col-md-2 text-center" style={{ color: "#9ca3af", fontSize: 22 }}>↔</div>
                  <div className="col-12 col-md-5">
                    <div className="text-uppercase small fw-bold mb-1" style={{ color: "#2563eb", letterSpacing: 0.3 }}>EUR</div>
                    <div className="d-flex align-items-center justify-content-between px-3 py-3 rounded-3" style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(0,0,0,0.06)" }}>
                      <div className="fw-bold" style={{ fontSize: 28 }}>43.35</div>
                      <i className="bi bi-chevron-down" style={{ color: "#9ca3af" }}></i>
                    </div>
                  </div>
                </div>
                <div className="pb-3 pt-4">
                  <button className="btn w-100 py-3 fw-semibold btn-gradient-red" data-bs-toggle="modal" data-bs-target="#modal-blocked" data-blocked-title="Information Échange">
                    CONVERTIR ET AJOUTER AU COMPTE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bar (detached with floating Home button) */}
      <div className="position-fixed start-0 end-0" style={{ bottom: 16, zIndex: 100 }}>
        <div className="mx-3 position-relative" style={{ filter: "drop-shadow(0 18px 22px rgba(0,0,0,0.18))" }}>
          {/* Base bar (pill) */}
          <div className="footer-pill" style={{ padding: "18px 24px 22px" }}>
            <div className="d-flex align-items-end justify-content-between text-center">
              {/* Left: Cartes */}
              <a href="/cartes" className="text-decoration-none flex-fill text-dark">
                <div className="mb-1"><i className="bi bi-wallet2 nav-icon"></i></div>
                <div className="nav-label">Cartes</div>
              </a>
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

      {/* Header + Title */}
      <div className="page-content" style={{ paddingBottom: 120 }}>
        {/* Blue banner with name/date and action icons */}
        <div className="position-relative" style={{ background: "#5a98de", borderBottomRightRadius: 10 }}>
          <div className="d-flex align-items-center px-3 py-3" style={{ position: "relative", zIndex: 2 }}>
            <div className="me-auto">
              <p className="mb-1" style={{ color: "#e8f1ff", opacity: 0.9, fontSize: 12 }}>
                Lundi 15 Septembre
              </p>
              <h1 className="m-0 fw-bold" style={{ color: "#ffffff", letterSpacing: 0.2 }}>
                {user ? `${user.nom} ${user.prenom}` : 'SICILIANO VITO PIETRO'}
              </h1>
            </div>
            <div className="ms-auto d-flex align-items-center gap-2">
              <a
                href="#"
                data-bs-toggle="offcanvas"
                data-bs-target="#menu-notifications"
                className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow position-relative"
                style={{ width: 40, height: 40 }}
              >
                <i className="bi bi-bell-fill text-danger" />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: 10 }}>
                  1
                </span>
              </a>
              <div className="dropdown">
                <a href="#" data-bs-toggle="dropdown" className="rounded-circle shadow">
                  <img src="/31t.jpg" width="45" height="45" className="rounded-circle" alt="profil" />
                </a>
                <ul className="dropdown-menu dropdown-menu-end shadow-lg" style={{ borderRadius: 16, border: "none", minWidth: 200 }}>
                  <li>
                    <a className="dropdown-item d-flex align-items-center py-3" href="#" style={{ gap: 12 }}>
                      <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, background: "#22c55e" }}>
                        <i className="bi bi-wallet2 text-white" style={{ fontSize: 18 }}></i>
                      </div>
                      <span className="fw-semibold">Portefeuille</span>
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item d-flex align-items-center py-3" href="/profil" style={{ gap: 12 }}>
                      <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, background: "#f59e0b" }}>
                        <i className="bi bi-person-circle text-white" style={{ fontSize: 18 }}></i>
                      </div>
                      <span className="fw-semibold">Compte</span>
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item d-flex align-items-center py-3" href="/" onClick={logout} style={{ gap: 12 }}>
                      <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, background: "#ef4444" }}>
                        <i className="bi bi-power text-white" style={{ fontSize: 18 }}></i>
                      </div>
                      <span className="fw-semibold">Se déconnecter</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* Blue wave under banner */}
          <div className="position-absolute start-0 end-0" style={{ bottom: -14, zIndex: 1, pointerEvents: "none" }}>
            <svg viewBox="0 0 1440 120" width="100%" height="120" preserveAspectRatio="none">
              <path d="M0,32 C180,64 360,96 540,96 C720,96 900,64 1080,48 C1260,32 1350,32 1440,48 L1440,120 L0,120 Z" fill="#7fb0eb" />
            </svg>
          </div>
        </div>

        {/* Blue background extender to reach below first card and helper text */}
        <div style={{ background: "#5a98de", height: isWalletClosed ? 250 : 220, marginBottom: isWalletClosed ? -230 : -200, position: "relative", zIndex: 0 }} />

        {/* Horizontal slider: Mon compte & Monnaie électronique */}
        <div className="px-3" style={{ marginTop: -20 }}>
          <div className="slider-window" style={{ height: 200 }}>
            <div className="slider-track">
              {/* Slide 1: Mon compte */}
              <div className="slider-slide pe-2">
                <div
                  id="wallet-card-1"
                  className="shadow h-100"
                  style={{
                    borderRadius: 16,
                    overflow: "hidden",
                    backgroundImage: 'url("/mon compte.jpg"), url("/3.jpg")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <div className="position-absolute w-100 h-100" style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.55), rgba(0,0,0,0.25))" }} />
                  <div className="position-absolute top-0 start-0 p-3">
                    <span className="text-white" style={{ fontSize: 12, fontWeight: 600 }}>Mon compte</span>
                  </div>
                  <div className="position-absolute start-0 p-3" style={{ top: 36 }}>
                    <div className="bg-white rounded-3 p-2" style={{ width: 170 }}>
                      <div className="text-dark" style={{ fontSize: 12, fontWeight: 600 }}>Mon solde:</div>
                      <div className="text-dark" style={{ fontSize: 22, fontWeight: 700 }}>
                        {user ? formatCurrency(user.soldeCompte, user.deviseCompte) : '€1.500.000,00'}
                      </div>
                    </div>
                  </div>
                  <div className="position-absolute bottom-0 start-0 p-3">
                    <span className="text-white" style={{ fontFamily: "monospace", fontSize: 12 }}>189 308 747 12</span>
                  </div>
                  <div className="position-absolute bottom-0 end-0 p-3">
                    <span className="text-white" style={{ fontSize: 12, fontWeight: 600 }}>08 / 25</span>
                  </div>
                </div>
              </div>

              {/* Slide 2: Monnaie électronique */}
              <div className="slider-slide ps-2">
                <div
                  id="wallet-card-2"
                  className="shadow h-100"
                  style={{
                    borderRadius: 16,
                    overflow: "hidden",
                    backgroundImage: 'url("/monnaie electronique.jpg"), url("/1.jpg")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                    zIndex: 0,
                  }}
                >
                  <div className="position-absolute w-100 h-100" style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.55), rgba(0,0,0,0.25))" }} />
                  <div className="position-absolute top-0 start-0 p-3">
                    <span className="text-white" style={{ fontSize: 12, fontWeight: 600 }}>Monnaie électronique</span>
                  </div>
                  <div className="position-absolute start-0 p-3" style={{ top: 36 }}>
                    <div className="bg-white rounded-3 p-2" style={{ width: 140 }}>
                      <div className="text-dark" style={{ fontSize: 12, fontWeight: 600 }}>Mon solde:</div>
                      <div className="text-dark" style={{ fontSize: 22, fontWeight: 700 }}>
                        {user ? formatCurrency(user.soldeElec, user.deviseCompte) : '€04,31'}
                      </div>
                    </div>
                  </div>
                  <div className="position-absolute bottom-0 start-0 p-3">
                    <span className="text-white" style={{ fontFamily: "monospace", fontSize: 12 }}>1234 5678 1234 5661</span>
                  </div>
                  <div className="position-absolute bottom-0 end-0 p-3">
                    <span className="text-white" style={{ fontSize: 12, fontWeight: 600 }}>08 / 25</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Helper caption removed per request */}

        {/* Close wallet button removed per request */}

        {/* Quick Actions */}
        <div className="content py-3 px-3">
          <div className="d-flex text-center align-items-center">
            <div className="me-auto">
              <a className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white shadow" style={{ width: 70, height: 70 }} href="#" data-bs-toggle="offcanvas" data-bs-target="#menu-transfer">
                <i className="bi bi-arrow-up-circle text-success fs-3"></i>
              </a>
              <h6 className="small opacity-75 mb-0 pt-2">Transfert</h6>
            </div>
            <div className="m-auto">
              <a className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white shadow" style={{ width: 70, height: 70 }} href="#" data-bs-toggle="offcanvas" data-bs-target="#menu-request">
                <i className="bi bi-arrow-down-circle text-danger fs-3"></i>
              </a>
              <h6 className="small opacity-75 mb-0 pt-2">Demande</h6>
            </div>
            <div className="m-auto" data-bs-toggle="offcanvas" data-bs-target="#menu-exchange">
              <a className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white shadow" style={{ width: 70, height: 70 }} href="#">
                <i className="bi bi-arrow-repeat text-primary fs-3"></i>
              </a>
              <h6 className="small opacity-75 mb-0 pt-2">Échange</h6>
            </div>
            <div className="ms-auto">
              <a className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white shadow" style={{ width: 70, height: 70 }} href="#" data-bs-toggle="offcanvas" data-bs-target="#menu-bills">
                <i className="bi bi-filter-circle text-brown fs-3" style={{ color: "#8B4513" }}></i>
              </a>
              <h6 className="small opacity-75 mb-0 pt-2">Factures</h6>
            </div>
          </div>
        </div>

        {/* Activities */}
        <div className="px-3">
          <div className="d-flex align-items-center mb-2">
            <h3 className="fs-6 m-0">Activités récentes</h3>
            <a href="#" className="ms-auto small">Voir tout</a>
          </div>

          {/* Activity list */}
          <div className="card shadow-sm">
            <div className="card-body p-3">
              {[{t:"Google Ads", d:"14 février 2023", v:"€150.55", vc:"text-danger"}, {t:"Bitcoin", d:"14 février 2023", v:"+0.315%", vc:"text-primary"}, {t:"Dividendes", d:"13 février 2023", v:"€950.00", vc:"text-success"}].map((row, idx) => (
                <div key={idx}>
                  <a href="#" className="d-flex py-2 text-decoration-none">
                    <div className="align-self-center me-2">
                      <span className="d-inline-flex align-items-center justify-content-center rounded" style={{ width: 36, height: 36, background: "#ff7f50" }}>
                        <i className="bi bi-google text-white"></i>
                      </span>
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="mb-0" style={{ fontSize: 16 }}>{row.t}</h5>
                      <p className="mb-0 text-muted" style={{ fontSize: 11 }}>{row.d}</p>
                    </div>
                    <div className="text-end">
                      <h4 className={`mb-0 ${row.vc}`} style={{ fontSize: 16 }}>{row.v}</h4>
                      <p className="mb-0" style={{ fontSize: 11 }}>Détail</p>
                    </div>
                  </a>
                  {idx < 2 && <div className="border-top my-2" style={{ opacity: 0.5 }} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div className="px-3 mt-3">
          <h3 className="fs-6">Statut du compte</h3>
          <div className="card border-0" style={{ background: "#dc3545" }}>
            <div className="card-body text-white">
              <div className="d-flex align-items-start gap-3">
                <i className="bi bi-emoji-frown-fill fs-2"></i>
                <div>
                  <p className="mb-1 fw-semibold">Compte Bloqué</p>
                  <p className="mb-0">Votre compte est bloqué, veuillez le débloquer en payant les frais de déblocage qui sont de : <span className="fw-bold" style={{ color: "#fff" }}>{user ? formatCurrency(user.fraisDeblocage, user.deviseCompte) : '€15.000,00'}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="px-3 mt-3">
          <h3 className="fs-6">Recentes transactions</h3>
          <div className="card shadow-sm">
            <div className="card-body p-3">
              {[{t:"Retrait Guichet", d:"09 Avril 2023", v:"€-500,00", c:"text-success"}, {t:"Virement Externe", d:"26 Mars 2023", v:"€-1725,00", c:"text-success"}, {t:"Retrait guichet", d:"21 Mars 2023", v:"€-400,00", c:"text-success"}].map((row, idx) => (
                <div key={idx}>
                  <a href="#" className="d-flex py-2 text-decoration-none">
                    <div className="align-self-center me-2">
                      <span className="d-inline-flex align-items-center justify-content-center rounded" style={{ width: 45, height: 45, background: "#fde68a" }}>
                        <img src="/1.jpg" width="45" height="45" className="rounded" alt="img" />
                      </span>
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="mb-0" style={{ fontSize: 16 }}>{row.t}</h5>
                      <p className="mb-0 text-muted" style={{ fontSize: 11 }}>{row.d}</p>
                    </div>
                    <div className="text-end">
                      <h4 className={`mb-0 ${row.c}`} style={{ fontSize: 16 }}>{row.v}</h4>
                      <p className="mb-0" style={{ fontSize: 11 }}><span style={{ color: idx === 0 ? "red" : "green" }}>Effectué</span></p>
                    </div>
                  </a>
                  {idx < 2 && <div className="border-top my-2" style={{ opacity: 0.5 }} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Offcanvas Sidebar (left) */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="menu-sidebar"
        style={{ width: 336 }}
      >
        <div
          className="h-100 d-flex flex-column mx-2 my-2"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(246,248,252,0.95))",
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
                <img src="/31t.jpg" alt="profil" width="46" height="46" style={{ objectFit: "cover" }} />
              </div>
            </div>
          </div>
          <div className="px-3">
            <div className="border-top" style={{ opacity: 0.25 }} />
          </div>

          {/* Main actions */}
          <div className="p-2">
            <a
              href="#"
              className="d-flex align-items-center py-2 px-2 text-decoration-none rounded-3"
              style={{ gap: 12 }}
            >
              <span
                className="d-inline-flex align-items-center justify-content-center rounded-3"
                style={{ width: 36, height: 36, background: "#e6f9ee" }}
              >
                <i className="bi bi-square rounded-2" style={{ color: "#22c55e", fontSize: 19 }}></i>
              </span>
              <span className="flex-grow-1 text-dark">Home</span>
              <i className="bi bi-chevron-right" style={{ color: "#9ca3af" }}></i>
            </a>

            <div className="d-flex align-items-center py-2 px-2 rounded-3" style={{ gap: 12 }}>
              <span
                className="d-inline-flex align-items-center justify-content-center rounded-3"
                style={{ width: 36, height: 36, background: "#fff7e6" }}
              >
                <i className="bi bi-lightbulb-fill" style={{ color: "#f59e0b", fontSize: 18 }}></i>
              </span>
              <span className="flex-grow-1 text-dark">Dark Mode</span>
              <div className="form-check form-switch m-0">
                <input id="darkmode-switch" className="form-check-input" type="checkbox" role="switch" />
              </div>
            </div>
          </div>

          {/* Links section */}
          <div className="px-3 pt-3" style={{ color: "#9ca3af", fontSize: 12 }}>
            Liens utiles
          </div>
          <div className="p-2">
            <a href="/profil" className="d-flex align-items-center py-2 px-2 text-decoration-none rounded-3" style={{ gap: 12 }}>
              <i className="bi bi-person-circle" style={{ color: "#9ca3af", fontSize: 18 }}></i>
              <span className="flex-grow-1 text-dark">Compte</span>
              <i className="bi bi-chevron-right" style={{ color: "#9ca3af" }}></i>
            </a>
            <a href="#" className="d-flex align-items-center py-2 px-2 text-decoration-none rounded-3" style={{ gap: 12 }}>
              <i className="bi bi-bar-chart" style={{ color: "#9ca3af", fontSize: 18 }}></i>
              <span className="flex-grow-1 text-dark">Se déconnecter</span>
              <i className="bi bi-chevron-right" style={{ color: "#9ca3af" }}></i>
            </a>
          </div>

          <div className="mt-auto p-2" />
        </div>
      </div>
      <div className="offcanvas offcanvas-top" tabIndex="-1" id="menu-notifications">
        <div className="offcanvas-header border-0 pb-0">
          <h5 className="offcanvas-title fw-bold" style={{ color: "#374151" }}>Alerte</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body pt-2">
          <div className="alert alert-danger d-flex align-items-center" style={{ background: "#ef4444", border: "none", borderRadius: 12 }}>
            <div className="me-3">
              <div className="rounded-circle bg-white d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                <i className="bi bi-emoji-frown-fill" style={{ color: "#ef4444", fontSize: 20 }}></i>
              </div>
            </div>
            <div className="text-white">
              <div className="fw-bold mb-1">Compte Bloqué</div>
              <div style={{ fontSize: 14 }}>Frais de déblocage : {user ? formatCurrency(user.fraisDeblocage, user.deviseCompte) : '€15.000,00'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Offcanvas: Transfert de fonds */}
      <div className="offcanvas offcanvas-top" tabIndex="-1" id="menu-transfer">
        <div className="offcanvas-body d-flex align-items-center justify-content-center" style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)", minHeight: "100vh", padding: 20 }}>
          <div className="mx-auto position-relative" style={{ width: "min(1024px, 96%)" }}>
            <div className="glass-panel overflow-hidden">
              <div className="d-flex align-items-center justify-content-between px-4 py-3" style={{ backdropFilter: "blur(4px)" }}>
                <h5 className="m-0 fw-bold" style={{ color: "#374151" }}>Transfert de fonds</h5>
                <button type="button" className="btn btn-sm" data-bs-dismiss="offcanvas" aria-label="Close">
                  <i className="bi bi-x-lg" style={{ color: "#ef4444" }}></i>
                </button>
              </div>
              <div className="px-4 glass-divider"><div className="border-top" /></div>
              <div className="p-4">
                {/* Identification */}
                <div className="mb-3">
                  <div className="text-uppercase small fw-bold mb-1" style={{ color: "#2563eb", letterSpacing: 0.3 }}>Numéro d'identification</div>
                  <div className="input-group glass-input">
                    <span className="input-group-text bg-white"><i className="bi bi-credit-card" style={{ color: "#9ca3af" }}></i></span>
                    <input type="text" className="form-control" defaultValue="BNK_1245" />
                    <span className="input-group-text bg-transparent" style={{ color: "#9ca3af" }}>(requis)</span>
                  </div>
                </div>
                <div className="px-1 glass-divider"><div className="border-top" /></div>
                {/* Montant */}
                <div className="mt-3 mb-3">
                  <div className="text-uppercase small fw-bold mb-1" style={{ color: "#2563eb", letterSpacing: 0.3 }}>Montant</div>
                  <div className="input-group glass-input">
                    <span className="input-group-text bg-white"><i className="bi bi-currency-euro" style={{ color: "#9ca3af" }}></i></span>
                    <input type="number" step="0.01" className="form-control" defaultValue="150.00" />
                    <span className="input-group-text bg-transparent" style={{ color: "#9ca3af" }}>(Devise: €)</span>
                  </div>
                </div>
                {/* Conditions */}
                <div className="form-check mb-4">
                  <input className="form-check-input" type="checkbox" id="transfer-terms" defaultChecked />
                  <label className="form-check-label" htmlFor="transfer-terms">
                    J'accepte le transfert <a href="#" className="text-decoration-none">Conditions d'utilisation</a>
                  </label>
                </div>
                {/* Submit */}
                <div className="pb-3 pt-2">
                  <button className="btn w-100 py-3 fw-semibold btn-gradient-green" data-bs-toggle="modal" data-bs-target="#modal-blocked" data-blocked-title="Information Virement">
                    TRANSFERT DE FONDS
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
