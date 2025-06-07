import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import StickyHelpButton from '../../components/StickyHelpButton';
import SEO from '../../components/SEO';

const WindowWashing: React.FC = () => {
  const navigate = useNavigate();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Professional Window Washing",
    "description": "Crystal clear windows that enhance your property's appearance and let natural light shine through. We use a double osmosis process that eliminates watermarks and window streaks for a perfect finish every time.",
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
    "serviceType": "Window Cleaning",
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
      "priceRange": "$6-10 per window"
    }
  };

  const process = [
    "Initial assessment and safety setup",
    "Remove screens and hardware cleaning", 
    "Apply eco-friendly cleaning solution",
    "Double osmosis water treatment for streak-free results",
    "Squeegee technique with purified water",
    "Detail work on frames and sills",
    "Final inspection and touch-ups"
  ];

  const benefits = [
    "Enhanced curb appeal and property value",
    "Improved natural light penetration",
    "Streak-free, crystal clear results",
    "Eco-friendly cleaning solutions",
    "Professional equipment and techniques",
    "Fully insured and bonded service"
  ];

  const faqs = [
    {
      question: "How often should I have my windows professionally cleaned?",
      answer: "For residential properties, we recommend professional window cleaning every 3-6 months. Commercial properties may need monthly or bi-monthly service depending on location and environmental factors."
    },
    {
      question: "Do you clean windows in the rain?",
      answer: "We avoid cleaning during active precipitation for safety and quality reasons. However, light moisture or recent rain doesn't affect our cleaning process once conditions are safe."
    },
    {
      question: "What's included in your window cleaning service?",
      answer: "Our service includes cleaning both interior and exterior window surfaces, frames, sills, and screens. We also check for any damage or issues and provide recommendations."
    },
    {
      question: "Do you have insurance?",
      answer: "Yes, we are fully licensed, bonded, and insured for your protection and peace of mind."
    }
  ];

  return (
    <>
      <SEO
        title="Professional Window Washing Austin TX - Streak-Free Window Cleaning Services"
        description="Crystal clear window cleaning in Austin. Professional, eco-friendly window washing with streak-free results. Residential & commercial. Fully insured. Free estimates."
        keywords="window cleaning Austin, professional window washing, streak-free windows, residential window cleaning Austin, commercial window cleaning"
        canonicalUrl="https://elev8texas.com/services/window-washing"
        jsonLd={jsonLd}
      />
      
      <div className="min-h-screen bg-background-primary">
        <Navigation />
        
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-br from-background-primary via-background-secondary to-background-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-text-primary mb-6">
              Professional <span className="text-gold-500">Window Washing</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
              Crystal clear windows that enhance your property's appearance and let natural light shine through. 
              We use a double osmosis process that eliminates watermarks and window streaks for a perfect finish every time.
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
        <section className="py-20 bg-background-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-text-primary mb-8">Transparent Pricing</h2>
            <div className="bg-background-card border border-border-primary rounded-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-text-primary mb-2">First Floor Windows</h3>
                  <div className="text-3xl font-bold text-gold-500 mb-2">$6</div>
                  <p className="text-text-secondary">per window</p>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-text-primary mb-2">Upper Floor Windows</h3>
                  <div className="text-3xl font-bold text-gold-500 mb-2">$10</div>
                  <p className="text-text-secondary">per window</p>
                </div>
              </div>
              <div className="mt-8 p-4 bg-background-secondary border border-border-primary rounded-lg">
                <p className="text-text-muted text-sm">
                  Pricing includes interior and exterior cleaning, frames, sills, and screens. 
                  Minimum service charge of $200 applies. Free estimates available.
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
            <h2 className="text-4xl font-bold text-text-primary mb-6">Ready for Crystal Clear Windows?</h2>
            <p className="text-xl text-text-secondary mb-8">
              Get your free estimate today and see the difference professional window washing makes.
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

export default WindowWashing; 