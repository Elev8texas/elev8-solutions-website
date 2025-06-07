import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import StickyHelpButton from '../../components/StickyHelpButton';
import SEO from '../../components/SEO';

const ExteriorCleaning: React.FC = () => {
  const navigate = useNavigate();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Professional Exterior Cleaning",
    "description": "Complete exterior restoration that revitalizes siding, building exteriors, and outdoor surfaces. Professional cleaning solutions for all exterior materials.",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Elev8 Solutions",
      "telephone": "+1-512-701-8085", 
      "url": "https://elev8texas.com"
    },
    "serviceType": "Exterior Cleaning",
    "offers": {
      "@type": "Offer",
      "priceRange": "$0.50-0.75 per square foot"
    }
  };

  const process = [
    "Material identification and surface evaluation",
    "Gentle pre-wash and preparation",
    "Application of specialized cleaning solutions",
    "Soft washing technique for delicate surfaces",
    "Hand scrubbing for stubborn stains and areas",
    "Thorough rinse and debris removal",
    "Protective treatment application when needed",
    "Final inspection and touch-ups"
  ];

  const benefits = [
    "Dramatically improves curb appeal and property value",
    "Removes harmful mold, mildew, and algae",
    "Protects exterior materials from long-term damage",
    "Restores original beauty of siding and surfaces",
    "Extends lifespan of exterior building materials",
    "Safe cleaning methods for all surface types",
    "Eco-friendly solutions that protect landscaping",
    "Professional results that last longer"
  ];

  const surfaces = [
    "Vinyl and aluminum siding",
    "Brick and stone exteriors",
    "Stucco and cement surfaces", 
    "Wood siding and trim",
    "Building facades and walls",
    "Outdoor structures and sheds"
  ];

  const faqs = [
    {
      question: "Is exterior cleaning safe for all types of siding?",
      answer: "Yes, we use specialized techniques and cleaning solutions appropriate for each material type. From delicate vinyl to sturdy brick, we adjust our methods to safely and effectively clean without damage."
    },
    {
      question: "How often should I have my home's exterior cleaned?",
      answer: "We recommend annual exterior cleaning for most homes. Properties in areas with high humidity, near trees, or exposed to industrial pollution may benefit from bi-annual cleaning."
    },
    {
      question: "Will exterior cleaning damage my landscaping?",
      answer: "We take extensive precautions to protect your plants and landscaping. We use eco-friendly cleaning solutions and cover sensitive plants during the cleaning process."
    },
    {
      question: "Can you remove all types of stains from siding?",
      answer: "Most stains can be successfully removed with professional cleaning. Some permanent stains may require specialized treatment. We'll assess your specific situation and provide honest expectations during our consultation."
    }
  ];

  return (
    <>
      <SEO
        title="Professional Exterior Cleaning Austin TX - Building & Siding Cleaning Services"
        description="Expert exterior cleaning in Austin. Revitalize siding, building exteriors & outdoor surfaces. Professional cleaning solutions for all materials. Free estimates."
        keywords="exterior cleaning Austin, siding cleaning Austin, building exterior cleaning, house washing Austin, exterior restoration"
        canonicalUrl="https://elev8texas.com/services/exterior-cleaning"
        jsonLd={jsonLd}
      />
      
      <div className="min-h-screen bg-background-primary">
        <Navigation />
        
        <section className="pt-32 pb-16 bg-gradient-to-br from-background-primary via-background-secondary to-background-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-text-primary mb-6">
              Professional <span className="text-gold-500">Exterior Cleaning</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
              Complete exterior restoration that revitalizes siding, building exteriors, and outdoor surfaces. 
              Professional cleaning solutions tailored for all exterior materials.
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
            <h2 className="text-4xl font-bold text-text-primary text-center mb-12">Exterior Surfaces We Clean</h2>
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
                <h2 className="text-3xl font-bold text-text-primary mb-6">Why Choose Exterior Cleaning</h2>
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

        <section className="py-20 bg-background-secondary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-text-primary mb-8">Exterior Cleaning Pricing</h2>
            <div className="bg-background-card border border-border-primary rounded-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Single Story</h3>
                  <div className="text-2xl font-bold text-gold-500">$0.50</div>
                  <p className="text-text-secondary">per sq ft</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Two Story</h3>
                  <div className="text-2xl font-bold text-gold-500">$0.60</div>
                  <p className="text-text-secondary">per sq ft</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Three+ Story</h3>
                  <div className="text-2xl font-bold text-gold-500">$0.75</div>
                  <p className="text-text-secondary">per sq ft</p>
                </div>
              </div>
              <div className="mt-8 p-4 bg-background-secondary border border-border-primary rounded-lg">
                <p className="text-text-muted text-sm">
                  Pricing includes material-appropriate cleaning solutions, protective treatments when needed, and post-cleaning inspection. 
                  Minimum service charge of $200 applies. Free estimates available.
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
            <h2 className="text-4xl font-bold text-text-primary mb-6">Transform Your Home's Exterior</h2>
            <p className="text-xl text-text-secondary mb-8">
              Restore your home's beauty and protect your investment with professional exterior cleaning.
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

export default ExteriorCleaning; 