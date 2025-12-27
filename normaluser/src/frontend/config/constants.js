/**
 * Application-wide constants
 * Centralized configuration for magic numbers and strings
 */

export const CAROUSEL_CONFIG = {
  AUTO_PLAY_INTERVAL: 5000,
  TRANSITION_DURATION: 500,
  TOTAL_SLIDES: 3,
};

export const ANIMATION_DURATIONS = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};

export const BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 768,
  DESKTOP: 1024,
  WIDE: 1280,
};

export const COMPANY_INFO = {
  NAME: "Sutraty",
  EMAIL: "sutratyco@gmail.com",
  PHONE: "+213 661 23 45 67",
  LOCATION: "Alger, Algérie",
  TAGLINE: "Vêtements féminins élégants pour la femme algérienne moderne.",
  COPYRIGHT_YEAR: new Date().getFullYear(),
};

export const SOCIAL_LINKS = {
  FACEBOOK:
    "https://www.facebook.com/profile.php?id=100083258443071&locale=fr_FR",
  INSTAGRAM: "https://www.instagram.com/sutraty.co/",
};

export const ROUTES = {
  HOME: "/",
  CATEGORIES: "/categories",
  PRODUCTS: "/produits",
  INSPIRATION: "/inspiration",
  CREATE_OUTFIT: "/creer-tenue",
};

export const RATING_CONFIG = {
  MAX_STARS: 5,
  DEFAULT_RATING: 5,
};

// API Base URL (override with REACT_APP_API_URL in environment)
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";
