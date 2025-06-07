import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import StickyHelpButton from '../components/StickyHelpButton';
import { Link } from 'react-router-dom';
import { saveQuoteRequest } from '../services/firebase';
import CalendarBooking from '../components/CalendarBooking';
import { createAppointment, AppointmentData } from '../services/calendarService';
import { scrollToTop } from '../components/ScrollToTop';
import { analytics } from '../utils/analytics';

const Quote: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  interface FormData {
    selectedServices: string[];
    squareFootage: string;
    windowCount: string;
    solarPanelCount: string;
    linearFeet: string;
    stories: string;
    propertyType: string;
    additionalDetails: string;
    recurringService: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    preferredDate: string;
    preferredTime: string;
    // Upsell fields
    upsellServices: string[];
    upsellSquareFootage: string;
    upsellWindowCount: string;
    upsellSolarPanelCount: string;
    upsellLinearFeet: string;
  }

  const [formData, setFormData] = useState<FormData>({
    selectedServices: [],
    squareFootage: '',
    windowCount: '',
    solarPanelCount: '',
    linearFeet: '',
    stories: '1',
    propertyType: '',
    additionalDetails: '',
    recurringService: 'none',
    name: '',
    email: '',
    phone: '',
    address: '',
    preferredDate: '',
    preferredTime: '',
    // Upsell fields
    upsellServices: [],
    upsellSquareFootage: '',
    upsellWindowCount: '',
    upsellSolarPanelCount: '',
    upsellLinearFeet: ''
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
      basePrice: 0, // Calculated based on linear feet and stories
      priceUnit: 'per linear foot',
      requiresLinearFeet: true
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

  // Service bundle definitions
  const roofBundle = ['roof-cleaning', 'gutter-cleaning', 'solar-panel'];
  const exteriorBundle = ['window-washing', 'pressure-washing', 'exterior-cleaning', 'deck-patio'];

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

  // Detect upsell opportunities
  const getUpsellOpportunities = () => {
    const upsells = [];
    
    // Check roof bundle upsells
    const selectedRoofServices = formData.selectedServices.filter(s => roofBundle.includes(s));
    if (selectedRoofServices.length > 0 && selectedRoofServices.length < roofBundle.length) {
      const missingRoofServices = roofBundle.filter(s => !formData.selectedServices.includes(s));
      upsells.push({
        bundle: 'roof',
        name: 'Complete Roof & Solar Care Package',
        description: 'Add remaining roof services for comprehensive care',
        services: missingRoofServices,
        discount: 0.10
      });
    }
    
    // Check exterior bundle upsells
    const selectedExteriorServices = formData.selectedServices.filter(s => exteriorBundle.includes(s));
    if (selectedExteriorServices.length > 0 && selectedExteriorServices.length < exteriorBundle.length) {
      const missingExteriorServices = exteriorBundle.filter(s => !formData.selectedServices.includes(s));
      upsells.push({
        bundle: 'exterior',
        name: 'Complete Exterior Cleaning Package',
        description: 'Add remaining exterior services for a complete clean',
        services: missingExteriorServices,
        discount: 0.10
      });
    }
    
    return upsells;
  };

  const handleUpsellToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      upsellServices: prev.upsellServices.includes(serviceId)
        ? prev.upsellServices.filter(s => s !== serviceId)
        : [...prev.upsellServices, serviceId]
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
    const needsLinearFeet = formData.selectedServices.includes('gutter-cleaning');
    
    if (needsSquareFootage && !formData.squareFootage) return false;
    if (needsWindowCount && !formData.windowCount) return false;
    if (needsSolarPanelCount && !formData.solarPanelCount) return false;
    if (needsLinearFeet && !formData.linearFeet) return false;
    
    return true;
  };

  // Calculate pricing based on detailed requirements
  const calculatePricing = () => {
    const selectedServiceObjects = services.filter(s => formData.selectedServices.includes(s.id));
    const upsellServiceObjects = services.filter(s => formData.upsellServices.includes(s.id));
    let baseTotal = 0;
    let upsellTotal = 0;
    
    const sqft = parseInt(formData.squareFootage) || 0;
    const windowCount = parseInt(formData.windowCount) || 0;
    const solarPanelCount = parseInt(formData.solarPanelCount) || 0;
    const linearFeet = parseInt(formData.linearFeet) || 0;
    const stories = parseInt(formData.stories) || 1;

    // Upsell dimensions
    const upsellSqft = parseInt(formData.upsellSquareFootage) || 0;
    const upsellWindowCount = parseInt(formData.upsellWindowCount) || 0;
    const upsellSolarPanelCount = parseInt(formData.upsellSolarPanelCount) || 0;
    const upsellLinearFeet = parseInt(formData.upsellLinearFeet) || 0;

    // Helper function to calculate service price
    const calculateServicePrice = (service: any, isUpsell: boolean = false) => {
      const currentSqft = isUpsell ? upsellSqft : sqft;
      const currentWindowCount = isUpsell ? upsellWindowCount : windowCount;
      const currentSolarPanelCount = isUpsell ? upsellSolarPanelCount : solarPanelCount;
      const currentLinearFeet = isUpsell ? upsellLinearFeet : linearFeet;

      switch (service.id) {
        case 'window-washing':
          const firstFloorWindows = Math.min(currentWindowCount, Math.ceil(currentWindowCount / stories));
          const upperFloorWindows = currentWindowCount - firstFloorWindows;
          return (firstFloorWindows * 6) + (upperFloorWindows * 10);
          
        case 'pressure-washing':
        case 'driveway-cleaning':
          if (currentSqft < 600) {
            return currentSqft * 0.55;
          } else if (currentSqft <= 1000) {
            return currentSqft * 0.50;
          } else {
            return currentSqft * 0.45;
          }
          
        case 'roof-cleaning':
        case 'exterior-cleaning':
        case 'deck-patio':
          if (currentSqft < 2000) {
            return currentSqft * 0.55;
          } else if (currentSqft <= 3999) {
            return currentSqft * 0.50;
          } else {
            return currentSqft * 0.45;
          }
          
        case 'solar-panel':
          return currentSolarPanelCount * 15;
          
        case 'gutter-cleaning':
          let pricePerFoot = 1.25;
          if (stories === 2) {
            pricePerFoot = 2.00;
          } else if (stories >= 3) {
            pricePerFoot = 2.50;
          }
          return currentLinearFeet * pricePerFoot;
          
        default:
          return service.basePrice;
      }
    };
    
    // Calculate price for each selected service
    selectedServiceObjects.forEach(service => {
      baseTotal += calculateServicePrice(service, false);
    });

    // Calculate price for each upsell service (with 10% discount)
    upsellServiceObjects.forEach(service => {
      const servicePrice = calculateServicePrice(service, true);
      upsellTotal += servicePrice * 0.9; // 10% discount
    });
    
    const combinedTotal = baseTotal + upsellTotal;
    
    // Multi-service discount (10% for 2+ services)
    const totalServicesCount = formData.selectedServices.length + formData.upsellServices.length;
    const multiServiceDiscount = totalServicesCount >= 2 ? 0.10 : 0;
    const afterMultiServiceDiscount = combinedTotal * (1 - multiServiceDiscount);
    
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
      upsellTotal,
      combinedTotal,
      multiServiceDiscount: combinedTotal * multiServiceDiscount,
      recurringDiscount: afterMultiServiceDiscount * recurringDiscount,
      finalTotal: adjustedFinalTotal,
      priceRangeHigh,
      selectedServices: selectedServiceObjects,
      upsellServices: upsellServiceObjects,
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
        return '$1.25-2.50';
      default:
        return 'Quote';
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      // Track quote step progression
      analytics.trackQuoteStep(currentStep + 1);
      scrollToTop();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
    scrollToTop();
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
        services: [...formData.selectedServices, ...formData.upsellServices],
        propertyType: formData.propertyType,
        ...(formData.squareFootage && { squareFootage: parseInt(formData.squareFootage) }),
        ...(formData.windowCount && { windowCount: parseInt(formData.windowCount) }),
        ...(formData.solarPanelCount && { solarPanelCount: parseInt(formData.solarPanelCount) }),
        ...(formData.linearFeet && { linearFeet: parseInt(formData.linearFeet) }),
        ...(formData.upsellSquareFootage && { upsellSquareFootage: parseInt(formData.upsellSquareFootage) }),
        ...(formData.upsellWindowCount && { upsellWindowCount: parseInt(formData.upsellWindowCount) }),
        ...(formData.upsellSolarPanelCount && { upsellSolarPanelCount: parseInt(formData.upsellSolarPanelCount) }),
        ...(formData.upsellLinearFeet && { upsellLinearFeet: parseInt(formData.upsellLinearFeet) }),
        stories: formData.stories,
        recurringService: formData.recurringService,
        additionalDetails: `${formData.additionalDetails}\n\nQuote Details:\n- Stories: ${formData.stories}\n- Recurring: ${formData.recurringService}\n- Main Services: ${formData.selectedServices.join(', ')}\n- Upsell Services: ${formData.upsellServices.join(', ')}\n- Total: $${pricing.finalTotal.toFixed(2)}`
      };

      // Save quote request to Firebase
      const docId = await saveQuoteRequest(quoteData);
      console.log('Quote request submitted successfully with ID:', docId);

      // Track form submission and conversion
      analytics.trackFormSubmission('quote');
      analytics.trackConversion('quote_request');

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
        linearFeet: '',
        stories: '1',
        propertyType: '',
        additionalDetails: '',
        recurringService: 'none',
        name: '',
        email: '',
        phone: '',
        address: '',
        preferredDate: '',
        preferredTime: '',
        upsellServices: [],
        upsellSquareFootage: '',
        upsellWindowCount: '',
        upsellSolarPanelCount: '',
        upsellLinearFeet: ''
      });
      setCurrentStep(1);

    } catch (error) {
      console.error('Error submitting quote request:', error);
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
                  onClick={() => {
                    setIsSubmitted(false);
                    scrollToTop('smooth');
                  }}
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
                  
                  {/* Linear Feet - Required for gutter cleaning */}
                  {formData.selectedServices.includes('gutter-cleaning') && (
                    <div className="bg-background-card border border-border-primary rounded-xl p-6">
                      <label htmlFor="linearFeet" className="block text-sm font-medium text-text-primary mb-2">
                        Linear Feet of Gutters *
                      </label>
                      <input
                        type="number"
                        id="linearFeet"
                        name="linearFeet"
                        value={formData.linearFeet}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-background-primary border border-border-primary rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-text-primary"
                        placeholder="e.g. 150"
                        min="1"
                        required
                      />
                      <p className="text-sm text-text-secondary mt-2">
                        Total linear feet of gutters around your home
                      </p>
                    </div>
                  )}
                  
                  {/* Square Footage - Required for most services */}
                  {formData.selectedServices.some(service => 
                    ['pressure-washing', 'roof-cleaning', 'exterior-cleaning', 'deck-patio', 'driveway-cleaning'].includes(service)
                  ) && (
                    <div className="bg-background-card border border-border-primary rounded-xl p-6">
                      <label htmlFor="squareFootage" className="block text-sm font-medium text-text-primary mb-2">
                        Square Footage *
                      </label>
                      <input
                        type="number"
                        id="squareFootage"
                        name="squareFootage"
                        value={formData.squareFootage}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-background-primary border border-border-primary rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-text-primary"
                        placeholder="e.g. 2000"
                        min="1"
                        required
                      />
                      <p className="text-sm text-text-secondary mt-2">
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
                          {/* Regular Selected Services */}
                          {pricing.selectedServices.map((service) => (
                            <div key={service.id} className="flex justify-between items-center">
                              <span className="text-text-primary">{service.name}</span>
                              <span className="text-gold-500 font-medium">{getServiceDisplayPrice(service)}</span>
                            </div>
                          ))}
                          
                          {/* Upsell Services */}
                          {pricing.upsellServices.length > 0 && (
                            <>
                              <hr className="border-border-primary my-2" />
                              <div className="text-sm font-medium text-green-400 mb-2">Upsell Services (10% discount applied)</div>
                              {pricing.upsellServices.map((service) => (
                                <div key={`upsell-${service.id}`} className="flex justify-between items-center">
                                  <span className="text-text-primary flex items-center">
                                    {service.name}
                                    <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">10% OFF</span>
                                  </span>
                                  <span className="text-green-400 font-medium">{getServiceDisplayPrice(service)}</span>
                                </div>
                              ))}
                            </>
                          )}
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
                          {pricing.upsellTotal > 0 && (
                            <div className="flex justify-between text-green-400">
                              <span>Upsell Services (10% off)</span>
                              <span>${pricing.upsellTotal.toFixed(2)}</span>
                            </div>
                          )}
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

                      {/* Upsell Opportunities */}
                      {(() => {
                        const upsells = getUpsellOpportunities();
                        return upsells.length > 0 && (
                          <div className="bg-gradient-to-r from-gold-500/10 to-gold-400/10 border border-gold-500/30 rounded-lg p-6">
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-sm">💡</span>
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gold-600">
                                  Complete Your Service Package
                                </h3>
                                <p className="text-sm text-text-secondary">
                                  Add these complementary services and save 10%!
                                </p>
                              </div>
                            </div>

                            {upsells.map((upsell) => (
                              <div key={upsell.bundle} className="mb-6 last:mb-0">
                                <h4 className="font-semibold text-text-primary mb-3">{upsell.name}</h4>
                                <p className="text-sm text-text-secondary mb-4">{upsell.description}</p>
                                
                                <div className="space-y-4">
                                  {upsell.services.map((serviceId) => {
                                    const service = services.find(s => s.id === serviceId);
                                    if (!service) return null;

                                    return (
                                      <div key={serviceId} className="border border-border-primary rounded-lg p-4 bg-background-primary">
                                        <div className="flex items-center justify-between mb-3">
                                          <label className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                              type="checkbox"
                                              checked={formData.upsellServices.includes(serviceId)}
                                              onChange={() => handleUpsellToggle(serviceId)}
                                              className="w-4 h-4 text-gold-500 rounded"
                                            />
                                            <div>
                                              <span className="font-medium text-text-primary">{service.name}</span>
                                              <div className="text-sm text-text-secondary">{service.description}</div>
                                            </div>
                                          </label>
                                          <div className="text-right">
                                            <div className="text-lg font-bold text-green-400">
                                              {getServiceDisplayPrice(service)} <span className="text-sm">(10% off)</span>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Dimension inputs for selected upsell services */}
                                        {formData.upsellServices.includes(serviceId) && (
                                          <div className="border-t border-border-primary pt-3 mt-3">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                              
                                              {/* Square footage for services that need it */}
                                              {['pressure-washing', 'roof-cleaning', 'exterior-cleaning', 'deck-patio', 'driveway-cleaning'].includes(serviceId) && (
                                                <div>
                                                  <label htmlFor={`upsell-sqft-${serviceId}`} className="block text-sm font-medium text-text-primary mb-2">
                                                    Square Footage *
                                                  </label>
                                                  <input
                                                    type="number"
                                                    id={`upsell-sqft-${serviceId}`}
                                                    name="upsellSquareFootage"
                                                    value={formData.upsellSquareFootage}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 bg-background-secondary border border-border-primary rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-text-primary text-sm"
                                                    placeholder="e.g. 2000"
                                                    min="1"
                                                  />
                                                </div>
                                              )}

                                              {/* Window count for window washing */}
                                              {serviceId === 'window-washing' && (
                                                <div>
                                                  <label htmlFor={`upsell-windows-${serviceId}`} className="block text-sm font-medium text-text-primary mb-2">
                                                    Number of Windows *
                                                  </label>
                                                  <input
                                                    type="number"
                                                    id={`upsell-windows-${serviceId}`}
                                                    name="upsellWindowCount"
                                                    value={formData.upsellWindowCount}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 bg-background-secondary border border-border-primary rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-text-primary text-sm"
                                                    placeholder="e.g. 20"
                                                    min="1"
                                                  />
                                                </div>
                                              )}

                                              {/* Solar panel count for solar cleaning */}
                                              {serviceId === 'solar-panel' && (
                                                <div>
                                                  <label htmlFor={`upsell-solar-${serviceId}`} className="block text-sm font-medium text-text-primary mb-2">
                                                    Number of Solar Panels *
                                                  </label>
                                                  <input
                                                    type="number"
                                                    id={`upsell-solar-${serviceId}`}
                                                    name="upsellSolarPanelCount"
                                                    value={formData.upsellSolarPanelCount}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 bg-background-secondary border border-border-primary rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-text-primary text-sm"
                                                    placeholder="e.g. 20"
                                                    min="1"
                                                  />
                                                </div>
                                              )}

                                              {/* Linear feet for gutter cleaning */}
                                              {serviceId === 'gutter-cleaning' && (
                                                <div>
                                                  <label htmlFor={`upsell-gutters-${serviceId}`} className="block text-sm font-medium text-text-primary mb-2">
                                                    Linear Feet of Gutters *
                                                  </label>
                                                  <input
                                                    type="number"
                                                    id={`upsell-gutters-${serviceId}`}
                                                    name="upsellLinearFeet"
                                                    value={formData.upsellLinearFeet}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 bg-background-secondary border border-border-primary rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-text-primary text-sm"
                                                    placeholder="e.g. 150"
                                                    min="1"
                                                  />
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
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