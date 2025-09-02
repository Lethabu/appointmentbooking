import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const { tenantId, tier, paid } = await request.json();
    
    // Generate a unique slug
    const slug = `salon-${Date.now()}`;
    
    // Create tenant in Convex
    const newTenantId = await convex.mutation(api.tenants.create, {
      name: `Salon ${Date.now()}`,
      slug,
      paystackKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY!,
      tier,
    });
    
    // Update tier if paid
    if (paid) {
      await convex.mutation(api.tenants.updateTier, {
        tenantId: newTenantId,
        tier,
        paid: true,
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      tenantId: newTenantId,
      slug 
    });
    
  } catch (error) {
    console.error('Tenant creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create tenant' },
      { status: 500 }
    );
  }
}