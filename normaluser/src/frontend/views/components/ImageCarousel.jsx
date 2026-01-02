import React from "react";
import PropTypes from "prop-types";
import "../styles/ImageCarousel.css";
import { carouselSlides } from "../../../database/data/mockData";
import { CAROUSEL_CONFIG } from "../../config/constants";
import { useCarousel } from "../../hooks/useCarousel";
import { useKeyboardNavigation } from "../../hooks/useKeyboardNavigation";

/**
 * Image carousel component with auto-play and manual navigation
 * Features smooth transitions and keyboard navigation support
 */
function ImageCarousel({
  autoPlay = true,
  interval = CAROUSEL_CONFIG.AUTO_PLAY_INTERVAL,
}) {
  const totalSlides = carouselSlides.length;
  const { currentIndex, goToNext, goToPrevious, goToSlide } = useCarousel(
    totalSlides,
    autoPlay,
    interval
  );

  useKeyboardNavigation(goToPrevious, goToNext);

  const currentSlide = carouselSlides[currentIndex];

  return (
    <section className="carousel-container" aria-label="Image carousel">
      <div className="carousel">
        <img
          src={currentSlide.src}
          alt={currentSlide.alt}
          className="carousel-image"
          key={currentIndex}
        />

        <div className="image-overlay">
          <p className="image-subtitle">{currentSlide.subtitle}</p>
          <h2 className="image-title">{currentSlide.title}</h2>
        </div>

        <button
          onClick={goToPrevious}
          className="carousel-btn carousel-btn-left"
          aria-label="Previous slide"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="14 18 8 12 14 6" />
          </svg>
        </button>

        <button
          onClick={goToNext}
          className="carousel-btn carousel-btn-right"
          aria-label="Next slide"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="10 6 16 12 10 18" />
          </svg>
        </button>

        <div
          className="carousel-indicators"
          role="tablist"
          aria-label="Carousel navigation"
        >
          {carouselSlides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`indicator ${index === currentIndex ? "active" : ""}`}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

ImageCarousel.propTypes = {
  autoPlay: PropTypes.bool,
  interval: PropTypes.number,
};

export default ImageCarousel;
