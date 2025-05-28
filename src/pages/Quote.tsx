import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import StickyHelpButton from '../components/StickyHelpButton';
import { Link } from 'react-router-dom';
import { saveQuoteRequest, QuoteFormData } from '../services/firebase';
import { getAvailableTimeSlots, createServiceAppointment, formatTimeSlot, TimeSlot } from '../services/googleCalendar';

const Quote: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    services: [] as string[],
    propertyType: '',
    squareFootage: '',
    windowCount: '',
    additionalDetails: '',
    preferredDate: '',
    preferredTime: ''
  });
  
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const services = [
    'Window Washing',
    'Pressure Washing',
    'Roof & Gutter Cleaning',
    'Exterior Cleaning',
    'Solar Panel Cleaning',
    'Driveway Cleaning',
    'Sidewalk Cleaning',
    'Deck/Patio Cleaning',
    'Commercial Services'
  ];

  const propertyTypes = [
    'Single Family Home',
    'Townhouse',
    'Condo/Apartment',
    'Commercial Building',
    'Office Building',
    'Retail Store',
    'Restaurant',
    'Other'
  ];

  // Load available time slots when date changes
  useEffect(() => {
    if (formData.preferredDate) {
      loadAvailableSlots(formData.preferredDate);
    }
  }, [formData.preferredDate]);

  const loadAvailableSlots = async (date: string) => {
    setLoadingSlots(true);
    try {
      const slots = await getAvailableTimeSlots(date);
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error loading time slots:', error);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleServiceChange = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    if (slot.available) {
      setFormData(prev => ({
        ...prev,
        preferredTime: slot.start
      }));
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare data for Firebase
      const quoteData: QuoteFormData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        services: formData.services,
        propertyType: formData.propertyType,
        squareFootage: formData.squareFootage ? parseInt(formData.squareFootage) : undefined,
        windowCount: formData.windowCount ? parseInt(formData.windowCount) : undefined,
        additionalDetails: formData.additionalDetails
      };

      // Save quote request to Firebase
      const docId = await saveQuoteRequest(quoteData);
      console.log('Quote request submitted successfully with ID:', docId);

      // If appointment time is selected, create calendar event
      if (formData.preferredDate && formData.preferredTime) {
        try {
          const startTime = new Date(formData.preferredTime);
          const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour later
          
          await createServiceAppointment(
            formData.name,
            formData.email,
            formData.phone,
            formData.services.join(', '),
            startTime.toISOString(),
            endTime.toISOString(),
            formData.address
          );
          
          console.log('Appointment scheduled successfully');
        } catch (calendarError) {
          console.error('Error scheduling appointment:', calendarError);
          // Don't fail the whole submission if calendar fails
        }
      }
      
      // Show success state
      setIsSubmitted(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        services: [],
        propertyType: '',
        squareFootage: '',
        windowCount: '',
        additionalDetails: '',
        preferredDate: '',
        preferredTime: ''
      });
      setCurrentStep(1);

    } catch (error) {
      console.error('Error submitting quote request:', error);
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
                Quote Request Submitted!
              </h1>
              <p className="text-xl text-text-secondary mb-8">
                Thank you for your detailed request. We'll prepare a customized quote and get back to you within 24 hours.
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
                  Submit Another Quote
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-text-primary mb-6">
            Get Your <span className="text-gold-500">Instant Quote</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Tell us about your project and we'll provide a detailed quote with optional appointment scheduling.
          </p>
        </div>
      </section>

      {/* Quote Form */}
      <section className="py-20 bg-background-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Progress Indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step 
                      ? 'bg-gold-500 text-white' 
                      : 'bg-background-card border border-border-primary text-text-secondary'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      currentStep > step ? 'bg-gold-500' : 'bg-border-primary'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4 space-x-8">
              <span className={`text-sm ${currentStep >= 1 ? 'text-gold-500' : 'text-text-secondary'}`}>
                Project Details
              </span>
              <span className={`text-sm ${currentStep >= 2 ? 'text-gold-500' : 'text-text-secondary'}`}>
                Property Info
              </span>
              <span className={`text-sm ${currentStep >= 3 ? 'text-gold-500' : 'text-text-secondary'}`}>
                Schedule & Submit
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-background-card border border-border-primary rounded-2xl p-8 shadow-luxe">
            
            {/* Step 1: Project Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-text-primary mb-6">
                  Tell Us About Your Project
                </h2>
                
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
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-background-primary border border-border-primary rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-text-primary placeholder-text-muted transition-all duration-300"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-text-primary mb-2">
                      Property Address *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-background-primary border border-border-primary rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-text-primary placeholder-text-muted transition-all duration-300"
                      placeholder="123 Main St, Austin, TX"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-4">
                    Services Needed * (Select all that apply)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {services.map((service) => (
                      <label key={service} className="flex items-center space-x-3 p-3 bg-background-primary border border-border-primary rounded-lg hover:bg-background-secondary transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.services.includes(service)}
                          onChange={() => handleServiceChange(service)}
                          className="w-4 h-4 text-gold-500 bg-background-primary border-border-primary rounded focus:ring-gold-500 focus:ring-2"
                        />
                        <span className="text-text-primary text-sm">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.name || !formData.email || !formData.phone || !formData.address || formData.services.length === 0}
                    className="px-8 py-3 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-white font-semibold rounded-lg hover:shadow-gold-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Property Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-text-primary mb-6">
                  Property Information
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="propertyType" className="block text-sm font-medium text-text-primary mb-2">
                      Property Type *
                    </label>
                    <select
                      id="propertyType"
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-background-primary border border-border-primary rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-text-primary transition-all duration-300"
                    >
                      <option value="">Select property type</option>
                      {propertyTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="squareFootage" className="block text-sm font-medium text-text-primary mb-2">
                      Square Footage (optional)
                    </label>
                    <input
                      type="number"
                      id="squareFootage"
                      name="squareFootage"
                      value={formData.squareFootage}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-background-primary border border-border-primary rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-text-primary placeholder-text-muted transition-all duration-300"
                      placeholder="e.g., 2500"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="windowCount" className="block text-sm font-medium text-text-primary mb-2">
                    Number of Windows (optional)
                  </label>
                  <input
                    type="number"
                    id="windowCount"
                    name="windowCount"
                    value={formData.windowCount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background-primary border border-border-primary rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-text-primary placeholder-text-muted transition-all duration-300"
                    placeholder="e.g., 20"
                  />
                </div>
                
                <div>
                  <label htmlFor="additionalDetails" className="block text-sm font-medium text-text-primary mb-2">
                    Additional Details
                  </label>
                  <textarea
                    id="additionalDetails"
                    name="additionalDetails"
                    value={formData.additionalDetails}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-background-primary border border-border-primary rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-text-primary placeholder-text-muted transition-all duration-300 resize-vertical"
                    placeholder="Any specific requirements, concerns, or additional information..."
                  />
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-3 bg-background-secondary border border-border-primary text-text-primary hover:bg-background-card font-semibold rounded-lg transition-all duration-300"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.propertyType}
                    className="px-8 py-3 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-white font-semibold rounded-lg hover:shadow-gold-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Schedule & Submit */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-text-primary mb-6">
                  Schedule Appointment (Optional)
                </h2>
                
                <div className="bg-background-secondary border border-border-primary rounded-lg p-6 mb-6">
                  <p className="text-text-secondary text-sm">
                    <strong>Note:</strong> Scheduling an appointment is optional. You can submit your quote request now and we'll contact you to schedule, or select a preferred time below for automatic scheduling.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="preferredDate" className="block text-sm font-medium text-text-primary mb-2">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      id="preferredDate"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 bg-background-primary border border-border-primary rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-text-primary transition-all duration-300"
                    />
                  </div>
                </div>
                
                {/* Available Time Slots */}
                {formData.preferredDate && (
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-4">
                      Available Time Slots
                    </label>
                    {loadingSlots ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-3 text-text-secondary">Loading available times...</span>
                      </div>
                    ) : availableSlots.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {availableSlots.map((slot, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleTimeSlotSelect(slot)}
                            disabled={!slot.available}
                            className={`p-3 rounded-lg border text-sm font-medium transition-all duration-300 ${
                              formData.preferredTime === slot.start
                                ? 'bg-gold-500 text-white border-gold-500'
                                : slot.available
                                ? 'bg-background-primary border-border-primary text-text-primary hover:border-gold-500 hover:bg-background-secondary'
                                : 'bg-background-secondary border-border-primary text-text-muted cursor-not-allowed opacity-50'
                            }`}
                          >
                            {formatTimeSlot(slot)}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-text-secondary">
                        No available time slots for this date. Please choose another date or submit without scheduling.
                      </div>
                    )}
                  </div>
                )}
                
                {/* Error Message */}
                {submitError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">{submitError}</p>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-3 bg-background-secondary border border-border-primary text-text-primary hover:bg-background-card font-semibold rounded-lg transition-all duration-300"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-8 py-4 font-semibold rounded-lg transition-all duration-300 transform ${
                      isSubmitting
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 hover:shadow-gold-glow hover:scale-105'
                    } text-white`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      'Submit Quote Request'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>

      <Footer />
      <StickyHelpButton />
    </div>
  );
};

export default Quote; 