import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, LayoutDashboard, User } from "lucide-react";
import { navigationLinks } from "../../../../database/data/mockData";
import "../styles/header.css";

/**
 * Main header component with navigation and user actions
 * Responsive design with mobile menu support
 */
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

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

          <div className="header-icons">
            <button
              className="icon-button"
              aria-label="View dashboard"
              onClick={() => navigate("/")}
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
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
