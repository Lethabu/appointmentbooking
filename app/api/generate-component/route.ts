import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: NextRequest) {
  const { componentType, brandInfo } = await req.json();

  if (!componentType || !brandInfo) {
    return new NextResponse('Missing componentType or brandInfo', { status: 400 });
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    Generate the HTML and CSS for a ${componentType} component for a salon with the following brand information:
    ${JSON.stringify(brandInfo, null, 2)}

    Return the response as a JSON object with two keys: "html" and "css".
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // The model may return a JSON object embedded in a markdown block.
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '');
    
    const data = JSON.parse(jsonString);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error generating component:', error);
    return new NextResponse('Error generating component', { status: 500 });
  }
}