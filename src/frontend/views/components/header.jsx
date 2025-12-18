import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Heart, ShoppingBag, LayoutDashboard } from "lucide-react";
import "../styles/header.css";
import { navigationLinks } from "../../../database/data/mockData";
import { CartContext } from "../../context/CartContext";
import { useAdminAuth } from "../../context/AdminAuthContext";

// ⬅️ import cart modal
import CartModal from "../../cart/CartModal";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); // 🛒
  const navigate = useNavigate();
  const { cartItems } = useContext(CartContext);
  const { isAuthenticated } = useAdminAuth();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="header-content">
            <div className="header-left">
              <button
                onClick={toggleMenu}
                className="menu-button"
                aria-label="Toggle navigation menu"
                aria-expanded={isMenuOpen}
              >
                <Menu className="menu-icon" />
              </button>

              <Link to="/" className="logo-link">
                <h1 className="logo">Sutraty</h1>
              </Link>
            </div>

            <nav className="nav-desktop" aria-label="Main navigation">
              {navigationLinks.map((link) => (
                <Link key={link.id} to={link.href} className="nav-link">
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="header-icons">
              <button
                className="icon-button"
                aria-label="View favorites"
                onClick={() => navigate("/favorites")}
              >
                <Heart className="icon" />
              </button>

              {/* 🛒 Shopping bag */}
              <button
                className="icon-button cart-button"
                aria-label="View shopping bag"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag className="icon" />
                {cartItemCount > 0 && (
                  <span className="cart-badge">{cartItemCount}</span>
                )}
              </button>

              {/* Admin Dashboard Button - Only show when logged in */}
              {isAuthenticated && (
                <button
                  className="icon-button"
                  aria-label="Admin Dashboard"
                  onClick={() => navigate("/admin")}
                  title="Admin Dashboard"
                >
                  <LayoutDashboard className="icon" />
                </button>
              )}
            </div>
          </div>

          {isMenuOpen && (
            <div className="mobile-menu">
              <nav className="mobile-nav" aria-label="Mobile navigation">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.id}
                    to={link.href}
                    className="mobile-nav-link"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                ))}
                {/* Admin Dashboard Link in Mobile Menu - Only show when logged in */}
                {isAuthenticated && (
                  <Link
                    to="/admin"
                    className="mobile-nav-link"
                    onClick={closeMenu}
                  >
                    Admin Dashboard
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* 🧾 Cart Modal */}
      <CartModal open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

export default Header;
