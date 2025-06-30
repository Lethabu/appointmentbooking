import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getOrCreateClient(phone: string) {
  let { data } = await supabase
    .from('clients')
    .select('*')
    .eq('phone', phone)
    .single();

  if (!data) {
    const { data: newClient } = await supabase
      .from('clients')
      .insert({ phone })
      .select()
      .single();
    return newClient;
  }
  return data;
}

export async function getConversationHistory(phone: string) {
  const { data } = await supabase
    .from('conversations')
    .select('history')
    .eq('phone', phone)
    .single();
  return data?.history || '';
}

export async function saveConversationHistory(phone: string, history: string) {
  await supabase
    .from('conversations')
    .upsert({ phone, history });
}
