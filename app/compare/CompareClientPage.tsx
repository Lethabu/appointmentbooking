'use client';

import { usePreloadedQuery } from "convex/nextjs";
import { Preloaded } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default function CompareClientPage({ preloadedItems }: { preloadedItems: Preloaded<typeof api.comparisonItems.list> }) {
  const items = usePreloadedQuery(preloadedItems);

  if (items.length === 0) {
    return <div>No comparison items found.</div>
  }

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