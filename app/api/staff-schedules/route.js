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
  const staffId = searchParams.get('staff_id');

  if (!salonId) {
    return NextResponse.json({ error: 'Missing salon_id parameter' }, { status: 400 });
  }

  const { authorized, response } = await authorizeUser(supabase, salonId);
  if (!authorized) return response;

  let query = supabase
    .from('staff_schedules')
    .select('id, staff_id, day_of_week, start_time, end_time, schedule_type, schedule_date, staff(name)');

  if (staffId) {
    query = query.eq('staff_id', staffId);
  }

  const { data: schedules, error } = await query
    .in('staff_id', supabase.from('staff').select('id').eq('salon_id', salonId))
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Error fetching staff schedules:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(schedules);
}

export async function POST(req) {
  const supabase = await getSupabaseClient();
  const scheduleData = await req.json();
  const { staff_id, day_of_week, start_time, end_time, schedule_type, schedule_date, salon_id } = scheduleData;

  if (!staff_id || !schedule_type || !salon_id) {
    return NextResponse.json({ error: 'Missing required schedule fields' }, { status: 400 });
  }

  const { authorized, response } = await authorizeUser(supabase, salon_id);
  if (!authorized) return response;

  const { data, error } = await supabase
    .from('staff_schedules')
    .insert({
      staff_id,
      day_of_week: schedule_type === 'working_hours' ? day_of_week : null, // Only set for working hours
      start_time: start_time || null,
      end_time: end_time || null,
      schedule_type,
      schedule_date: schedule_type !== 'working_hours' ? schedule_date : null, // Only set for breaks/day_offs
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating staff schedule:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function PUT(req) {
  const supabase = await getSupabaseClient();
  const scheduleData = await req.json();
  const { id, staff_id, day_of_week, start_time, end_time, schedule_type, schedule_date, salon_id } = scheduleData;

  if (!id || !staff_id || !schedule_type || !salon_id) {
    return NextResponse.json({ error: 'Missing required schedule fields' }, { status: 400 });
  }

  const { authorized, response } = await authorizeUser(supabase, salon_id);
  if (!authorized) return response;

  const { data, error } = await supabase
    .from('staff_schedules')
    .update({
      staff_id,
      day_of_week: schedule_type === 'working_hours' ? day_of_week : null,
      start_time: start_time || null,
      end_time: end_time || null,
      schedule_type,
      schedule_date: schedule_type !== 'working_hours' ? schedule_date : null,
    })
    .eq('id', id)
    .in('staff_id', supabase.from('staff').select('id').eq('salon_id', salon_id)) // Ensure schedule belongs to salon's staff
    .select()
    .single();

  if (error) {
    console.error('Error updating staff schedule:', error);
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
    return NextResponse.json({ error: 'Missing schedule ID or salon ID' }, { status: 400 });
  }

  const { authorized, response } = await authorizeUser(supabase, salonId);
  if (!authorized) return response;

  const { error } = await supabase
    .from('staff_schedules')
    .delete()
    .eq('id', id)
    .in('staff_id', supabase.from('staff').select('id').eq('salon_id', salonId)); // Ensure schedule belongs to salon's staff

  if (error) {
    console.error('Error deleting staff schedule:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Staff schedule deleted successfully' }, { status: 204 });
}
