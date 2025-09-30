import { initializeApp } from "firebase/app";
import { getFirestore, Firestore, enableIndexedDbPersistence } from "firebase/firestore";

let firebaseApp: ReturnType<typeof initializeApp> | null = null;
let _firestore: Firestore | null = null;
export let db: Firestore | null = null;

export function getClientFirestore() {
  if (typeof window === "undefined") {
    throw new Error("Firebase client must only be used in browser");
  }
  if (!_firestore) {
    firebaseApp = initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!
    });
  _firestore = getFirestore(firebaseApp);
  db = _firestore;
    // Enable offline persistence
    enableIndexedDbPersistence(_firestore).catch((err) => {
      if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time.
        console.warn('Firestore persistence failed-precondition:', err.message);
      } else if (err.code === 'unimplemented') {
        // The current browser does not support all of the features required to enable persistence
        console.warn('Firestore persistence unimplemented:', err.message);
      } else {
        console.error('Firestore persistence error:', err);
      }
    });
  }
  return _firestore;
}
// ...existing code...

