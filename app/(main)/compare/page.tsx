export const dynamic = 'force-dynamic';

import { preloadQuery, fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { jsonLd } from '@/lib/jsonLd';
import { ItemList } from 'schema-dts';
import CompareClientPage from './CompareClientPage';

export async function generateMetadata() {
  try {
    const items = await fetchQuery(api.comparisonItems.list);

    const itemListElement = items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Thing',
        name: item.name,
        description: item.features
          .map((f) => `${f.name}: ${f.supported ? 'Yes' : 'No'}`)
          .join(', '),
      },
    }));

    return {
      title: 'Compare Features - The Platform',
      description: 'Compare our features with other platforms.',
      other: {
        'script[type="application/ld+json"]': jsonLd({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: itemListElement,
        } as ItemList),
      },
    };
  } catch (error) {
    console.error('Error generating metadata for compare page:', error);
    return {
      title: 'Compare Features - The Platform',
      description: 'Compare our features with other platforms.',
    };
  }
}

export default async function ComparePage() {
  const preloadedItems = await preloadQuery(api.comparisonItems.list);
  return <CompareClientPage preloadedItems={preloadedItems} />;
}
