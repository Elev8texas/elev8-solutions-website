// Simple Firebase connection test
// Run this in the browser console to test Firebase connectivity

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

// Test Firebase configuration
const testFirebaseConnection = async () => {
  console.log('🔥 Testing Firebase Connection...');
  
  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('REACT_APP_FIREBASE_API_KEY:', process.env.REACT_APP_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing');
  console.log('REACT_APP_FIREBASE_AUTH_DOMAIN:', process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing');
  console.log('REACT_APP_FIREBASE_PROJECT_ID:', process.env.REACT_APP_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing');
  console.log('REACT_APP_FIREBASE_STORAGE_BUCKET:', process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing');
  console.log('REACT_APP_FIREBASE_MESSAGING_SENDER_ID:', process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Missing');
  console.log('REACT_APP_FIREBASE_APP_ID:', process.env.REACT_APP_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing');
  
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
  };
  
  console.log('🔧 Firebase Config:', firebaseConfig);
  
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log('✅ Firebase initialized successfully');
    
    // Test writing to Firestore
    console.log('📝 Testing Firestore write...');
    const testData = {
      test: true,
      timestamp: Timestamp.now(),
      message: 'Firebase connection test'
    };
    
    const docRef = await addDoc(collection(db, 'contacts'), testData);
    console.log('✅ Test document written with ID:', docRef.id);
    
    return true;
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    console.error('Error details:', error.message);
    return false;
  }
};

// Export for use in browser console
window.testFirebaseConnection = testFirebaseConnection;

console.log('🧪 Firebase test loaded. Run testFirebaseConnection() in console to test.'); 