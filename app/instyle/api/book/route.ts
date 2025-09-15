
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const BookingSchema = z.object({
  service: z.string().min(1, "Service is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^\+27\d{9}$/, "Invalid South African phone number"),
  email: z.string().email("Invalid email address").optional(),
  notes: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = BookingSchema.parse(body);

    // Store booking in Convex
    // TODO: Add Convex integration
    
    // Send WhatsApp confirmation via Aisensy
    const whatsappResponse = await fetch(`${process.env.AISENSY_BASE_URL}/api/v2/whatsapp-outbound`, {
      method: 'POST',
      headers: {
        'X-Aisensy-API-KEY': process.env.AISENSY_API_KEY!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: validatedData.phone.replace('+', ''),
        type: "template",
        template: {
          name: "booking_confirmation_instyle",
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: validatedData.name },
                { type: "text", text: validatedData.service },
                { type: "text", text: `${validatedData.date} at ${validatedData.time}` }
              ]
            }
          ]
        }
      })
    });

    if (!whatsappResponse.ok) {
      console.error('WhatsApp API Error:', await whatsappResponse.text());
    }

    return NextResponse.json({ 
      success: true, 
      message: "Booking confirmed! You'll receive a WhatsApp confirmation shortly.",
      booking: validatedData
    });

  } catch (error) {
    console.error('Booking error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Booking failed. Please try again." },
      { status: 500 }
    );
  }
}
