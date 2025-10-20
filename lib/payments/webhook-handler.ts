import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase'; // Adjust to your Supabase types
import { verifyPaystackSignature } from './paystack'; // Assume existing verifier
import { verifyStripeSignature } from './stripe'; // Assume existing verifier

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // For server-side RLS bypass if needed
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

interface WebhookPayload {
  event: string;
  data: any;
  tenantId?: string; // For multi-tenant
}

export async function handleBookingWebhook(payload: WebhookPayload, signature?: string, provider?: 'paystack' | 'stripe') {
  const { event, data, tenantId } = payload;

  try {
    // Verify signature based on provider
    if (provider === 'paystack' && signature && !verifyPaystackSignature(payload, signature)) {
      throw new Error('Invalid Paystack signature');
    }
    if (provider === 'stripe' && signature && !verifyStripeSignature(JSON.stringify(payload), signature)) {
      throw new Error('Invalid Stripe signature');
    }

    // RLS: Ensure tenant isolation - all ops filtered by tenantId
    if (!tenantId) {
      throw new Error('Missing tenantId for webhook');
    }

    switch (event) {
      case 'charge.success': // Paystack/Stripe success
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(data, tenantId);
        break;
      case 'charge.failed':
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(data, tenantId);
        break;
      case 'booking.confirmed': // Internal booking event
        await handleBookingConfirmation(data, tenantId);
        break;
      default:
        console.warn(`Unhandled webhook event: ${event}`);
    }

    return { success: true, message: 'Webhook processed' };
  } catch (error) {
    console.error('Webhook processing error:', error);
    // Do not expose details; log to Supabase for audit
    await supabase.from('webhook_logs').insert({
      event: event || 'unknown',
      tenant_id: tenantId,
      payload: data,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      processed_at: new Date().toISOString()
    });
    throw error;
  }
}

async function handlePaymentSuccess(paymentData: any, tenantId: string) {
  const { id: paymentId, amount, reference, customer } = paymentData;

  // Update booking with payment status (RLS enforced)
  const { error } = await supabase
    .from('bookings')
    .update({
      payment_status: 'paid',
      payment_id: paymentId,
      payment_amount: amount / 100, // Convert cents
      updated_at: new Date().toISOString()
    })
    .eq('payment_reference', reference)
    .eq('tenant_id', tenantId); // RLS filter

  if (error) throw error;

  // Trigger agent reminder or email
  await supabase.from('agent_triggers').insert({
    type: 'payment_success',
    tenant_id: tenantId,
    booking_reference: reference,
    data: { paymentId, customer }
  });

  // Update inventory/services if e-commerce
  // e.g., decrement stock via Supabase function
}

async function handlePaymentFailure(paymentData: any, tenantId: string) {
  const { reference, error } = paymentData;

  const { error: updateError } = await supabase
    .from('bookings')
    .update({
      payment_status: 'failed',
      payment_error: error,
      updated_at: new Date().toISOString()
    })
    .eq('payment_reference', reference)
    .eq('tenant_id', tenantId);

  if (updateError) throw updateError;

  // Notify tenant admin via webhook or email
  console.log(`Payment failed for booking ${reference} in tenant ${tenantId}`);
}

async function handleBookingConfirmation(bookingData: any, tenantId: string) {
  const { id: bookingId, customer_email, service_id } = bookingData;

  // Mark slot as booked (realtime update)
  const { error } = await supabase
    .from('availability_slots')
    .update({ status: 'booked' })
    .eq('booking_id', bookingId)
    .eq('tenant_id', tenantId);

  if (error) throw error;

  // Send confirmation email (integrate with Resend or similar)
  // await sendEmail({ to: customer_email, template: 'booking-confirmation', data: bookingData });

  // Trigger Typebot flow for follow-up
  const { typebotOrchestrator } = await import('../typebot-orchestrator');
  await typebotOrchestrator.triggerBookingFlow({
    customerName: bookingData.customer_name,
    customerPhone: bookingData.customer_phone,
    serviceName: bookingData.service_name,
    tenantId,
    appointmentId: bookingId
  });
}

// Usage in API route: app/api/webhooks/booking/route.ts
// export async function POST(request: Request) {
//   const payload = await request.json();
//   const signature = request.headers.get('x-paystack-signature') || request.headers.get('stripe-signature');
//   return handleBookingWebhook(payload, signature, 'paystack');
// }