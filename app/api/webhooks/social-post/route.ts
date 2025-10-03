import { NextRequest, NextResponse } from 'next/server';
<<<<<<< HEAD
=======
import { postToInstagram } from '@/services/social/instagram';
>>>>>>> origin/feat/instyle-whitelabel

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, platform, caption, media } = body;

    console.log('Social post webhook:', { tenantId, platform, caption });

<<<<<<< HEAD
    return NextResponse.json({
      success: true,
      message: 'Social post processed',
=======
    if (platform === 'instagram') {
      await postToInstagram(caption, media);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Social post processed' 
>>>>>>> origin/feat/instyle-whitelabel
    });
  } catch (error) {
    console.error('Social webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to process social post' },
<<<<<<< HEAD
      { status: 500 },
    );
  }
}
=======
      { status: 500 }
    );
  }
}
>>>>>>> origin/feat/instyle-whitelabel
