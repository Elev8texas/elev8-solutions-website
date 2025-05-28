# 🔥 Firebase Setup Guide for Elev8 Website

## ✅ Current Status

**Environment Variables**: All Firebase and Google API keys are now securely stored in Vercel environment variables.

**Deployment Status**: 
- ✅ Frontend deployed to Vercel
- ✅ Firebase Functions implemented and ready for deployment
- ✅ Firestore rules and indexes configured
- ✅ Google Calendar integration implemented
- ⏳ Firebase Functions deployment pending

## Overview
This guide will help you set up Firebase for the Elev8 website, including Firestore database, Cloud Functions, email notifications, and Google Calendar integration.

## Prerequisites
- Firebase account (free tier is sufficient)
- Google Cloud Console account
- Gmail account for sending emails
- Node.js 18+ installed
- Vercel account with environment variables configured

## Environment Variables Configuration

### ✅ Vercel Environment Variables (Already Configured)

The following environment variables are already set up in your Vercel deployment:

**Frontend Variables (React App):**
```env
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef123456
REACT_APP_GOOGLE_API_KEY=your_google_api_key
REACT_APP_GOOGLE_CALENDAR_ID=your_calendar_id
```

**Backend Variables (Firebase Functions):**
```env
GMAIL_EMAIL=your_gmail_email
GMAIL_PASSWORD=your_app_specific_password
GOOGLE_API_KEY=your_google_api_key
GOOGLE_CALENDAR_ID=your_calendar_id
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name your project (e.g., "elev8-solutions")
4. Enable Google Analytics (optional)
5. Create the project

## Step 2: Enable Firestore Database

1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode"
4. Select a location (choose closest to your users, e.g., us-central for Texas)

## Step 3: Deploy Firestore Rules and Indexes

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not already done)
firebase init

# Deploy Firestore rules and indexes
firebase deploy --only firestore:rules,firestore:indexes
```

## Step 4: Set up Firebase Functions Environment Variables

Since your environment variables are stored in Vercel, you need to configure them for Firebase Functions:

### Method 1: Using Firebase Functions v2 Parameters (Recommended)

```bash
# Set Gmail configuration for email notifications
firebase functions:secrets:set GMAIL_EMAIL
# Enter: your-email@gmail.com

firebase functions:secrets:set GMAIL_PASSWORD
# Enter: your-app-specific-password

# Set Google Calendar API configuration
firebase functions:secrets:set GOOGLE_API_KEY
# Enter: your-google-api-key

firebase functions:secrets:set GOOGLE_CALENDAR_ID
# Enter: your-calendar-id

firebase functions:secrets:set GOOGLE_SERVICE_ACCOUNT_KEY
# Enter: {"type":"service_account",...} (entire JSON)
```

### Method 2: Using Legacy Config (Alternative)

```bash
firebase functions:config:set gmail.email="your-email@gmail.com"
firebase functions:config:set gmail.password="your-app-password"
firebase functions:config:set google.api_key="your-api-key"
firebase functions:config:set google.calendar_id="primary"
firebase functions:config:set google.service_account_key='{"type":"service_account",...}'
```

## Step 5: Deploy Firebase Functions

```bash
# Build and deploy functions
cd functions
npm run build
cd ..
firebase deploy --only functions
```

## Step 6: Test the Complete Setup

1. Your website is already deployed on Vercel with environment variables
2. Submit a test form on your website
3. Check Firestore console to see if data is saved
4. Check your email for notifications (once functions are deployed)
5. Test calendar integration (once functions are deployed)

## Google Calendar Integration Features

With the environment variables configured in Vercel, your website supports:

### **Available Time Slots**
- Automatically fetches busy times from your Google Calendar
- Shows available appointment slots to customers
- Prevents double-booking

### **Automatic Appointment Scheduling**
- Creates calendar events when customers book services
- Sends calendar invitations to customers
- Includes service details and customer information

### **Business Hours Management**
- Monday-Friday: 7:00 AM - 6:00 PM
- Saturday: 8:00 AM - 4:00 PM  
- Sunday: Emergency only

## Firebase Functions Implementation

### Calendar Functions
- `createCalendarEvent`: Creates calendar events and saves appointments to Firestore
- `getAvailableTimeSlots`: Retrieves available time slots for booking
- `updateAppointmentStatus`: Updates appointment status and manages calendar events

