import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import StickyHelpButton from '../components/StickyHelpButton';
import { Link, useLocation } from 'react-router-dom';
import { saveContactForm, ContactFormData } from '../services/firebase';

const Contact: React.FC = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    // Check if there's a pre-selected service from navigation state
    if (location.state && (location.state as any).selectedService) {
      const selectedService = (location.state as any).selectedService;
      setFormData(prev => ({
        ...prev,
        service: selectedService
      }));
    }
  }, [location.state]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear any previous errors when user starts typing
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare data for Firebase
      const contactData: ContactFormData = {
        ...formData,
        source: 'contact-page'
      };

      // Save to Firebase
      const docId = await saveContactForm(contactData);
      console.log('Contact form submitted successfully with ID:', docId);
      
      // Show success state
      setIsSubmitted(true);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });

    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitError('There was an error submitting your request. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success message component
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background-primary">
        <Navigation />
        <section className="pt-32 pb-16 bg-gradient-to-br from-background-primary via-background-secondary to-background-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-background-card border border-border-primary rounded-2xl p-12 shadow-luxe">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-text-primary mb-6">
                Thank You!
              </h1>
              <p className="text-xl text-text-secondary mb-8">
                Your message has been received. We'll get back to you within 24 hours with a personalized quote.
              </p>
              <div className="space-y-4">
                <Link 
                  to="/"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-white font-semibold rounded-lg hover:shadow-gold-glow transition-all duration-300 mr-4"
                >
                  Return Home
                </Link>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="inline-flex items-center px-6 py-3 bg-transparent border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-background-primary font-semibold rounded-lg transition-all duration-300"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          </div>
        </section>
        <Footer />
        <StickyHelpButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-background-primary via-background-secondary to-background-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-text-primary mb-6">
            Get In <span className="text-gold-500">Touch</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Ready to elevate your property's appearance? Contact us today for a free estimate and discover the Elev8 difference.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Alternative Navigation */}
          <div className="mb-12 text-center">
            <div className="bg-background-card border border-border-primary rounded-2xl p-6 shadow-luxe max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-text-primary mb-3">
                Already know your project's dimensions?
              </h3>
              <p className="text-text-secondary mb-4">
                Skip the consultation and get an instant quote with our self-service booking tool.
              </p>
              <Link 
                to="/quote"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-white font-semibold rounded-lg hover:shadow-gold-glow transition-all duration-300 transform hover:scale-105"
              >
                Get Instant Quote & Book
                <svg className="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Form */}
            <div className="bg-background-card border border-border-primary rounded-2xl p-8 shadow-luxe">
              <h2 className="text-3xl font-bold text-text-primary mb-6">
                Request Your <span className="text-gold-500">Free Estimate</span>
              </h2>
              <p className="text-text-secondary mb-8">
                Fill out the form below and we'll get back to you within 24 hours with a personalized quote.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-background-primary border border-border-primary rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-text-primary placeholder-text-muted transition-all duration-300"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-background-primary border border-border-primary rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-text-primary placeholder-text-muted transition-all duration-300"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-background-primary border border-border-primary rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-text-primary placeholder-text-muted transition-all duration-300"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-text-primary mb-2">
                      Service Needed
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-background-primary border border-border-primary rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-text-primary transition-all duration-300"
                    >
                      <option value="">Select a service</option>
                      <option value="Curb Appeal">Curb Appeal Package</option>
                      <option value="Big Tex Makeover">Big Tex Makeover Package</option>
                      <option value="Roof Renovation">Roof Renovation Package</option>
                      <option value="Window Washing">Window Washing</option>
                      <option value="Pressure Washing">Pressure Washing</option>
                      <option value="Roof & Gutter Cleaning">Roof & Gutter Cleaning</option>
                      <option value="Exterior Cleaning">Exterior Cleaning</option>
                      <option value="Solar Panel Cleaning">Solar Panel Cleaning</option>
                      <option value="Commercial Services">Commercial Services</option>
                      <option value="Multiple Services">Multiple Services</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
                    Project Details
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 bg-background-primary border border-border-primary rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-text-primary placeholder-text-muted transition-all duration-300 resize-vertical"
                    placeholder="Tell us about your property, specific needs, or any questions you have..."
                  />
                </div>
                
                {/* Error Message */}
                {submitError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">{submitError}</p>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-8 py-4 font-semibold rounded-lg transition-all duration-300 transform ${
                    isSubmitting
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 hover:shadow-gold-glow hover:scale-105'
                  } text-white`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending Message...</span>
                    </div>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              
              {/* Contact Details */}
              <div className="bg-background-card border border-border-primary rounded-2xl p-8 shadow-luxe">
                <h3 className="text-2xl font-bold text-text-primary mb-6">
                  Contact <span className="text-gold-500">Information</span>
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gold-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary">Phone</h4>
                      <p className="text-text-secondary">(512) 701-8085</p>
                      <p className="text-sm text-text-muted">Available 7 days a week</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gold-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary">Email</h4>
                      <p className="text-text-secondary">Contact@elev8texas.com</p>
                      <p className="text-sm text-text-muted">We respond within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gold-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary">Service Area</h4>
                      <p className="text-text-secondary">Austin, Texas & Surrounding Areas</p>
                      <p className="text-sm text-text-muted">25 mile radius of Austin</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-background-card border border-border-primary rounded-2xl p-8 shadow-luxe">
                <h3 className="text-2xl font-bold text-text-primary mb-6">
                  Business <span className="text-gold-500">Hours</span>
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border-primary">
                    <span className="text-text-primary font-medium">Monday - Friday</span>
                    <span className="text-text-secondary">7:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border-primary">
                    <span className="text-text-primary font-medium">Saturday</span>
                    <span className="text-text-secondary">8:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-text-primary font-medium">Sunday</span>
                    <span className="text-text-secondary">Emergency Only</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gold-500/10 border border-gold-500/20 rounded-lg">
                  <p className="text-sm text-text-secondary">
                    <span className="text-gold-500 font-semibold">Emergency Services:</span> Available 24/7 for urgent cleaning needs
                  </p>
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="bg-background-card border border-border-primary rounded-2xl p-8 shadow-luxe">
                <h3 className="text-2xl font-bold text-text-primary mb-6">
                  Why Choose <span className="text-gold-500">Elev8?</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                    <span className="text-text-secondary">Free, no-obligation estimates</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                    <span className="text-text-secondary">Fully licensed and insured</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                    <span className="text-text-secondary">100% satisfaction guarantee</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                    <span className="text-text-secondary">Eco-friendly cleaning solutions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                    <span className="text-text-secondary">Professional, trained technicians</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <StickyHelpButton />
    </div>
  );
};

export default Contact; 