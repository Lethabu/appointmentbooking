import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import OpenAI from 'openai'
import { z } from 'zod'

// Zod schemas for validation
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

const SearchServicesArgsSchema = z.object({
  query: z.string()
});

// Agent functions
const functions = {
  nia: [
    {
      name: 'get_available_appointments',
      description: 'Get available appointment slots for a specific service and optional date.',
      parameters: {
        type: 'object',
        properties: {
          service_id: { type: 'string', description: 'The ID of the service to check for appointments.' },
          date: { type: 'string', description: "The date to check for appointments, in YYYY-MM-DD format. Defaults to today if not provided." },
        },
        required: ['service_id'],
      },
    },
    {
      name: 'book_appointment',
      description: 'Book a new appointment for a client.',
      parameters: {
        type: 'object',
        properties: {
          service_id: { type: 'string', description: 'The ID of the service for the appointment.' },
          datetime: { type: 'string', description: "The specific date and time for the appointment in ISO 8601 format." },
          client_name: { type: 'string', description: 'The full name of the client.' },
          client_phone: { type: 'string', description: 'The phone number of the client (optional).' },
        },
        required: ['service_id', 'datetime', 'client_name'],
      },
    },
    {
      name: 'search_services',
      description: 'Search for available services.',
      parameters: {
        type: 'object',
        properties: { query: { type: 'string', description: 'The search term for services.' } },
        required: ['query'],
      },
    },
  ],
};

// Helper functions
async function getAvailableAppointments(tenantId, { service_id, date }) {
  // Implementation for getting available appointments
  return { available_slots: [], message: 'Available appointments retrieved' };
}

async function bookAppointment(tenantId, { service_id, datetime, client_name, client_phone }) {
  // Implementation for booking appointment
  return { success: true, appointment_id: 'new-id', message: 'Appointment booked successfully' };
}

async function searchServices(tenantId, query) {
  // Implementation for searching services
  return { services: [], message: 'Services found' };
}

export async function POST(req) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name, options) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session }} = await supabase.auth.getSession()
  
  const { messages, context } = await req.json()
  const lastMessage = messages[messages.length - 1]
  
  // Get tenant context
  let tenant = null;
  if (session) {
    const { data: salon } = await supabase
      .from('salons')
      .select('id, name, plan')
      .eq('owner_id', session.user.id)
      .single()
    tenant = salon;
  }
  
  // Agent selection logic
  let agent = 'nia'
  if (context?.agent) agent = context.agent
  
  // Multilingual system messages
  const systemMessages = {
    nia: `You are Nia, a friendly and efficient AI assistant${tenant ? ` for ${tenant.name}` : ''}. ` +
         `You are an expert in booking appointments and providing information about services. ` +
         `You are capable of understanding and responding fluently in English, isiZulu, isiXhosa, Afrikaans, and Sesotho. ` +
         `Always try to respond in the language the user primarily uses. If the user mixes languages, feel free to do so naturally. ` +
         `Be polite and use common South African greetings where appropriate. When providing booking details or service names from our system, present them clearly and offer to clarify in the user's preferred language if the system data is in English.`,
  };

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    // Initial AI call
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: systemMessages[agent]
        },
        ...messages
      ],
      functions: functions[agent] || [],
      function_call: 'auto'
    })

    const responseMessage = response.choices[0].message
    
    // Handle function calls
    if (responseMessage.function_call) {
      const functionName = responseMessage.function_call.name
      const functionArgsRaw = JSON.parse(responseMessage.function_call.arguments)
      let functionResponse

      try {
        switch (functionName) {
          case 'get_available_appointments':
            const validGetAvail = GetAvailableAppointmentsArgsSchema.parse(functionArgsRaw)
            functionResponse = await getAvailableAppointments(tenant?.id, validGetAvail)
            break
          case 'book_appointment':
            const validBook = BookAppointmentArgsSchema.parse(functionArgsRaw)
            functionResponse = await bookAppointment(tenant?.id, validBook)
            break
          case 'search_services':
            const validSearch = SearchServicesArgsSchema.parse(functionArgsRaw)
            functionResponse = await searchServices(tenant?.id, validSearch.query)
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