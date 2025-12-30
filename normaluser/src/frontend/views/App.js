import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "../context/CartContext";
import { FavoritesProvider } from "../context/FavoritesContext";
import CookieConsent from "./components/CookieConsent";
import Homepage from "./pages/homepage";
import Adminpanelpage from "./pages/adminpanelpage";
import OutfitInspiration from "./pages/inspiration";
import LoginPage from "./pages/loginpage";
import Productdetpage from "./pages/productdetails";
import ProductsPage from "./pages/produits";
import OutfitCreator from "./pages/createoutfit";
import ContactUsPage from "./pages/contactuspage";
import OutfitsPage from "./pages/outfitspage";
import OutfitDetailsPage from "./pages/outfitdetails";
import FavoritesPage from "./pages/favoritespage";
import OrderForm from "./pages/orderform";

export default function App() {
  return (
    <>
      <CookieConsent />
      <FavoritesProvider>
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/produits" element={<ProductsPage />} />
              <Route path="/inspiration" element={<OutfitInspiration />} />
              <Route path="/creer-tenue" element={<OutfitCreator />} />
              <Route path="/admin" element={<Adminpanelpage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/product/:id" element={<Productdetpage />} />
              <Route path="/outfit/:id" element={<OutfitDetailsPage />} />
              <Route path="/contact-us" element={<ContactUsPage />} />
              <Route path="/outfits" element={<OutfitsPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/order" element={<OrderForm />} />
              <Route path="*" element={<h2>404: Page Not Found</h2>} />
            </Routes>
          </Router>
        </CartProvider>
      </FavoritesProvider>
    </>
  );
}
