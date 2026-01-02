import React from "react";
import StatusBadge from "../../components/status";

export default function OrderCard({
  order,
  isRecues,
  onStatusChange,
  onRemove,
  onAccept,
}) {
  return (
    <div className="order-card">
      <div className="order-top">
        <div className="order-left">
          <div className="order-name">
            {order.name}{" "}
            <StatusBadge
              status={order.status}
              onStatusChange={onStatusChange}
              orderId={order.id}
            />
          </div>

          <div className="order-detail">
            Produit: <span className="strong">{order.product}</span>
          </div>
          <div className="order-detail">Téléphone: {order.phone}</div>
          <div className="order-detail">Adresse: {order.address}</div>
          {!isRecues && order.notes && (
            <div className="order-detail">
              <span className="strong">Notes:</span> {order.notes}
            </div>
          )}
        </div>

        <div className="order-middle">
          <div className="order-detail">
            Taille: <span className="strong">{order.size}</span>
          </div>
          <div className="order-detail">
            Wilaya: <span className="strong">{order.wilaya}</span>
          </div>
          <div className="order-detail">
            Date: <span className="strong">{order.date}</span>
          </div>
        </div>

        <div className="order-right">
          {!isRecues && order.status === "En attente" && (
            <div className="action-buttons">
              <button
                className="btn accept"
                title="Accepter"
                onClick={() => onAccept && onAccept(order.id)}
              >
                ✔
              </button>
              <button
                className="btn reject"
                title="Refuser"
                onClick={() => onRemove && onRemove(order.id)}
              >
                ✖
              </button>
            </div>
          )}

          {isRecues && (
            <div className="action-buttons">
              <button
                className="btn reject"
                title="Refuser"
                onClick={() => onRemove && onRemove(order.id)}
              >
                ✖
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
