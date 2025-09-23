import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { tenantId, customerData, context } = await request.json();
    const supabase = createClient();

    // Get customer's booking history
    const { data: bookings } = await supabase
      .from('appointments')
      .select('services(name, category)')
      .eq('salon_id', tenantId)
      .eq('client_id', customerData?.id);

    // Get available products
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('salon_id', tenantId)
      .eq('is_active', true);

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Based on customer's booking history: ${JSON.stringify(bookings?.slice(0, 3))} 
    and available products: ${JSON.stringify(products?.slice(0, 10))}
    
    Recommend 3 products that would complement their hair care routine. 
    Consider South African hair types and preferences.
    
    Return JSON: { "recommendations": [{"id": "product_id", "reason": "why this product"}] }`;

    const result = await model.generateContent(prompt);
    const recommendations = JSON.parse(result.response.text());

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('AI recommendations error:', error);
    return NextResponse.json({ recommendations: [] });
  }
}
