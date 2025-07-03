
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { platforms } = await request.json();
    
    // Import ES module properly
    const { default: SocialMediaScraper } = await import('../../../lib/scrapers/social-media-scraper.js');
    const scraper = new SocialMediaScraper();
    
    const results = {};
    
    if (platforms.includes('instagram')) {
      results.instagram = await scraper.scrapeInstagram('instyle_hair_boutique_');
    }
    
    if (platforms.includes('tiktok')) {
      results.tiktok = await scraper.scrapeTikTok('instylehairboutique');
    }
    
    // No cleanup needed for mock scraper
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json({ error: 'Failed to scrape social media' }, { status: 500 });
  }
}
