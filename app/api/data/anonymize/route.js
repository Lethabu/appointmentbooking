import { NextResponse } from 'next/server';
import { anonymizeData } from '@/app/lib/utils/anonymizer';

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (
      !contentType.includes('text/csv') &&
      !contentType.includes('text/plain')
    ) {
      return NextResponse.json(
        {
          error:
            'Invalid content type. Only text/csv and text/plain are supported.',
        },
        { status: 415 },
      );
    }

    const rawData = await request.text();
    if (!rawData) {
      return NextResponse.json(
        { error: 'No data provided in the request body.' },
        { status: 400 },
      );
    }

    const anonymizedData = anonymizeData(rawData);

    return new NextResponse(anonymizedData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
      },
    });
  } catch (error) {
    console.error('Anonymization error:', error);
    return NextResponse.json(
      { error: 'An internal error occurred during data anonymization.' },
      { status: 500 },
    );
  }
}
