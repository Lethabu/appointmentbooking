import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, tenantId } = await request.json();
    
    // Proxy to AI service (placeholder for actual AI integration)
    const aiResponse = await fetch(process.env.AI_SERVICE_URL || 'https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: `You are Nia, an AI assistant for ${tenantId} salon. Help with bookings and product questions.` },
          { role: 'user', content: message }
        ]
      })
    });

    const data = await aiResponse.json();
    
    return NextResponse.json({ 
      response: data.choices?.[0]?.message?.content || 'How can I help you today?',
      tenantId 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Chat service unavailable' }, { status: 500 });
  }
}