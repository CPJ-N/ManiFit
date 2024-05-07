// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  MEASUREMENT_ID
 } from '@env'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID
};

// Initialize Firebase

const firebaseApp = initializeApp(firebaseConfig);
// const firebaseApp = apps.length ? initializeApp(firebaseConfig) : app();
// const apps = getApps();
// const firebaseApp = apps.length ? apps[0] : initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
const auth = getAuth();

export {auth}