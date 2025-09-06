import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, tenantId } = await request.json();
    
    // Use Gemini AI
    const aiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY!
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are Nia, an AI assistant for ${tenantId} salon. Help with bookings and product questions.\n\nUser: ${message}`
          }]
        }]
      })
    });

    const data = await aiResponse.json();
    
    return NextResponse.json({ 
      response: data.candidates?.[0]?.content?.parts?.[0]?.text || 'How can I help you today?',
      tenantId 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Chat service unavailable' }, { status: 500 });
  }
}