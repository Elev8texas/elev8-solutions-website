import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import BundleSection from './components/BundleSection';
import ReviewsSection from './components/ReviewsSection';
import GallerySection from './components/GallerySection';
import ContactCallToAction from './components/ContactCallToAction';
import FullGallery from './components/FullGallery';
import Commercial from './pages/Commercial';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import ContactForm from './pages/ContactForm';
import Quote from './pages/Quote';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Footer from './components/Footer';
import StickyHelpButton from './components/StickyHelpButton';
import NewsletterPopup from './components/NewsletterPopup';
import ScrollToTop from './components/ScrollToTop';

function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <BundleSection />
      <ReviewsSection />
      <GallerySection />
      <ContactCallToAction />
    </>
  );
}

function App() {
  const [showNewsletterPopup, setShowNewsletterPopup] = React.useState(false);
  const [hasShownPopup, setHasShownPopup] = React.useState(false);

  React.useEffect(() => {
    // Check if popup has been shown before (localStorage)
    const hasSeenNewsletter = localStorage.getItem('elev8-newsletter-shown');
    
    if (!hasSeenNewsletter && !hasShownPopup) {
      const timer = setTimeout(() => {
        setShowNewsletterPopup(true);
        setHasShownPopup(true);
        localStorage.setItem('elev8-newsletter-shown', 'true');
      }, 30000); // 30 seconds

      return () => clearTimeout(timer);
    }
  }, [hasShownPopup]);

  const handleCloseNewsletter = () => {
    setShowNewsletterPopup(false);
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-background-primary">
        <Routes>
          <Route path="/" element={
            <>
              <Navigation />
              <HomePage />
              <Footer />
              <StickyHelpButton />
            </>
          } />
          <Route path="/gallery" element={
            <>
              <Navigation />
              <FullGallery />
              <Footer />
              <StickyHelpButton />
            </>
          } />
          <Route path="/commercial" element={<Commercial />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<ContactForm />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
        </Routes>
        
        {/* Newsletter Popup */}
        <NewsletterPopup 
          isVisible={showNewsletterPopup} 
          onClose={handleCloseNewsletter} 
        />
      </div>
    </Router>
  );
}

export default App;
