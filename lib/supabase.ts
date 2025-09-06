import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function createServerSupabaseClient() {
  const cookieStore = cookies()
  
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}

export async function setTenantContext(tenantId: string) {
  const { error } = await supabase.rpc('set_config', {
    setting_name: 'app.current_tenant_id',
    setting_value: tenantId,
    is_local: true
  })
  
  if (error) console.error('Error setting tenant context:', error)
  return !error
}