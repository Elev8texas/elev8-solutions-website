import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import StickyHelpButton from '../components/StickyHelpButton';
import { Link } from 'react-router-dom';
import { saveQuoteRequest, QuoteFormData } from '../services/firebase';
import CalendarBooking from '../components/CalendarBooking';
import { createAppointment, AppointmentData } from '../services/calendarService';

const Quote: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Service Selection
    selectedServices: [] as string[],
    
    // Step 2: Project Dimensions
    squareFootage: '',
    windowCount: '',
    solarPanelCount: '',
    stories: '1',
    propertyType: '',
    additionalDetails: '',
    
    // Step 3: Quote Review
    recurringService: 'none', // 'none', 'biannual', 'quarterly'
    
    // Step 4: Contact & Booking
    name: '',
    email: '',
    phone: '',
    address: '',
    preferredDate: '',
    preferredTime: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Service definitions with pricing
  const services = [
    {
      id: 'window-washing',
      name: 'Window Washing',
      description: 'Professional interior and exterior window cleaning',
      basePrice: 0, // Calculated based on windows and floors
      priceUnit: 'per window',
      requiresWindows: true
    },
    {
      id: 'pressure-washing',
      name: 'Pressure Washing',
      description: 'High-pressure cleaning for driveways, sidewalks, and exteriors',
      basePrice: 0, // Calculated based on sq/ft
      priceUnit: 'per sq/ft',
      requiresSquareFootage: true
    },
    {
      id: 'roof-cleaning',
      name: 'Roof Cleaning',
      description: 'Professional soft washing for roof cleaning and maintenance',
      basePrice: 0, // Calculated based on sq/ft
      priceUnit: 'per sq/ft',
      requiresSquareFootage: true
    },
    {
      id: 'gutter-cleaning',
      name: 'Gutter Cleaning',
      description: 'Complete gutter cleaning and maintenance service',
      basePrice: 150, // Base price for gutter cleaning
      priceUnit: 'per service'
    },
    {
      id: 'solar-panel',
      name: 'Solar Panel Cleaning',
      description: 'Specialized solar panel cleaning for maximum efficiency',
      basePrice: 0, // Calculated based on panel count
      priceUnit: 'per panel',
      requiresPanels: true
    },
    {
      id: 'exterior-cleaning',
      name: 'Exterior Home Soft Washing',
      description: 'Complete exterior house soft washing and cleaning',
      basePrice: 0, // Calculated based on sq/ft
      priceUnit: 'per sq/ft',
      requiresSquareFootage: true
    },
    {
      id: 'deck-patio',
      name: 'Deck/Patio Cleaning',
      description: 'Deep cleaning and restoration of outdoor living spaces',
      basePrice: 0, // Calculated based on sq/ft
      priceUnit: 'per sq/ft',
      requiresSquareFootage: true
    },
    {
      id: 'driveway-cleaning',
      name: 'Driveway Cleaning',
      description: 'Professional pressure washing for driveways and walkways',
      basePrice: 0, // Calculated based on sq/ft
      priceUnit: 'per sq/ft',
      requiresSquareFootage: true
    }
  ];

  const propertyTypes = [
    'Single Family Home',
    'Townhouse',
    'Condo/Apartment',
    'Commercial Building',
    'Other'
  ];

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

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(s => s !== serviceId)
        : [...prev.selectedServices, serviceId]
    }));
  };

  const handleDateTimeSelect = (date: string, time: string) => {
      setFormData(prev => ({
        ...prev,
      preferredDate: date,
      preferredTime: time
    }));
  };

  // Check if required fields are filled based on selected services
  const isRequiredFieldsFilled = () => {
    // Property type is always required
    if (!formData.propertyType) return false;
    
    // Check service-specific requirements
    const needsSquareFootage = formData.selectedServices.some(service => 
      ['pressure-washing', 'roof-cleaning', 'exterior-cleaning', 'deck-patio', 'driveway-cleaning'].includes(service)
    );
    const needsWindowCount = formData.selectedServices.includes('window-washing');
    const needsSolarPanelCount = formData.selectedServices.includes('solar-panel');
    
    if (needsSquareFootage && !formData.squareFootage) return false;
    if (needsWindowCount && !formData.windowCount) return false;
    if (needsSolarPanelCount && !formData.solarPanelCount) return false;
    
    return true;
  };

  // Calculate pricing based on detailed requirements
  const calculatePricing = () => {
    const selectedServiceObjects = services.filter(s => formData.selectedServices.includes(s.id));
    let baseTotal = 0;
    
    const sqft = parseInt(formData.squareFootage) || 0;
    const windowCount = parseInt(formData.windowCount) || 0;
    const solarPanelCount = parseInt(formData.solarPanelCount) || 0;
    const stories = parseInt(formData.stories) || 1;
    
    // Calculate price for each selected service
    selectedServiceObjects.forEach(service => {
      switch (service.id) {
        case 'window-washing':
          // $6-10 per window based on floor (1st floor = $6, ascending floors = $10)
          const firstFloorWindows = Math.min(windowCount, Math.ceil(windowCount / stories));
          const upperFloorWindows = windowCount - firstFloorWindows;
          baseTotal += (firstFloorWindows * 6) + (upperFloorWindows * 10);
          break;
          
        case 'pressure-washing':
        case 'driveway-cleaning':
          // Pressure washing: $0.55/sqft (<600), $0.50/sqft (600-1000), $0.45/sqft (>1000)
          if (sqft < 600) {
            baseTotal += sqft * 0.55;
          } else if (sqft <= 1000) {
            baseTotal += sqft * 0.50;
          } else {
            baseTotal += sqft * 0.45;
          }
          break;
          
        case 'roof-cleaning':
        case 'exterior-cleaning':
        case 'deck-patio':
          // Soft washing: $0.55/sqft (<2000), $0.50/sqft (2000-3999), $0.45/sqft (>4000)
          if (sqft < 2000) {
            baseTotal += sqft * 0.55;
          } else if (sqft <= 3999) {
            baseTotal += sqft * 0.50;
          } else {
            baseTotal += sqft * 0.45;
          }
          break;
          
        case 'solar-panel':
          // $15 per panel
          baseTotal += solarPanelCount * 15;
          break;
          
        case 'gutter-cleaning':
          // Fixed price
          baseTotal += service.basePrice;
          break;
          
        default:
          baseTotal += service.basePrice;
      }
    });
    
    const adjustedTotal = baseTotal;
    
    // Multi-service discount (10% for 2+ services)
    const multiServiceDiscount = formData.selectedServices.length >= 2 ? 0.10 : 0;
    const afterMultiServiceDiscount = adjustedTotal * (1 - multiServiceDiscount);
    
    // Recurring service discount
    let recurringDiscount = 0;
    if (formData.recurringService === 'biannual') recurringDiscount = 0.10;
    if (formData.recurringService === 'quarterly') recurringDiscount = 0.15;
    
    const finalTotal = afterMultiServiceDiscount * (1 - recurringDiscount);
    
    // Apply minimum service charge of $200
    const minimumCharge = 200;
    const adjustedFinalTotal = Math.max(finalTotal, minimumCharge);
    
    // Calculate price range (+20%)
    const priceRangeHigh = adjustedFinalTotal * 1.20;
    
    return {
      baseTotal,
      adjustedTotal,
      multiServiceDiscount: adjustedTotal * multiServiceDiscount,
      recurringDiscount: afterMultiServiceDiscount * recurringDiscount,
      finalTotal: adjustedFinalTotal,
      priceRangeHigh,
      selectedServices: selectedServiceObjects,
      isMinimumApplied: finalTotal < minimumCharge
    };
  };

  // Get display price for service cards
  const getServiceDisplayPrice = (service: any) => {
    switch (service.id) {
      case 'window-washing':
        return '$6-10';
      case 'pressure-washing':
      case 'driveway-cleaning':
        return '$0.45-0.55';
      case 'roof-cleaning':
      case 'exterior-cleaning':
      case 'deck-patio':
        return '$0.45-0.55';
      case 'solar-panel':
        return '$15';
      case 'gutter-cleaning':
        return '$150';
      default:
        return 'Quote';
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
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
      const pricing = calculatePricing();
      
      // Prepare quote data for submission
      const quoteData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        services: formData.selectedServices,
        propertyType: formData.propertyType,
        ...(formData.squareFootage && { squareFootage: parseInt(formData.squareFootage) }),
        ...(formData.windowCount && { windowCount: parseInt(formData.windowCount) }),
        ...(formData.solarPanelCount && { solarPanelCount: parseInt(formData.solarPanelCount) }),
        stories: formData.stories,
        recurringService: formData.recurringService,
        additionalDetails: `${formData.additionalDetails}\n\nQuote Details:\n- Stories: ${formData.stories}\n- Recurring: ${formData.recurringService}\n- Total: $${pricing.finalTotal.toFixed(2)}`
      };

      // Save quote request to Firebase
      const docId = await saveQuoteRequest(quoteData);
      console.log('Quote request submitted successfully with ID:', docId);

      // If appointment time is selected, create calendar event
      if (formData.preferredDate && formData.preferredTime) {
        try {
          const startTime = new Date(formData.preferredTime);
          const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
          
          const appointmentData: AppointmentData = {
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            services: formData.selectedServices,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            address: formData.address,
            notes: `Quote Details:\n- Stories: ${formData.stories}\n- Recurring: ${formData.recurringService}\n- Total: $${pricing.finalTotal.toFixed(2)}`
          };
          
          await createAppointment(appointmentData);
          
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
        selectedServices: [],
        squareFootage: '',
        windowCount: '',
        solarPanelCount: '',
        stories: '1',
        propertyType: '',
        additionalDetails: '',
        recurringService: 'none',
        name: '',
        email: '',
        phone: '',
        address: '',
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
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step 
                      ? 'bg-gold-500 text-white' 
                      : 'bg-background-card border border-border-primary text-text-secondary'
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-16 h-1 mx-2 ${
                      currentStep > step ? 'bg-gold-500' : 'bg-border-primary'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4 space-x-8">
              <span className={`text-sm ${currentStep >= 1 ? 'text-gold-500' : 'text-text-secondary'}`}>
                Select Services
              </span>
              <span className={`text-sm ${currentStep >= 2 ? 'text-gold-500' : 'text-text-secondary'}`}>
                Project Details
              </span>
              <span className={`text-sm ${currentStep >= 3 ? 'text-gold-500' : 'text-text-secondary'}`}>
                Quote Review
              </span>
              <span className={`text-sm ${currentStep >= 4 ? 'text-gold-500' : 'text-text-secondary'}`}>
                Contact & Booking
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-background-card border border-border-primary rounded-2xl p-8 shadow-luxe">
            
            {/* Step 1: Service Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-text-primary mb-6">
                  Select Your Services
                </h2>
                
                {/* Discount Reminder */}
                <div className="bg-gradient-to-r from-gold-500/10 to-gold-400/10 border border-gold-500/30 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">%</span>
                    </div>
                    <div>
                      <p className="text-gold-600 font-semibold text-sm">
                        💡 Pro Tip: Select 2 or more services to unlock 10% off your total!
                      </p>
                      <p className="text-text-secondary text-xs mt-1">
                        Save more by bundling services together
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => handleServiceToggle(service.id)}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        formData.selectedServices.includes(service.id)
                          ? 'border-gold-500 bg-gold-500/10 shadow-gold-glow'
                          : 'border-border-primary bg-background-primary hover:border-gold-300 hover:bg-background-secondary'
                      }`}
                    >
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-text-primary mb-2">{service.name}</h3>
                        <p className="text-sm text-text-secondary mb-4">{service.description}</p>
                        <div className="text-xl font-bold text-gold-500">
                          {getServiceDisplayPrice(service)}
                          <span className="text-sm text-text-muted ml-1">{service.priceUnit}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Multi-service discount notice */}
                {formData.selectedServices.length >= 2 && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <p className="text-green-400 text-sm font-medium">
                      🎉 Great choice! You've unlocked a 10% discount for selecting multiple services.
                    </p>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={formData.selectedServices.length === 0}
                    className="px-8 py-3 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-white font-semibold rounded-lg hover:shadow-gold-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Project Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-text-primary mb-6">
                  Project Details
                </h2>
                
                {/* Only show fields needed for selected services */}
                <div className="space-y-6">
                  
                  {/* Square Footage - Required for most services */}
                  {(formData.selectedServices.includes('pressure-washing') || 
                    formData.selectedServices.includes('roof-cleaning') || 
                    formData.selectedServices.includes('exterior-cleaning') || 
                    formData.selectedServices.includes('deck-patio') || 
                    formData.selectedServices.includes('driveway-cleaning')) && (
                    <div>
                      <label htmlFor="squareFootage" className="block text-sm font-medium text-text-primary mb-2">
                        Square Footage *
                      </label>
                      <input
                        type="number"
                        id="squareFootage"
                        name="squareFootage"
                        value={formData.squareFootage}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-background-primary border border-border-primary rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-text-primary placeholder-text-muted transition-all duration-300"
                        placeholder="e.g., 2500"
                      />
                      <p className="text-xs text-text-muted mt-1">
                        Area to be cleaned in square feet
                      </p>
                    </div>
                  )}
                  
                  {/* Window Count - Only for window washing */}
                  {formData.selectedServices.includes('window-washing') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="windowCount" className="block text-sm font-medium text-text-primary mb-2">
                          Number of Windows *
                        </label>
                        <input
                          type="number"
                          id="windowCount"
                          name="windowCount"
                          value={formData.windowCount}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-background-primary border border-border-primary rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-text-primary placeholder-text-muted transition-all duration-300"
                          placeholder="e.g., 20"
                        />
                      </div>
                      <div>
                        <label htmlFor="stories" className="block text-sm font-medium text-text-primary mb-2">
                          Number of Stories *
                        </label>
                        <select
                          id="stories"
                          name="stories"
                          value={formData.stories}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-background-primary border border-border-primary rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-text-primary transition-all duration-300"
                        >
                          <option value="1">1 Story</option>
                          <option value="2">2 Stories</option>
                          <option value="3">3+ Stories</option>
                        </select>
                      </div>
                    </div>
                  )}
                  
                  {/* Solar Panel Count - Only for solar panel cleaning */}
                  {formData.selectedServices.includes('solar-panel') && (
                    <div>
                      <label htmlFor="solarPanelCount" className="block text-sm font-medium text-text-primary mb-2">
                        Number of Solar Panels *
                      </label>
                      <input
                        type="number"
                        id="solarPanelCount"
                        name="solarPanelCount"
                        value={formData.solarPanelCount}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-background-primary border border-border-primary rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-text-primary placeholder-text-muted transition-all duration-300"
                        placeholder="e.g., 20"
                      />
                    </div>
                  )}
                  
                  {/* Property Type - Always shown for context */}
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
                  
                  {/* Additional Details - Optional */}
                  <div>
                    <label htmlFor="additionalDetails" className="block text-sm font-medium text-text-primary mb-2">
                      Additional Details (Optional)
                    </label>
                    <textarea
                      id="additionalDetails"
                      name="additionalDetails"
                      value={formData.additionalDetails}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-background-primary border border-border-primary rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-text-primary placeholder-text-muted transition-all duration-300 resize-vertical"
                      placeholder="Any specific requirements or special considerations..."
                    />
                  </div>
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
                    disabled={!formData.propertyType || !isRequiredFieldsFilled()}
                    className="px-8 py-3 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-white font-semibold rounded-lg hover:shadow-gold-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Quote Review */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-text-primary mb-6">
                  Your Quote
                </h2>
                
                {(() => {
                  const pricing = calculatePricing();
                  return (
                    <div className="space-y-6">
                      {/* Selected Services */}
                      <div className="bg-background-secondary border border-border-primary rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-text-primary mb-4">Selected Services</h3>
                        <div className="space-y-3">
                          {pricing.selectedServices.map((service) => (
                            <div key={service.id} className="flex justify-between items-center">
                              <span className="text-text-primary">{service.name}</span>
                              <span className="text-gold-500 font-medium">{getServiceDisplayPrice(service)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Price Breakdown */}
                      <div className="bg-background-secondary border border-border-primary rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-text-primary mb-4">Price Breakdown</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-text-secondary">Base Total</span>
                            <span className="text-text-primary">${pricing.baseTotal.toFixed(2)}</span>
                          </div>
                          {pricing.multiServiceDiscount > 0 && (
                            <div className="flex justify-between text-green-400">
                              <span>Multi-Service Discount (10%)</span>
                              <span>-${pricing.multiServiceDiscount.toFixed(2)}</span>
                            </div>
                          )}
                          {pricing.recurringDiscount > 0 && (
                            <div className="flex justify-between text-green-400">
                              <span>Recurring Service Discount</span>
                              <span>-${pricing.recurringDiscount.toFixed(2)}</span>
                            </div>
                          )}
                          {pricing.isMinimumApplied && (
                            <div className="flex justify-between text-blue-400">
                              <span>Minimum Service Charge</span>
                              <span>${200}</span>
                            </div>
                          )}
                          <hr className="border-border-primary" />
                          <div className="flex justify-between text-xl font-bold">
                            <span className="text-text-primary">Estimated Range</span>
                            <span className="text-gold-500">
                              ${pricing.finalTotal.toFixed(2)} - ${pricing.priceRangeHigh.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-background-primary border border-border-primary rounded-lg">
                          <p className="text-xs text-text-muted">
                            * Final price may vary based on site conditions and specific requirements. 
                            Minimum service charge of $200 applies to all jobs.
                          </p>
                        </div>
                      </div>
                      
                      {/* Recurring Service Options */}
                      <div className="bg-background-secondary border border-border-primary rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-text-primary mb-4">Recurring Service Options</h3>
                        <div className="space-y-3">
                          <label className="flex items-center space-x-3 p-3 bg-background-primary border border-border-primary rounded-lg hover:bg-background-card transition-colors cursor-pointer">
                            <input
                              type="radio"
                              name="recurringService"
                              value="none"
                              checked={formData.recurringService === 'none'}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-gold-500"
                            />
                            <span className="text-text-primary">One-time service</span>
                          </label>
                          <label className="flex items-center space-x-3 p-3 bg-background-primary border border-border-primary rounded-lg hover:bg-background-card transition-colors cursor-pointer">
                            <input
                              type="radio"
                              name="recurringService"
                              value="biannual"
                              checked={formData.recurringService === 'biannual'}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-gold-500"
                            />
                            <div className="flex-1">
                              <span className="text-text-primary">Bi-annual service</span>
                              <span className="text-green-400 ml-2 font-medium">(10% off)</span>
                            </div>
                          </label>
                          <label className="flex items-center space-x-3 p-3 bg-background-primary border border-border-primary rounded-lg hover:bg-background-card transition-colors cursor-pointer">
                            <input
                              type="radio"
                              name="recurringService"
                              value="quarterly"
                              checked={formData.recurringService === 'quarterly'}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-gold-500"
                            />
                            <div className="flex-1">
                              <span className="text-text-primary">Quarterly service</span>
                              <span className="text-green-400 ml-2 font-medium">(15% off)</span>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })()}
                
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
                    className="px-8 py-3 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-white font-semibold rounded-lg hover:shadow-gold-glow transition-all duration-300"
                  >
                    Continue to Booking
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Contact & Booking */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-text-primary mb-6">
                  Contact Information & Booking
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
                      Service Address *
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
                
                {/* Appointment Scheduling */}
                <CalendarBooking
                  selectedDate={formData.preferredDate}
                  selectedTime={formData.preferredTime}
                  onDateTimeSelect={handleDateTimeSelect}
                />
                
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
                    disabled={isSubmitting || !formData.name || !formData.email || !formData.phone || !formData.address}
                    className={`px-8 py-4 font-semibold rounded-lg transition-all duration-300 transform ${
                      isSubmitting
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 hover:shadow-gold-glow hover:scale-105'
                    } text-white`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Finalizing Quote...</span>
                      </div>
                    ) : (
                      'Finalize Quote'
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