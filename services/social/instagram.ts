import axios from 'axios';

const IG_ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN;

export interface InstagramMedia {
  id: string;
  caption: string;
  mediaUrl: string;
  permalink: string;
  timestamp: string;
}

export async function fetchInstagramMedia(tenantId: string): Promise<InstagramMedia[]> {
  if (!IG_ACCESS_TOKEN) {
    console.warn('Instagram access token not configured');
    return [];
  }

  try {
    const response = await axios.get(
      `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,timestamp&access_token=${IG_ACCESS_TOKEN}`
    );
    
    return response.data.data.map((media: any) => ({
      id: media.id,
      caption: media.caption || '',
      mediaUrl: media.media_url,
      permalink: media.permalink,
      timestamp: media.timestamp,
    }));
  } catch (error) {
    console.error('Error fetching Instagram media:', error);
    return [];
  }
}

export async function postToInstagram(caption: string, mediaUrl?: string) {
  // Implementation for posting to Instagram
  console.log('Posting to Instagram:', { caption, mediaUrl });
}
