import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import StickyHelpButton from '../components/StickyHelpButton';
import { saveCommercialForm, CommercialFormData } from '../services/firebase';
import { scrollToTop } from '../components/ScrollToTop';

const Commercial: React.FC = () => {
  const [formData, setFormData] = useState<CommercialFormData>({
    businessName: '',
    contactName: '',
    phoneNumber: '',
    businessAddress: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare data for Firebase - use the correct field names
      const commercialData: CommercialFormData = {
        businessName: formData.businessName,
        contactName: formData.contactName,
        phoneNumber: formData.phoneNumber,
        businessAddress: formData.businessAddress
      };

      // Save to Firebase
      const docId = await saveCommercialForm(commercialData);
      console.log('Commercial form submitted successfully with ID:', docId);
      
      // Scroll to top BEFORE showing success state
      scrollToTop('auto');
      
      // Show success state
      setIsSubmitted(true);
      
      // Reset form after successful submission
      setFormData({
        businessName: '',
        contactName: '',
        phoneNumber: '',
        businessAddress: ''
      });

    } catch (error) {
      console.error('Error submitting commercial form:', error);
      setSubmitError('There was an error submitting your request. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ensure scroll to top when success page is shown
  useEffect(() => {
    if (isSubmitted) {
      scrollToTop('auto');
    }
  }, [isSubmitted]);

  return (
    <div className="min-h-screen bg-background-primary">
      <Navigation />
      
      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-8">
                  Have a commercial property?
                </h1>
                
                <div className="text-lg text-text-secondary leading-relaxed space-y-4">
                  <p>
                    The exterior of your business is deterring new customers. According to private studies your business's exterior appearance matters to <span className="font-bold text-gold-500">95%</span> of consumers and determines whether they shop. Another found that it can deter up to <span className="font-bold text-gold-500">52%</span> of first time visitors. That is substantial loss that is <span className="font-bold text-gold-500">100%</span> preventable, with Elev8 we do it all and will restore your business to its former glory and put dollars in your pocket. Fill out the form and let's make you more money.
                  </p>
                </div>
                
                {/* Sources */}
                <div className="mt-6 text-sm text-text-muted">
                  <p>Sources: RetailCustomerExperience.com, CCFAC</p>
                </div>
              </div>

              {/* Additional Benefits Section */}
              <div className="bg-background-card p-8 rounded-xl border border-border-primary">
                <h3 className="text-2xl font-semibold text-text-primary mb-6">
                  Why Choose Elev8 for Your Business?
                </h3>
                <ul className="space-y-4 text-text-secondary">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Professional exterior cleaning that attracts more customers</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Comprehensive services including windows, pressure washing, and roof cleaning</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Flexible scheduling to minimize business disruption</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Proven track record with local businesses</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="lg:sticky lg:top-32">
              <div className="bg-background-card p-8 rounded-xl border border-border-primary shadow-luxe">
                <h2 className="text-2xl font-semibold text-text-primary mb-6">
                  Get Your Free Commercial Quote
                </h2>
                
                {submitError && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">
                      {submitError}
                    </p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-text-secondary mb-2">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-background-primary border border-border-primary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                      placeholder="Enter your business name"
                    />
                  </div>

                  <div>
                    <label htmlFor="contactName" className="block text-sm font-medium text-text-secondary mb-2">
                      Name of Person Reaching Out *
                    </label>
                    <input
                      type="text"
                      id="contactName"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-background-primary border border-border-primary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-text-secondary mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-background-primary border border-border-primary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label htmlFor="businessAddress" className="block text-sm font-medium text-text-secondary mb-2">
                      Business Address *
                    </label>
                    <textarea
                      id="businessAddress"
                      name="businessAddress"
                      value={formData.businessAddress}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                      rows={3}
                      className="w-full px-4 py-3 bg-background-primary border border-border-primary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-300 resize-none disabled:opacity-50"
                      placeholder="Enter your business address"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gold-gradient hover:bg-gold-gradient-hover text-background-primary font-semibold py-4 px-8 rounded-lg transition-all duration-300 shadow-luxe hover:shadow-gold-glow transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? 'Submitting...' : 'Get My Free Quote'}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-text-muted">
                    We'll respond within 24 hours with your custom quote
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <StickyHelpButton />
    </div>
  );
};

export default Commercial; 