import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

// Placeholder for AISensy library
const aisensy = {
  sendWhatsAppMessage: async (to: string, message: string) => {
    console.log(`Sending WhatsApp message to ${to}: ${message}`);
    return { success: true };
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Ozow webhook received:', body);

    // Example: Process a successful payment event
    if (body.Status === 'Complete') {
      const supabase = createClient();
      const { error } = await supabase.from('orders').update({ status: 'paid' }).eq('payment_reference', body.TransactionId);

      if (error) {
        throw new Error(`Ozow webhook DB update failed: ${error.message}`);
      }

      // Optional: Send a confirmation message
      const customerPhone = body.Optional2; // Assuming phone is passed in an optional field
      if (customerPhone) {
        await aisensy.sendWhatsAppMessage(customerPhone, 'Thank you for your order! It has been confirmed.');
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Ozow webhook error:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
