
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { platforms } = await request.json();
    
    // Import dynamically to avoid server-side issues
    const SocialMediaScraper = require('../../../lib/scrapers/social-media-scraper');
    const scraper = new SocialMediaScraper();
    
    await scraper.init();
    
    const results = {};
    
    if (platforms.includes('instagram')) {
      results.instagram = await scraper.scrapeInstagram('instyle_hair_boutique_');
    }
    
    if (platforms.includes('tiktok')) {
      results.tiktok = await scraper.scrapeTikTok('instylehairboutique');
    }
    
    await scraper.close();
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json({ error: 'Failed to scrape social media' }, { status: 500 });
  }
}
