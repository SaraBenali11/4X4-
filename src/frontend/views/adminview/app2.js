import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminAuthProvider, useAdminAuth } from "../../context/AdminAuthContext";
import { CartProvider } from "../../context/CartContext";
import { FavoritesProvider } from "../../context/FavoritesContext";
import { useToast, ToastContainer } from "../../components/Toast";
import Adminpanelpage from "./pages/adminpanelpage";
import AdminInfo from "./pages/admininfo";
import AdminLogin from "./components/AdminLogin";
import ProtectedRoute from "../../components/ProtectedRoute";

// Import all public pages
import Homepage from "../pages/homepage";
import ProductsPage from "../pages/produits";
import OutfitInspiration from "../pages/inspiration";
import OutfitCreator from "../pages/createoutfit";
import Productdetpage from "../pages/productdetails";
import OutfitDetailsPage from "../pages/outfitdetails";
import ContactUsPage from "../pages/contactuspage";
import OutfitsPage from "../pages/outfitspage";
import FavoritesPage from "../pages/favoritespage";

function AppContent() {
  const { toasts, addToast } = useToast();
  const { isAuthenticated, loading } = useAdminAuth();

  const handleAddToCart = (productName) => {
    addToast(`"${productName}" ajouté au panier`);
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', fontSize: '18px' }}>
        Chargement...
      </div>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} />
      <FavoritesProvider>
        <CartProvider onAddToCart={handleAddToCart}>
          <Routes>
            {/* Login Route - Only route accessible without authentication */}
            <Route path="/login" element={<AdminLogin />} />
            
            {/* Root route - redirect to login if not authenticated */}
            <Route
              path="/"
              element={
                !isAuthenticated ? (
                  <Navigate to="/login" replace />
                ) : (
                  <Homepage />
                )
              }
            />
            
            {/* All other routes require authentication */}
            <Route
              path="/admin"
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
              path="/produits"
              element={
                <ProtectedRoute>
                  <ProductsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inspiration"
              element={
                <ProtectedRoute>
                  <OutfitInspiration />
                </ProtectedRoute>
              }
            />
            <Route
              path="/creer-tenue"
              element={
                <ProtectedRoute>
                  <OutfitCreator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product/:id"
              element={
                <ProtectedRoute>
                  <Productdetpage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/outfit/:id"
              element={
                <ProtectedRoute>
                  <OutfitDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact-us"
              element={
                <ProtectedRoute>
                  <ContactUsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/outfits"
              element={
                <ProtectedRoute>
                  <OutfitsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <FavoritesPage />
                </ProtectedRoute>
              }
            />
            
            {/* Default redirect - always go to login if route not found */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </CartProvider>
      </FavoritesProvider>
    </>
  );
}

export default function App2() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AdminAuthProvider>
  );
}
