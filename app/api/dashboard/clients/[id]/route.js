import { NextResponse } from 'next/server';
import { getSessionAndSalon } from '@/app/lib/api-helpers';

export async function GET(req, { params }) {
  try {
    const { salon, supabase, error: authError } = await getSessionAndSalon();
    if (authError) return authError;

    const { data: client, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', params.id)
      .eq('salon_id', salon.id)
      .single();

    if (error) {
      console.error('Error fetching client:', error);
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!client) {
      return new NextResponse(JSON.stringify({ error: 'Client not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return NextResponse.json(client);
  } catch (e) {
    console.error('Unhandled error in GET /api/dashboard/clients/[id]:', e);
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
      .from('clients')
      .update(body)
      .eq('id', params.id)
      .eq('salon_id', salon.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating client:', error);
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error('Unhandled error in PUT /api/dashboard/clients/[id]:', e);
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
      .from('clients')
      .delete()
      .eq('id', params.id)
      .eq('salon_id', salon.id);

    if (error) {
      console.error('Error deleting client:', error);
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new NextResponse(null, { status: 204 });
  } catch (e) {
    console.error('Unhandled error in DELETE /api/dashboard/clients/[id]:', e);
    return new NextResponse(
      JSON.stringify({ error: 'An unexpected error occurred.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
