import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

// Firebase configuration - Replace with your actual config
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

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
  try {
    // Save to original contacts collection for backward compatibility
    const docRef = await addDoc(collection(db, 'contacts'), {
      ...formData,
      timestamp: Timestamp.now(),
      status: 'new',
      source: formData.source || 'website'
    });
    console.log('Contact saved with ID: ', docRef.id);

    // Also save to Client Profiles collection
    const clientProfile: ClientProfileData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      serviceInquired: formData.service,
      source: formData.source || 'contact-form',
      status: 'new',
      additionalInfo: {
        message: formData.message,
        urgency: formData.urgency
      }
    };
    
    await saveClientProfile(clientProfile);
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving contact:', error);
    throw error;
  }
};

// Save quote request data to Firestore (updated to also save client profile)
export const saveQuoteRequest = async (formData: QuoteFormData) => {
  try {
    // Save to original quotes collection for backward compatibility
    const docRef = await addDoc(collection(db, 'quotes'), {
      ...formData,
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
        squareFootage: formData.squareFootage,
        windowCount: formData.windowCount,
        additionalDetails: formData.additionalDetails
      }
    };
    
    await saveClientProfile(clientProfile);

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
          ...customerInfo
        }
      };
      
      await saveClientProfile(clientProfile);
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
          ...customerInfo
        }
      };
      
      await saveClientProfile(clientProfile);
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
    
    await saveClientProfile(clientProfile);
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving commercial inquiry:', error);
    throw error;
  }
};

export default app; 