import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    // Fetch existing bookings from SuperSaaS
    const response = await fetch(
      `https://www.supersaas.com/api/bookings.json?api_key=${process.env.SUPERSAAS_API_KEY}&from=2024-01-01`,
      { headers: { Accept: 'application/json' } }
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'SuperSaaS API error' }, { status: 500 });
    }

    const { bookings } = await response.json();
    
    // Migrate bookings to our system
    const migratedBookings = bookings?.map((booking: any) => ({
      supersaas_id: booking.id,
      client_name: booking.full_name || booking.name,
      client_phone: booking.phone,
      client_email: booking.email,
      service_name: booking.resource_name || 'Hair Service',
      scheduled_time: booking.start,
      status: booking.status === 'confirmed' ? 'confirmed' : 'pending',
      tenant_id: 'instyle',
      notes: booking.description,
      created_at: booking.created_on,
    })) || [];

    if (migratedBookings.length > 0) {
      const { data, error } = await supabase
        .from('appointments')
        .upsert(migratedBookings, { onConflict: 'supersaas_id' })
        .select();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ 
        message: `Migrated ${data?.length || 0} bookings from SuperSaaS`,
        bookings: data 
      });
    }

    return NextResponse.json({ message: 'No bookings to migrate' });

  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Migration failed' 
    }, { status: 500 });
  }
}