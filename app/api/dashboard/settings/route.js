export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getSessionAndSalon } from '@/app/lib/api-helpers';

export async function GET() {
  try {
    const { salon, supabase, error: authError } = await getSessionAndSalon();
    if (authError) return authError;
    const { data: settings, error } = await supabase
      .from('settings')
      .select('*')
      .eq('salon_id', salon.id);

    if (error) {
      console.error('Error fetching settings:', error);
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return NextResponse.json(settings);
  } catch (e) {
    console.error('Unhandled error in GET /api/dashboard/settings:', e);
    return new NextResponse(
      JSON.stringify({ error: 'An unexpected error occurred.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}

export async function PUT(req) {
  try {
    const { salon, supabase, error: authError } = await getSessionAndSalon();
    if (authError) return authError;

    const body = await req.json();
    const { data, error } = await supabase
      .from('settings')
      .update(body)
      .eq('salon_id', salon.id)
      .select();

    if (error) {
      console.error('Error updating settings:', error);
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error('Unhandled error in PUT /api/dashboard/settings:', e);
    return new NextResponse(
      JSON.stringify({ error: 'An unexpected error occurred.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
