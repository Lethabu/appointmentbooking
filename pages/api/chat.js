import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const supabase = createServerSupabaseClient({
    req,
    res,
  });

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const agentServiceUrl = process.env.AGENT_SERVICE_URL;

    if (!agentServiceUrl) {
      console.error('AGENT_SERVICE_URL is not defined in environment variables.');
      return res.status(500).json({ error: 'AI service URL not configured.' });
    }

    const response = await fetch(agentServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Potentially add an API key or other authentication for the AI service
        // 'Authorization': `Bearer ${process.env.AGENT_SERVICE_API_KEY}`,
      },
      body: JSON.stringify({ message, userId: session.user.id }), // Forward user ID for context
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error from AI service:', errorData);
      return res.status(response.status).json({ error: errorData.detail || 'Error from AI service' });
    }

    const aiResponse = await response.json();
    return res.status(200).json(aiResponse);
  } catch (error) {
    console.error('Unexpected error in chat API:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
