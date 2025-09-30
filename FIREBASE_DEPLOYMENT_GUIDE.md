# Firebase Migration & Deployment Guide

## Phase 1: Security & Stability - Verification Steps

### 1. Install Firebase CLI and Dependencies
```bash
npm install -g firebase-tools
npm install firebase firebase-admin firebase-functions
cd functions && npm install
```

### 2. Initialize Firebase Project
```bash
firebase login
firebase init
# Select: Firestore, Functions, Hosting
# Choose existing project or create new one
```

### 3. Set Firebase Secrets
```bash
firebase functions:secrets:set GEMINI_API_KEY
firebase functions:secrets:set PAYSTACK_SECRET_KEY  
firebase functions:secrets:set WHATSAPP_API_TOKEN
```

### 4. Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### 5. Deploy Functions
```bash
cd functions
npm run build
firebase deploy --only functions
```

### 6. Test Security Rules
```javascript
// Test in Firebase Console Rules Playground
// User with tenantId: "tenant_123"
// Document path: /appointments/doc1
// Document data: { tenantId: "tenant_123", clientName: "John" }
// Should ALLOW read/write

// User with tenantId: "tenant_456" 
// Same document
// Should DENY read/write
```

### 7. Verify Custom Claims
```javascript
// In browser console after authentication:
firebase.auth().currentUser.getIdTokenResult()
  .then(result => console.log(result.claims));
// Should show: { tenantId: "tenant_xxx", role: "owner" }
```

## Common Errors & Fixes

### Error: "Permission denied" on Firestore
**Fix**: Ensure user has custom claims set with correct tenantId

### Error: "Function not found"
**Fix**: Deploy functions first: `firebase deploy --only functions`

### Error: "Secret not found"
**Fix**: Set secrets: `firebase functions:secrets:set SECRET_NAME`

## Phase 2: Tenant-Specific Features - Verification Steps

### 1. Deploy Updated Functions
```bash
cd functions
npm run build
firebase deploy --only functions
```

### 2. Test Payment Processing
```javascript
// Test in browser console
const processPayment = firebase.functions().httpsCallable('processPayment');
processPayment({ reference: 'test_ref_123', appointmentId: 'appointment_id' })
  .then(result => console.log(result));
```

### 3. Test Real-time Dashboard
```javascript
// Should automatically update when appointments change
// Add test appointment in Firestore Console
// Verify dashboard updates in real-time
```

### 4. Test AI Chat
```javascript
// Test in browser console
const aiChat = firebase.functions().httpsCallable('aiChat');
aiChat({ message: 'What services do you offer?', tenantId: 'tenant_123' })
  .then(result => console.log(result.data.response));
```

### 5. Add Paystack Script to HTML
```html
<!-- Add to app/layout.tsx or _document.tsx -->
<script src="https://js.paystack.co/v1/inline.js"></script>
```

## Production Deployment
```bash
# Build and deploy everything
npm run build
firebase deploy
```