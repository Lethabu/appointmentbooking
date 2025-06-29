import { unstable_cache } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import dynamic from 'next/dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 1. Database Query Caching
export const cachedQuery = unstable_cache(
  async (table, select = '*', filter = {}) => {
    let query = supabase.from(table).select(select);
    Object.entries(filter).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    const { data } = await query;
    return data;
  },
  ['supabase-data'],
  { revalidate: 3600 } // 1 hour cache
);

// 2. Image Optimization
export async function optimizeImage(url, width, height) {
  if (!url) return null;
  if (url.includes('res.cloudinary.com')) {
    return url.replace('/upload/', `/upload/w_${width},h_${height},c_fill/`);
  }
  return url;
}

// 3. Lazy Loading Components
export function dynamicImport(componentPath, loadingComponent = null) {
  return dynamic(
    () => import(`@/components/${componentPath}`),
    {
      loading: () => loadingComponent || <div>Loading...</div>,
      ssr: false
    }
  );
}

// 4. Connection Pool Manager
const connectionPool = new Map();

export function getSupabaseClient(salonId) {
  if (!connectionPool.has(salonId)) {
    connectionPool.set(salonId, createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { db: { schema: `salon_${salonId}` } } // Use schema per salon
    ));
  }
  return