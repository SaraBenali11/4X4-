/**
 * Utility functions for formatting data
 */

/**
 * Format price in Algerian Dinar
 * @param {number} price - Price in centimes
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
  if (typeof price !== "number" || isNaN(price)) {
    return "0 DA";
  }
  const roundedPrice = Math.round(price);
  // Format with spaces as thousands separator
  const formattedPrice = roundedPrice
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${formattedPrice} DA`;
};

/**
 * Format date to French locale
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (!(dateObj instanceof Date) || isNaN(dateObj)) {
    return "";
  }
  return dateObj.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format phone number for display
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhone = (phone) => {
  if (!phone) {
    return "";
  }
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{4})(\d{2})(\d{2})(\d{2})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
  }
  return phone;
};

/**
 * Generate array of specified length
 * @param {number} length - Array length
 * @returns {Array} Array of undefined values
 */
export const generateArray = (length) => {
  return Array.from({ length });
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength)}...`;
};
