import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { saveContactForm, ContactFormData } from '../services/firebase';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    urgency: 'normal',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: 'Quick Help Request',
        message: formData.message,
        urgency: formData.urgency,
        source: 'help-page'
      };

      // Save to Firebase
      const docId = await saveContactForm(contactData);
      console.log('Help form submitted successfully with ID:', docId);
      
      // Show success state
      setIsSubmitted(true);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        urgency: 'normal',
        message: ''
      });

    } catch (error) {
      console.error('Error submitting help form:', error);
      setSubmitError('There was an error submitting your request. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background-primary">
        <Navigation />
        
        {/* Success Message */}
        <section className="pt-32 pb-20 bg-background-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-background-card border border-border-primary rounded-2xl p-12 shadow-luxe">
              {/* Success Icon */}
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h1 className="text-4xl font-bold text-text-primary mb-4">
                Message Sent Successfully!
              </h1>
              <p className="text-xl text-text-secondary mb-8">
                Thank you for reaching out. We'll get back to you within 2 hours during business hours.
              </p>
              
              <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                <Link 
                  to="/"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-white font-semibold rounded-lg hover:shadow-gold-glow transition-all duration-300 transform hover:scale-105"
                >
                  Back to Home
                </Link>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="inline-block px-6 py-3 bg-background-secondary border border-border-primary text-text-primary hover:bg-background-card font-semibold rounded-lg transition-all duration-300"
                >
                  Send Another Message
                </button>
              </div>
              
              {/* Emergency Contact */}
              <div className="mt-8 p-4 bg-gold-500/10 border border-gold-500/20 rounded-lg">
                <p className="text-sm text-text-secondary">
                  <span className="text-gold-500 font-semibold">Need immediate assistance?</span> Call us at{' '}
                  <a href="tel:+15127018085" className="text-gold-500 hover:text-gold-400 font-semibold">
                    (512) 701-8085
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-background-primary via-background-secondary to-background-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
            How Can We <span className="text-gold-500">Help</span> You?
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Get quick assistance from our team. We'll respond within 2 hours during business hours.
          </p>
        </div>
      </section>

      {/* Quick Contact Form */}
      <section className="pb-20 bg-background-primary">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Alternative Options */}
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              to="/contact"
              className="bg-background-card border border-border-primary rounded-xl p-6 text-center hover:bg-background-secondary transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-gold-gradient rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Full Quote Request</h3>
              <p className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                Need a detailed estimate? Use our comprehensive form
              </p>
            </Link>
            
            <a 
              href="tel:+15127018085"
              className="bg-background-card border border-border-primary rounded-xl p-6 text-center hover:bg-background-secondary transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-gold-gradient rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Call Now</h3>
              <p className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                Speak directly with our team: (512) 701-8085
              </p>
            </a>
          </div>

          {/* Quick Help Form */}
          <div className="bg-background-card border border-border-primary rounded-2xl p-8 shadow-luxe">
            <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
              Send Us a Quick Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-background-primary border border-border-primary rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-text-primary placeholder-text-muted transition-all duration-300"
                    placeholder="Your name"
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
                    placeholder="your@email.com"
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
                  <label htmlFor="urgency" className="block text-sm font-medium text-text-primary mb-2">
                    How urgent is this?
                  </label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background-primary border border-border-primary rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-text-primary transition-all duration-300"
                  >
                    <option value="normal">Normal - within 24 hours</option>
                    <option value="urgent">Urgent - within 2 hours</option>
                    <option value="emergency">Emergency - call me ASAP</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
                  How can we help you? *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-background-primary border border-border-primary rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-text-primary placeholder-text-muted transition-all duration-300 resize-vertical"
                  placeholder="Briefly describe what you need help with..."
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
            
            {/* Response Time Info */}
            <div className="mt-6 p-4 bg-background-secondary border border-border-primary rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">Quick Response Guarantee</p>
                  <p className="text-xs text-text-secondary">We respond to all messages within 2 hours during business hours (7 AM - 6 PM, Mon-Fri)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactForm; 