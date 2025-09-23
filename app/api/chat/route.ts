import { NextRequest, NextResponse } from 'next/server';
import { getRateLimit } from '@/lib/rate-limit';
import { AiSensyClient } from '@/lib/aisensy';

export async function POST(request: NextRequest) {
  // Rate limiting (10 req/min per IP)
  const identifier = request.headers.get('x-forwarded-for') ?? 'anonymous';
  const rateLimit = getRateLimit();
  const { success } = await rateLimit.limit(identifier);

  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { messages, agentId, to } = await request.json();

  if (!agentId) {
    return NextResponse.json(
      { error: 'Agent ID is required' },
      { status: 400 },
    );
  }

  if (!to) {
    return NextResponse.json(
      { error: 'Recipient phone number is required' },
      { status: 400 },
    );
  }

  const ai = new AiSensyClient();
  // Assuming the last message is the one to be sent
  const lastMessage = messages[messages.length - 1]?.content;

  if (!lastMessage) {
    return NextResponse.json(
      { error: 'Message content is empty' },
      { status: 400 },
    );
  }

  const response = await ai.sendMessage(to, lastMessage);

  return NextResponse.json({ response });
}
