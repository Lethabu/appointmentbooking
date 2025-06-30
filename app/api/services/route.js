import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req, res) {
  const supabase = createServerSupabaseClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  // Get salon ID from owner
  const { data: salon } = await supabase
    .from('salons')
    .select('id')
    .eq('owner_id', session.user.id)
    .single();

  if (!salon) return res.status(403).json({ error: 'No salon found' });

  switch (req.method) {
    case 'GET': {
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('salon_id', salon.id)
        .order('created_at', { ascending: true });
      return res.status(200).json(data);
    }
    case 'POST': {
      const { error } = await supabase
        .from('services')
        .insert({ ...req.body, salon_id: salon.id });
      return error
        ? res.status(500).json({ error: error.message })
        : res.status(201).json({ success: true });
    }
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
