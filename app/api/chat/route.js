import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// The URL of your dedicated agent service.
// This should be in your Vercel environment variables.
const AGENT_SERVICE_URL = process.env.AGENT_SERVICE_URL;
// A secret key to authenticate requests from this app to the agent service.
// This should also be in your Vercel environment variables.
const AGENT_SERVICE_API_KEY = process.env.AGENT_SERVICE_API_KEY;

export async function POST(req) {
  // 1. Authenticate the end-user making the request from the browser
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  // 2. Get the salon context for the authenticated user
  const { data: salon } = await supabase
    .from('salons')
    .select('id, name, plan')
    .eq('owner_id', session.user.id)
    .single()

  if (!salon) {
    return new Response('Salon not found for user', { status: 404 })
  }

  // 3. Forward the request to the dedicated agent service
  try {
    const body = await req.json(); // { messages, context } from the client

    if (!AGENT_SERVICE_URL || !AGENT_SERVICE_API_KEY) {
      throw new Error('Agent service is not configured in environment variables.');
    }

    // 4. Construct the payload for the agent service, enriching it with secure context
    const agentServicePayload = {
      messages: body.messages,
      context: {
        ...body.context, // Any context from client (e.g., desired agent)
        user: {
          id: session.user.id,
          role: 'owner' // This would eventually come from your RBAC system
        },
        salon: {
          id: salon.id,
          name: salon.name,
          plan: salon.plan
        }
      }
    };

    // 5. Make the secure, server-to-server call to the agent service
    const agentResponse = await fetch(AGENT_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Secure the communication between this app and the agent service
        'Authorization': `Bearer ${AGENT_SERVICE_API_KEY}`
      },
      body: JSON.stringify(agentServicePayload)
    });

    // 6. Handle non-ok responses from the agent service
    if (!agentResponse.ok) {
      const errorText = await agentResponse.text();
      console.error(`Agent service error: ${agentResponse.status} ${errorText}`);
      return new Response(`Error from AI service: ${errorText}`, { status: agentResponse.status });
    }

    // 7. Stream the response from the agent service back to our client
    return new Response(agentResponse.body, {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('API proxy error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}