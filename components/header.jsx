import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, Heart, ShoppingBag, User } from 'lucide-react';
import '../styles/header.css';
import { navigationLinks } from '../../../database/data/mockData';

/**
 * Main header component with navigation and user actions
 * Responsive design with mobile menu support
 */
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

          <nav className="nav-desktop" aria-label="Main navigation">
            {navigationLinks.map((link) => (
              <Link key={link.id} to={link.href} className="nav-link">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="header-icons">
            <button className="icon-button" aria-label="Search products">
              <Search className="icon" />
            </button>
            <button className="icon-button" aria-label="View favorites">
              <Heart className="icon" />
            </button>
            <button className="icon-button" aria-label="View shopping bag">
              <ShoppingBag className="icon" />
            </button>
            <Link to="/login" className="icon-button" aria-label="Account settings">
              <User className="icon" />
            </Link>
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
