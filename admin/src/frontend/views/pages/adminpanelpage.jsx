import React from "react";
import AdminPanel from "../modules/adminpanel/adminpanel.jsx";
import Header from "../components/headeradmin.jsx";

/**
 * Admin Panel Page Component
 * Main page wrapper for the admin dashboard
 */
export default function Adminpanelpage() {
  return (
    <>
      <Header />
      <AdminPanel />
    </>
  );
}
