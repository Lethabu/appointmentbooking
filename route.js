import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const runtime = 'edge' // Use the Vercel Edge Runtime for speed

export async function POST(req) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => cookies().get(name)?.value
      }
    }
  );

  // 1. Authenticate the user's session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // 2. Get the salon context for the logged-in user
  const { data: salon } = await supabase
    .from('salons')
    .select('id, name')
    .eq('owner_id', session.user.id)
    .single()

  if (!salon) {
    return new NextResponse('Salon not found for user', { status: 404 })
  }

  // 3. Forward the request to your dedicated AI Agent Service
  const { messages, agent, context } = await req.json()
  const agentServiceUrl = process.env.AGENT_SERVICE_URL
  const agentServiceApiKey = process.env.AGENT_SERVICE_API_KEY

  if (!agentServiceUrl || !agentServiceApiKey) {
    console.error('Agent service environment variables are not set.')
    return new NextResponse('AI service is not configured.', { status: 500 })
  }

  try {
    const agentResponse = await fetch(agentServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${agentServiceApiKey}`, // Service-to-service auth
      },
      body: JSON.stringify({
        messages,
        agent,
        context: { ...context, salonId: salon.id, salonName: salon.name, userId: session.user.id },
      }),
    })

    // 4. Stream the response from the agent service back to the client
    return new NextResponse(agentResponse.body, {
      headers: { 'Content-Type': 'text/plain' },
    })
  } catch (error) {
    console.error('Error calling agent service:', error)
    return new NextResponse('An error occurred while communicating with the AI agent.', { status: 503 })
  }
}
