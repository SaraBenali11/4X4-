import React, { useState, useEffect } from "react";
import "../styles/CookieConsent.css";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookie_consent", "rejected");
    localStorage.removeItem("sutraty_favorites");
    setIsVisible(false);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-consent-overlay">
      <div className="cookie-consent-modal">
        <div className="cookie-icon">🍪</div>

        <h3 className="cookie-title">We Value Your Privacy</h3>

        <p className="cookie-description">
          We use cookies to enhance your browsing experience and keep your
          favorite items stored locally.
        </p>

        {showDetails && (
          <div className="cookie-details">
            <p>
              <strong>What we use cookies for:</strong>
            </p>
            <ul>
              <li>
                Storing your favorite products and outfits locally in your
                browser
              </li>
              <li>
                Remembering your preferences for a better shopping experience
              </li>
              <li>No tracking or third-party cookies are used</li>
            </ul>
            <p className="cookie-note">
              You can reject cookies if you prefer, but please note that your
              favorites will not be saved between sessions.
            </p>
          </div>
        )}

        <div className="cookie-actions">
          <button
            className="cookie-btn cookie-details-btn"
            onClick={toggleDetails}
          >
            {showDetails ? "Hide Details" : "See More Details"}
          </button>
          <div className="cookie-main-actions">
            <button className="cookie-btn cookie-reject" onClick={handleReject}>
              Reject
            </button>
            <button className="cookie-btn cookie-accept" onClick={handleAccept}>
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
