import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import StickyHelpButton from '../../components/StickyHelpButton';
import SEO from '../../components/SEO';

const DeckPatioCleaning: React.FC = () => {
  const navigate = useNavigate();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Professional Deck & Patio Cleaning",
    "description": "Expert deck and patio cleaning that restores outdoor living spaces. Remove stains, algae, and weathering from wood, concrete, and composite surfaces.",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Elev8 Solutions",
      "telephone": "+1-512-701-8085",
      "url": "https://elev8texas.com"
    },
    "serviceType": "Deck and Patio Cleaning",
    "offers": {
      "@type": "Offer", 
      "priceRange": "$0.40-0.60 per square foot"
    }
  };

  return (
    <>
      <SEO
        title="Professional Deck & Patio Cleaning Austin TX - Outdoor Space Restoration"
        description="Expert deck & patio cleaning in Austin. Restore outdoor living spaces. Remove stains, algae & weathering from all surfaces. Free estimates available."
        keywords="deck cleaning Austin, patio cleaning Austin, outdoor space cleaning, deck restoration Austin, patio pressure washing"
        canonicalUrl="https://elev8texas.com/services/deck-patio-cleaning"
        jsonLd={jsonLd}
      />
      
      <div className="min-h-screen bg-background-primary">
        <Navigation />
        
        <section className="pt-32 pb-16 bg-gradient-to-br from-background-primary via-background-secondary to-background-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-text-primary mb-6">
              Professional <span className="text-gold-500">Deck & Patio Cleaning</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
              Expert deck and patio cleaning that restores your outdoor living spaces. 
              Remove stains, algae, and weathering from wood, concrete, and composite surfaces.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/quote')}
                className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-white font-semibold rounded-lg hover:shadow-gold-glow transition-all duration-300 transform hover:scale-105"
              >
                Get Free Quote
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="px-8 py-4 bg-transparent border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-background-primary font-semibold rounded-lg transition-all duration-300"
              >
                Contact Us
              </button>
            </div>
          </div>
        </section>

        <section className="py-20 bg-background-secondary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-text-primary mb-8">Deck & Patio Pricing</h2>
            <div className="bg-background-card border border-border-primary rounded-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Concrete/Stone</h3>
                  <div className="text-2xl font-bold text-gold-500">$0.40</div>
                  <p className="text-text-secondary">per sq ft</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Composite Decking</h3>
                  <div className="text-2xl font-bold text-gold-500">$0.50</div>
                  <p className="text-text-secondary">per sq ft</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Wood Decking</h3>
                  <div className="text-2xl font-bold text-gold-500">$0.60</div>
                  <p className="text-text-secondary">per sq ft</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
        <StickyHelpButton />
      </div>
    </>
  );
};

export default DeckPatioCleaning; 