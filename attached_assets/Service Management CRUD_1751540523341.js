// API route: pages/api/services/[id].js
export default async function handler(req, res) {
  const { id } = req.query;
  const supabase = createServerSupabaseClient({ req, res });

  switch (req.method) {
    case 'PUT':
      // Verify salon ownership: 
      // SELECT owner_id FROM salons WHERE id = (SELECT salon_id FROM services WHERE id = $1)
      await supabase.from('services').update(req.body).eq('id', id);
      break;
  }
}