import axios from 'axios';
import * as cheerio from 'cheerio';

export interface TikTokVideo {
  id: string;
  caption: string;
  videoUrl: string;
  permalink: string;
  views: number;
  likes: number;
}

export async function scrapeTikTokProfile(username: string): Promise<TikTokVideo[]> {
  try {
    // Simple scraping approach - in production, use official API
    const response = await axios.get(`https://www.tiktok.com/@${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const videos: TikTokVideo[] = [];
    
    // Extract video data from page (simplified)
    $('.video-feed-item').each((i, element) => {
      const $el = $(element);
      const id = $el.attr('data-video-id') || `tiktok_${i}`;
      const caption = $el.find('.video-meta-caption').text().trim();
      const permalink = `https://www.tiktok.com/@${username}/video/${id}`;
      
      videos.push({
        id,
        caption,
        videoUrl: '',
        permalink,
        views: 0,
        likes: 0
      });
    });
    
    return videos.slice(0, 10); // Return latest 10
  } catch (error) {
    console.error('Error scraping TikTok:', error);
    return [];
  }
}

export async function getTikTokVideos(username: string = 'instylehairboutique'): Promise<TikTokVideo[]> {
  return scrapeTikTokProfile(username);
}