# 🔥 Firebase Setup Guide for Elev8 Website

## Overview
This guide will help you set up Firebase for the Elev8 website, including Firestore database, Cloud Functions, email notifications, and Google Calendar integration.

## Prerequisites
- Firebase account (free tier is sufficient)
- Google Cloud Console account
- Gmail account for sending emails
- Node.js 18+ installed

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

## Step 3: Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" → Web app
4. Register your app (name: "Elev8 Website")
5. Copy the configuration object

## Step 4: Set up Google API Key

### **Google Calendar API Setup**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select your existing Firebase project
3. Enable the Google Calendar API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Calendar API"
   - Click "Enable"
4. Create API credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key (this is your `REACT_APP_GOOGLE_API_KEY`)
5. Restrict the API key (recommended):
   - Click on the API key to edit
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domain (e.g., `https://yourdomain.com/*`)
   - Under "API restrictions", select "Restrict key"
   - Choose "Google Calendar API"

### **Google Calendar Setup**

1. Create a dedicated Google Calendar for appointments:
   - Go to [Google Calendar](https://calendar.google.com/)
   - Create a new calendar called "Elev8 Appointments"
   - Get the Calendar ID from calendar settings
2. Make the calendar public (optional) or share with your team
3. Copy the Calendar ID (looks like: `abc123@group.calendar.google.com`)

## Step 5: Set Environment Variables

1. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

2. Fill in your configuration:
```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Google API Configuration
REACT_APP_GOOGLE_API_KEY=AIzaSyBvUgUQN4HhlUUH_1XupZnafUZcETqO9-M
REACT_APP_GOOGLE_CALENDAR_ID=your_calendar_id@group.calendar.google.com
```

## Step 6: Deploy Firestore Rules and Indexes

```bash
# Install dependencies for functions
cd functions
npm install
cd ..

# Deploy Firestore rules and indexes
npx firebase deploy --only firestore:rules,firestore:indexes
```

## Step 7: Set up Email Notifications (Optional)

### Option A: Gmail SMTP (Recommended for testing)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"

3. Set Firebase Functions config:
```bash
npx firebase functions:config:set gmail.email="your-email@gmail.com" gmail.password="your-app-password"
```

### Option B: SendGrid (Recommended for production)

1. Sign up for [SendGrid](https://sendgrid.com/) (free tier: 100 emails/day)
2. Create an API key
3. Set Firebase Functions config:
```bash
npx firebase functions:config:set sendgrid.api_key="your-sendgrid-api-key"
```

## Step 8: Deploy Firebase Functions

```bash
# Deploy functions
npx firebase deploy --only functions
```

## Step 9: Deploy Website to Firebase Hosting (Optional)

```bash
# Build the React app
npm run build

# Deploy to Firebase Hosting
npx firebase deploy --only hosting
```

## Step 10: Test the Setup

1. Start your development server:
```bash
npm start
```

2. Submit a test form on your website
3. Check Firestore console to see if data is saved
4. Check your email for notifications (if configured)
5. Test calendar integration (if configured)

## Google Calendar Integration Features

With the Google API key configured, your website now supports:

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

### **Usage Example**
```typescript
import { getAvailableTimeSlots, createServiceAppointment } from './services/googleCalendar';

// Get available slots for tomorrow
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const slots = await getAvailableTimeSlots(tomorrow.toISOString().split('T')[0]);

// Book an appointment
const appointmentId = await createServiceAppointment(
  'John Doe',
  'john@example.com',
  '(512) 555-0123',
  'Window Washing',
  '2024-01-15T10:00:00.000Z',
  '2024-01-15T11:00:00.000Z',
  '123 Main St, Austin, TX'
);
```

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

### `quotes` Collection
```javascript
{
  name: string,
  email: string,
  phone: string,
  address: string,
  services: string[],
  propertyType: string,
  squareFootage?: number,
  windowCount?: number,
  additionalDetails?: string,
  timestamp: Timestamp,
  status: 'pending' | 'quoted' | 'accepted' | 'completed',
  estimatedPrice?: number,
  followUpDate?: Timestamp
}
```

### `appointments` Collection (New)
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

## Security Notes

- Firestore rules allow public writes but no reads (forms can submit but can't view data)
- Only Firebase Functions can read/modify data
- All sensitive operations happen server-side
- Email credentials are stored securely in Firebase Functions config
- Google API key is restricted to your domain and specific APIs

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
2. Verify Firebase configuration in `.env`
3. Check Firestore rules are deployed

### Emails not sending
1. Verify Gmail app password or SendGrid API key
2. Check Firebase Functions logs: `npx firebase functions:log`
3. Ensure functions are deployed: `npx firebase deploy --only functions`

### Calendar integration not working
1. Verify Google API key is correct and enabled
2. Check that Google Calendar API is enabled in Google Cloud Console
3. Ensure calendar ID is correct
4. Check browser console for API errors

### Build errors
1. Ensure all dependencies are installed: `npm install`
2. Check TypeScript errors in functions: `cd functions && npm run build`
3. Verify environment variables are set correctly

## Support

For additional help:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Calendar API Documentation](https://developers.google.com/calendar)
- [React Firebase Hooks](https://github.com/CSFrequency/react-firebase-hooks)
- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)

---

**Next Steps**: Once Firebase and Google Calendar are set up, you can enhance the website with:
- Real-time appointment booking
- Customer dashboard
- Automated appointment reminders
- Payment processing integration
- Review management system
- Advanced scheduling features 