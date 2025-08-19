import { convex } from "@/lib/convexClient";
import { api } from "@/convex/_generated/api";
import { jsonLd } from "@/lib/jsonLd";
import { LocalBusiness } from 'schema-dts';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const salon = await convex.query(api.tenants.getBySlug, { slug: params.slug });

  if (!salon) {
    return {
      title: "Salon not found",
    }
  }

  const services = await convex.query(api.services.list, { tenantName: salon.name });

  return {
    title: `${salon.name} – Online Booking`,
    description: `Book ${services.length} services instantly. Rated ${salon.rating}/5 by ${salon.reviewCount} clients.`,
    openGraph: {
      images: [`${salon.ogImage}?auto=format&w=1200&h=630`],
      type: 'website',
    },
    other: {
      'script[type="application/ld+json"]': jsonLd({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: salon.name,
        image: salon.logo,
        address: salon.address,
        telephone: salon.phone,
        openingHours: salon.openingHours?.map(o => o.schema),
        aggregateRating: { ratingValue: salon.rating, reviewCount: salon.reviewCount },
      } as LocalBusiness),
    }
  };
}

export default function SalonPage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <h1>Salon: {params.slug}</h1>
    </div>
  );
}
