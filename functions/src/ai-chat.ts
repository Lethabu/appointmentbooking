import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { secrets } from './secrets';

export const aiChat = functions
  .runWith({
    secrets: [secrets.geminiApiKey],
  })
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated',
      );
    }

    const { message, tenantId } = data;

    try {
      // Get tenant context for personalized responses
      const tenantDoc = await admin
        .firestore()
        .collection('tenants')
        .doc(tenantId)
        .get();
      const tenantData = tenantDoc.data();

      const systemPrompt = `You are Nia, an AI assistant for ${tenantData?.name || 'a salon'}. 
    Help customers book appointments, answer questions about services, and provide salon information.
    Keep responses concise and helpful.`;

      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': secrets.geminiApiKey.value(),
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${systemPrompt}\n\nUser: ${message}`,
                  },
                ],
              },
            ],
          }),
        },
      );

      const result = await response.json();
      const aiResponse =
        result.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Sorry, I could not process your request.';

      return { response: aiResponse };
    } catch (error) {
      throw new functions.https.HttpsError('internal', 'AI chat failed');
    }
  });
