import { initializeApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { useState, useEffect } from "react";

let firebaseApp: ReturnType<typeof initializeApp> | null = null;
let _firestore: Firestore | null = null;

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
  }
  return _firestore;
}

export function useFirestore() {
  const [firestore, setFirestore] = useState<Firestore | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    try {
      const db = getClientFirestore();
      setFirestore(db);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Firebase initialization failed');
    }
  }, []);
  return { firestore, error };
}
