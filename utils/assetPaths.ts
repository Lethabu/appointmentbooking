// Utility to resolve asset paths for tenants or general assets
export function getAssetPath(asset: string): string {
  // Example: prepend /assets/ to asset name
  if (!asset) return '';
  return `/assets/${asset}`;
}
