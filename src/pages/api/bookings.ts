// src/pages/api/bookings.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { computeEndTime, isConflict } from '../../lib/scheduling';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.error('Missing SUPABASE env on server');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

type Body = {
  tenant_id: string;
  service_id: string;
  staff_id: string | null;
  start_time: string; // ISO
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  payment_required?: boolean;
  metadata?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body: Body = req.body;
  try {
    // Basic validation
    const { tenant_id, service_id, staff_id, start_time } = body;
    if (!tenant_id || !service_id || !start_time) return res.status(400).json({ error: 'Missing required fields' });

    // Fetch service duration
    const { data: service, error: sErr } = await supabase
      .from('services')
      .select('id, duration_minutes, tenant_id')
      .eq('id', service_id)
      .single();

    if (sErr || !service) return res.status(400).json({ error: 'Invalid service' });
    if (service.tenant_id !== tenant_id) return res.status(400).json({ error: 'Service does not belong to tenant' });

    const duration = service.duration_minutes || 30;
    const end_time = computeEndTime(start_time, duration).toISOString();

    // Check staff availability if staff_id provided
    if (staff_id) {
      const { data: existing, error: qErr } = await supabase
        .from('bookings')
        .select('start_time,end_time')
        .eq('tenant_id', tenant_id)
        .eq('staff_id', staff_id)
        .gte('end_time', start_time)
        .lte('start_time', end_time)
        .limit(50);

      if (qErr) {
        console.error('DB query error', qErr);
        return res.status(500).json({ error: 'DB error' });
      }
      const windows = (existing || []).map((b: any) => ({ start: b.start_time, end: b.end_time }));
      if (isConflict(windows, start_time, end_time)) {
        return res.status(409).json({ error: 'Staff not available at requested time' });
      }
    }

    // Insert booking
    const { data: inserted, error: insertErr } = await supabase.from('bookings').insert({
      tenant_id,
      service_id,
      staff_id,
      customer_name: body.customer_name || null,
      customer_email: body.customer_email || null,
      customer_phone: body.customer_phone || null,
      start_time,
      end_time,
      status: body.payment_required ? 'pending_payment' : 'confirmed',
      metadata: body.metadata || {}
    }).select().single();

    if (insertErr) {
      console.error('Insert booking error', insertErr);
      return res.status(500).json({ error: 'Insert failed' });
    }

    return res.status(201).json({ booking: inserted });

  } catch (err) {
    console.error('booking API error', err);
    return res.status(500).json({ error: 'Server error' });
  }
}