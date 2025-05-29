# Service Account Setup Guide

This guide explains how to set up service accounts for Firebase and Google Calendar integration.

## Architecture Overview

### Frontend (React App)
- **Uses**: Firebase Client SDK with API keys
- **Purpose**: User-facing operations (form submissions, data reading)
- **Authentication**: API keys (stored in environment variables)
- **Security**: API keys are safe for client-side use with proper Firestore rules

### Backend (Firebase Functions)
- **Uses**: Firebase Admin SDK with service accounts + Google Calendar API with service account
- **Purpose**: Server-side operations, email notifications, calendar management
- **Authentication**: Service accounts for both Firebase and Google Calendar
- **Security**: Service accounts have elevated privileges, kept server-side only

## Service Account Configuration

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

### 2. Google Calendar Service Account

#### Step 1: Create Service Account in Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `elev8-website-a155a`
3. Navigate to **IAM & Admin** > **Service Accounts**
4. Click **Create Service Account**
5. Fill in details:
   - **Name**: `elev8-calendar-service`
   - **Description**: `Service account for Google Calendar API access`
6. Click **Create and Continue**
7. Skip role assignment (we'll handle permissions via Calendar sharing)
8. Click **Done**

#### Step 2: Generate Service Account Key
1. Click on the created service account
2. Go to **Keys** tab
3. Click **Add Key** > **Create New Key**
4. Select **JSON** format
5. Download the key file (keep it secure!)

#### Step 3: Enable Google Calendar API
1. In Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Google Calendar API"
3. Click on it and press **Enable**

#### Step 4: Share Calendar with Service Account
1. Open [Google Calendar](https://calendar.google.com/)
2. Find your business calendar
3. Click the three dots next to it > **Settings and sharing**
4. Under **Share with specific people**, click **Add people**
5. Enter the service account email (from the JSON file: `client_email`)
6. Set permission to **Make changes to events**
7. Click **Send**

#### Step 5: Configure Firebase Functions
1. Copy the entire JSON service account key content
2. In Firebase Console, go to **Functions** > **Parameters**
3. Set the following parameters:
   - `GOOGLE_SERVICE_ACCOUNT_KEY`: Paste the entire JSON content
   - `GOOGLE_CALENDAR_ID`: Your calendar ID (usually your email or 'primary')

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
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"elev8-website-a155a","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"elev8-calendar-service@elev8-website-a155a.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
GOOGLE_CALENDAR_ID=primary

# Optional: Custom Firebase Service Account
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}
```

## Security Best Practices

### ✅ Current Secure Implementation
- Frontend uses API keys (appropriate for client-side)
- Backend uses service accounts (appropriate for server-side)
- Service account keys stored as Firebase Function parameters (encrypted)
- Firestore security rules restrict data access
- No sensitive credentials in client-side code
- Google Calendar operations use service account with proper scopes

### ❌ What NOT to Do
- Don't put service account keys in frontend code
- Don't commit service account JSON files to Git
- Don't use API keys for server-side operations
- Don't use service accounts for client-side operations

## Testing Service Account Setup

### 1. Test Firebase Functions Locally
```bash
cd functions
npm run serve
```

### 2. Test Calendar Integration
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

1. **"Service account key not configured"**
   - Ensure `GOOGLE_SERVICE_ACCOUNT_KEY` parameter is set in Firebase Functions
   - Verify the JSON format is valid

2. **"Calendar not found"**
   - Check that the service account email has access to the calendar
   - Verify the `GOOGLE_CALENDAR_ID` parameter

3. **"Permission denied"**
   - Ensure the service account has proper calendar permissions
   - Check that the calendar is shared with the service account email
   - Verify Google Calendar API is enabled in Google Cloud Console

4. **"Invalid credentials"**
   - Regenerate the service account key
   - Ensure the JSON is properly formatted (no extra spaces/characters)
   - Check that the service account has the correct scopes

5. **"API not enabled"**
   - Enable Google Calendar API in Google Cloud Console
   - Wait a few minutes for the API to become active

## Migration Complete

The codebase now uses:
- **Firebase Admin SDK**: Service accounts (secure server-side operations)
- **Google Calendar API**: Service accounts (full functionality and security)
- **Frontend Firebase**: Client SDK with API keys (correct approach)

This provides the most secure and robust authentication setup with full Google Calendar functionality. 