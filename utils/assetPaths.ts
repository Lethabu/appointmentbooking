/**
 * Get asset path for tenant resources
 * @param path - The asset path
 * @returns The correct asset path
 */
export function getAssetPath(path: string): string {
  // Ensure path starts with /
  return path.startsWith('/') ? path : `/${path}`;
}