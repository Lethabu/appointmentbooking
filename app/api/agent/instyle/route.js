import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message, context } = await request.json();
    const tenantId = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';

    const response = await processInstyleQuery(message, tenantId);

    return NextResponse.json({
      response: response.message,
      action: response.action,
      agent: 'instyle-assistant',
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function processInstyleQuery(message, tenantId) {
  const query = message.toLowerCase();

  if (query.includes('book') || query.includes('appointment')) {
    return {
      message: `I can help you book an appointment! We offer:\n• Middle & Side Installation - R1,500\n• Maphondo & Lines Installation - R1,500\n\nWhich service would you like to book?`,
      action: 'show_booking_form',
    };
  }

  if (
    query.includes('price') ||
    query.includes('cost') ||
    query.includes('how much')
  ) {
    return {
      message: `Our hair installation services are:\n• Middle & Side Installation: R1,500 (60 min)\n• Maphondo & Lines Installation: R1,500 (60 min)\n\nAll installations include consultation and styling. Would you like to book?`,
      action: 'show_pricing',
    };
  }

  if (
    query.includes('hours') ||
    query.includes('open') ||
    query.includes('time')
  ) {
    return {
      message: `We're open:\n• Monday - Friday: 9:00 AM - 5:00 PM\n• Saturday: 9:00 AM - 4:00 PM\n• Sunday: Closed\n\nWould you like to book an appointment?`,
      action: 'show_hours',
    };
  }

  return {
    message: `Hi! I'm your Instyle Hair Boutique assistant. I can help you with:\n• Booking appointments 📅\n• Service information 💇♀️\n• Pricing details 💰\n• Business hours 🕐\n\nWhat would you like to know?`,
    action: 'general_help',
  };
}
