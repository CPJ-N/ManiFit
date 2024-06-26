// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: API_KEY,
//   authDomain: AUTH_DOMAIN,
//   projectId: PROJECT_ID,
//   storageBucket: STORAGE_BUCKET,
//   messagingSenderId: MESSAGING_SENDER_ID,
//   appId: APP_ID,
//   measurementId: MEASUREMENT_ID
// };

const firebaseConfig = {
  apiKey: "AIzaSyDTETka17EDLRr1BP6L767Bm_blefcvDFk",
  authDomain: "manifit-41d91.firebaseapp.com",
  projectId: "manifit-41d91",
  storageBucket: "manifit-41d91.appspot.com",
  messagingSenderId: "1059490247015",
  appId: "1:1059490247015:web:a1b13f779b6dc3fcf4bfc2",
  measurementId: "G-NGTCFNVX99"
};


const firebaseApp = initializeApp(firebaseConfig);
// const firebaseApp = apps.length ? initializeApp(firebaseConfig) : app();
// const apps = getApps();
// const firebaseApp = apps.length ? apps[0] : initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
// initializeAuth(auth, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });

export {auth, db}