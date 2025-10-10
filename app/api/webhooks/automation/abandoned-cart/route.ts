import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { tenantId, clientPhone, cartItems } = await request.json();

    console.log('Abandoned cart webhook received:', { tenantId, clientPhone, cartItems });

    // Logic for InStyle Hair Boutique tenant
    if (tenantId === 'instylehairboutique') {
      const whatsappMessage = `Hi! 👋 You left some amazing products in your cart at InStyle Hair Boutique.\n\n${cartItems.map((item: any) => `• ${item.name} - R${item.price / 100}`).join('\n')}\n\nComplete your purchase here: https://instylehairboutique.co.za/shop\n\nNeed help? Just reply to this message! 💜`;

      // In production, this would integrate with a WhatsApp API provider (e.g., AISensy, Twilio)
      console.log('WhatsApp message to send:', whatsappMessage);
      // Example: await sendWhatsAppMessage(clientPhone, whatsappMessage);
    }

    return NextResponse.json({
      success: true,
      message: 'Abandoned cart reminder processed',
    });

  } catch (error) {
    console.error('Abandoned cart webhook error:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
