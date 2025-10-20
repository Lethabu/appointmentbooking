import { NextResponse } from 'next/server';
import { getSessionAndSalon } from '@/app/lib/api-helpers';

export async function GET() {
  try {
    const { salon, supabase, error: authError } = await getSessionAndSalon();
    if (authError) return authError;
    const { data: marketing, error } = await supabase
      .from('marketing')
      .select('*')
      .eq('salon_id', salon.id)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching marketing data:', error);
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return NextResponse.json(marketing);
  } catch (e) {
    console.error('Unhandled error in GET /api/dashboard/marketing:', e);
    return new NextResponse(
      JSON.stringify({ error: 'An unexpected error occurred.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}

export async function POST(req) {
  try {
    const { salon, supabase, error: authError } = await getSessionAndSalon();
    if (authError) return authError;

    const body = await req.json();
    const { data, error } = await supabase
      .from('marketing')
      .insert({ ...body, salon_id: salon.id })
      .select()
      .single();

    if (error) {
      console.error('Error creating marketing data:', error);
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    console.error('Unhandled error in POST /api/dashboard/marketing:', e);
    return new NextResponse(
      JSON.stringify({ error: 'An unexpected error occurred.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
