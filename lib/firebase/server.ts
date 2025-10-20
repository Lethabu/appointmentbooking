import * as admin from 'firebase-admin';

function getFirebaseAdmin() {
  if (admin.apps.length) {
    return admin;
  }

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKey) {
    console.warn('FIREBASE_SERVICE_ACCOUNT_KEY not configured - Firebase features disabled');
    return null;
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(serviceAccountKey);
  } catch (error) {
    console.warn('Invalid FIREBASE_SERVICE_ACCOUNT_KEY format - Firebase features disabled');
    return null;
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    return admin;
  } catch (error) {
    console.warn('Failed to initialize Firebase Admin:', error instanceof Error ? error.message : String(error));
    return null;
  }
}

export const firebaseAdmin = getFirebaseAdmin();
