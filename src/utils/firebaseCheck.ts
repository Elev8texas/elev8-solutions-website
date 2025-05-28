// Utility to check Firebase configuration
export const checkFirebaseConfig = () => {
  const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
  };

  const missing = Object.entries(config)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  console.log('🔥 Firebase Configuration Check:');
  console.log('✅ Configured:', Object.keys(config).filter(key => config[key as keyof typeof config]));
  console.log('❌ Missing:', missing);
  
  if (missing.length > 0) {
    console.error('❌ Firebase configuration incomplete. Missing environment variables:', missing);
    return false;
  }
  
  console.log('✅ Firebase configuration complete');
  return true;
};

// Log Firebase config on import
checkFirebaseConfig(); 