import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Helper function to get the system prompt for the AI.
// This defines the AI's personality and capabilities for this specific webhook.
const getSystemPrompt = () => {
  return `You are Nia, a friendly and efficient AI assistant for a salon.
You are an expert in booking appointments and answering questions about services.
You are capable of understanding and responding fluently in English, isiZulu, isiXhosa, Afrikaans, and Sesotho.
Always try to respond in the language the user primarily uses.
Be polite and use common South African greetings where appropriate.`;
};

export async function POST(req) {
  // 1. Authenticate the webhook request
  const secret = req.headers.get('X-Webhook-Secret');
  if (secret !== process.env.YOUR_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Validate that all required environment variables are configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey || !openaiApiKey) {
    console.error(
      'Missing required environment variables for WhatsApp webhook.',
    );
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 },
    );
  }

  // 3. Parse the incoming message from the request body
  const { phone, message } = await req.json();
  if (!phone || !message) {
    return NextResponse.json(
      { error: 'Missing phone or message' },
      { status: 400 },
    );
  }

  try {
    // 4. Initialize clients inside the handler to ensure they run at request time
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    const openai = new OpenAI({ apiKey: openaiApiKey });

    // 5. Get or create the client record in the database
    let { data: client } = await supabase
      .from('clients')
      .select('id')
      .eq('phone', phone)
      .single();
    if (!client) {
      const { data: newClient, error: insertError } = await supabase
        .from('clients')
        .insert({ phone })
        .select('id')
        .single();
      if (insertError) throw insertError;
      client = newClient;
    }

    // 6. Retrieve conversation history and append the new message
    const { data: conversation } = await supabase
      .from('conversations')
      .select('history')
      .eq('phone', phone)
      .single();
    let history = conversation?.history || '';
    history += `\nUser: ${message}`;

    // 7. Call the OpenAI API to get a smart response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: getSystemPrompt() },
        {
          role: 'user',
          content: `Current conversation history:\n${history}\n\nNew message: ${message}`,
        },
      ],
    });

    const aiResponse =
      completion.choices[0].message.content ||
      'Sorry, I could not process your request.';

    // 8. Save the updated conversation history
    history += `\nAI: ${aiResponse}`;
    const { error: upsertError } = await supabase
      .from('conversations')
      .upsert({ phone, history, client_id: client.id });
    if (upsertError) throw upsertError;

    // 9. Return a success response (in a real app, you'd use a service to send the `aiResponse` back to WhatsApp)
    return NextResponse.json({ success: true, reply: aiResponse });
  } catch (error) {
    console.error('WhatsApp Webhook Error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'An internal server error occurred.', details: errorMessage },
      { status: 500 },
    );
  }
}
