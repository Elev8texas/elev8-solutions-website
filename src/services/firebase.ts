import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

// Debug logging for environment variables
console.log('🔧 Firebase Environment Variables Check:');
console.log('REACT_APP_FIREBASE_PROJECT_ID:', process.env.REACT_APP_FIREBASE_PROJECT_ID);
console.log('REACT_APP_FIREBASE_API_KEY:', process.env.REACT_APP_FIREBASE_API_KEY ? 'Set' : 'Missing');
console.log('REACT_APP_FIREBASE_AUTH_DOMAIN:', process.env.REACT_APP_FIREBASE_AUTH_DOMAIN);

// Firebase configuration with fallback values
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyB3Jbp_rzRStkUGRVG1om_noB_l9dECMGM',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'elev8-website-a155a.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'elev8-website-a155a',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'elev8-website-a155a.firebasestorage.app',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '962598553444',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:962598553444:web:b32d17e628dadcee751c71'
};

console.log('🔥 Initializing Firebase with config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  apiKey: firebaseConfig.apiKey ? 'Set' : 'Missing'
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export { app }; // Export app for use in other services

// Types for form data
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  urgency?: string;
  source?: string;
}

export interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  services: string[];
  propertyType: string;
  squareFootage?: number;
  windowCount?: number;
  solarPanelCount?: number;
  linearFeet?: number;
  stories?: string;
  recurringService?: string;
  additionalDetails?: string;
}

// New types for organized data structure
export interface EmailData {
  email: string;
  source: string;
  timestamp: any;
  status: string;
}

export interface ClientProfileData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  serviceInquired: string;
  source: string;
  timestamp?: any;
  status: string;
  additionalInfo?: any;
}

export interface CommercialFormData {
  businessName: string;
  contactName: string;
  phoneNumber: string;
  businessAddress: string;
}

// Save email only (for popups, newsletter signups, etc.)
export const saveEmail = async (email: string, source: string = 'popup') => {
  try {
    const emailData: EmailData = {
      email,
      source,
      timestamp: Timestamp.now(),
      status: 'new'
    };
    
    const docRef = await addDoc(collection(db, 'Emails'), emailData);
    console.log('Email saved with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving email:', error);
    throw error;
  }
};

// Save full client profile
export const saveClientProfile = async (profileData: ClientProfileData) => {
  try {
    const docRef = await addDoc(collection(db, 'client-profiles'), {
      ...profileData,
      timestamp: Timestamp.now()
    });
    console.log('Client profile saved with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving client profile:', error);
    throw error;
  }
};

// Save contact form data to Firestore (updated to also save client profile)
export const saveContactForm = async (formData: ContactFormData) => {
  console.log('🔥 Starting contact form save...', formData);
  
  try {
    // Check if Firebase is properly initialized
    if (!db) {
      throw new Error('Firebase database not initialized');
    }
    
    console.log('📝 Saving to contacts collection...');
    // Save to original contacts collection for backward compatibility
    const docRef = await addDoc(collection(db, 'contacts'), {
      ...formData,
      timestamp: Timestamp.now(),
      status: 'new',
      source: formData.source || 'website'
    });
    console.log('✅ Contact saved with ID: ', docRef.id);

    console.log('👤 Creating client profile...');
    // Also save to Client Profiles collection (non-blocking - don't fail the main operation)
    const clientProfile: ClientProfileData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      serviceInquired: formData.service,
      source: formData.source || 'contact-form',
      status: 'new',
      additionalInfo: {
        message: formData.message,
        // Only include urgency if it's defined
        ...(formData.urgency && { urgency: formData.urgency })
      }
    };
    
    // Save client profile without blocking the main operation
    saveClientProfile(clientProfile).catch(profileError => {
      console.warn('⚠️ Client profile save failed (main contact still saved):', profileError);
    });
    
    console.log('✅ Contact form submission completed successfully');
    
    return docRef.id;
  } catch (error) {
    console.error('❌ Error saving contact:', error);
    console.error('Error details:', {
      name: (error as any)?.name,
      message: (error as any)?.message,
      code: (error as any)?.code,
      stack: (error as any)?.stack
    });
    throw error;
  }
};

