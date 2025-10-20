// No Redis - direct function calls only
export function getRedisClient() {
  return null;
}

export async function connectRedis() {
  return null;
}

export async function cacheQuery(key: string, fetchFn: () => Promise<any>, ttl = 60) {
  // No caching - direct function call
  return await fetchFn();
}