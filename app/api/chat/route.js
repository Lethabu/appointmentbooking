import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { query, tenant_id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70' } = await request.json();

    // For now, use local AI logic until FastAPI is deployed
    const queryLower = query.toLowerCase();
    let response;

    if (queryLower.includes('book') || queryLower.includes('appointment')) {
      response = {
        response: "I can help you book an appointment! What service would you like to book?",
        action: "booking_intent"
      };
    } else if (queryLower.includes('price') || queryLower.includes('cost')) {
      response = {
        response: "Our services range from R180 for wash & blowdry to R450 for full color. Would you like to see our full price list?",
        action: "pricing_info"
      };
    } else if (queryLower.includes('hours') || queryLower.includes('open')) {
      response = {
        response: "We're open Monday to Saturday, 9 AM to 6 PM. Would you like to book an appointment?",
        action: "hours_info"
      };
    } else {
      response = {
        response: `AI handled: ${query}. How can I help you with your hair appointment today?`,
        action: "general_response"
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}