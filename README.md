## Firebase Initialization Example

```js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyBgRQnAI4-vz7ZWQobkA2FvbF_Fg2dwmkI",
	authDomain: "appointmentbookings-459617.firebaseapp.com",
	projectId: "appointmentbookings-459617",
	storageBucket: "appointmentbookings-459617.firebasestorage.app",
	messagingSenderId: "676754877412",
	appId: "1:676754877412:web:98602600cd8ff9a7c6f5f1",
	measurementId: "G-CC32G09BYR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
```

# The Platform

A multi-tenant appointment booking SaaS platform built with **Next.js**, **Supabase**, **AWS RDS**, and AI agent integration.

## Structure
- `your-platform-repo`: Core booking platform (frontend + backend).
- `your-platform-agent`: AI agent for automation, reminders, and analytics.

## Deployment
- Main platform: [appointmentbooking.co.za](https://appointmentbooking.co.za)
- Tenant example: [instylehairboutique.co.za](https://www.instylehairboutique.co.za)
