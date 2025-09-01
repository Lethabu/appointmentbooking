import axios from 'axios';

const AISENSY_BASE_URL = 'https://backend.aisensy.com/campaign/t1/api/v2';

export async function sendWhatsAppMessage(phone: string, templateName: string, params: unknown[] = []) {
  try {
    const response = await axios.post(
      `${AISENSY_BASE_URL}/campaigns/send`,
      {
        projectID: process.env.AISENSY_PROJECT_ID,
        campaignName: templateName,
        destination: phone,
        templateParams: params
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AISENSY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as { response?: { data?: unknown }; message?: string };
    console.error('AiSensy API error:', error.response?.data || error.message);
    throw new Error('Failed to send WhatsApp message');
  }
}
