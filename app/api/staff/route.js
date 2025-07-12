import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

async function getSupabaseClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}

async function authorizeUser(supabase, salonId) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return { authorized: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const { data: salon, error: salonError } = await supabase
    .from('salons')
    .select('id')
    .eq('id', salonId)
    .eq('owner_id', session.user.id)
    .single();

  if (salonError || !salon) {
    console.error('Authorization error:', salonError);
    return { authorized: false, response: NextResponse.json({ error: 'Forbidden: Not salon owner' }, { status: 403 }) };
  }
  return { authorized: true };
}

export async function GET(req) {
  const supabase = await getSupabaseClient();

  const { searchParams } = new URL(req.url);
  const salonId = searchParams.get('salon_id');

  if (!salonId) {
    return NextResponse.json({ error: 'Missing salon_id parameter' }, { status: 400 });
  }

  const { authorized, response } = await authorizeUser(supabase, salonId);
  if (!authorized) return response;

  const { data: staff, error } = await supabase
    .from('staff')
    .select('id, name, email, phone, is_active')
    .eq('salon_id', salonId)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(staff);
}

export async function POST(req) {
  const supabase = await getSupabaseClient();
  const staffData = await req.json();
  const { salon_id, name, email, phone, is_active } = staffData;

  if (!salon_id || !name) {
    return NextResponse.json({ error: 'Missing required staff fields' }, { status: 400 });
  }

  const { authorized, response } = await authorizeUser(supabase, salon_id);
  if (!authorized) return response;

  const { data, error } = await supabase
    .from('staff')
    .insert({
      salon_id,
      name,
      email,
      phone,
      is_active: is_active !== undefined ? is_active : true,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating staff member:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function PUT(req) {
  const supabase = await getSupabaseClient();
  const staffData = await req.json();
  const { id, salon_id, name, email, phone, is_active } = staffData;

  if (!id || !salon_id) {
    return NextResponse.json({ error: 'Missing staff ID or salon ID' }, { status: 400 });
  }

  const { authorized, response } = await authorizeUser(supabase, salon_id);
  if (!authorized) return response;

  const { data, error } = await supabase
    .from('staff')
    .update({
      name,
      email,
      phone,
      is_active,
    })
    .eq('id', id)
    .eq('salon_id', salon_id) // Ensure the staff member belongs to the salon
    .select()
    .single();

  if (error) {
    console.error('Error updating staff member:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(req) {
  const supabase = await getSupabaseClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const salonId = searchParams.get('salon_id');

  if (!id || !salonId) {
    return NextResponse.json({ error: 'Missing staff ID or salon ID' }, { status: 400 });
  }

  const { authorized, response } = await authorizeUser(supabase, salonId);
  if (!authorized) return response;

  const { error } = await supabase
    .from('staff')
    .delete()
    .eq('id', id)
    .eq('salon_id', salonId); // Ensure the staff member belongs to the salon

  if (error) {
    console.error('Error deleting staff member:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Staff member deleted successfully' }, { status: 204 });
}
