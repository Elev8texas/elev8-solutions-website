import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import StickyHelpButton from '../components/StickyHelpButton';
import SEO from '../components/SEO';

const Services: React.FC = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "Window Washing",
      description: "Crystal clear windows that enhance your property's appearance and let natural light shine through. We use a double osmosis process that eliminates watermarks and window streaks for a perfect finish every time.",
      process: [
        "Initial assessment and safety setup",
        "Remove screens and hardware cleaning",
        "Apply eco-friendly cleaning solution",
        "Double osmosis water treatment for streak-free results",
        "Squeegee technique with purified water",
        "Detail work on frames and sills",
        "Final inspection and touch-ups"
      ]
    },
    {
      title: "Pressure Washing",
      description: "High-powered cleaning that removes years of dirt, grime, and stains from exterior surfaces.",
      process: [
        "Surface evaluation and pressure selection",
        "Pre-treatment of stained areas",
        "Systematic cleaning pattern application",
        "Adjustable pressure for different materials",
        "Rinse and debris removal",
        "Post-cleaning surface protection"
      ]
    },
    {
      title: "Roof & Gutter Cleaning",
      description: "Comprehensive roof maintenance that protects your investment and prevents costly damage.",
      process: [
        "Safety equipment setup and inspection",
        "Debris removal from gutters and downspouts",
        "Soft washing technique for roof surfaces",
        "Gutter realignment and minor repairs",
        "Downspout flow testing",
        "Preventive maintenance recommendations"
      ]
    },
    {
      title: "Exterior Cleaning",
      description: "Complete exterior restoration that revitalizes siding, decks, and outdoor surfaces.",
      process: [
        "Material identification and testing",
        "Gentle pre-wash and preparation",
        "Specialized cleaning solutions application",
        "Hand scrubbing for stubborn areas",
        "Thorough rinse and drying",
        "Protective coating application when needed"
      ]
    },
    {
      title: "Solar Panel Cleaning",
      description: "Specialized cleaning that maximizes your solar investment and energy efficiency.",
      process: [
        "System shutdown and safety protocols",
        "Gentle brush and purified water cleaning",
        "Individual panel inspection",
        "Inverter and connection point cleaning",
        "Performance testing and documentation",
        "Maintenance schedule recommendations"
      ]
    }
  ];

  const servicesJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Professional Cleaning Services",
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
    "serviceType": ["Pressure Washing", "Window Cleaning", "Solar Panel Cleaning", "Roof Cleaning"],
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 30.2672,
        "longitude": -97.7431
      },
      "geoRadius": 50000
    }
  };

  return (
    <>
      <SEO
        title="Professional Cleaning Services Austin TX - Pressure Washing, Window & Solar Panel Cleaning"
        description="Complete cleaning services in Austin: pressure washing, window cleaning, solar panel cleaning, roof cleaning. Professional, eco-friendly, fully insured. Serving Westlake, Lakeway, Round Rock."
        keywords="pressure washing services Austin, professional window cleaning Austin, solar panel cleaning Texas, roof cleaning Austin, exterior cleaning services, commercial cleaning Austin"
        canonicalUrl="https://elev8texas.com/services"
        jsonLd={servicesJsonLd}
      />
      <div className="min-h-screen bg-background-primary">
        <Navigation />
        
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-background-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6">
              Our <span className="text-gold-500">Professional</span> Process
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Discover how our systematic approach and attention to detail delivers exceptional results for every project. 
              We don't just clean – we restore and protect your property with proven methods.
            </p>
          </div>
        </section>

        {/* Services Breakdown */}
        <section className="py-16 bg-background-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-16">
              {services.map((service, index) => (
                <div key={service.title} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}>
                  
                  {/* Service Info */}
                  <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <div className="bg-background-card p-6 rounded-xl border border-border-primary relative">
                      {/* Connection Line */}
                      <div className={`absolute top-1/2 ${index % 2 === 1 ? 'right-full mr-6' : 'left-full ml-6'} w-6 h-0.5 bg-gold-500 opacity-30 hidden lg:block`}></div>
                      
                      <h3 className="text-xl font-semibold text-gold-500 mb-2">{service.title} Process:</h3>
                      <p className="text-text-muted text-sm mb-4">Step-by-step breakdown of our professional approach</p>
                      <ul className="space-y-3">
                        {service.process.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-gold-500 text-background-primary rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                              {stepIndex + 1}
                            </div>
                            <span className="text-text-secondary">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Service Visual */}
                  <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                    <button 
                      onClick={() => navigate('/contact', { state: { selectedService: service.title } })}
                      className="relative bg-gradient-to-br from-background-card to-background-secondary p-8 rounded-xl border border-border-primary h-80 flex items-center justify-center hover:border-gold-500 hover:shadow-gold-glow transition-all duration-500 cursor-pointer group overflow-hidden w-full"
                    >
                      {/* Decorative Border Pattern */}
                      <div className="absolute inset-0 rounded-xl">
                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-gold-500 rounded-tl-xl opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                        <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-gold-500 rounded-tr-xl opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-gold-500 rounded-bl-xl opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                        <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-gold-500 rounded-br-xl opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                      </div>
                      
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                        <div className="absolute top-4 right-4 w-32 h-32 bg-gold-500 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-4 left-4 w-24 h-24 bg-gold-400 rounded-full blur-2xl"></div>
                      </div>
                      
                      {/* Content */}
                      <div className="relative text-center z-10">
                        <h3 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-gold-400 transition-colors duration-300">
                          {service.title}
                        </h3>
                        
                        {/* Decorative Line Pattern - Under Title */}
                        <div className="flex items-center justify-center space-x-2 mb-6">
                          <div className="w-8 h-0.5 bg-gold-gradient opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="w-2 h-2 bg-gold-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="w-8 h-0.5 bg-gold-gradient opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-center space-x-2">
                            <p className="text-gold-500 font-semibold text-lg group-hover:text-gold-400 transition-colors duration-300">
                              Book Now
                            </p>
                            <svg className="w-5 h-5 text-gold-500 group-hover:text-gold-400 transition-all duration-300 transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </div>
                          <p className="text-text-muted text-sm leading-relaxed">
                            Click to book this service and get your free estimate
                          </p>
                        </div>
                        
                        {/* Decorative Arrow */}
                        <div className="mt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          <svg className="w-6 h-6 text-gold-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Our Process Matters */}
        <section className="py-16 bg-background-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
                Why Our Process Matters
              </h2>
              <p className="text-lg text-text-secondary max-w-3xl mx-auto">
                Every step in our process is designed to deliver superior results while protecting your property and investment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background-card p-8 rounded-xl border border-border-primary text-center">
                <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-background-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">Quality Assurance</h3>
                <p className="text-text-secondary">
                  Every project includes multiple quality checkpoints to ensure exceptional results every time.
                </p>
              </div>

              <div className="bg-background-card p-8 rounded-xl border border-border-primary text-center">
                <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-background-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">Safety First</h3>
                <p className="text-text-secondary">
                  Comprehensive safety protocols protect our team, your property, and your family throughout the process.
                </p>
              </div>

              <div className="bg-background-card p-8 rounded-xl border border-border-primary text-center">
                <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-background-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">Eco-Friendly</h3>
                <p className="text-text-secondary">
                  Environmentally responsible cleaning solutions that are safe for your family, pets, and landscaping.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-background-secondary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
              Ready to Experience the Elev8 Difference?
            </h2>
            <p className="text-lg text-text-secondary mb-8">
              Let our proven process transform your property. Get your free estimate today.
            </p>
            <button 
              onClick={() => navigate('/help')}
              className="bg-gold-gradient hover:bg-gold-gradient-hover text-background-primary font-semibold py-4 px-8 rounded-lg transition-all duration-300 shadow-luxe hover:shadow-gold-glow transform hover:-translate-y-0.5 text-lg"
            >
              Get Free Estimate
            </button>
          </div>
        </section>

        <Footer />
        <StickyHelpButton />
      </div>
    </>
  );
};

export default Services; 