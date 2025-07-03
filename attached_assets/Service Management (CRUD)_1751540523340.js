// pages/api/services.js
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req, res) {
  const supabase = createServerSupabaseClient({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) return res.status(401).json({ error: 'Unauthorized' })

  // Get salon ID from owner
  const { data: salon } = await supabase
    .from('salons')
    .select('id')
    .eq('owner_id', session.user.id)
    .single()
    
  if (!salon) return res.status(403).json({ error: 'No salon found' })

  switch (req.method) {
    case 'GET':
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('salon_id', salon.id)
        .order('created_at', { ascending: true })
      return res.status(200).json(data)

    case 'POST':
      const { error } = await supabase
        .from('services')
        .insert({ ...req.body, salon_id: salon.id })
      return error 
        ? res.status(500).json({ error: error.message })
        : res.status(201).json({ success: true })

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

// components/ServiceForm.js
export default function ServiceForm({ salonId }) {
  const [service, setService] = useState({ name: '', duration: 30, price: '' });
  
  const handleSubmit = async () => {
    const response = await fetch('/api/services', {
      method: 'POST',
      body: JSON.stringify({
        ...service,
        price: Math.round(parseFloat(service.price) * 100 // convert to cents
      })
    });
    
    if (response.ok) {
      // Refresh service list
    }
  };

  return (
    <div>
      <input
        value={service.name}
        onChange={(e) => setService({...service, name: e.target.value})}
        placeholder="Service Name"
      />
      <input
        type="number"
        value={service.duration}
        onChange={(e) => setService({...service, duration: parseInt(e.target.value)})}
        placeholder="Duration (minutes)"
      />
      <input
        type="number"
        value={service.price}
        onChange={(e) => setService({...service, price: e.target.value})}
        placeholder="Price"
      />
      <button onClick={handleSubmit}>Add Service</button>
    </div>
  );
}