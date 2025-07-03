// lib/errorTracker.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Initialize error tracking
export function initErrorTracking() {
  if (typeof window !== 'undefined') {
    // 1. Global error handler
    window.addEventListener('error', (event) => {
      logError({
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack
      })
    })

    // 2. Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      logError({
        message: 'Unhandled promise rejection',
        reason: event.reason?.message || event.reason
      })
    })

    // 3. Network error tracking
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason?.name === 'AxiosError') {
        logError({
          type: 'network',
          url: event.reason.config?.url,
          status: event.reason.response?.status,
          message: event.reason.message
        })
      }
    })
  }
}

// Log error to database
async function logError(details) {
  try {
    const { data } = await supabase
      .rpc('log_error', {
        error_data: details
      })
    
    // Auto-resolve known errors
    if (data?.known_error) {
      console.warn('Automatically resolved known error:', details.message)
    }
  } catch (err) {
    console.error('Error logging failed:', err)
  }
}

// PostgreSQL error logging function
CREATE OR REPLACE FUNCTION log_error(error_data jsonb)
RETURNS TABLE(known_error boolean) AS $$
DECLARE
  is_known boolean;
BEGIN
  -- Check against known error patterns
  SELECT EXISTS (
    SELECT 1 FROM known_errors 
    WHERE error_data->>'message' ILIKE pattern
  ) INTO is_known;
  
  -- Insert error if not known
  IF NOT is_known THEN
    INSERT INTO error_logs (data, salon_id, user_id)
    VALUES (
      error_data,
      current_setting('app.current_salon_id', true)::uuid,
      current_setting('app.current_user_id', true)::uuid
    );
  END IF;
  
  RETURN QUERY SELECT is_known;
END;
$$ LANGUAGE plpgsql;