# Vercel Deploy Hook (run after git push)
curl -X POST https://api.vercel.com/v1/integrations/deploy/prj_abc123/def456

# Database Migration Script
#!/bin/bash
# migrate.sh
SUPABASE_URL=$1
SUPABASE_KEY=$2

# Apply schema changes
psql $SUPABASE_URL -f schema.sql

# Enable RLS policies
psql $SUPABASE_URL -c "ALTER TABLE salons ENABLE ROW LEVEL SECURITY;"
psql $SUPABASE_URL -c "ALTER TABLE services ENABLE ROW LEVEL SECURITY;"
# ... repeat for all tables

# Apply seed data for InStyle
psql $SUPABASE_URL -f seed-instyle.sql