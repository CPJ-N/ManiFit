import 'dotenv/config';

export default {
  expo: {
    name: "ManiFit",
    slug: "ManiFit",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./src/assets/manifit-icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./src/assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.nodemerge.manifit",
      googleServicesFile: process.env.GOOGLE_SERVICE_PLIST,
      infoPlist: {
        UIBackgroundModes: ["fetch", "remote-notification"],
        LSApplicationQueriesSchemes: [
          "googlechrome",
          "firefox",
          "tez",
          "phonepe",
          "paytmmp"
        ]
      }
    },
    android: {
      package: "com.nodemerge.manifit",
      adaptiveIcon: {
        foregroundImage: "./src/assets/manifit-icon.png",
        backgroundColor: "#ffffff"
      },
      googleServicesFile: process.env.GOOGLE_SERVICE_JSON,
    },
    web: {
      favicon: "./src/assets/favicon.png"
    },
    extra: {
      eas: {
        projectId: "fd1c93b1-6025-4f34-8bfc-9def1d9ef589"
      },
      razorpayApiKeyId: process.env.RAZORPAY_API_KEY_ID,
      razorpayApiKeySecret: process.env.RAZORPAY_API_KEY_SECRET,
      razorpayApiUrl: process.env.RAZORPAY_API_URL,
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
      githubExerciseImageUrlPrefix: process.env.GITHUB_EXERCISE_IMAGE_URL_PREFIX,
      githubExercisesUrl: process.env.GITHUB_EXERCISES_URL,
      googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      firebaseIosClientId: process.env.EXPO_PUBLIC_FIREBASE_IOS_CLIENT_ID
    }
  }
};