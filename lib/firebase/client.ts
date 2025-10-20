import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getAnalytics, Analytics } from 'firebase/analytics';

// Best practice: Use environment variables for Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let analytics: Analytics | undefined;

// Initialize Firebase only on client side
function initializeFirebase() {
  if (typeof window === 'undefined') {
    return { app: undefined, auth: undefined, analytics: undefined };
  }

  if (!getApps().length) {
    try {
      // Check if we have the required config
      if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
        console.warn('Firebase configuration incomplete - Firebase features disabled');
        return { app: undefined, auth: undefined, analytics: undefined };
      }

      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      // Initialize Analytics only if measurementId is available
      if (firebaseConfig.measurementId) {
        analytics = getAnalytics(app);
      }
    } catch (error) {
      console.error("Firebase initialization failed:", error);
      return { app: undefined, auth: undefined, analytics: undefined };
    }
  } else {
    app = getApp();
    auth = getAuth(app);
    if (firebaseConfig.measurementId) {
      analytics = getAnalytics(app);
    }
  }

  return { app, auth, analytics };
}

// Initialize on client side only
if (typeof window !== 'undefined') {
  const firebase = initializeFirebase();
  app = firebase.app;
  auth = firebase.auth;
  analytics = firebase.analytics;
}

export { auth, analytics };
export type { Auth };
