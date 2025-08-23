import { convex } from "@/lib/convexClient";
import { api } from "@/convex/_generated/api";
import { jsonLd } from "@/lib/jsonLd";
import { Product, Offer, AggregateOffer } from 'schema-dts';

export async function generateMetadata() {
  try {
    const tiers = await convex.query(api.pricingTiers.list);

    const offers = tiers.map(tier => ({
      '@type': 'Offer',
      name: tier.name,
      price: tier.price,
      priceCurrency: 'ZAR',
    } as Offer));

    return {
      title: "Pricing - AppointmentBooking.co.za",
      description: "Choose the best plan for your salon.",
      other: {
        'script[type="application/ld+json"]': jsonLd({
          '@context': 'https://schema.org',
          '@type': 'AggregateOffer',
          offers: offers,
        } as AggregateOffer),
      }
    };
  } catch (error) {
    console.error("Error generating metadata for pricing page:", error);
    return {
      title: "Pricing - AppointmentBooking.co.za",
      description: "Choose the best plan for your salon.",
    }
  }
}

export default function PricingPage() {
  return (
    <div>
      <h1>Pricing</h1>
    </div>
  );
}
