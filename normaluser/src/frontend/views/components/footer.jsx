import React, { useState } from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import "../styles/BoubaayaFooter.css";
import { COMPANY_INFO, SOCIAL_LINKS } from "../../config/constants";
import { footerLinks } from "../../../database/data/mockData";
import { isValidEmail } from "../../utils/validators";

/**
 * Footer component with company info, navigation, and newsletter signup
 */
function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      return;
    }

    if (!isValidEmail(email)) {
      alert("Veuillez entrer une adresse email valide.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      alert("Merci pour votre inscription!");
      setEmail("");
    } catch (error) {
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <footer className="footer-container">
      <div className="footer-wrapper">
        <div className="footer-grid">
          <div>
            <h2 className="brand-title">{COMPANY_INFO.NAME}</h2>
            <p className="brand-description">{COMPANY_INFO.TAGLINE}</p>
            <div className="social-links">
              <a
                href={SOCIAL_LINKS.FACEBOOK}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Visit our Facebook page"
              >
                <FaFacebook size={100} />
              </a>
              <a
                href={SOCIAL_LINKS.INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Visit our Instagram page"
              >
                <FaInstagram size={100} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="section-title">Navigation</h3>
            <ul className="nav-list">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="nav-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="section-title">Contact</h3>
            <ul className="contact-list">
              <li>
                Email:{" "}
                <a
                  href={`mailto:${COMPANY_INFO.EMAIL}`}
                  className="contact-link"
                >
                  {COMPANY_INFO.EMAIL}
                </a>
              </li>
              <li>
                Tél:{" "}
                <a
                  href={`tel:${COMPANY_INFO.PHONE.replace(/\s/g, "")}`}
                  className="contact-link"
                >
                  {COMPANY_INFO.PHONE}
                </a>
              </li>
              <li>{COMPANY_INFO.LOCATION}</li>
            </ul>
          </div>

          <div>
            <h3 className="section-title">Newsletter</h3>
            <p className="newsletter-description">
              Inscrivez-vous pour recevoir nos dernières nouveautés
            </p>
            <div className="newsletter-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Votre email"
                className="newsletter-input"
                disabled={isSubmitting}
                aria-label="Email address for newsletter"
              />
              <button
                onClick={handleSubmit}
                className="newsletter-button"
                disabled={isSubmitting}
                aria-label="Subscribe to newsletter"
              >
                →
              </button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © {COMPANY_INFO.COPYRIGHT_YEAR} {COMPANY_INFO.NAME}. Tous droits
            réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
