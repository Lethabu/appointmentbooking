# 🔧 FUNCTION CONFLICT FIX

## Problem
Two versions of `set_tenant_context` function exist (text and UUID).

## Solution
Go to: https://supabase.com/dashboard/project/awrnkvjitzwzojaonrzo/sql/new

Paste and run this SQL:

```sql
-- Drop all versions of the function
DROP FUNCTION IF EXISTS set_tenant_context(text);
DROP FUNCTION IF EXISTS set_tenant_context(uuid);

-- Create clean version that accepts text
CREATE OR REPLACE FUNCTION set_tenant_context(p_tenant_id text)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.tenant_id', p_tenant_id, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

Then run: `npm run validate:deployment`

**This will fix the function conflict and make validation pass!**