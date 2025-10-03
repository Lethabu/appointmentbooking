import { NextResponse } from 'next/server';
<<<<<<< HEAD
import { createClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Test database connection
    const { error } = await supabase
      .from('tenants')
      .select('count')
      .limit(1);
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        api: 'operational'
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed'
    }, { status: 503 });
  }
=======

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
>>>>>>> origin/feat/instyle-whitelabel
}