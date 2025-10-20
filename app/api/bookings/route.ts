// ============================================================================
// SECURITY FIX #3: Secure API Route Template (Next.js App Router)
// File: app/api/bookings/route.ts
// Spec: OWASP A01, A02, A03 Compliant
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { getRateLimit } from '@/lib/rate-limit';
import { getTenantContext } from '@/lib/supabase-server';

// ========================================================================
// Rate Limiting (In-memory fallback)
// ========================================================================
const ratelimit = getRateLimit();

// ========================================================================
// Input Validation Schema (Prevents Injection)
// ========================================================================
const BookingQuerySchema = z.object({
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});

const CreateBookingSchema = z.object({
  service_id: z.string().uuid(),
  scheduled_time: z.string().datetime(),
  notes: z.string().max(500).optional(),
});

// ========================================================================
// GET Handler - Fetch Bookings
// ========================================================================
export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const ip = request.ip ?? 'anonymous';
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests, please try again later.' },
        { status: 429 }
      );
    }

    // ======================================================================
    // Authentication & Authorization
    // ======================================================================
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract tenant context
    const tenantContext = getTenantContext(request.headers);
    const tenantId = tenantContext.tenantId;

    // Verify user belongs to this tenant
    const userTenantId = session.user.user_metadata?.tenant_id;
    if (userTenantId !== tenantId) {
      console.error('[SECURITY VIOLATION] Tenant access violation detected');
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // ======================================================================
    // Validate Query Parameters
    // ======================================================================
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams);

    const validation = BookingQuerySchema.safeParse(searchParams);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid query parameters',
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { start_date, end_date, status, limit, offset } = validation.data;

    // ======================================================================
    // Build Query with Tenant Isolation
    // ======================================================================
    let query = supabase
      .from('appointments')
      .select('*, services(name, duration_minutes, price), profiles(full_name)')
      .eq('tenant_id', tenantId) // CRITICAL: Tenant isolation
      .eq('user_id', session.user.id) // Users can only see their own bookings
      .order('scheduled_time', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply optional filters
    if (start_date) {
      query = query.gte('scheduled_time', start_date);
    }
    if (end_date) {
      query = query.lte('scheduled_time', end_date);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('[DB ERROR] Query failed');
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    return NextResponse.json({
      data,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit,
      },
    });

  } catch (error: any) {
    console.error('[API ERROR]', error);

    // Never expose internal errors to clients
    return NextResponse.json(
      {
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// ========================================================================
// POST Handler - Create Booking
// ========================================================================
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const ip = request.ip ?? 'anonymous';
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests, please try again later.' },
        { status: 429 }
      );
    }

    // ======================================================================
    // Authentication & Authorization
    // ======================================================================
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract tenant context
    const tenantContext = getTenantContext(request.headers);
    const tenantId = tenantContext.tenantId;

    // Verify user belongs to this tenant
    const userTenantId = session.user.user_metadata?.tenant_id;
    if (userTenantId !== tenantId) {
      console.error('[SECURITY VIOLATION] Tenant access violation detected');
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // ======================================================================
    // Validate Request Body
    // ======================================================================
    const body = await request.json();
    const validation = CreateBookingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid request body',
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { service_id, scheduled_time, notes } = validation.data;

    // ======================================================================
    // Verify Service Belongs to Tenant
    // ======================================================================
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('id')
      .eq('id', service_id)
      .eq('tenant_id', tenantId)
      .single();

    if (serviceError || !service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // ======================================================================
    // Create Booking with Tenant Isolation
    // ======================================================================
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        user_id: session.user.id,
        service_id,
        scheduled_time,
        notes,
        tenant_id: tenantId, // CRITICAL: Tenant isolation
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('[DB ERROR] Booking creation failed');
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });

  } catch (error: any) {
    console.error('[API ERROR]', error);

    // Never expose internal errors to clients
    return NextResponse.json(
      {
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}