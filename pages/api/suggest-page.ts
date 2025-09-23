import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const config = {
  runtime: 'edge', // Specify the edge runtime
};

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return new NextResponse('Method Not Allowed', { status: 405 });
  }

  const { path, tenantId, services } = await req.json();

  if (!path || !tenantId) {
    return new NextResponse('Missing path or tenantId', { status: 400 });
  }

  // Initialize Google Generative AI
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || ''); // Assuming GEMINI_API_KEY is set
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  try {
    const prompt = `Given the current non-existent path "${path}" for tenant ID "${tenantId}", and the following available services: ${JSON.stringify(services)}. Suggest 2-3 relevant existing pages or services the user might be looking for. Provide the suggestions as a JSON array of objects, each with a "title" and "url" property. Example: [{"title": "Book Lace-Wig Install", "url": "/book/lace-install"}]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Attempt to parse the AI's response as JSON
    let suggestions;
    try {
      suggestions = JSON.parse(text);
      if (!Array.isArray(suggestions)) {
        throw new Error('AI response is not a JSON array.');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Fallback if AI doesn't return perfect JSON
      suggestions = [{ title: 'Back to Home', url: '/' }];
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
