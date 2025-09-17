import { NextRequest, NextResponse } from 'next/server';
import { postToInstagram } from '@/services/social/instagram';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, platform, caption, media } = body;

    console.log('Social post webhook:', { tenantId, platform, caption });

    if (platform === 'instagram') {
      await postToInstagram(caption, media);
    }

    return NextResponse.json({
      success: true,
      message: 'Social post processed',
    });
  } catch (error) {
    console.error('Social webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to process social post' },
      { status: 500 },
    );
  }
}
