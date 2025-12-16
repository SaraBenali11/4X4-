import React from "react";
import "../styles/AdminDetails.css";
import AdminProfile from "./adminprofile/adminprofile.jsx";
import PermissionsCard from "./permissionscard/permissionscard.jsx";
import ActivityLog from "./activitylog/activitylog.jsx";
import StatusCard from "./statuscard/statuscard.jsx";

// Grid layout matches requested 2fr/1fr columns with the four admin cards
export default function AdminDetails() {
  return (
    <div className="admin-details-shell">
      <div className="admin-details-grid">
        <AdminProfile />
        <PermissionsCard />
        <ActivityLog />
        <StatusCard />
      </div>
    </div>
  );
}
