import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import StickyHelpButton from '../../components/StickyHelpButton';
import SEO from '../../components/SEO';

const GutterCleaning: React.FC = () => {
  const navigate = useNavigate();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Professional Gutter Cleaning",
    "description": "Complete gutter cleaning and maintenance service that protects your property from water damage. Professional debris removal, flow testing, and minor repairs.",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Elev8 Solutions",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Austin",
        "addressRegion": "TX",
        "addressCountry": "US"
      },
      "telephone": "+1-512-701-8085",
      "url": "https://elev8texas.com"
    },
    "serviceType": "Gutter Cleaning",
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 30.2672,
        "longitude": -97.7431
      },
      "geoRadius": 50000
    },
    "offers": {
      "@type": "Offer",
      "priceRange": "$1.25-2.50 per linear foot"
    }
  };

  const process = [
    "Safety equipment setup and inspection",
    "Debris removal from gutters and downspouts",
    "Thorough cleaning of gutter interiors",
    "Downspout flow testing and clearing",
    "Gutter realignment and minor repairs",
    "Preventive maintenance recommendations"
  ];

  const benefits = [
    "Prevents costly water damage to your home",
    "Protects foundation and landscaping",
    "Extends gutter system lifespan",
    "Maintains proper drainage flow",
    "Prevents ice dam formation in winter",
    "Professional safety equipment and techniques"
  ];

  const faqs = [
    {
      question: "How often should gutters be cleaned?",
      answer: "We recommend cleaning gutters at least twice a year - once in spring and once in fall. Properties with many trees may need quarterly cleaning to prevent clogs and overflow."
    },
    {
      question: "Do you repair gutters during cleaning?",
      answer: "We perform minor repairs during cleaning such as reattaching loose sections and sealing small leaks. For major repairs or replacements, we'll provide a separate estimate."
    },
    {
      question: "What happens if gutters aren't cleaned regularly?",
      answer: "Clogged gutters can cause water overflow leading to foundation damage, basement flooding, roof damage, and landscape erosion. Regular cleaning prevents these costly issues."
    },
    {
      question: "Is gutter cleaning safe in all weather?",
      answer: "We avoid cleaning during high winds, storms, or icy conditions for safety. Light rain doesn't typically affect our cleaning process, but we prioritize safety first."
    }
  ];

  return (
    <>
      <SEO
        title="Professional Gutter Cleaning Austin TX - Gutter Maintenance Services"
        description="Expert gutter cleaning in Austin. Prevent water damage with professional gutter cleaning & maintenance. Debris removal, flow testing & minor repairs. Free estimates."
        keywords="gutter cleaning Austin, gutter maintenance Austin, downspout cleaning, gutter repair Austin, rain gutter cleaning"
        canonicalUrl="https://elev8texas.com/services/gutter-cleaning"
        jsonLd={jsonLd}
      />
      
      <div className="min-h-screen bg-background-primary">
        <Navigation />
        
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-br from-background-primary via-background-secondary to-background-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-text-primary mb-6">
              Professional <span className="text-gold-500">Gutter Cleaning</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
              Complete gutter cleaning and maintenance service that protects your property from water damage. 
              Professional debris removal, flow testing, and preventive maintenance.
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

        {/* Service Details */}
        <section className="py-20 bg-background-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Our Process */}
              <div className="bg-background-card border border-border-primary rounded-xl p-8">
                <h2 className="text-3xl font-bold text-text-primary mb-6">Our Professional Process</h2>
                <div className="space-y-4">
                  {process.map((step, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gold-500 text-background-primary rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-text-secondary">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-background-card border border-border-primary rounded-xl p-8">
                <h2 className="text-3xl font-bold text-text-primary mb-6">Why Regular Gutter Cleaning Matters</h2>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-6 h-6 text-gold-500 flex-shrink-0 mt-1">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-text-secondary">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-background-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-text-primary mb-8">Story-Based Pricing</h2>
            <div className="bg-background-card border border-border-primary rounded-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-text-primary mb-2">Single Story</h3>
                  <div className="text-3xl font-bold text-gold-500 mb-2">$1.25</div>
                  <p className="text-text-secondary">per linear foot</p>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-text-primary mb-2">Two Story</h3>
                  <div className="text-3xl font-bold text-gold-500 mb-2">$2.00</div>
                  <p className="text-text-secondary">per linear foot</p>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-text-primary mb-2">Three+ Story</h3>
                  <div className="text-3xl font-bold text-gold-500 mb-2">$2.50</div>
                  <p className="text-text-secondary">per linear foot</p>
                </div>
              </div>
              <div className="mt-8 p-4 bg-background-secondary border border-border-primary rounded-lg">
                <p className="text-text-muted text-sm">
                  Pricing based on total linear feet of gutters and building height. Includes debris removal, 
                  cleaning, flow testing, and minor adjustments. Minimum service charge of $200 applies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-background-secondary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-text-primary text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-background-card border border-border-primary rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-text-primary mb-3">{faq.question}</h3>
                  <p className="text-text-secondary">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-background-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-text-primary mb-6">Protect Your Property Investment</h2>
            <p className="text-xl text-text-secondary mb-8">
              Don't let clogged gutters cause expensive damage. Schedule your professional gutter cleaning today.
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
                Call (512) 701-8085
              </button>
            </div>
          </div>
        </section>

        <Footer />
        <StickyHelpButton />
      </div>
    </>
  );
};

export default GutterCleaning; 