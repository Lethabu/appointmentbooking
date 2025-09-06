import { NextResponse } from 'next/server';

export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'InStyle Hair Boutique E-Commerce',
    version: '1.0.0',
    features: {
      ecommerce: true,
      payments: true,
      ai_chat: true,
      whatsapp: true,
      social_sync: true
    }
  };

  return NextResponse.json(health);
}