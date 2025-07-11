import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api/withErrorHandler';
import { appointmentSchema } from '@/lib/validators/appointmentValidator';

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
  const startDate = searchParams.get('start_date');
  const endDate = searchParams.get('end_date');

  if (!salonId) {
    return NextResponse.json({ error: 'Missing salon_id parameter' }, { status: 400 });
  }

  const { authorized, response } = await authorizeUser(supabase, salonId);
  if (!authorized) return response;

  let query = supabase
    .from('appointments')
    .select('id, start_time, client_name, client_phone, status, services(name), staff(name)')
    .eq('salon_id', salonId);

  if (startDate) {
    query = query.gte('start_time', startDate);
  }
  if (endDate) {
    query = query.lte('start_time', endDate);
  }

  const { data: appointments, error } = await query.order('start_time', { ascending: true });

  if (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(appointments);
}

export const POST = withErrorHandler(async (req) => {
  const supabase = await getSupabaseClient();
  const json = await req.json();
  const body = appointmentSchema.parse(json);

  const { authorized, response } = await authorizeUser(supabase, body.salon_id);
  if (!authorized) return response;

  const { data, error } = await supabase
    .from('appointments')
    .insert(body)
    .select()
    .single();

  if (error) {
    console.error('Error creating appointment:', error);
    // The withErrorHandler will catch this and return a 500
    throw error;
  }

  return NextResponse.json(data, { status: 201 });
});

export const PUT = withErrorHandler(async (req) => {
  const supabase = await getSupabaseClient();
  const json = await req.json();
  // For PUT, we'll make all fields optional except the id
  const body = appointmentSchema.partial().extend({ id: z.string().uuid() }).parse(json);
  const { id, ...updateData } = body;

  if (!updateData.salon_id) {
      const { data: existingAppointment } = await supabase.from('appointments').select('salon_id').eq('id', id).single();
      if (!existingAppointment) {
          return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
      }
      updateData.salon_id = existingAppointment.salon_id;
  }

  const { authorized, response } = await authorizeUser(supabase, updateData.salon_id);
  if (!authorized) return response;

  const { data, error } = await supabase
    .from('appointments')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }

  return NextResponse.json(data);
});

export const DELETE = withErrorHandler(async (req) => {
  const supabase = await getSupabaseClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const salonId = searchParams.get('salon_id');

  if (!id || !salonId) {
    return NextResponse.json({ error: 'Missing appointment ID or salon ID' }, { status: 400 });
  }

  const { authorized, response } = await authorizeUser(supabase, salonId);
  if (!authorized) return response;

  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id)
    .eq('salon_id', salonId);

  if (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }

  return new NextResponse(null, { status: 204 });
});
