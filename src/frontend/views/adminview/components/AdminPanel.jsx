import React, { useState } from "react";
import "../styles/AdminPanel.css";
import {
  stats,
  initialOrders,
  recuesOrders,
} from "../../../../database/models/listsfortesting.js";
import ProduitsContent from "./ProduitsContent.jsx";
import OrderCard from "./ordercard.jsx";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("commandes");
  const [orders] = useState(initialOrders);
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-root">
      <header className="header">
        <h1 className="title">Tableau de Bord Admin</h1>
        <button className="logout" onClick={handleLogout}>
          Déconnexion
        </button>
      </header>

      <main className="container">
        <section className="stats-row">
          {stats.map((s, idx) => (
            <div key={idx} className="stat-card">
              <div className="stat-left">
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-text">
                  <div className="muted">{s.title}</div>
                  <div className="stat-value">{s.value}</div>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="tabs-section">
          <nav className="tabs">
            <button
              className={`tab ${activeTab === "commandes" ? "active" : ""}`}
              onClick={() => setActiveTab("commandes")}
            >
              Commandes
            </button>
            <button
              className={`tab ${activeTab === "produits" ? "active" : ""}`}
              onClick={() => setActiveTab("produits")}
            >
              Produits
            </button>
            <button
              className={`tab ${activeTab === "recues" ? "active" : ""}`}
              onClick={() => setActiveTab("recues")}
            >
              Reçues / Retournées
            </button>
          </nav>

          <div className="panel">
            {activeTab === "commandes" && (
              <>
                <h2 className="panel-title">Demandes de Commande</h2>
                <div className="panel-content">
                  {orders.map((o) => (
                    <OrderCard key={o.id} order={o} />
                  ))}
                </div>
              </>
            )}

            {activeTab === "produits" && <ProduitsContent />}

            {activeTab === "recues" && (
              <>
                <h2 className="panel-title">
                  Les commandes Reçues ou Retournées
                </h2>
                <div className="panel-content">
                  {recuesOrders.map((o) => (
                    <OrderCard key={o.id} order={o} isRecues={true} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
