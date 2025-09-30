import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let app;
if (!getApps().length) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/gm, '\n');
    const serviceAccount = {
      projectId: typeof process.env.FIREBASE_PROJECT_ID === 'string' ? process.env.FIREBASE_PROJECT_ID : '',
      privateKey: typeof privateKey === 'string' ? privateKey : '',
      clientEmail: typeof process.env.FIREBASE_CLIENT_EMAIL === 'string' ? process.env.FIREBASE_CLIENT_EMAIL : '',
    };

    if (serviceAccount.projectId && serviceAccount.privateKey && serviceAccount.clientEmail) {
      try {
        app = initializeApp({
          credential: cert(serviceAccount),
        });
        console.log('Firebase Admin SDK initialized successfully');
      } catch (error) {
        console.error('Firebase Admin initialization failed:', error);
        throw error;
      }
    } else {
      console.warn('Missing Firebase service account credentials, falling back to offline mode');
      app = undefined;
    }
} else {
  app = getApps()[0];
}

export const adminDb = app ? getFirestore(app) : undefined;
