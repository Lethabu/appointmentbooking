import { NextResponse } from 'next/server';
import { getSessionAndSalon } from '@/app/lib/api-helpers';

export async function GET(req, { params }) {
  try {
    const { salon, supabase, error: authError } = await getSessionAndSalon();
    if (authError) return authError;

    const { data: marketing, error } = await supabase
      .from('marketing')
      .select('*')
      .eq('id', params.id)
      .eq('salon_id', salon.id)
      .single();

    if (error) {
      console.error('Error fetching marketing data:', error);
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!marketing) {
      return new NextResponse(
        JSON.stringify({ error: 'Marketing data not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return NextResponse.json(marketing);
  } catch (e) {
    console.error('Unhandled error in GET /api/dashboard/marketing/[id]:', e);
    return new NextResponse(
      JSON.stringify({ error: 'An unexpected error occurred.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { salon, supabase, error: authError } = await getSessionAndSalon();
    if (authError) return authError;

    const body = await req.json();
    const { data, error } = await supabase
      .from('marketing')
      .update(body)
      .eq('id', params.id)
      .eq('salon_id', salon.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating marketing data:', error);
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error('Unhandled error in PUT /api/dashboard/marketing/[id]:', e);
    return new NextResponse(
      JSON.stringify({ error: 'An unexpected error occurred.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { salon, supabase, error: authError } = await getSessionAndSalon();
    if (authError) return authError;

    const { error } = await supabase
      .from('marketing')
      .delete()
      .eq('id', params.id)
      .eq('salon_id', salon.id);

    if (error) {
      console.error('Error deleting marketing data:', error);
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new NextResponse(null, { status: 204 });
  } catch (e) {
    console.error(
      'Unhandled error in DELETE /api/dashboard/marketing/[id]:',
      e,
    );
    return new NextResponse(
      JSON.stringify({ error: 'An unexpected error occurred.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
