import React from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { SOCIAL_LINKS, COMPANY_INFO } from "../../config/constants";
import "../styles/contact.css";

export default function FollowUs() {
  return (
    <section className="follow-us-card">
      <div className="follow-header">
        <h2>Suivez-nous sur les réseaux</h2>
        <p>
          Restez connectés pour découvrir nos dernières collections et
          promotions
        </p>
      </div>

      <div className="socials-container">
        <a
          href={SOCIAL_LINKS.FACEBOOK}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link facebook"
          title="Facebook"
        >
          <span className="social-icon">
            <FaFacebook />
          </span>
        </a>
        <a
          href={SOCIAL_LINKS.INSTAGRAM}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link instagram"
          title="Instagram"
        >
          <span className="social-icon">
            <FaInstagram />
          </span>
        </a>
      </div>

      <div className="company-bio">
        <h3>{COMPANY_INFO.NAME}</h3>
        <p>{COMPANY_INFO.TAGLINE}</p>
      </div>
    </section>
  );
}
