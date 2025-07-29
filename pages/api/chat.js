import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message } = req.body;
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Placeholder for the server-to-server call to the AI service
    // const aiServiceUrl = process.env.AI_SERVICE_URL;
    // const response = await fetch(`${aiServiceUrl}/chat`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.AI_SERVICE_API_KEY}`,
    //   },
    //   body: JSON.stringify({ message }),
    // });
    // const data = await response.json();
    // res.status(200).json(data);

    // For now, return a mock response
    res.status(200).json({ response: `This is a mock response to: "${message}"` });

  } catch (error) {
    console.error('Error calling AI service:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
