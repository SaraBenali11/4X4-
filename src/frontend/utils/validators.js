/**
 * Validation utility functions
 */

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate phone number (Algerian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone format
 */
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  const phoneRegex = /^(0)(5|6|7)[0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @returns {boolean} True if value exists
 */
export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

/**
 * Validate minimum length
 * @param {string} value - String to validate
 * @param {number} minLength - Minimum length required
 * @returns {boolean} True if meets minimum length
 */
export const hasMinLength = (value, minLength) => {
  if (typeof value !== 'string') {
    return false;
  }
  return value.trim().length >= minLength;
};

/**
 * Validate maximum length
 * @param {string} value - String to validate
 * @param {number} maxLength - Maximum length allowed
 * @returns {boolean} True if within maximum length
 */
export const hasMaxLength = (value, maxLength) => {
  if (typeof value !== 'string') {
    return false;
  }
  return value.trim().length <= maxLength;
};