import React, { useState } from "react";
import PropTypes from "prop-types";

export default function StatusBadge({ status, onStatusChange, orderId }) {
  const [showMenu, setShowMenu] = useState(false);

  let cls = "";
  if (status === "Confirmée") {
    cls = "badge confirmed";
  } else if (status === "Reçue") {
    cls = "badge recu";
  } else if (status === "Retournée") {
    cls = "badge retournee";
  } else {
    cls = "badge pending";
  }

  const statusOptions = ["En attente", "En Cours", "Livrée", "Retour"];

  const handleStatusChange = (newStatus) => {
    if (onStatusChange) {
      onStatusChange(orderId, newStatus);
    }
    setShowMenu(false);
  };

  return (
    <div className="status-badge-container">
      <span
        className={`${cls} status-clickable`}
        onClick={() => setShowMenu(!showMenu)}
      >
        {status}
      </span>

      {showMenu && onStatusChange && (
        <div className="status-dropdown">
          {statusOptions.map((option) => (
            <button
              key={option}
              className={`status-option ${option === status ? "active" : ""}`}
              onClick={() => handleStatusChange(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func,
  orderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