// Save quote request data to Firestore (updated to also save client profile)
export const saveQuoteRequest = async (formData: QuoteFormData) => {
  try {
    // Save to original quotes collection for backward compatibility
    const filteredFormData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      services: formData.services,
      propertyType: formData.propertyType,
      // Only include defined values
      ...(formData.squareFootage !== undefined && formData.squareFootage !== null && { squareFootage: formData.squareFootage }),
      ...(formData.windowCount !== undefined && formData.windowCount !== null && { windowCount: formData.windowCount }),
      ...(formData.solarPanelCount !== undefined && formData.solarPanelCount !== null && { solarPanelCount: formData.solarPanelCount }),
      ...(formData.linearFeet !== undefined && formData.linearFeet !== null && { linearFeet: formData.linearFeet }),
      ...(formData.stories && { stories: formData.stories }),
      ...(formData.recurringService && { recurringService: formData.recurringService }),
      ...(formData.additionalDetails && { additionalDetails: formData.additionalDetails })
    };
    
    const docRef = await addDoc(collection(db, 'quotes'), {
      ...filteredFormData,
      timestamp: Timestamp.now(),
      status: 'pending',
      estimatedPrice: null,
      followUpDate: null
    });
    console.log('Quote request saved with ID: ', docRef.id);

    // Also save to Client Profiles collection
    const clientProfile: ClientProfileData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      serviceInquired: formData.services.join(', '),
      source: 'quote-form',
      status: 'pending',
      additionalInfo: {
        services: formData.services,
        propertyType: formData.propertyType,
        // Only include defined values to avoid Firestore undefined field errors
        ...(formData.squareFootage !== undefined && formData.squareFootage !== null && { squareFootage: formData.squareFootage }),
        ...(formData.windowCount !== undefined && formData.windowCount !== null && { windowCount: formData.windowCount }),
        ...(formData.solarPanelCount !== undefined && formData.solarPanelCount !== null && { solarPanelCount: formData.solarPanelCount }),
        ...(formData.linearFeet !== undefined && formData.linearFeet !== null && { linearFeet: formData.linearFeet }),
        ...(formData.stories && { stories: formData.stories }),
        ...(formData.recurringService && { recurringService: formData.recurringService }),
        ...(formData.additionalDetails && { additionalDetails: formData.additionalDetails })
      }
    };
    
    // Save client profile without blocking the main operation
    saveClientProfile(clientProfile).catch(profileError => {
      console.warn('⚠️ Client profile save failed (main quote still saved):', profileError);
    });

    return docRef.id;
  } catch (error) {
    console.error('Error saving quote request:', error);
    throw error;
  }
};

// Save bundle selection data (updated to also save client profile)
export const saveBundleSelection = async (bundleName: string, customerInfo: any) => {
  try {
    // Save to original collection for backward compatibility
    const docRef = await addDoc(collection(db, 'bundle-selections'), {
      bundleName,
      customerInfo,
      timestamp: Timestamp.now(),
      status: 'new'
    });
    console.log('Bundle selection saved with ID: ', docRef.id);

    // Also save to Client Profiles collection if customer info is provided
    if (customerInfo.email) {
      const clientProfile: ClientProfileData = {
        name: customerInfo.name || 'Bundle Customer',
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: customerInfo.address,
        serviceInquired: bundleName,
        source: 'bundle-selection',
        status: 'new',
        additionalInfo: {
          bundleName,
          // Filter out undefined values from customerInfo
          ...Object.fromEntries(Object.entries(customerInfo).filter(([_, v]) => v !== undefined && v !== null && v !== ''))
        }
      };
      
      // Save client profile without blocking the main operation
      saveClientProfile(clientProfile).catch(profileError => {
        console.warn('⚠️ Client profile save failed (main bundle selection still saved):', profileError);
      });
    }

    return docRef.id;
  } catch (error) {
    console.error('Error saving bundle selection:', error);
    throw error;
  }
};

// Save service booking data (updated to also save client profile)
export const saveServiceBooking = async (serviceName: string, customerInfo: any) => {
  try {
    // Save to original collection for backward compatibility
    const docRef = await addDoc(collection(db, 'service-bookings'), {
      serviceName,
      customerInfo,
      timestamp: Timestamp.now(),
      status: 'new'
    });
    console.log('Service booking saved with ID: ', docRef.id);

    // Also save to Client Profiles collection if customer info is provided
    if (customerInfo.email) {
      const clientProfile: ClientProfileData = {
        name: customerInfo.name || 'Service Customer',
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: customerInfo.address,
        serviceInquired: serviceName,
        source: 'service-booking',
        status: 'new',
        additionalInfo: {
          serviceName,
          // Filter out undefined values from customerInfo
          ...Object.fromEntries(Object.entries(customerInfo).filter(([_, v]) => v !== undefined && v !== null && v !== ''))
        }
      };
      
      // Save client profile without blocking the main operation
      saveClientProfile(clientProfile).catch(profileError => {
        console.warn('⚠️ Client profile save failed (main service booking still saved):', profileError);
      });
    }

    return docRef.id;
  } catch (error) {
    console.error('Error saving service booking:', error);
    throw error;
  }
};

// Save commercial form data to Firestore (also save client profile)
export const saveCommercialForm = async (formData: CommercialFormData) => {
  try {
    // Save to commercial-inquiries collection
    const docRef = await addDoc(collection(db, 'commercial-inquiries'), {
      ...formData,
      timestamp: Timestamp.now(),
      status: 'new',
      source: 'commercial-form'
    });
    console.log('Commercial inquiry saved with ID: ', docRef.id);

    // Also save to Client Profiles collection
    const clientProfile: ClientProfileData = {
      name: formData.contactName,
      email: '', // Commercial form doesn't collect email
      phone: formData.phoneNumber,
      address: formData.businessAddress,
      serviceInquired: 'Commercial Cleaning Services',
      source: 'commercial-form',
      status: 'new',
      additionalInfo: {
        businessName: formData.businessName,
        isCommercial: true
      }
    };
    
    // Save client profile without blocking the main operation
    saveClientProfile(clientProfile).catch(profileError => {
      console.warn('⚠️ Client profile save failed (main commercial inquiry still saved):', profileError);
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving commercial inquiry:', error);
    throw error;
  }
}; 