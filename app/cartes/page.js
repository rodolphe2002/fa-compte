"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Cartes() {
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
    const bs = document.createElement("script");
    bs.src =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js";
    bs.integrity =
      "sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM";
    bs.crossOrigin = "anonymous";
    document.body.appendChild(bs);

    const existingIcons = document.querySelector(
      'link[href*="bootstrap-icons"]'
    );
    if (!existingIcons) {
      const icons = document.createElement("link");
      icons.rel = "stylesheet";
      icons.href =
        "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css";
      document.head.appendChild(icons);
    }

    // Load user from sessionStorage and guard
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

    // Initialize wallet state from localStorage and sync classes
    try {
      const v = localStorage.getItem('walletClosed');
      const closed = v === '1';
      if (closed) {
        setIsWalletClosed(true);
        const c2 = document.getElementById('wallet-card-2');
        if (c2 && !c2.classList.contains('card-peek')) c2.classList.add('card-peek');
      } else {
        setIsWalletClosed(false);
        const c2 = document.getElementById('wallet-card-2');
        if (c2) c2.classList.remove('card-peek');
      }
    } catch {}

    // Done initializing
    setLoading(false);

    return () => {
      if (bs.parentNode) bs.parentNode.removeChild(bs);
    };
  }, []);

  const closeWallet = () => {
    const card2 = document.getElementById("wallet-card-2");
    if (!card2) return;
    card2.classList.remove("card-slide-back", "card-peek");
    // Trigger animation to peek behind
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
    <main className="theme-light" style={{ background: "#f4f5f7", paddingBottom: 120 }}>
      {/* Global loader overlay */}
      {loading && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", zIndex: 2000 }}>
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      )}
      {/* Header banner */}
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
              className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow"
              style={{ width: 40, height: 40 }}
            >
              <i className="bi bi-bell-fill text-danger" />
            </a>
            <div className="dropdown">
              <a href="#" data-bs-toggle="dropdown" className="rounded-circle shadow">
                <Image src="/25s.jpg" width={45} height={45} className="rounded-circle" alt="img" />
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
                  <a className="dropdown-item d-flex align-items-center py-3" href="#" style={{ gap: 12 }}>
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
        <div className="position-absolute start-0 end-0" style={{ bottom: -14, zIndex: 1, pointerEvents: "none" }}>
          <svg viewBox="0 0 1440 120" width="100%" height="120" preserveAspectRatio="none">
            <path d="M0,32 C180,64 360,96 540,96 C720,96 900,64 1080,48 C1260,32 1350,32 1440,48 L1440,120 L0,120 Z" fill="#7fb0eb" />
          </svg>
        </div>
      </div>

      {/* Blue background extender to reach below first card and helper text */}
      <div style={{ background: "#5a98de", height: isWalletClosed ? 250 : 220, marginBottom: isWalletClosed ? -230 : -200, position: "relative", zIndex: 0 }} />

      {/* Two cards */}
      <div className="px-3" style={{ marginTop: -20 }}>
        {/* Mon compte */}
        <div
          id="wallet-card-1"
          className="shadow mb-3"
          style={{
            borderRadius: 16,
            height: 200,
            overflow: "hidden",
            backgroundImage: 'url("/mon compte.jpg"), url("/3.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            zIndex: 1,
          }}
          onClick={isWalletClosed ? openWallet : undefined}
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

        {/* Monnaie électronique */}
        <div
          id="wallet-card-2"
          className="shadow"
          style={{
            borderRadius: 16,
            height: 200,
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
            <div className="bg-white rounded-3 p-3" style={{ width: 220 }}>
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

        {/* Helper caption placed just under the second card when wallet is closed */}
        {isWalletClosed && (
          <div className="text-center px-3 py-2" style={{ color: "#374151", fontSize: 14, marginTop: 6, position: "relative", zIndex: 2, fontWeight: 500 }}>
            Appuyez sur les cartes pour développer votre portefeuille
          </div>
        )}
      </div>

      

      {/* Close wallet button (visible only when wallet is open) */}
      {!isWalletClosed && (
        <div className="px-3 mt-3">
          <button onClick={closeWallet} className="btn w-100" style={{ background: "#5a98de", color: "#fff", borderRadius: 12, boxShadow: "0 12px 18px rgba(0,0,0,0.15)" }}>
            FERMER MON PORTEFEUILLE
          </button>
        </div>
      )}

      

      {/* Tabs and content */}
      <div className="px-3 mt-3">
        <div className="bg-white p-3 rounded-3 shadow-sm">
          {/* Rounded gray track with pill buttons */}
          <div className="wallet-tabs p-1 rounded-pill mb-2" style={{ background: "#eceff4" }}>
            <ul className="nav nav-pills nav-fill" role="tablist">
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="tab-params" data-bs-toggle="tab" data-bs-target="#panel-params" type="button" role="tab">
                Paramètres
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="tab-histo" data-bs-toggle="tab" data-bs-target="#panel-histo" type="button" role="tab">
                Histoire
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link active" id="tab-activ" data-bs-toggle="tab" data-bs-target="#panel-activ" type="button" role="tab">
                Activité
              </button>
            </li>
            </ul>
          </div>
          <div className="tab-content p-0">
            <div className="tab-pane fade" id="panel-params" role="tabpanel">
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex align-items-center">
                  <span className="me-2 d-inline-flex align-items-center justify-content-center rounded-circle" style={{ width: 28, height: 28, background: "#e6f9ee" }}>
                    <i className="bi bi-globe" style={{ color: "#22c55e" }} />
                  </span>
                  <div className="flex-grow-1">
                    <div className="fw-semibold">Utiliser les paiements en ligne</div>
                    <div className="text-muted" style={{ fontSize: 12 }}>Utilisez cette carte pour payer en ligne</div>
                  </div>
                  <div className="form-check form-switch m-0">
                    <input className="form-check-input" type="checkbox" defaultChecked />
                  </div>
                </div>
                <div className="list-group-item d-flex align-items-center">
                  <span className="me-2 d-inline-flex align-items-center justify-content-center rounded-circle" style={{ width: 28, height: 28, background: "#fff7e6" }}>
                    <i className="bi bi-phone" style={{ color: "#f59e0b" }} />
                  </span>
                  <div className="flex-grow-1">
                    <div className="fw-semibold">Utiliser les paiements NFC</div>
                    <div className="text-muted" style={{ fontSize: 12 }}>Payer par carte sans contact</div>
                  </div>
                  <div className="form-check form-switch m-0">
                    <input className="form-check-input" type="checkbox" defaultChecked />
                  </div>
                </div>
                <a className="list-group-item d-flex align-items-center" href="#">
                  <span className="me-2 d-inline-flex align-items-center justify-content-center rounded-circle" style={{ width: 28, height: 28, background: "#e0e7ff" }}>
                    <i className="bi bi-credit-card" style={{ color: "#4f46e5" }} />
                  </span>
                  <div className="flex-grow-1">
                    <div className="fw-semibold">Changer le nom de la carte</div>
                  </div>
                </a>
                <a className="list-group-item d-flex align-items-center" href="#">
                  <span className="me-2 d-inline-flex align-items-center justify-content-center rounded-circle" style={{ width: 28, height: 28, background: "#fee2e2" }}>
                    <i className="bi bi-exclamation-octagon" style={{ color: "#dc2626" }} />
                  </span>
                  <div className="flex-grow-1">
                    <div className="fw-semibold">Signaler une perte ou un vol</div>
                  </div>
                </a>
              </div>
            </div>
            <div className="tab-pane fade" id="panel-histo" role="tabpanel">
              <div className="list-group list-group-flush">
                {[
                  { title: "Des économies", ops: 14, color: "#22c55e", bg: "#e6f9ee", icon: "bi-piggy-bank", amount: "€414", pct: "13.5%" },
                  { title: "Utilitaires", ops: 11, color: "#f59e0b", bg: "#fff7e6", icon: "bi-droplet-fill", amount: "€631", pct: "20.3%" },
                  { title: "Achats", ops: 23, color: "#3b82f6", bg: "#e0e7ff", icon: "bi-bag-fill", amount: "€950", pct: "45.7%" },
                  { title: "Construction", ops: 34, color: "#ef4444", bg: "#fee2e2", icon: "bi-tools", amount: "€315", pct: "19.5%" },
                  { title: "D'autres coûts", ops: 15, color: "#8b5cf6", bg: "#efe7ff", icon: "bi-x-diamond-fill", amount: "€530", pct: "35.5%" },
                ].map((it, idx) => (
                  <div key={idx} className="list-group-item d-flex align-items-center">
                    <span
                      className="me-3 d-inline-flex align-items-center justify-content-center rounded-circle"
                      style={{ width: 38, height: 38, background: it.bg }}
                    >
                      <i className={`bi ${it.icon}`} style={{ color: it.color }} />
                    </span>
                    <div className="flex-grow-1">
                      <div className="fw-semibold" style={{ fontSize: 15 }}>{it.title}</div>
                      <div className="text-muted" style={{ fontSize: 12 }}>{it.ops} Opérations</div>
                    </div>
                    <div className="text-end">
                      <div className="fw-semibold" style={{ fontSize: 15 }}>{it.amount}</div>
                      <div className="text-muted" style={{ fontSize: 12 }}>{it.pct}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="tab-pane fade show active" id="panel-activ" role="tabpanel">
              <div className="list-group list-group-flush">
                {[
                  { title: "Google Ads", date: "14 février 2023", color: "#ef4444", bg: "#fee2e2", icon: "G", amount: "€150.55", amountClass: "text-danger", note: "Paiement de factures" },
                  { title: "Stockage en ligne", date: "14 février 2023", color: "#3b82f6", bg: "#e0e7ff", icon: "☁", amount: "€15.55", amountClass: "text-danger", note: "Abonnement" },
                  { title: "Bitcoin", date: "14 février 2023", color: "#22c55e", bg: "#e6f9ee", icon: "₿", amount: "+0.315%", amountClass: "text-primary", note: "Mise à jour des stocks" },
                  { title: "Dividendes", date: "13 février 2023", color: "#22c55e", bg: "#e6f9ee", icon: "€", amount: "€950.00", amountClass: "text-success", note: "Virement bancaire" },
                ].map((it, idx) => (
                  <div key={idx} className="list-group-item d-flex align-items-center">
                    <span
                      className="me-3 d-inline-flex align-items-center justify-content-center rounded-3"
                      style={{ width: 36, height: 36, background: it.bg, color: it.color, fontWeight: 700 }}
                      aria-hidden
                    >
                      {it.icon}
                    </span>
                    <div className="flex-grow-1">
                      <div className="fw-semibold" style={{ fontSize: 15 }}>{it.title}</div>
                      <div className="text-muted" style={{ fontSize: 12 }}>{it.date}</div>
                    </div>
                    <div className="text-end">
                      <div className={`fw-semibold ${it.amountClass}`} style={{ fontSize: 15 }}>{it.amount}</div>
                      <div className="text-muted" style={{ fontSize: 12 }}>{it.note}</div>
                    </div>
                  </div>
                ))}
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
              <a href="/cartes" className="text-decoration-none flex-fill text-dark">
                <div className="mb-1"><i className="bi bi-wallet2 nav-icon"></i></div>
                <div className="nav-label">Cartes</div>
              </a>
              {/* Center: Home label (under floating button) */}
              <a href="/compte" className="flex-fill text-decoration-none text-dark"><div style={{ fontSize: 13, color: "#374151" }}>Home</div></a>
              {/* Right: Plus */}
              <a href="#" className="text-decoration-none flex-fill text-dark" data-bs-toggle="offcanvas" data-bs-target="#menu-sidebar">
                <div className="mb-1"><i className="bi bi-three-dots nav-icon"></i></div>
                <div className="nav-label">Plus</div>
              </a>
            </div>
          </div>
          {/* Floating Home button */}
          <a href="/compte" className="position-absolute start-50 translate-middle-x d-flex align-items-center justify-content-center floating-home-btn floating-home-wrapper" style={{ top: 0, transform: "translate(-50%, -58%)" }}>
            <i className="bi bi-house-fill text-white" style={{ fontSize: 24 }}></i>
          </a>
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
                SICILIANO VITO PIETRO
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
            <a
              href="/compte"
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
                <input className="form-check-input" type="checkbox" role="switch" />
              </div>
            </div>
          </div>

          {/* Links section */}
          <div className="px-3 pt-3" style={{ color: "#9ca3af", fontSize: 12 }}>
            Liens utiles
          </div>
          <div className="p-2">
            <a href="#" className="d-flex align-items-center py-2 px-2 text-decoration-none rounded-3" style={{ gap: 12 }}>
              <i className="bi bi-person-circle" style={{ color: "#9ca3af", fontSize: 18 }}></i>
              <span className="flex-grow-1 text-dark">Compte</span>
              <i className="bi bi-chevron-right" style={{ color: "#9ca3af" }}></i>
            </a>
            <Link href="/" onClick={logout} className="d-flex align-items-center py-2 px-2 text-decoration-none rounded-3" style={{ gap: 12 }}>
              <i className="bi bi-bar-chart" style={{ color: "#9ca3af", fontSize: 18 }}></i>
              <span className="flex-grow-1 text-dark">Se déconnecter</span>
              <i className="bi bi-chevron-right" style={{ color: "#9ca3af" }}></i>
            </Link>
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
    </main>
  );
}
