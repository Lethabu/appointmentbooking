import { convex } from "@/lib/convexClient";
import { api } from "@/convex/_generated/api";
import { jsonLd } from "@/lib/jsonLd";
import { ItemList, Thing } from 'schema-dts';

export async function generateMetadata() {
  const items = await convex.query(api.comparisonItems.list);

  const itemListElement = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Thing',
      name: item.name,
      description: item.features.map(f => `${f.name}: ${f.supported ? 'Yes' : 'No'}`).join(', '),
    }
  }));

  return {
    title: "Compare Features - AppointmentBooking.co.za",
    description: "Compare our features with other platforms.",
    other: {
      'script[type="application/ld+json"]': jsonLd({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: itemListElement,
      } as ItemList),
    }
  };
}

async function ComparePage() {
  const items = await convex.query(api.comparisonItems.list);

  return (
    <div>
      <h1>Compare Features</h1>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            {items.map(item => <th key={item.name}>{item.name}</th>)}
          </tr>
        </thead>
        <tbody>
          {items[0]?.features.map((feature, index) => (
            <tr key={feature.name}>
              <td>{feature.name}</td>
              {items.map(item => (
                <td key={item.name}>
                  {item.features[index].supported ? '✅' : '❌'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ComparePage;