import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import StickyHelpButton from '../components/StickyHelpButton';
import teamImage from '../assets/Team.jpg';

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-primary">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-background-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6">
            About <span className="text-gold-500">Elev8</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Dedicated professionals committed to delivering an elevated cleaning experience that cannot be matched.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Story Content */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
                Our Story
              </h2>
              <div className="text-lg text-text-secondary leading-relaxed space-y-4">
                <p>
                  Elev8 was founded with one simple goal in mind: to provide an unrivaled experience for the clients we serve. We are a small team of dedicated professionals who are passionate about delivering an elevated experience that cannot be matched by anyone else in the industry.
                </p>
                <p>
                  We believe that a clean home is a happy home. We are committed to revealing the best version of all our clients homes and businesses time and time again.
                </p>
              </div>
            </div>

            {/* Team Image */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-xl shadow-luxe">
                <img 
                  src={teamImage} 
                  alt="Elev8 Team" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-16 bg-background-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Approach Visual */}
            <div className="lg:order-1">
              <div className="bg-background-card p-8 rounded-xl border border-border-primary">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-background-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-text-primary">Professional Equipment</h4>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-background-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-text-primary">Eco-Friendly Solutions</h4>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-background-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-text-primary">Ongoing Training</h4>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-background-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-text-primary">Safety Protocols</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Approach Content */}
            <div className="space-y-6 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
                Our Approach
              </h2>
              <div className="text-lg text-text-secondary leading-relaxed space-y-4">
                <p>
                  At Elev8 Solutions, we believe in using the right tools for the job. We invest in professional-grade equipment and eco-friendly cleaning solutions that are effective yet safe for your family and the environment.
                </p>
                <p>
                  Our team receives ongoing training to stay current with the latest cleaning techniques and safety protocols. This commitment to excellence ensures that we can handle any cleaning challenge effectively and efficiently.
                </p>
              </div>
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
            Let our dedicated team transform your property with our professional cleaning services.
          </p>
          <button 
            onClick={() => navigate('/help')}
            className="bg-gold-gradient hover:bg-gold-gradient-hover text-background-primary font-semibold py-4 px-8 rounded-lg transition-all duration-300 shadow-luxe hover:shadow-gold-glow transform hover:-translate-y-0.5 text-lg"
          >
            Get Your Free Estimate
          </button>
        </div>
      </section>

      <Footer />
      <StickyHelpButton />
    </div>
  );
};

export default About; 