### Email Notification Functions
- `sendEmailNotification`: Triggered when new emails are collected
- `sendAppointmentNotification`: Triggered when new appointments are created
- `sendClientProfileNotification`: Triggered when new client profiles are created
- `sendContactNotification`: Triggered when new contacts are submitted
- `sendQuoteNotification`: Triggered when new quotes are requested
- `sendBundleNotification`: Triggered when new bundles are selected

## Firestore Collections Structure

### `contacts` Collection
```javascript
{
  name: string,
  email: string,
  phone: string,
  service: string,
  message: string,
  urgency?: string,
  source: string,
  timestamp: Timestamp,
  status: 'new' | 'contacted' | 'completed',
  emailsSent?: boolean,
  emailsSentAt?: Timestamp
}
```

### `appointments` Collection
```javascript
{
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  service: string,
  startTime: Timestamp,
  endTime: Timestamp,
  address?: string,
  calendarEventId: string,
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled',
  timestamp: Timestamp
}
```

### `Emails` Collection (Organized)
```javascript
{
  email: string,
  source: string,
  status: 'active' | 'unsubscribed',
  timestamp: Timestamp
}
```

### `client-profiles` Collection (Organized)
```javascript
{
  name: string,
  email: string,
  phone?: string,
  address?: string,
  serviceInquired: string,
  source: string,
  status: 'new' | 'contacted' | 'converted',
  timestamp: Timestamp,
  additionalInfo?: object
}
```

## Security Notes

- ✅ Environment variables are securely stored in Vercel
- ✅ Firestore rules allow public writes but no reads (forms can submit but can't view data)
- ✅ Only Firebase Functions can read/modify data
- ✅ All sensitive operations happen server-side
- ✅ Email credentials are stored securely in Firebase Functions config
- ✅ Google API key is restricted to your domain and specific APIs

## Deployment Checklist

### ✅ Completed
- [x] Frontend deployed to Vercel
- [x] Environment variables configured in Vercel
- [x] Firebase project created
- [x] Firestore database enabled
- [x] Firebase Functions implemented
- [x] Firestore rules and indexes configured
- [x] Google Calendar integration implemented

### ⏳ Pending
- [ ] Firebase Functions environment variables configured
- [ ] Firebase Functions deployed
- [ ] Email notifications tested
- [ ] Calendar integration tested

## Next Steps

1. **Configure Firebase Functions Environment Variables**:
   ```bash
   firebase functions:secrets:set GMAIL_EMAIL
   firebase functions:secrets:set GMAIL_PASSWORD
   firebase functions:secrets:set GOOGLE_API_KEY
   firebase functions:secrets:set GOOGLE_CALENDAR_ID
   firebase functions:secrets:set GOOGLE_SERVICE_ACCOUNT_KEY
   ```

2. **Deploy Firebase Functions**:
   ```bash
   firebase deploy --only functions
   ```

3. **Test Complete Integration**:
   - Submit forms on your live website
   - Verify data appears in Firestore
   - Check email notifications
   - Test calendar booking

## Cost Estimation

### Firebase Free Tier
- **Firestore**: 50,000 reads, 20,000 writes, 20,000 deletes per day
- **Cloud Functions**: 2M invocations, 400,000 GB-seconds per month
- **Hosting**: 10 GB storage, 360 MB/day transfer

### Google Calendar API
- **Free tier**: 1,000,000 requests per day
- **Cost**: $0.25 per 1,000 requests after free tier

This should be sufficient for a small to medium business website.

## Troubleshooting

### Forms not submitting
1. Check browser console for errors
2. Verify Firebase configuration in Vercel environment variables
3. Check Firestore rules are deployed

### Functions not working
1. Verify environment variables are set in Firebase Functions
2. Check Firebase Functions logs: `firebase functions:log`
3. Ensure functions are deployed: `firebase deploy --only functions`

### Calendar integration not working
1. Verify Google API key is correct and enabled
2. Check that Google Calendar API is enabled in Google Cloud Console
3. Ensure calendar ID is correct
4. Check browser console for API errors

## Support

For additional help:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Calendar API Documentation](https://developers.google.com/calendar)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)

---

**Current Status**: Your website is deployed on Vercel with all environment variables configured. The final step is deploying Firebase Functions to enable server-side calendar integration and email notifications. 