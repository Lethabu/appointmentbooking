import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://appointmentbooking.co.za';

  try {
    // Get dynamic pages (services)
    const servicesQuery = query(
      collection(db, 'services'),
      where('tenantId', '==', 'instyle-boutique'),
    );
    const servicesSnapshot = await getDocs(servicesQuery);
    const services = servicesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Static pages
    const staticPages = [
      '',
      '/book-demo',
      '/pricing',
      '/instylehairboutique',
      '/dashboard',
      '/profile',
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
    <url>
      <loc>${baseUrl}${page}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
      <priority>${page === '' ? '1.0' : '0.8'}</priority>
    </url>
  `,
    )
    .join('')}
  
  ${services
    .map(
      (service) => `
    <url>
      <loc>${baseUrl}/services/${service.id}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>
  `,
    )
    .join('')}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'text/xml',
        'Cache-Control': 'max-age=86400', // Cache for 1 day
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
