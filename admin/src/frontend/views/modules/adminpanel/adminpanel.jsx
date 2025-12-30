import React, { useState, useEffect } from "react";
import "../../styles/AdminPanel.css";

import {
  stats,
} from "../../../../database/models/listsfortesting.js";

import ProduitsContent from "../../components/ProduitsContent.jsx";
import OutfitsContent from "./OutfitsContent.jsx";
import OrderCard from "./ordercard.jsx";
import { orderService } from "../../../services/orderService";

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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  // Fetch orders from Supabase
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrders();
      // Transform data to match OrderCard format
      const transformedOrders = data.map((order) => {
        // Get first product name or combine all products
        const productNames = order.order_items
          ?.map((item) => item.product?.name || "Produit")
          .join(", ") || "Produit";
        
        // Get first size or combine sizes
        const sizes = order.order_items
          ?.map((item) => item.size)
          .join(", ") || "N/A";

        // Format date
        const date = order.created_at
          ? new Date(order.created_at).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
          : "";

        // Normalize status to match UI expectations
        let normalizedStatus = order.status || "En attente";
        if (normalizedStatus.toLowerCase() === "en attente") {
          normalizedStatus = "En attente";
        } else if (normalizedStatus.toLowerCase() === "en cours") {
          normalizedStatus = "En Cours";
        } else if (normalizedStatus.toLowerCase() === "livrée" || normalizedStatus.toLowerCase() === "livree") {
          normalizedStatus = "Livrée";
        } else if (normalizedStatus.toLowerCase() === "retour") {
          normalizedStatus = "Retour";
        }

        return {
          id: order.id,
          name: order.full_name,
          status: normalizedStatus,
          product: productNames,
          phone: order.phone,
          address: order.address,
          notes: order.notes || "",
          size: sizes,
          wilaya: order.wilaya,
          date: date,
          email: order.email,
          order_items: order.order_items, // Keep original for reference
        };
      });
      setOrders(transformedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      // Normalize status to lowercase for database
      const dbStatus = newStatus.toLowerCase();
      await orderService.updateOrderStatus(orderId, dbStatus);
      // Update local state with normalized status
      const normalizedStatus = 
        dbStatus === "en attente" ? "En attente" :
        dbStatus === "en cours" ? "En Cours" :
        dbStatus === "livrée" || dbStatus === "livree" ? "Livrée" :
        dbStatus === "retour" ? "Retour" : newStatus;
      
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: normalizedStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  const handleOrderRemove = async (orderId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette commande?")) {
      return;
    }
    try {
      await orderService.deleteOrder(orderId);
      setOrders(orders.filter((order) => order.id !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Erreur lors de la suppression de la commande");
    }
  };

  const handleOrderAccept = (orderId) => {
    handleOrderStatusChange(orderId, "en cours");
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

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => {
          const status = order.status?.toLowerCase() || "";
          if (statusFilter === "en attente") return status === "en attente";
          if (statusFilter === "en cours") return status === "en cours" || status === "en cours";
          if (statusFilter === "livrée") return status === "livrée" || status === "livree";
          if (statusFilter === "retour") return status === "retour";
          return true;
        });

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
                <div className="commandes-header">
                  <h2 className="panel-title">Demandes de Commande</h2>
                  <div className="status-filters">
                    <button
                      className={`filter-btn ${
                        statusFilter === "all" ? "active" : ""
                      }`}
                      onClick={() => setStatusFilter("all")}
                    >
                      Toutes
                    </button>
                    <button
                      className={`filter-btn ${
                        statusFilter === "en attente" ? "active" : ""
                      }`}
                      onClick={() => setStatusFilter("en attente")}
                    >
                      En attente
                    </button>
                    <button
                      className={`filter-btn ${
                        statusFilter === "en cours" ? "active" : ""
                      }`}
                      onClick={() => setStatusFilter("en cours")}
                    >
                      En cours
                    </button>
                    <button
                      className={`filter-btn ${
                        statusFilter === "livrée" ? "active" : ""
                      }`}
                      onClick={() => setStatusFilter("livrée")}
                    >
                      Livrée
                    </button>
                    <button
                      className={`filter-btn ${
                        statusFilter === "retour" ? "active" : ""
                      }`}
                      onClick={() => setStatusFilter("retour")}
                    >
                      Retour
                    </button>
                  </div>
                </div>

                <div className="panel-content">
                  {loading ? (
                    <div style={{ padding: "2rem", textAlign: "center" }}>
                      Chargement...
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div style={{ padding: "2rem", textAlign: "center", color: "#9b7f7a" }}>
                      Aucune commande trouvée
                    </div>
                  ) : (
                    filteredOrders.map((o) => (
                      <OrderCard
                        key={o.id}
                        order={o}
                        onStatusChange={handleOrderStatusChange}
                        onRemove={handleOrderRemove}
                        onAccept={handleOrderAccept}
                      />
                    ))
                  )}
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
