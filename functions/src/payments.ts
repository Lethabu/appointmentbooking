import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { secrets } from './secrets';

export const processPayment = functions
  .runWith({
    secrets: [secrets.paystackSecretKey],
  })
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated',
      );
    }

    const { reference, appointmentId } = data;

    try {
      // Verify payment with Paystack
      const response = await fetch(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${secrets.paystackSecretKey.value()}`,
          },
        },
      );

      const result = await response.json();

      if (result.status && result.data.status === 'success') {
        // Update appointment with payment status
        await admin
          .firestore()
          .collection('appointments')
          .doc(appointmentId)
          .update({
            paymentStatus: 'paid',
            paymentReference: reference,
            paidAt: admin.firestore.FieldValue.serverTimestamp(),
          });

        return {
          success: true,
          message: 'Payment verified and appointment confirmed',
        };
      } else {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'Payment verification failed',
        );
      }
    } catch (error) {
      throw new functions.https.HttpsError(
        'internal',
        'Payment processing failed',
      );
    }
  });
