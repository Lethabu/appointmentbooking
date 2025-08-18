import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../../prisma/src/drizzle/schema';

const poolPromise = import('pg').then(({ Pool }) => {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
  });
});

export const db = new Proxy({}, {
  get: (target, prop) => {
    if (prop === 'then') return undefined; // Prevent this proxy from being treated as a Promise
    return async (...args: any[]) => {
      const pool = await poolPromise;
      const client = await pool.connect();
      try {
        const result = await drizzle(client, { schema })[prop](...args);
        return result;
      } finally {
        client.release();
      }
    };
  },
});
