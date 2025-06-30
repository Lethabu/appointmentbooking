import { NextResponse } from 'next/server';
import { getOrCreateClient, getConversationHistory, saveConversationHistory } from '../../../lib/db';

export async function POST(req: Request) {
  const secret = req.headers.get('X-Webhook-Secret');
  if (secret !== process.env.YOUR_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { phone, message } = await req.json();
  if (!phone || !message) {
    return NextResponse.json({ error: 'Missing phone or message' }, { status: 400 });
  }

  // Get or create client
  const client = await getOrCreateClient(phone);

  // Get conversation history
  let history = await getConversationHistory(phone);
  history += `\nUser: ${message}`;

  // Call your AI agent (pseudo-code)
  let aiResponse = '';
  try {
    // aiResponse = await callSmartAgent({ message, client, history });
    aiResponse = "This is a placeholder AI response.";
  } catch (err) {
    // Optionally send a WhatsApp message here if you have a sendWhatsAppMessage helper
    return NextResponse.json({ error: 'AI error' }, { status: 500 });
  }

  // Save new history
  history += `\nAI: ${aiResponse}`;
  await saveConversationHistory(phone, history);

  // Optionally send WhatsApp reply here
  // await sendWhatsAppMessage(phone, aiResponse);

  return NextResponse.json({ success: true });
}
