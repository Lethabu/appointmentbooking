import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const serviceMapping = {
  'Middle & Side Installation': { price: 300, duration: 60 },
  'Maphondo & Lines Installation': { price: 350, duration: 90 },
  'Hair Treatment': { price: 250, duration: 30 },
  'Gel Maphondo': { price: 350, duration: 60 },
  'Frontal Ponytail': { price: 950, duration: 120 },
  'Makeup Soft Glam': { price: 450, duration: 120 },
};

export async function GET() {
  try {
    // Sync services to database
    const services = Object.entries(serviceMapping).map(([name, config]) => ({
      name,
      price_cents: config.price * 100,
      duration_minutes: config.duration,
      tenant_id: 'instyle',
      category: name.includes('Makeup') ? 'Beauty' : 'Hair',
    }));

    const { data: inserted, error } = await supabase
      .from('services')
      .upsert(services, { onConflict: 'name,tenant_id' })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      message: `Synced ${inserted?.length || 0} services`,
      services: inserted 
    });

  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}