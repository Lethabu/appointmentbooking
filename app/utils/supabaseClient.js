import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// This client is for client-side usage only where RLS is enforced.
// For server-side logic, use the helpers (`createServerActionClient`, etc.).
export const supabase = createClientComponentClient();
