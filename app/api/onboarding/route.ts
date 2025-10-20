import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export async function POST(req: NextRequest) {
  const { salonName, ownerId } = await req.json();

  if (!salonName || !ownerId) {
    return new NextResponse('Missing salonName or ownerId', { status: 400 });
  }

  const { data, error } = await supabase
    .from('salons')
    .insert([{ name: salonName, owner_id: ownerId }])
    .select();

  if (error) {
    console.error('Error creating salon:', error);
    return new NextResponse('Error creating salon', { status: 500 });
  }

  return NextResponse.json(data);
}
