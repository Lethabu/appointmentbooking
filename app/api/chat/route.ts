import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

// Placeholder for AiSensy Client
class AiSensyClient {
  private apiKey: string;
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  async sendMessage(to: string, message: string) {
    console.log(`Sending message to ${to}: ${message}`);
    // Mock success response
    return { success: true, messageId: `mock_${Date.now()}` };
  }
}

// Placeholder for a rate limiter
const rateLimiter = {
  check: async (ip: string, limit: number, duration: string) => {
    console.log(`Rate limit check for ${ip}`);
    // Mock success response
    return { success: true };
  }
};

export async function POST(request: NextRequest) {
  const ip = request.ip || '127.0.0.1';

  try {
    const { success } = await rateLimiter.check(ip, 10, '1m'); // 10 requests per minute
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { message, to, tenantId } = await request.json();
    if (!message || !to) {
      return NextResponse.json({ error: 'Message and recipient are required' }, { status: 400 });
    }

    const supabase = createClient();
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('aisensy_api_key')
      .eq('id', tenantId)
      .single();

    if (tenantError || !tenant) {
      return NextResponse.json({ error: 'Invalid tenant or API key not found' }, { status: 401 });
    }

    const aiSensy = new AiSensyClient(tenant.aisensy_api_key);
    const response = await aiSensy.sendMessage(to, message);

    return NextResponse.json({ success: true, data: response });

  } catch (error) {
    console.error('Chat API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: 'Failed to send message', details: errorMessage }, { status: 500 });
  }
}