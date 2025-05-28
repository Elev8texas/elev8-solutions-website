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

// Save contact form data to Firestore
export const saveContactForm = async (formData: ContactFormData) => {
  try {
    const docRef = await addDoc(collection(db, 'contacts'), {
      ...formData,
      timestamp: Timestamp.now(),
      status: 'new',
      source: formData.source || 'website'
    });
    console.log('Contact saved with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving contact:', error);
    throw error;
  }
};

// Save quote request data to Firestore
export const saveQuoteRequest = async (formData: QuoteFormData) => {
  try {
    const docRef = await addDoc(collection(db, 'quotes'), {
      ...formData,
      timestamp: Timestamp.now(),
      status: 'pending',
      estimatedPrice: null,
      followUpDate: null
    });
    console.log('Quote request saved with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving quote request:', error);
    throw error;
  }
};

// Save bundle selection data
export const saveBundleSelection = async (bundleName: string, customerInfo: any) => {
  try {
    const docRef = await addDoc(collection(db, 'bundle-selections'), {
      bundleName,
      customerInfo,
      timestamp: Timestamp.now(),
      status: 'new'
    });
    console.log('Bundle selection saved with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving bundle selection:', error);
    throw error;
  }
};

// Save service booking data
export const saveServiceBooking = async (serviceName: string, customerInfo: any) => {
  try {
    const docRef = await addDoc(collection(db, 'service-bookings'), {
      serviceName,
      customerInfo,
      timestamp: Timestamp.now(),
      status: 'new'
    });
    console.log('Service booking saved with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving service booking:', error);
    throw error;
  }
};

export default app; 