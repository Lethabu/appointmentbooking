import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const { salonName, requestedSlug, customDomain, ownerEmail, ownerPassword } = await request.json();

  // 1. Validate input
  if (!salonName || !requestedSlug || !ownerEmail || !ownerPassword) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  // Basic password strength check
  if (ownerPassword.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
  }

  try {
    // 2. Check for uniqueness of slug and domain
    const { data: existingTenant, error: checkError } = await supabaseAdmin
      .from('tenants')
      .select('slug, custom_domain')
      .or(`slug.eq.${requestedSlug},custom_domain.eq.${customDomain}`)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // Ignore 'PGRST116' (No rows found)
      throw checkError;
    }

    if (existingTenant) {
      return NextResponse.json({ error: 'Slug or custom domain is already in use.' }, { status: 409 });
    }

    // 3. Create the tenant record
    const { data: newTenant, error: createTenantError } = await supabaseAdmin
      .from('tenants')
      .insert({
        name: salonName,
        slug: requestedSlug,
        custom_domain: customDomain,
        status: 'pending',
      })
      .select('id')
      .single();

    if (createTenantError) {
      throw createTenantError;
    }

    // 4. Create the admin user for the new tenant
    // (Note: In a real app, you'd associate this user with the tenant, e.g., in a profiles table)
    const { data: newUser, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email: ownerEmail,
      password: ownerPassword,
      email_confirm: true, // Auto-confirm email for simplicity in this example
    });

    if (createUserError) {
      // If user creation fails, we should roll back the tenant creation
      await supabaseAdmin.from('tenants').delete().eq('id', newTenant.id);
      throw createUserError;
    }

    // 5. Return success response
    return NextResponse.json({
      status: 'success',
      message: 'Tenant and admin user created successfully.',
      tenantId: newTenant.id,
      userId: newUser.user?.id,
      domainSetupInstructions: {
        type: 'CNAME',
        host: 'www',
        value: 'cname.appointmentbooking.co.za', // Replace with your actual CNAME target
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Tenant creation failed:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.', details: error.message }, { status: 500 });
  }
}
