import axios from 'axios';

const IG_ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN;

export async function fetchInstagramMedia(tenantId: string) {
  if (!IG_ACCESS_TOKEN) return [];

  try {
    const resp = await axios.get(
      `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink&access_token=${IG_ACCESS_TOKEN}`,
    );

    return resp.data.data.map((m: any) => ({
      id: m.id,
      caption: m.caption,
      mediaUrl: m.media_url,
      permalink: m.permalink,
      tenantId,
    }));
  } catch (error) {
    console.error('Instagram fetch error:', error);
    return [];
  }
}
