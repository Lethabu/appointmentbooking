import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
<<<<<<< HEAD
  return [
    {
      url: 'https://instylehairboutique.co.za',
=======
  const baseUrl = 'https://appointmentbooking.co.za';
  
  return [
    {
      url: baseUrl,
>>>>>>> origin/feat/instyle-whitelabel
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
<<<<<<< HEAD
      url: 'https://instylehairboutique.co.za/book',
=======
      url: `${baseUrl}/instylehairboutique`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/book/instylehairboutique`,
>>>>>>> origin/feat/instyle-whitelabel
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
<<<<<<< HEAD
      url: 'https://instylehairboutique.co.za/services',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];
}
=======
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}
>>>>>>> origin/feat/instyle-whitelabel
