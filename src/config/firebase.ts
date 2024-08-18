// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"
import { firebaseConfig } from "../constants/firebaseContant";

const firebaseApp = initializeApp(firebaseConfig);
// const firebaseApp = apps.length ? initializeApp(firebaseConfig) : app();
// const apps = getApps();
// const firebaseApp = apps.length ? apps[0] : initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
// initializeAuth(auth, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });

export {auth, db, storage}