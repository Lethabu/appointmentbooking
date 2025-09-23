import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://appointmentbooking.co.za';

  const robots = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/

# Allow important pages
Allow: /book-demo
Allow: /pricing
Allow: /instylehairboutique`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'max-age=86400', // Cache for 1 day
    },
  });
}
