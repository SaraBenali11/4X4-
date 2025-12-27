import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import ImageCarousel from '../components/ImageCarousel';
import ReviewsSection from '../components/ReviewsSection';
import NewArrivals from '../components/nouveautesection';

/**
 * Homepage component
 * Main landing page with carousel, new products, and reviews
 */
function Homepage() {
  return (
    <div className="homepage">
      <Header />
      <main>
        <ImageCarousel />
        <NewArrivals />
        <ReviewsSection />
      </main>
      <Footer />
    </div>
  );
}

export default Homepage;
