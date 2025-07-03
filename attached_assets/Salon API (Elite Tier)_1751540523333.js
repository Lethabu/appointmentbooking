// pages/api/salon-api/[endpoint].js
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import apiHandler from '@/lib/api-handler'

export default apiHandler()
  .get(async (req, res) => {
    const { endpoint } = req.query
    const supabase = createServerSupabaseClient({ req, res })
    const { data: { session }} = await supabase.auth.getSession()
    
    if (!session) return res.status(401).json({ error: 'Unauthorized' })
    
    // Verify Elite tier
    const { data: salon } = await supabase
      .from('salons')
      .select('plan, api_enabled')
      .eq('owner_id', session.user.id)
      .single()
    
    if (salon?.plan !== 'elite' || !salon.api_enabled) {
      return res.status(403).json({ error: 'API access requires Elite subscription' })
    }
    
    try {
      let data;
      switch(endpoint) {
        case 'appointments':
          data = await getAppointments(supabase, session.user.id)
          break;
        case 'clients':
          data = await getClients(supabase, session.user.id)
          break;
        case 'products':
          data = await getProducts(supabase, session.user.id)
          break;
        default:
          return res.status(404).json({ error: 'Endpoint not found' })
      }
      
      res.status(200).json(data)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

async function getAppointments(supabase, userId) {
  const { data } = await supabase
    .from('appointments')
    .select(`
      id, start_time, end_time, status,
      clients(name, phone),
      services(name, price)
    `)
    .eq('salons.owner_id', userId)
    .order('start_time', { ascending: true })
  
  return data
}

// lib/api-handler.js (API key authentication)
export default function apiHandler() {
  return {
    get(handler) {
      return async (req, res) => {
        const apiKey = req.headers['x-api-key']
        
        if (!apiKey) return res.status(401).json({ error: 'API key required' })
        
        // Verify API key
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        )
        
        const { data: key } = await supabase
          .from('api_keys')
          .select('salon_id, expires_at')
          .eq('key', apiKey)
          .gt('expires_at', new Date().toISOString())
          .single()
        
        if (!key) return res.status(403).json({ error: 'Invalid API key' })
        
        req.salonId = key.salon_id
        return handler(req, res)
      }
    }
  }
}