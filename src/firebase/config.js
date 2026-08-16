import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC9yCj3imJaXpiHqGPdheQvfexjokRoGmE", // a mock api key
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "habit-rescue.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "habit-rescue",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "habit-rescue.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "937297860548",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:937297860548:web:735924ac3dc4dcd4977691",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-LCJ2YK95CD"
};

export const isFirebaseConfigured = true;

let app = null;
let auth = null;
let db = null;
let googleProvider = null;
let analytics = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();

  // Safely initialize analytics in browser environment
  if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    }).catch(() => { });
  }
} catch (error) {
  console.warn("Firebase initialization notice:", error.message);
}

export { app, auth, db, googleProvider, analytics };
