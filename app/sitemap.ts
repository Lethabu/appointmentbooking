import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://instylehairboutique.co.za',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://instylehairboutique.co.za/instylehairboutique',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://instylehairboutique.co.za/instylehairboutique/shop',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://instylehairboutique.co.za/instylehairboutique/shop/enhanced',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }
  ];
}