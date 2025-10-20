export const dynamic = 'force-dynamic';
// 2. API ROUTES FIXES

// app/api/dashboard/services/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const salonId =
      searchParams.get('salon_id') || 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';

    console.log(`Fetching services for salon: ${salonId}`);

    const { data: services, error } = await supabase
      .from('services')
      .select(
        `
        id,
        name,
        description,
        duration_minutes,
        price_cents,
        category,
        is_active,
        created_at
      `,
      )
      .eq('salon_id', salonId)
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        {
          error: 'Failed to fetch services',
          details: error.message,
          services: [],
        },
        { status: 500 },
      );
    }

    console.log(`Found ${services?.length || 0} services`);

    return NextResponse.json({
      success: true,
      services: services || [],
      count: services?.length || 0,
    });
  } catch (error) {
    console.error('Unexpected error in services API:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        services: [],
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
