const axios = require('axios');

class SocialMediaScraper {
  constructor() {
    // Mock data based on InStyle Hair Boutique's actual services
    this.mockInstagramData = {
      bio: "✨ InStyle Hair Boutique ✨ Professional Hair Treatments & Styling 💫 Hair Extensions & Color Specialists 📍 South Africa 📱 Book Now!",
      posts: [
        {
          image: "https://images.unsplash.com/photo-1560869713-7d0bc5d97521?w=400",
          description: "Beautiful hair transformation with our signature color treatment",
          type: "product_service"
        },
        {
          image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=400",
          description: "Professional hair styling for special occasions",
          type: "product_service"
        },
        {
          image: "https://images.unsplash.com/photo-1559599238-8ad2def8c2cd?w=400",
          description: "Hair treatment and deep conditioning service",
          type: "product_service"
        },
        {
          image: "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?w=400",
          description: "Premium hair extensions application",
          type: "product_service"
        },
        {
          image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400",
          description: "Hair color touch-up and highlights",
          type: "product_service"
        },
        {
          image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400",
          description: "Bridal hair styling package",
          type: "product_service"
        }
      ],
      profileImage: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300"
    };

    this.mockTikTokData = {
      bio: "Professional Hair Boutique 💇‍♀️ Hair Treatments & Styling ✨ Book your appointment below 👇",
      videos: [
        {
          description: "Hair transformation Tuesday! Watch this amazing color change ✨ #hairtransformation #color",
          thumbnail: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=300",
          type: "service_showcase"
        },
        {
          description: "Step-by-step hair treatment process 💆‍♀️ #haircare #treatment",
          thumbnail: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=300",
          type: "service_showcase"
        },
        {
          description: "Before and after hair styling magic ✨ #hairstyling #makeover",
          thumbnail: "https://images.unsplash.com/photo-1588717107313-6623b9c65e90?w=300",
          type: "service_showcase"
        },
        {
          description: "Professional hair extension installation process #hairextensions",
          thumbnail: "https://images.unsplash.com/photo-1525925436399-2917d68c3c85?w=300",
          type: "service_showcase"
        }
      ],
      followerCount: "2.5K"
    };
  }

  async init() {
    // No browser initialization needed
    return true;
  }

  async scrapeInstagram(username) {
    try {
      // For now, return curated content that matches InStyle's services
      // This can be enhanced with actual Instagram Basic Display API later
      return this.mockInstagramData;
    } catch (error) {
      console.error('Instagram scraping error:', error);
      return this.mockInstagramData; // Fallback to mock data
    }
  }

  async scrapeTikTok(username) {
    try {
      // For now, return curated content that matches InStyle's services
      // This can be enhanced with TikTok API later
      return this.mockTikTokData;
    } catch (error) {
      console.error('TikTok scraping error:', error);
      return this.mockTikTokData; // Fallback to mock data
    }
  }

  async close() {
    // No cleanup needed
    return true;
  }
}

module.exports = SocialMediaScraper;