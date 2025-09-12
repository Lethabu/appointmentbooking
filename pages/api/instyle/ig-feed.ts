// pages/api/instyle/ig-feed.ts
// This is a placeholder for the Instagram feed API endpoint.

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Logic for server-side IG scrape (no tokens)
  res.status(200).json({ feed: [] });
}