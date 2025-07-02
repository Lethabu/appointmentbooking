
const puppeteer = require('puppeteer');
const axios = require('axios');

class SocialMediaScraper {
  constructor() {
    this.browser = null;
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  async scrapeInstagram(username) {
    const page = await this.browser.newPage();
    const url = `https://www.instagram.com/${username}/`;
    
    try {
      await page.goto(url, { waitUntil: 'networkidle0' });
      
      // Extract profile info and recent posts
      const data = await page.evaluate(() => {
        const posts = [];
        const postElements = document.querySelectorAll('article img');
        
        postElements.forEach((img, index) => {
          if (index < 12) { // Get first 12 posts
            const alt = img.getAttribute('alt') || '';
            const src = img.getAttribute('src');
            
            // Try to identify products/services from alt text
            const isProduct = alt.toLowerCase().includes('hair') || 
                             alt.toLowerCase().includes('treatment') || 
                             alt.toLowerCase().includes('style') ||
                             alt.toLowerCase().includes('color');
            
            if (isProduct) {
              posts.push({
                image: src,
                description: alt,
                type: 'product_service'
              });
            }
          }
        });

        // Extract bio for services
        const bio = document.querySelector('div.-vDIg span')?.textContent || '';
        
        return {
          bio,
          posts,
          profileImage: document.querySelector('img[data-testid="user-avatar"]')?.src
        };
      });

      return data;
    } catch (error) {
      console.error('Instagram scraping error:', error);
      return null;
    } finally {
      await page.close();
    }
  }

  async scrapeTikTok(username) {
    const page = await this.browser.newPage();
    const url = `https://www.tiktok.com/@${username}`;
    
    try {
      await page.goto(url, { waitUntil: 'networkidle0' });
      
      const data = await page.evaluate(() => {
        const videos = [];
        const videoElements = document.querySelectorAll('[data-e2e="user-post-item"]');
        
        videoElements.forEach((video, index) => {
          if (index < 10) { // Get first 10 videos
            const description = video.querySelector('[data-e2e="user-post-item-desc"]')?.textContent || '';
            const thumbnail = video.querySelector('img')?.src;
            
            // Identify hair-related content
            const isHairContent = description.toLowerCase().includes('hair') ||
                                 description.toLowerCase().includes('style') ||
                                 description.toLowerCase().includes('treatment') ||
                                 description.toLowerCase().includes('color');
            
            if (isHairContent) {
              videos.push({
                description,
                thumbnail,
                type: 'service_showcase'
              });
            }
          }
        });

        const bio = document.querySelector('[data-e2e="user-bio"]')?.textContent || '';
        
        return {
          bio,
          videos,
          followerCount: document.querySelector('[data-e2e="followers-count"]')?.textContent
        };
      });

      return data;
    } catch (error) {
      console.error('TikTok scraping error:', error);
      return null;
    } finally {
      await page.close();
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

module.exports = SocialMediaScraper;
