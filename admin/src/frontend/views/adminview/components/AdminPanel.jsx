import React, { useState } from "react";
import "../styles/AdminPanel.css";
import {
  stats,
  initialOrders,
  recuesOrders,
} from "../../../../database/models/listsfortesting.js";
import ProduitsContent from "./ProduitsContent.jsx";
import OutfitsContent from "./OutfitsContent.jsx";
import AdminProfile from "./adminprofile/adminprofile.jsx";
import OrderCard from "./ordercard.jsx";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("commandes");
  const [orders] = useState(initialOrders);
  const [showProfile, setShowProfile] = useState(false);
  const { logout, admin } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-root">
      <header className="header">
        <h1 className="title">Tableau de Bord Admin</h1>
        <div className="header-actions">
          <button
            className="profile-icon-btn"
            onClick={() => setShowProfile(!showProfile)}
            title="Mon Profil"
          >
            <span className="profile-icon">👤</span>
            {admin?.name && <span className="profile-name">{admin.name}</span>}
          </button>
          <button className="logout" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </header>

      {/* Profile Modal/Dropdown */}
      {showProfile && (
        <div className="profile-overlay" onClick={() => setShowProfile(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-profile" onClick={() => setShowProfile(false)}>×</button>
            <AdminProfile />
          </div>
        </div>
      )}

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
            <button
              className={`tab ${activeTab === "tenues" ? "active" : ""}`}
              onClick={() => setActiveTab("tenues")}
            >
              Tenues
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

            {activeTab === "tenues" && <OutfitsContent />}
          </div>
        </section>
      </main>
    </div>
  );
}

