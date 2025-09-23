import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Set custom claims for tenant isolation
export const setTenantClaims = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated',
    );
  }

  const { tenantId, role = 'user' } = data;

  if (!tenantId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'tenantId is required',
    );
  }

  try {
    await admin.auth().setCustomUserClaims(context.auth.uid, {
      tenantId,
      role,
    });

    return { success: true, message: 'Custom claims set successfully' };
  } catch (error) {
    throw new functions.https.HttpsError(
      'internal',
      'Failed to set custom claims',
    );
  }
});

// Create tenant on user signup
export const createTenant = functions.auth.user().onCreate(async (user) => {
  const tenantId = `tenant_${user.uid}`;

  // Create tenant document
  await admin
    .firestore()
    .collection('tenants')
    .doc(tenantId)
    .set({
      id: tenantId,
      ownerId: user.uid,
      name: user.displayName || 'New Salon',
      email: user.email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'active',
    });

  // Set custom claims
  await admin.auth().setCustomUserClaims(user.uid, {
    tenantId,
    role: 'owner',
  });

  // Create user profile
  await admin.firestore().collection('users').doc(user.uid).set({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    tenantId,
    role: 'owner',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});

// Export Phase 2 functions
export { processPayment } from './payments';
export { aiChat } from './ai-chat';
