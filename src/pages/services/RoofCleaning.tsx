import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import StickyHelpButton from '../../components/StickyHelpButton';
import SEO from '../../components/SEO';

const RoofCleaning: React.FC = () => {
  const navigate = useNavigate();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Professional Roof Cleaning",
    "description": "Safe roof cleaning using soft washing techniques to remove algae, moss, and stains without damaging your roof. Extend roof life and improve curb appeal.",
    "provider": {
      "@type": "LocalBusiness", 
      "name": "Elev8 Solutions",
      "telephone": "+1-512-701-8085",
      "url": "https://elev8texas.com"
    },
    "serviceType": "Roof Cleaning",
    "offers": {
      "@type": "Offer",
      "priceRange": "$0.55-0.85 per square foot"
    }
  };

  return (
    <>
      <SEO
        title="Professional Roof Cleaning Austin TX - Soft Wash Roof Services"
        description="Safe roof cleaning in Austin using soft washing techniques. Remove algae, moss & stains. Extend roof life & improve curb appeal. Fully insured. Free estimates."
        keywords="roof cleaning Austin, soft wash roof cleaning, algae removal roof, moss removal roof, roof stain removal Austin"
        canonicalUrl="https://elev8texas.com/services/roof-cleaning"
        jsonLd={jsonLd}
      />
      
      <div className="min-h-screen bg-background-primary">
        <Navigation />
        
        <section className="pt-32 pb-16 bg-gradient-to-br from-background-primary via-background-secondary to-background-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-text-primary mb-6">
              Professional <span className="text-gold-500">Roof Cleaning</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
              Safe roof cleaning using soft washing techniques to remove algae, moss, and stains without damaging your roof. 
              Extend your roof's lifespan and improve your home's curb appeal.
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
            <h2 className="text-4xl font-bold text-text-primary mb-8">Soft Wash Pricing</h2>
            <div className="bg-background-card border border-border-primary rounded-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Single Story</h3>
                  <div className="text-2xl font-bold text-gold-500">$0.55</div>
                  <p className="text-text-secondary">per sq ft</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Two Story</h3>
                  <div className="text-2xl font-bold text-gold-500">$0.70</div>
                  <p className="text-text-secondary">per sq ft</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Three+ Story</h3>
                  <div className="text-2xl font-bold text-gold-500">$0.85</div>
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

export default RoofCleaning; 