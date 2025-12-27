import React, { useState } from "react";
import "../../styles/AdminPanel.css";

import {
  stats,
  initialOrders,
} from "../../../../database/models/listsfortesting.js";

import ProduitsContent from "../../components/ProduitsContent.jsx";
import OutfitsContent from "./OutfitsContent.jsx";
import OrderCard from "./ordercard.jsx";

import { useAdminAuth } from "../../../context/AdminAuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import { Eye, ShoppingCart, Truck, RotateCcw } from "lucide-react";
import ConfirmModal from "../../components/ConfirmModal.jsx";

const iconMap = {
  ShoppingCart: ShoppingCart,
  Truck: Truck,
  RotateCcw: RotateCcw,
};

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("commandes");
  const [orders, setOrders] = useState(initialOrders);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleOrderStatusChange = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleOrderRemove = (orderId) => {
    setOrders(orders.filter((order) => order.id !== orderId));
  };

  const handleOrderAccept = (orderId) => {
    handleOrderStatusChange(orderId, "En Cours");
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate("/login");
  };

  const handleViewAsUser = () => {
    window.location.href = "/userview";
  };

  return (
    <div className="app-root">
      {/* Header */}
      <header className="header">
        <h1 className="title">Tableau de Bord Admin</h1>

        <div className="header-actions">
          <button className="view-user" onClick={handleViewAsUser}>
            <Eye size={18} />
            Voir comme utilisateur
          </button>
          <button className="logout" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </header>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="Confirmer la déconnexion"
        message="Êtes-vous sûr de vouloir vous déconnecter?"
        confirmText="Déconnexion"
        cancelText="Annuler"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
        type="warning"
      />

      {/* Main */}
      <main className="container">
        {/* Stats */}
        <section className="stats-row">
          {stats.map((s, idx) => {
            const IconComponent = iconMap[s.icon];
            return (
              <div key={idx} className="stat-card">
                <div className="stat-left">
                  <div className="stat-icon">
                    {IconComponent ? <IconComponent size={24} /> : s.icon}
                  </div>
                  <div className="stat-text">
                    <div className="muted">{s.title}</div>
                    <div className="stat-value">{s.value}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Tabs */}
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
                    <OrderCard
                      key={o.id}
                      order={o}
                      onStatusChange={handleOrderStatusChange}
                      onRemove={handleOrderRemove}
                      onAccept={handleOrderAccept}
                    />
                  ))}
                </div>
              </>
            )}

            {activeTab === "produits" && <ProduitsContent />}

            {activeTab === "tenues" && <OutfitsContent />}
          </div>
        </section>
      </main>
    </div>
  );
}
