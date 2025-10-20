import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * A singleton for the Firebase Admin SDK.
 *
 * This function ensures that the Firebase Admin SDK is initialized only once,
 * using credentials from the `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable.
 * It handles JSON parsing and provides a single point of access to the admin instance.
 *
 * @returns The initialized Firebase Admin SDK instance.
 */
function getFirebaseAdmin() {
  // Return the existing app if it's already initialized
  if (admin.apps.length > 0) {
    return admin.apps[0] as admin.app.App;
  }

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKey) {
    console.warn('FIREBASE_SERVICE_ACCOUNT_KEY is not set. Firebase Admin SDK is not initialized.');
    return null;
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.warn('Failed to initialize Firebase Admin SDK:', error instanceof Error ? error.message : String(error));
    return null;
  }
}

export const adminApp = getFirebaseAdmin();
export const adminDb = adminApp ? getFirestore(adminApp) : undefined;
