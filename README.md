General Descripiton 

In simple terms, this application aims to be the best fitness platform for gym trainers and coaches who need to:

- Provide personalized workouts, meal plans, and supplements guidance  
- Track client subscriptions with monthly payments aligned to their start dates  
- Manage client progress, scheduling, and communication

We are developing a comprehensive fitness application tailored for personal trainers and their trainees. The app's core functionality focuses on creating, managing, and tracking personalized fitness routines and exercises. Trainers will be able to design detailed exercise plans, specifying attributes such as weight, repetitions, sets, and duration. These exercises can be grouped into routines that trainers can assign to their trainees to follow on particular days.

The application provides trainers the ability to add special instructions for each exercise, offering customized guidance to trainees. Trainers can also link to multiple trainees who have no assigned trainer, while trainees can only be linked to a single trainer. This linking functionality ensures that trainers manage their trainees effectively and that trainees receive dedicated guidance.

The backend leverages Firebase for essential services, including user authentication, data storage, and real-time updates, enabling trainees to view their assigned routines, track their progress, and receive notifications about new or updated workouts. The platform aims to streamline the interaction between trainers and trainees, making it easier to set goals, monitor progress, and continuously adapt routines based on performance and feedback, all within a user-friendly mobile application.

## 🎯 MVP Features

### 👨‍💼 **Trainer Side**

#### **Client Management**
- Add/remove clients from trainer dashboard
- View client status (active/inactive)
- Assign personalized workout & meal plans to clients
- Track client progress and engagement

#### **Program Templates**
- Create basic workout plans with exercises, sets, reps, and instructions
- Design basic meal plans with nutritional guidance
- Duplicate existing plans for multiple clients
- Template library for quick program creation

#### **Payment Tracking**
- Set individual client pricing & subscription start dates
- Automated monthly billing aligned to each client's start date
- Payment status dashboard (paid/overdue/failed)
- Revenue tracking and financial reporting

### 👤 **Client Side**

#### **View Plans**
- Daily workout display with exercises and instructions
- Personalized meal plan access
- Mark workouts as completed
- Progress tracking and workout history

#### **AI Food Photo**
- Take photos of meals → automatic calorie recognition
- Daily calorie intake tracking
- Nutritional insights and goal monitoring
- Food diary with photo history

#### **Chat & Communication**
- Direct messaging with assigned trainer
- Push notifications for new messages
- Workout reminders and motivational messages
- Progress updates and feedback sharing

### 🔧 **Admin & Setup**

#### **Sign Up Flow**
- Trainer account creation and verification
- Client invitation system via shareable links
- Secure payment method integration
- Account linking and subscription management

Quick Start

npm install
npm run start

### Post-build (iOS Simulator)

After an EAS build finishes you can download and install the most recent iOS build directly into the Simulator with:

```bash
eas build:run -p ios --latest
```

If you need to pick a specific build from the list instead of automatically pulling the most recent one, just omit the `--latest` flag:

```bash
eas build:run -p ios
```

Fitness App for trainers 

https://www.youtube.com/watch?v=ql4J6SpLXZA
https://firebase.google.com/docs/web/setup#available-libraries

// https://firebase.google.com/docs/web/setup#available-libraries

Overall Code and App Architecture
Project Structure
Root Directory: Contains configuration files like .env, app.json, babel.config.js, tsconfig.json, and package.json.
src/ Directory: Main source code organized into subdirectories for assets, components, configuration, constants, navigation, screens, store, and utilities.
Key Directories and Files
**Root
Files**:

App.tsx: Main entry point. Sets up Redux store, navigation container, and main stack navigator.
package.json: Lists dependencies and scripts.
tsconfig.json: TypeScript configuration.
src/ Directory:
assets/: Static assets like fonts and images.
components/: Reusable UI components (e.g., ExerciseCard, ExerciseForm).
config/: Configuration files, including Firebase setup (firebase.ts).
constants/: Constant values used throughout the app.
navigation/: Navigation setup files (e.g., AuthNavigation.tsx).
screens/: Main screens of the application, organized into subdirectories like AuthScreens and BottomNavScreens.
store/: Redux store setup and slices (reduxStore.ts).
utils/: Utility functions and helpers.
Key Components and Screens
App.tsx:

