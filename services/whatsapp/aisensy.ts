interface WhatsAppMessage {
  phone: string;
  message: string;
  tenantId?: string;
}

export async function sendWhatsAppMessage({ phone, message, tenantId }: WhatsAppMessage) {
  const AISENSY_API_URL = process.env.AISENSY_API_URL;
  const AISENSY_API_KEY = process.env.AISENSY_API_KEY;

  if (!AISENSY_API_URL || !AISENSY_API_KEY) {
    console.log('WhatsApp message (demo):', { phone, message });
    return { success: true, demo: true };
  }

  try {
    const response = await fetch(`${AISENSY_API_URL}/send-message`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AISENSY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone,
        message,
        metadata: { tenantId }
      }),
    });

    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return { success: false, error };
  }
}

export async function sendAbandonedCartReminder(phone: string, cartItems: any[]) {
  const message = `Hi! 👋 You left some amazing products in your cart at InStyle Hair Boutique.

${cartItems.map(item => `• ${item.name} - R${item.price_cents / 100}`).join('\n')}

Complete your purchase: https://instylehairboutique.co.za/shop

Need help? Just reply to this message! 💜`;

  return sendWhatsAppMessage({ phone, message, tenantId: 'instylehairboutique' });
}