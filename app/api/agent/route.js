// pages/api/agent/route.js
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
// We'll also need the regular createClient for service_role access later
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { getAvailableAppointments, bookAppointment, searchProducts } from '../../lib/agent-functions';
import { z } from 'zod';

const openai = new OpenAI(process.env.OPENAI_API_KEY)

export async function POST(req) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  const { data: { session }} = await supabase.auth.getSession()
  if (!session) return new Response('Unauthorized', { status: 401 })

  // Fetch user profile for role-based authorization
  const { data: userProfile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();
  if (profileError || !userProfile) {
    console.error('Error fetching user profile or profile not found:', profileError);
    return new Response('User profile not found or error fetching it.', { status: 403 });
  }
  if (!['staff', 'admin'].includes(userProfile.role)) {
    console.warn(`User ${session.user.id} with role ${userProfile.role} attempted unauthorized agent action.`);
    return new Response('Forbidden: Insufficient permissions for this agent action.', { status: 403 });
  }

  const { messages, context } = await req.json()
  const lastMessage = messages[messages.length - 1]
  
  // Get tenant context
  const { data: salon } = await supabase
    .from('salons')
    .select('id, name, plan')
    .eq('owner_id', session.user.id)
    .single()
  
  if (!salon) return new Response('Salon not found', { status: 404 })
  
  // Agent selection logic
  let agent = 'nia'
  if (context?.agent) agent = context.agent
  else if (lastMessage.content.includes('product')) agent = 'orion'
  else if (lastMessage.content.includes('marketing')) agent = 'blaze'

  // Multilingual system messages
  const systemMessages = {
    nia: `You are Nia, a friendly and efficient AI assistant for ${salon.name}. ` +
         `You are an expert in booking appointments. ` +
         `You are capable of understanding and responding fluently in English, isiZulu, isiXhosa, Afrikaans, and Sesotho. ` +
         `Always try to respond in the language the user primarily uses. If the user mixes languages, feel free to do so naturally. ` +
         `Be polite and use common South African greetings where appropriate. When providing booking details or service names from our system, present them clearly and offer to clarify in the user's preferred language if the system data is in English.`,
    orion: `You are Orion, a helpful AI assistant for ${salon.name}. ` +
           `You specialize in product recommendations and information. ` +
           `You can communicate fluently in English, isiZulu, isiXhosa, Afrikaans, and Sesotho. ` +
           `Prioritize the user's language in your responses. Be clear and concise.`,
    blaze: `You are Blaze, a dynamic AI marketing assistant for ${salon.name}. ` +
           `You provide marketing insights and content ideas. ` +
           `You are fluent in English, isiZulu, isiXhosa, Afrikaans, and Sesotho. ` +
           `Adapt your communication style to be engaging in the chosen language.`
  };

  try {
    // Initial AI call
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: systemMessages[agent] // Use the dynamic system message
        },
        ...messages
      ],
      functions: functions[agent] || [],
      function_call: agent === 'nia' ? 'auto' : { name: 'search_products' }
    })

    const responseMessage = response.choices[0].message
    
    // Handle function calls
    if (responseMessage.function_call) {
      const functionName = responseMessage.function_call.name
      const functionArgsRaw = JSON.parse(responseMessage.function_call.arguments)
      let functionResponse
      // Zod schemas
      const BookAppointmentArgsSchema = z.object({
        service_id: z.string(),
        datetime: z.string(),
        client_name: z.string(),
        client_phone: z.string().optional(),
      });
      const GetAvailableAppointmentsArgsSchema = z.object({
        service_id: z.string(),
        date: z.string().optional(),
      });
      const SearchProductsArgsSchema = z.object({
        query: z.string()
      });
      try {
        switch (functionName) {
          case 'get_available_appointments':
            const validGetAvail = GetAvailableAppointmentsArgsSchema.parse(functionArgsRaw)
            functionResponse = await getAvailableAppointments(salon.id, validGetAvail)
            break
          case 'book_appointment':
            const validBook = BookAppointmentArgsSchema.parse(functionArgsRaw)
            functionResponse = await bookAppointment(salon.id, validBook)
            break
          case 'search_products':
            const validSearch = SearchProductsArgsSchema.parse(functionArgsRaw)
            functionResponse = await searchProducts(salon.id, validSearch.query)
            break
          default:
            functionResponse = { error: 'Function not implemented' }
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error(`Validation error for ${functionName}:`, error.errors)
          functionResponse = { error: 'Invalid arguments for function.', validationErrors: error.flatten() }
        } else {
          throw error
        }
      }
      // Second AI call with function response
      const secondResponse = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          ...messages,
          responseMessage,
          {
            role: 'function',
            name: functionName,
            content: JSON.stringify(functionResponse)
          }
        ]
      })
      
      return Response.json({ 
        reply: secondResponse.choices[0].message.content,
        agent
      })
    }
    
    return Response.json({ 
      reply: responseMessage.content,
      agent 
    })
  } catch (error) {
    console.error('AI Agent error:', error)
    return new Response('AI processing failed', { status: 500 })
  }
}