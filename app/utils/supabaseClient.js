import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey);

// Note: This client is for client-side usage only where RLS is enforced.
// For server-side logic, use the helpers (`createServerActionClient`, etc.).
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
