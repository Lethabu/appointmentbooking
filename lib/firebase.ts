import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyBgRQnAI4-vz7ZWQobkA2FvbF_Fg2dwmkI",
  authDomain: "appointmentbookings-459617.firebaseapp.com",
  projectId: "appointmentbookings-459617",
  storageBucket: "appointmentbookings-459617.firebasestorage.app",
  messagingSenderId: "676754877412",
  appId: "1:676754877412:web:98602600cd8ff9a7c6f5f1",
  measurementId: "G-CC32G09BYR"
};

// Initialize Firebase app if not already initialized
let app: any = null;
let auth: any = null;
let db: any = null;
let functions: any = null;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}
auth = getAuth(app);
db = getFirestore(app);
functions = getFunctions(app);

export { auth, db, functions };
export default app;
