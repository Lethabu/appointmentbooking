import { NextRequest, NextResponse } from 'next/server';
import { fetchInstagramMedia } from '@/services/social/instagram';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { tenantId } = await request.json();

    // Fetch Instagram media
    const igMedia = await fetchInstagramMedia(tenantId);

    // Store in database
    for (const media of igMedia) {
      await supabase.from('social_media_posts').upsert({
        tenant_id: tenantId,
        platform: 'instagram',
        external_id: media.id,
        caption: media.caption,
        media_url: media.mediaUrl,
        permalink: media.permalink,
        created_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      synced: igMedia.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Social sync failed',
      },
      { status: 500 },
    );
  }
}
