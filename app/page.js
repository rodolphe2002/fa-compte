"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiFetch } from "./lib/api";

export default function Home() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    // Dynamically load Bootstrap JS via CDN on the client only
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js";
    script.integrity =
      "sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM";
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Erreur ${res.status}`);
      }
      const data = await res.json();
      try {
        sessionStorage.setItem('user', JSON.stringify(data.user));
      } catch {}
      window.location.href = "/compte";
    } catch (err) {
      setError(err.message);
      alert("Échec de la connexion: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      {/* Top navigation image */}
      <div style={{ width: "100%", position: "relative" }}>
        <Image
          src="/nav.png"
          alt="Navigation"
          width={1920}
          height={200}
          priority
          style={{ width: "100%", height: "auto", display: "block", marginBottom: 0 }}
        />
      </div>

      {/* Carousel */}
      <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner" style={{ paddingTop: 10, paddingBottom: 10 }}>
          <div className="carousel-item active">
            <Image
              src="/1.jpg"
              alt="Slide 1"
              width={1000}
              height={600}
              style={{ display: "block", width: "100%", height: "auto", maxWidth: 500, margin: "0 auto" }}
            />
          </div>
          <div className="carousel-item">
            <Image
              src="/2.jpg"
              alt="Slide 2"
              width={1000}
              height={600}
              style={{ display: "block", width: "100%", height: "auto", maxWidth: 500, margin: "0 auto" }}
            />
          </div>
          <div className="carousel-item">
            <Image
              src="/3.jpg"
              alt="Slide 3"
              width={1000}
              height={600}
              style={{ display: "block", width: "100%", height: "auto", maxWidth: 500, margin: "0 auto" }}
            />
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

      {/* Content container */}
      <div className="container" style={{ paddingTop: 5, backgroundColor: "white" }}>
        <div className="row" style={{ padding: 15 }}>
          <div className="col-12" style={{ textAlign: "left" }}>
            <h2>
              <strong>Connexion</strong>
              <br />
              <br />
              Identifiez-vous pour accéder à vos comptes en toute sécurité
            </h2>
          </div>
          <div className="col-sm-6 offset-sm-3">
            <form onSubmit={onSubmit}>
              <div className="mb-3" style={{ marginTop: 15 }}>
                <label htmlFor="username" className="form-label" style={{ color: "black" }}>
                  Saisir votre identifiant
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  style={{ height: 47 }}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="mdp" className="form-label" style={{ color: "black" }}>
                  Mot de passe
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="mdp"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ height: 47 }}
                  required
                />
              </div>
              {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
              <div className="mb-3 text-center">
                <button type="submit" name="connect" className="btn form-control" style={{ color: "white", height: 47, backgroundColor: "#008154" }} disabled={loading}>
                  {loading ? "Connexion..." : "Valider"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer image */}
      <div style={{ width: "100%", position: "relative", marginTop: 50 }}>
        <Image src="/f.png" alt="Footer" width={1920} height={240} style={{ width: "100%", height: "auto", display: "block" }} />
      </div>
    </main>
  );
}
