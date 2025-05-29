# Google Calendar API Setup Guide

This guide explains how to set up Google Calendar integration using the Google Cloud Console API key.

## Architecture Overview

### Frontend (React App)
- **Uses**: Firebase Client SDK with API keys
- **Purpose**: User-facing operations (form submissions, data reading)
- **Authentication**: API keys (stored in environment variables)
- **Security**: API keys are safe for client-side use with proper Firestore rules

### Backend (Firebase Functions)
- **Uses**: Firebase Admin SDK with service accounts + Google Calendar API with API key
- **Purpose**: Server-side operations, email notifications, calendar management
- **Authentication**: Firebase uses service accounts, Google Calendar uses API key
- **Security**: Service accounts for Firebase, API key for Google Calendar

## Configuration Setup

### 1. Firebase Admin SDK (Already Configured)

Firebase Functions automatically use the default service account when deployed. No additional configuration needed unless you want to use a custom service account.

**Current Implementation:**
```typescript
// Default service account (recommended)
admin.initializeApp();

// OR with custom service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountCredentials),
  databaseURL: "https://elev8-website-a155a-default-rtdb.firebaseio.com"
});
```

### 2. Google Calendar API Key Setup

#### Step 1: Enable Google Calendar API in Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `elev8-website-a155a`
3. Navigate to **APIs & Services** > **Library**
4. Search for "Google Calendar API"
5. Click on it and press **Enable**

#### Step 2: Create API Key
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy the generated API key
4. (Optional) Click **Restrict Key** to add restrictions:
   - **Application restrictions**: None (for server-side use)
   - **API restrictions**: Select "Google Calendar API"

#### Step 3: Configure Firebase Functions
1. In Firebase Console, go to **Functions** > **Parameters**
2. Set the following parameters:
   - `GOOGLE_API_KEY`: Your Google Calendar API key
   - `GOOGLE_CALENDAR_ID`: Your calendar ID (usually your email or 'primary')

#### Step 4: Calendar Permissions
Since we're using an API key (not service account), the calendar operations will run with the permissions of the API key. For creating events on your calendar, you'll need to:

1. Make sure the calendar is public for event creation, OR
2. Use OAuth 2.0 flow for more secure access (more complex setup)

**Note**: API key method has limitations - it can read public calendar data but may have restrictions on creating events. For full functionality, consider using OAuth 2.0 or service accounts.

## Environment Variables

### Production (Vercel)
```bash
# Firebase Client SDK (Frontend)
REACT_APP_FIREBASE_API_KEY=AIzaSyB3Jbp_rzRStkUGRVG1om_noB_l9dECMGM
REACT_APP_FIREBASE_AUTH_DOMAIN=elev8-website-a155a.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=elev8-website-a155a
REACT_APP_FIREBASE_STORAGE_BUCKET=elev8-website-a155a.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=962598553444
REACT_APP_FIREBASE_APP_ID=1:962598553444:web:b32d17e628dadcee751c71
```

### Firebase Functions Parameters
```bash
# Email Configuration
GMAIL_EMAIL=contact@elev8texas.com
GMAIL_PASSWORD=your_app_password

# Google Calendar Configuration
GOOGLE_API_KEY=your_google_calendar_api_key_from_cloud_console
GOOGLE_CALENDAR_ID=primary

# Optional: Custom Firebase Service Account
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}
```

## Current Implementation

### ✅ What's Working
- Frontend uses Firebase API keys (appropriate for client-side)
- Backend uses Firebase service accounts (appropriate for server-side)
- Google Calendar uses API key from Google Cloud Console
- All credentials stored securely as Firebase Function parameters

### ⚠️ API Key Limitations
- API keys have limited permissions for calendar operations
- May not be able to create events on private calendars
- Read-only access to public calendar data works well
- For full calendar management, OAuth 2.0 or service accounts are recommended

## Testing Calendar Integration

### 1. Test Firebase Functions Locally
```bash
cd functions
npm run serve
```

### 2. Test Calendar Function
```bash
# Call the calendar function
curl -X POST https://your-region-your-project.cloudfunctions.net/createCalendarEvent \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "customerName": "Test User",
      "customerEmail": "test@example.com",
      "service": "Window Cleaning",
      "startTime": "2024-01-15T10:00:00-06:00",
      "endTime": "2024-01-15T11:00:00-06:00"
    }
  }'
```

## Troubleshooting

### Common Issues

1. **"API key not configured"**
   - Ensure `GOOGLE_API_KEY` parameter is set in Firebase Functions
   - Verify the API key is valid and not restricted

2. **"Calendar API not enabled"**
   - Enable Google Calendar API in Google Cloud Console
   - Wait a few minutes for the API to become active

3. **"Permission denied" when creating events**
   - API keys have limited permissions for calendar operations
   - Consider switching to OAuth 2.0 or service account authentication
   - Ensure the calendar allows public event creation

4. **"Invalid API key"**
   - Regenerate the API key in Google Cloud Console
   - Check that the API key restrictions allow Calendar API access

## Migration Status

The codebase now uses:
- **Firebase Admin SDK**: Service accounts (secure server-side operations)
- **Google Calendar API**: API key from Google Cloud Console (reverted from service account)
- **Frontend Firebase**: Client SDK with API keys (correct approach)

This provides a simpler setup but with some limitations on calendar operations compared to service account authentication. 