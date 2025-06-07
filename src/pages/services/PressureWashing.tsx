import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import StickyHelpButton from '../../components/StickyHelpButton';
import SEO from '../../components/SEO';

const PressureWashing: React.FC = () => {
  const navigate = useNavigate();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Professional Pressure Washing",
    "description": "High-powered cleaning that removes years of dirt, grime, and stains from exterior surfaces. Safe and effective pressure washing for driveways, sidewalks, patios, and building exteriors.",
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
    "serviceType": "Pressure Washing",
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
      "priceRange": "$0.45-0.55 per square foot"
    }
  };

  const process = [
    "Surface evaluation and pressure selection",
    "Pre-treatment of stained areas",
    "Systematic cleaning pattern application",
    "Adjustable pressure for different materials",
    "Rinse and debris removal",
    "Post-cleaning surface protection"
  ];

  const benefits = [
    "Removes years of built-up dirt and grime",
    "Eliminates mold, mildew, and algae",
    "Increases property value and curb appeal",
    "Prevents long-term surface damage",
    "Eco-friendly cleaning solutions",
    "Professional equipment for optimal results"
  ];

  const surfaces = [
    "Driveways (driveway cleaning service)",
    "House exteriors (house power washing)", 
    "Sidewalks and walkways",
    "Roofs (soft wash pressure washing)",
    "Patios and decks",
    "Commercial buildings",
    "Fences and gates",
    "Pool areas and decks"
  ];

  const faqs = [
    {
      question: "Why choose our pressure washing company over others near me?",
      answer: "As a local pressure washing company, we provide professional power washing services with advanced equipment, eco-friendly solutions, and fully trained technicians. Our pressure washing services near you include free estimates, satisfaction guarantee, and competitive pricing."
    },
    {
      question: "What's the difference between power washing and soft wash pressure washing?",
      answer: "Power washing uses high-pressure water for tough surfaces like driveways and concrete. Soft wash pressure washing uses lower pressure with specialized cleaning solutions, perfect for roofs, siding, and delicate surfaces. We use the right technique for each surface."
    },
    {
      question: "Do you offer driveway cleaning service in my area?",
      answer: "Yes! Our driveway cleaning service covers Austin and surrounding areas including Round Rock, Cedar Park, Georgetown, and more. We specialize in removing oil stains, dirt buildup, and restoring your driveway's appearance."
    },
    {
      question: "How often should I schedule house power washing services?",
      answer: "We recommend house power washing annually for most homes, or bi-annually for properties in high-humidity areas or with heavy tree coverage. Regular cleaning maintains your home's appearance and prevents long-term damage."
    },
    {
      question: "Do you provide roof cleaning services near me?",
      answer: "Absolutely! Our roof cleaning services use safe soft wash pressure washing techniques to remove algae, moss, and stains without damaging your roof. We serve the entire Austin metro area with professional roof cleaning."
    }
  ];

  return (
    <>
      <SEO
        title="Power Washing Near Me | Pressure Washing Services Austin TX - Driveway Cleaning"
        description="Top-rated pressure washing company in Austin TX. Professional power washing services near you - driveway cleaning, house power washing, soft wash roof cleaning. Licensed & insured. Free estimates."
        keywords="power washing near me Austin, pressure washing services near me, pressure washing company Austin TX, soft wash pressure washing, roof cleaning services near me, driveway cleaning service, house power washing near me Austin"
        canonicalUrl="https://elev8texas.com/services/pressure-washing"
        service="Pressure Washing"
        jsonLd={jsonLd}
      />
      
      <div className="min-h-screen bg-background-primary">
        <Navigation />
        
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-br from-background-primary via-background-secondary to-background-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-text-primary mb-6">
              Professional <span className="text-gold-500">Power Washing Near Me</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
              Looking for reliable pressure washing services near you? Our pressure washing company delivers professional power washing services in Austin and surrounding areas. From driveway cleaning service to house power washing and soft wash roof cleaning, we're your local pressure washing experts.
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

        {/* Surfaces We Clean */}
        <section className="py-20 bg-background-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-text-primary text-center mb-12">Surfaces We Clean</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {surfaces.map((surface, index) => (
                <div key={index} className="bg-background-card border border-border-primary rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-background-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">{surface}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Details */}
        <section className="py-20 bg-background-primary">
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
                <h2 className="text-3xl font-bold text-text-primary mb-6">Why Choose Our Service</h2>
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
        <section className="py-20 bg-background-secondary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-text-primary mb-8">Competitive Pricing</h2>
            <div className="bg-background-card border border-border-primary rounded-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Small Areas</h3>
                  <p className="text-sm text-text-secondary mb-2">Under 600 sq ft</p>
                  <div className="text-2xl font-bold text-gold-500">$0.55</div>
                  <p className="text-text-secondary">per sq ft</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Medium Areas</h3>
                  <p className="text-sm text-text-secondary mb-2">600-1000 sq ft</p>
                  <div className="text-2xl font-bold text-gold-500">$0.50</div>
                  <p className="text-text-secondary">per sq ft</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Large Areas</h3>
                  <p className="text-sm text-text-secondary mb-2">Over 1000 sq ft</p>
                  <div className="text-2xl font-bold text-gold-500">$0.45</div>
                  <p className="text-text-secondary">per sq ft</p>
                </div>
              </div>
              <div className="mt-8 p-4 bg-background-secondary border border-border-primary rounded-lg">
                <p className="text-text-muted text-sm">
                  Minimum service charge of $200 applies. Pricing includes pre-treatment of stains and post-cleaning rinse. Free estimates available.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-background-primary">
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
        <section className="py-20 bg-background-secondary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-text-primary mb-6">Transform Your Property Today</h2>
            <p className="text-xl text-text-secondary mb-8">
              See the dramatic difference professional pressure washing can make for your property.
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

export default PressureWashing; 