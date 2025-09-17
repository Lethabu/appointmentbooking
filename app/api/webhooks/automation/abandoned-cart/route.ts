import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { tenantId, clientPhone, cartItems } = await request.json();

    console.log('Abandoned cart webhook:', {
      tenantId,
      clientPhone,
      cartItems,
    });

    // Send WhatsApp reminder
    const whatsappMessage = `Hi! 👋 You left some amazing products in your cart at InStyle Hair Boutique.\n\n${cartItems.map((item: any) => `• ${item.name} - R${item.price_cents / 100}`).join('\n')}\n\nComplete your purchase: https://instylehairboutique.co.za/shop\n\nNeed help? Just reply to this message! 💜`;

    // In production, integrate with WhatsApp API (AISensy, Twilio, etc.)
    console.log('WhatsApp message to send:', whatsappMessage);

    return NextResponse.json({
      success: true,
      message: 'Abandoned cart reminder sent',
    });
  } catch (error) {
    console.error('Abandoned cart webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to process abandoned cart' },
      { status: 500 },
    );
  }
}
