import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import StickyHelpButton from '../../components/StickyHelpButton';
import SEO from '../../components/SEO';

const SolarPanelCleaning: React.FC = () => {
  const navigate = useNavigate();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service", 
    "name": "Professional Solar Panel Cleaning",
    "description": "Specialized solar panel cleaning that maximizes your solar investment and energy efficiency. Safe cleaning methods that won't void warranties.",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Elev8 Solutions", 
      "telephone": "+1-512-701-8085",
      "url": "https://elev8texas.com"
    },
    "serviceType": "Solar Panel Cleaning",
    "offers": {
      "@type": "Offer",
      "priceRange": "$15-25 per panel"
    }
  };

  const process = [
    "System shutdown and safety protocols",
    "Individual panel inspection for damage",
    "Gentle brush and purified water cleaning",
    "Removal of dirt, pollen, and debris buildup",
    "Inverter and connection point cleaning",
    "System restart and efficiency verification",
    "Maintenance schedule recommendations"
  ];

  const benefits = [
    "Increases energy efficiency by up to 25%",
    "Reduces monthly electricity bills significantly",
    "Extends solar panel lifespan and warranty protection",
    "Maximizes return on solar investment",
    "Prevents permanent damage from debris buildup",
    "Professional cleaning maintains manufacturer warranties",
    "Regular maintenance prevents costly repairs",
    "Environmentally responsible energy optimization"
  ];

  const efficiencyFacts = [
    {
      title: "25% Efficiency Boost",
      description: "Clean solar panels can increase energy production by up to 25%, directly reducing your electric bill."
    },
    {
      title: "Annual Savings",
      description: "Regular cleaning can save homeowners $200-$500 annually on electricity costs."
    },
    {
      title: "ROI Protection", 
      description: "Maintain your solar investment value and ensure maximum energy generation."
    }
  ];

  const faqs = [
    {
      question: "How much can clean solar panels save on my electric bill?",
      answer: "Clean solar panels can increase efficiency by 15-25%, potentially saving $200-$500 annually on electricity costs. The exact savings depend on your system size and local energy rates."
    },
    {
      question: "How often should solar panels be cleaned?",
      answer: "We recommend cleaning solar panels every 6-12 months, or more frequently if you live in a dusty area or near construction. Texas weather conditions often require bi-annual cleaning for optimal performance."
    },
    {
      question: "Will cleaning void my solar panel warranty?",
      answer: "Our professional cleaning methods are manufacturer-approved and will not void warranties. We use soft brushes and purified water specifically designed for solar panel maintenance."
    },
    {
      question: "Can I clean my solar panels myself?",
      answer: "While possible, professional cleaning is safer and more effective. We have specialized equipment, safety training for roof work, and knowledge of proper cleaning techniques that prevent damage."
    }
  ];

  return (
    <>
      <SEO
        title="Professional Solar Panel Cleaning Austin TX - Solar Maintenance Services"
        description="Expert solar panel cleaning in Austin, Round Rock, Cedar Park & Central Texas. Maximize energy efficiency with professional solar panel maintenance. Safe cleaning methods. Fully insured. Free estimates."
        keywords="solar panel cleaning Austin TX, solar panel maintenance Austin, solar efficiency cleaning Round Rock, residential solar cleaning Cedar Park, solar panel washing Georgetown, Austin solar services"
        canonicalUrl="https://elev8texas.com/services/solar-panel-cleaning"
        service="Solar Panel Cleaning"
        jsonLd={jsonLd}
      />
      
      <div className="min-h-screen bg-background-primary">
        <Navigation />
        
        <section className="pt-32 pb-16 bg-gradient-to-br from-background-primary via-background-secondary to-background-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-text-primary mb-6">
              Professional <span className="text-gold-500">Solar Panel Cleaning</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
              Specialized cleaning that maximizes your solar investment and energy efficiency. 
              Clean solar panels can boost efficiency by up to 25% and save hundreds on your electric bill annually.
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

        {/* Efficiency Benefits */}
        <section className="py-20 bg-background-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-text-primary text-center mb-12">Clean Panels = Lower Electric Bills</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {efficiencyFacts.map((fact, index) => (
                <div key={index} className="bg-background-card border border-border-primary rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-background-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-3">{fact.title}</h3>
                  <p className="text-text-secondary">{fact.description}</p>
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
                <h2 className="text-3xl font-bold text-text-primary mb-6">Why Clean Your Solar Panels</h2>
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
            <h2 className="text-4xl font-bold text-text-primary mb-8">Solar Panel Pricing</h2>
            <div className="bg-background-card border border-border-primary rounded-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Ground Level</h3>
                  <div className="text-2xl font-bold text-gold-500">$15</div>
                  <p className="text-text-secondary">per panel</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Single Story Roof</h3>
                  <div className="text-2xl font-bold text-gold-500">$20</div>
                  <p className="text-text-secondary">per panel</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Two+ Story Roof</h3>
                  <div className="text-2xl font-bold text-gold-500">$25</div>
                  <p className="text-text-secondary">per panel</p>
                </div>
              </div>
              <div className="mt-8 p-4 bg-background-secondary border border-border-primary rounded-lg">
                <p className="text-text-muted text-sm">
                  Professional cleaning includes system inspection, warranty-safe cleaning methods, and efficiency testing. 
                  Regular cleaning pays for itself through increased energy production.
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
            <h2 className="text-4xl font-bold text-text-primary mb-6">Maximize Your Solar Investment</h2>
            <p className="text-xl text-text-secondary mb-8">
              Clean solar panels can save you hundreds on your electric bill. Get your efficiency boost today!
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

export default SolarPanelCleaning; 