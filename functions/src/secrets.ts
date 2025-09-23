import * as functions from 'firebase-functions';

// Define secrets for Firebase Secret Manager
export const secrets = {
  geminiApiKey: functions.params.defineSecret('GEMINI_API_KEY'),
  paystackSecretKey: functions.params.defineSecret('PAYSTACK_SECRET_KEY'),
  whatsappApiToken: functions.params.defineSecret('WHATSAPP_API_TOKEN'),
};
