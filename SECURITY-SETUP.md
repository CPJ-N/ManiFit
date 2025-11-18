# Security Setup Instructions

## ⚠️ CRITICAL: API Key Rotation Required

**The Google API keys for this project were previously exposed in the git repository and MUST be rotated immediately.**

## Step 1: Rotate Exposed API Keys (URGENT)

### For Google Cloud Platform / Firebase:

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Select project: `manifit-41d91`

2. **Restrict or Delete the Exposed Keys:**
   - Navigate to: **APIs & Services > Credentials**
   - Find the exposed API keys:
     - Android: `AIzaSyCvIgjZH72-t_97-SvAoK2tZp3J6mTHPVo`
     - iOS: `AIzaSyDe8xgdG2csKP_Uu-APVWodtxcU1I9MxFo`
   - **Delete these keys** or restrict them heavily if deletion isn't possible

3. **Generate New API Keys:**
   - Create new API keys with appropriate restrictions
   - Add application restrictions (Android/iOS package names)
   - Add API restrictions (only allow necessary APIs)

4. **Download New Configuration Files:**
   - For Android: Download new `google-services.json` from Firebase Console
   - For iOS: Download new `GoogleService-Info.plist` from Firebase Console

## Step 2: Set Up Local Development Environment

### Required Files (NOT in version control):

You need to obtain these files from Firebase Console:

1. **`google-services.json`** - Place in project root AND `android/app/`
2. **`GoogleService-Info.plist`** - Place in project root AND `ios/ManiFit/`

### How to Get These Files:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select the ManiFit project
3. Go to Project Settings (gear icon)
4. Under "Your apps" section:
   - For Android app: Download `google-services.json`
   - For iOS app: Download `GoogleService-Info.plist`

### Template Files:

Template files are provided to show the structure:
- `google-services.json.template`
- `GoogleService-Info.plist.template`

**Copy these templates and fill in your values:**

```bash
# For Android
cp google-services.json.template google-services.json
cp google-services.json android/app/google-services.json

# For iOS
cp GoogleService-Info.plist.template GoogleService-Info.plist
cp GoogleService-Info.plist ios/ManiFit/GoogleService-Info.plist
```

Then edit these files with your actual values from Firebase Console.

## Step 3: Environment Variables

Create a `.env` file in the project root (already gitignored):

```bash
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id

# Google OAuth
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_web_client_id
EXPO_PUBLIC_FIREBASE_IOS_CLIENT_ID=your_ios_client_id
EXPO_PUBLIC_FIREBASE_ANDROID_CLIENT_ID=your_android_client_id

# Google Services (paths to config files)
GOOGLE_SERVICE_JSON=./google-services.json
GOOGLE_SERVICE_PLIST=./GoogleService-Info.plist

# Razorpay (if applicable)
RAZORPAY_API_KEY_ID=your_razorpay_key
RAZORPAY_API_KEY_SECRET=your_razorpay_secret
RAZORPAY_API_URL=your_razorpay_url

# GitHub (for exercises)
GITHUB_EXERCISE_IMAGE_URL_PREFIX=your_github_url
GITHUB_EXERCISES_URL=your_exercises_url
```

## Security Best Practices

### ✅ DO:
- Keep all API keys in environment variables
- Use `.gitignore` to exclude sensitive files
- Restrict API keys to specific applications and APIs
- Rotate keys immediately if exposed
- Use separate Firebase projects for dev/staging/production

### ❌ DON'T:
- Commit API keys or credentials to version control
- Share credentials in chat/email/tickets
- Use the same keys across environments
- Disable or bypass security restrictions

## Files That Should NEVER Be Committed:

```
.env
.env*.local
google-services.json
GoogleService-Info.plist
android/app/google-services.json
ios/ManiFit/GoogleService-Info.plist
*.jks
*.p8
*.p12
*.key
*.pem
```

These are already in `.gitignore` - keep it that way!

## For Team Members:

If you're setting up this project for the first time:

1. Contact the project admin to get access to Firebase Console
2. Download the configuration files yourself (don't ask others to send them)
3. Set up your local `.env` file
4. Never commit these files to git

## Additional Resources:

- [Firebase Security Best Practices](https://firebase.google.com/docs/projects/api-keys#api-keys-for-firebase-are-different)
- [Google Cloud API Key Best Practices](https://cloud.google.com/docs/authentication/api-keys)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