Sets up Redux provider and navigation container.
Defines main stack navigator with screens for authentication (AuthNavigation) and main app (BottomNavigation).
src/config/firebase.ts:

Initializes Firebase services (auth, Firestore, storage).
src/store/reduxStore.ts:

Configures Redux store with slices like userReducer and workoutReducer.
src/navigation/AuthNavigation.tsx:

Defines stack navigator for authentication-related screens (SignUp, Login, UserDetailsForm).
src/screens/TempHome.tsx:

Temporary home screen with navigation buttons for login and signup.
src/screens/BottomNavScreens/Home.tsx:

Home screen with sections for recommendations, weekly challenges, and articles/tips.
Navigation
React Navigation: Manages navigation between screens.
AuthNavigation: Handles authentication-related screens.
BottomNavigation: Handles main app screens after authentication.
State Management
Redux: Manages state with a centralized store configured in reduxStore.ts.
Firebase Integration
Firebase: Provides backend services for authentication, data storage, and file uploads, configured in firebase.ts.

## Firebase Setup

### 🔐 Security Notice
**IMPORTANT:** The Google API keys were previously exposed in this repository. If you're setting up this project, you MUST rotate the API keys before deploying.

### Required Configuration Files

This project requires Firebase configuration files that are **NOT** included in version control for security reasons:

1. **`google-services.json`** (Android)
2. **`GoogleService-Info.plist`** (iOS)

### How to Get These Files

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com/
   - Select the ManiFit project (or create a new one)

2. **For Android (`google-services.json`):**
   - Go to Project Settings (gear icon) → Your apps
   - Select your Android app or add a new one
   - Download `google-services.json`
   - Place it in **two locations**:
     - `/google-services.json` (project root)
     - `/android/app/google-services.json`

3. **For iOS (`GoogleService-Info.plist`):**
   - Go to Project Settings (gear icon) → Your apps
   - Select your iOS app or add a new one
   - Download `GoogleService-Info.plist`
   - Place it in **two locations**:
     - `/GoogleService-Info.plist` (project root)
     - `/ios/ManiFit/GoogleService-Info.plist`

### Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id

# Google OAuth Client IDs
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_web_client_id
EXPO_PUBLIC_FIREBASE_IOS_CLIENT_ID=your_ios_client_id
EXPO_PUBLIC_FIREBASE_ANDROID_CLIENT_ID=your_android_client_id

# Paths to Google Service files
GOOGLE_SERVICE_JSON=./google-services.json
GOOGLE_SERVICE_PLIST=./GoogleService-Info.plist

# Razorpay (Payment Gateway)
RAZORPAY_API_KEY_ID=your_razorpay_key
RAZORPAY_API_KEY_SECRET=your_razorpay_secret
RAZORPAY_API_URL=your_razorpay_url

# GitHub (Exercise Data)
GITHUB_EXERCISE_IMAGE_URL_PREFIX=your_github_url
GITHUB_EXERCISES_URL=your_exercises_url
```

### Important Security Notes

- **NEVER** commit these files to version control
- **NEVER** share API keys in chat, email, or tickets
- Use API key restrictions in Google Cloud Console
- Rotate keys immediately if they become exposed
- Keep `.env` files out of version control (already in `.gitignore`)

Summary
The app architecture is modular and scalable, with a clear separation of concerns:

Configuration: Centralized in the config directory.
Components: Reusable UI components in the components directory.
Screens: Organized into subdirectories for different parts of the app.
Navigation: Managed using React Navigation.
State Management: Handled using Redux.
Firebase Integration: Provides backend services.
This structure ensures maintainability, scalability, and ease of understanding.

