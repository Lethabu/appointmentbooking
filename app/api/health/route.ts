import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createClient();
    const { error } = await supabase.from('health_check').select('*').limit(1);

    if (error) {
      console.error('Supabase health check failed:', error);
      return NextResponse.json({ status: 'degraded', database: 'error' }, { status: 503 });
    }

    return NextResponse.json({ status: 'ok', database: 'ok' });
  } catch (error) {
    console.error('API health check failed:', error);
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 });
  }
}