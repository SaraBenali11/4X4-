import React from "react";

export default function OrderCard({ order, isRecues }) {
  return (
    <div className="order-card">
      <div className="order-header">
        <div>
          <div className="order-id">Commande #{order.id}</div>
          <div className="order-customer">{order.name}</div>
        </div>
        <div className="order-status">{order.status}</div>
      </div>
      <div className="order-details">
        <div className="order-info">
          <span>Produit:</span> {order.product}
        </div>
        {order.phone && (
          <div className="order-info">
            <span>Téléphone:</span> {order.phone}
          </div>
        )}
        {order.address && (
          <div className="order-info">
            <span>Adresse:</span> {order.address}
          </div>
        )}
        {order.size && (
          <div className="order-info">
            <span>Taille:</span> {order.size}
          </div>
        )}
        <div className="order-info">
          <span>Date:</span> {order.date}
        </div>
      </div>
      {!isRecues && (
        <div className="order-actions">
          <button className="btn-confirm">Confirmer</button>
          <button className="btn-reject">Rejeter</button>
        </div>
      )}
    </div>
  );
}
