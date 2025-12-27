import React from "react";
import PropTypes from 'prop-types';
import StatusBadge from "./status";

export default function OrderCard({ order, isRecues }) {
    return (
      <div className="order-card">
        <div className="order-top">
          <div className="order-left">
            <div className="order-name">
              {order.name} <StatusBadge status={order.status} />
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
                <button className="btn accept" title="Accepter">
                  ✔
                </button>
                <button className="btn reject" title="Refuser">
                  ✖
                </button>
              </div>
            )}
  
            {isRecues && (
              <div className="action-buttons">
                <button className="btn reject" title="Refuser">
                  ✖
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  OrderCard.propTypes = {
    order: PropTypes.shape({
      name: PropTypes.string,
      status: PropTypes.string,
      product: PropTypes.string,
      phone: PropTypes.string,
      address: PropTypes.string,
      notes: PropTypes.string,
      size: PropTypes.string,
      wilaya: PropTypes.string,
      date: PropTypes.string,
    }).isRequired,
    isRecues: PropTypes.bool,
  };

  OrderCard.defaultProps = {
    isRecues: false,
  };