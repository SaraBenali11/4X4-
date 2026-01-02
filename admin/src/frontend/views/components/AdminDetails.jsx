import React from "react";
import "../styles/AdminDetails.css";
import StatusCard from "../modules/statuscard/statuscard.jsx";

// Grid layout: Admin Info + Status on top, Activities below
export default function AdminDetails() {
  return (
    <div className="admin-details-shell">
      <div className="admin-details-grid">
        <StatusCard />
      </div>
    </div>
  );
}
