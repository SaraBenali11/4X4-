import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for carousel functionality
 * Handles state management and auto-play logic
 * 
 * @param {number} totalSlides - Total number of slides
 * @param {boolean} autoPlay - Enable auto-play
 * @param {number} interval - Auto-play interval in milliseconds
 * @returns {Object} Carousel state and controls
 */
export function useCarousel(totalSlides, autoPlay = true, interval = 5000) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalSlides - 1 : prevIndex - 1));
  }, [totalSlides]);

  const goToSlide = useCallback((index) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentIndex(index);
    }
  }, [totalSlides]);

  useEffect(() => {
    if (!autoPlay) {
      return;
    }

    const intervalId = setInterval(goToNext, interval);
    return () => clearInterval(intervalId);
  }, [autoPlay, interval, goToNext]);

  return {
    currentIndex,
    goToNext,
    goToPrevious,
    goToSlide,
  };
}