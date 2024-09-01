// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from "../constants/firebaseConfig";

// Initialize Firebase App
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firestore
const db = getFirestore(firebaseApp);

// Initialize Storage
const storage = getStorage(firebaseApp);

export { auth, db, storage };