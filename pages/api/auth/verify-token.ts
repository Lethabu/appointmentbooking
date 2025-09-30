import type { NextApiRequest, NextApiResponse } from 'next';
import { firebaseAdmin } from '@/lib/firebase/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let token: string | undefined;
  try {
    token = req.body?.token;
  } catch (err) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    return res.status(200).json({ decodedToken });
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
