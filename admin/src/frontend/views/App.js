import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminAuthProvider, useAdminAuth } from "../context/AdminAuthContext";
import Adminpanelpage from "./pages/adminpanelpage";
import AdminInfo from "./pages/admininfo";
import AdminLogin from "./components/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductsPage from "./pages/produits";
import AddProduct from "./pages/AddProduct";

function AppContent() {
  const { isAuthenticated, loading } = useAdminAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", fontSize: "18px" }}>
        Chargement...
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* Root route - redirect based on authentication */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/adminpanel" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Login Route - Only route accessible without authentication */}
        <Route path="/login" element={<AdminLogin />} />

        {/* Protected routes */}
        <Route
          path="/adminpanel"
          element={
            <ProtectedRoute>
              <Adminpanelpage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userinfo"
          element={
            <ProtectedRoute>
              <AdminInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-product"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />

        {/* Default redirect - redirect to root for any unknown route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AdminAuthProvider>
  );
}
