import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, LayoutDashboard, User, LogOut, Heart, ShoppingBag } from "lucide-react";
import { navigationLinks } from "../../../../database/data/mockData";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import { CartContext } from "../../../context/CartContext";
import CartModal from "../../../cart/CartModal";
import "../styles/header.css";

/**
 * Main header component with navigation and user actions
 * Responsive design with mobile menu support
 */
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, admin } = useAdminAuth();
  const { cartItems } = useContext(CartContext);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
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
            {admin && (
              <span className="admin-name" style={{ marginRight: "12px", fontSize: "14px", color: "var(--text)" }}>
                {admin.name || admin.email}
              </span>
            )}
            <button
              className="icon-button"
              aria-label="View favorites"
              onClick={() => navigate("/favorites")}
            >
              <Heart className="icon" />
            </button>
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
            <button
              className="icon-button"
              aria-label="View dashboard"
              onClick={() => navigate("/admin")}
              title="Admin Dashboard"
            >
              <LayoutDashboard className="icon" />
            </button>
            <button
              className="icon-button"
              aria-label="Account settings"
              onClick={() => navigate("/userinfo")}
            >
              <User className="icon" />
            </button>
            <button
              className="icon-button"
              aria-label="Logout"
              onClick={handleLogout}
              title="Déconnexion"
            >
              <LogOut className="icon" />
            </button>
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
              {admin && (
                <>
                  <Link
                    to="/admin"
                    className="mobile-nav-link"
                    onClick={closeMenu}
                  >
                    Admin Dashboard
                  </Link>
                  <Link
                    to="/userinfo"
                    className="mobile-nav-link"
                    onClick={closeMenu}
                  >
                    Profile
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
      <CartModal open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}

export default Header;
