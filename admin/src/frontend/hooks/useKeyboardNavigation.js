import { useEffect } from 'react';

/**
 * Custom hook for keyboard navigation
 * Handles arrow key events for carousel navigation
 * 
 * @param {Function} onLeft - Callback for left arrow key
 * @param {Function} onRight - Callback for right arrow key
 */
export function useKeyboardNavigation(onLeft, onRight) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft' && onLeft) {
        onLeft();
      } else if (event.key === 'ArrowRight' && onRight) {
        onRight();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onLeft, onRight]);
}