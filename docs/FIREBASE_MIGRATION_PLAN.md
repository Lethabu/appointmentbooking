# Pragmatic Firebase Migration Plan to Supabase

## Overview
This plan outlines the migration from Firebase to Supabase for realtime features and authentication in the multi-tenant appointment booking platform. Audits revealed Firebase exposure (e.g., exposed keys in client code, auth mismatches with agents), favoring Supabase for better isolation via RLS, freemium scaling, and alignment with existing stack (Next.js 14, Clerk). The migration is reverse-compatible where needed but prioritizes Supabase for auth/realtime (e.g., chat, bookings). No full rewrite; focus on data export/import, code redirects, and testing. Estimated time: 2-4 days; cost: $0 (Supabase Spark tier).

Key benefits:
- **Security**: RLS enforces tenant isolation; remove exposed Firebase keys.
- **Consistency**: Unified Supabase for DB/auth/realtime; Clerk for user pools.
- **Minimal Downtime**: Phased rollout with feature flags; rollback via backups.
- **Freemium**: Supabase free tier handles initial load; no Firebase billing.

Assumptions: Firebase project has auth users, realtime DB (e.g., chat messages, bookings), Firestore (if used). Supabase project ready with schemas (from tenant onboarding spec).

## Migration Steps

### 1. Preparation & Audit (1 day)
- **Audit Firebase Usage**: Scan codebase for Firebase imports (`grep -r "firebase" lib/ components/ app/`).
  - Identified: `lib/firebase.ts` (client init), `lib/firebase-admin.ts` (server), realtime listeners in chat/agent components.
  - Document dependencies: Auth (signInWithPhone), Realtime (chat, availability), Storage (logos).
- **Backup Firebase**: Export all data via Firebase Console (Auth: users.json; Realtime: JSON dump; Firestore: if any, CSV/JSON).
  - Use Firebase CLI: `firebase data:export --project=your-project backup-$(date +%Y%m%d)`.
- **Setup Supabase Equivalents**:
  - Auth: Enable Phone auth in Supabase dashboard; migrate to Clerk integration where possible.
  - Realtime: Create tables (e.g., `chat_messages`, `availability_slots`) with RLS: `auth.uid() = user_id AND tenant_id = (select tenant_id from users where id = auth.uid())`.
  - Storage: Migrate to Supabase Storage buckets per tenant (e.g., `tenants/{tenant_id}/logos`).
- **Update Scripts**: Modify `scripts/migration.py` (create if missing) for data import.

### 2. Data Export from Firebase & Import to Supabase (1 day)
- **Export Firebase Data**:
  - Auth Users: `firebase auth:export users.json --project=your-project --format=json`.
  - Realtime DB: Use Admin SDK script to dump JSON (e.g., `admin.database().ref().once('value')`).
  - Storage: Download files via `gsutil` or Firebase SDK; organize by tenant.
- **Import to Supabase** (via updated `scripts/migration.py`):
  - Install deps: `pip install firebase-admin supabase python-dotenv`.
  - Script Snippet (update/create `scripts/migration.py`):
```python
import json
import os
from firebase_admin import credentials, auth, db
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Firebase setup
cred = credentials.Certificate('path/to/service-account.json')
firebase_admin.initialize_app(cred, {'databaseURL': 'https://your-project.firebaseio.com'})

# Supabase setup
supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
supabase: Client = create_client(supabase_url, supabase_key)

def migrate_auth_users():
    users = auth.list_users().iterate_all()
    for user in users:
        # Map Firebase UID to Supabase user (use Clerk for new auth)
        supabase.table('users').insert({
            'id': user.uid,
            'email': user.email or None,
            'phone': user.phone_number or None,
            'tenant_id': extract_tenant_from_user(user),  # Custom logic
            'created_at': user.metadata.creation_timestamp
        }).execute()

def migrate_realtime_data():
    ref = db.reference('chat_messages')  # Example path
    data = ref.get()
    for key, message in data.items():
        supabase.table('chat_messages').insert({
            'id': key,
            'tenant_id': message.get('tenant_id'),
            'user_id': message.get('user_id'),
            'content': message.get('content'),
            'timestamp': message.get('timestamp')
        }).execute()  # RLS will validate on insert

def migrate_storage():
    # Download from Firebase Storage, upload to Supabase
    bucket = storage.bucket('your-project.appspot.com')
    blobs = bucket.list_blobs(prefix='tenants/')
    for blob in blobs:
        if blob.name.endswith('/'): continue
        content = blob.download_as_bytes()
        tenant_id = blob.name.split('/')[1]
        supabase.storage.from_(f'tenants/{tenant_id}').upload(blob.name.split('/')[-1], content)

if __name__ == '__main__':
    migrate_auth_users()
    migrate_realtime_data()
    migrate_storage()
    print('Migration complete')
```
  - Run: `python scripts/migration.py` (test on staging Supabase first).
  - Handle Conflicts: Use upsert for users/bookings; log errors to `migration_logs` table.

### 3. Code Updates: Redirect Firebase to Supabase (1 day)
- **Update lib/firebase.ts to lib/supabase.ts**:
  - Rename/move `lib/firebase.ts` to `lib/supabase-legacy.ts` (for redirects).
  - Create `lib/supabase.ts` with equivalents:
```typescript
// lib/supabase.ts (new)
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

export const supabase = createClientComponentClient<Database>();

// Realtime: Replace Firebase listeners
export function onRealtimeValue(path: string, callback: (data: any) => void, tenantId: string) {
  const channel = supabase.channel(`realtime:${path}`);
  channel.on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: path.split('/')[0],  // e.g., 'chat_messages'
    filter: `tenant_id=eq.${tenantId}`  // RLS filter
  }, callback).subscribe();
  return () => channel.unsubscribe();
}

// Auth: Migrate to Supabase/Clerk
export async function signInWithPhone(phone: string) {
  const { data, error } = await supabase.auth.signInWithOtp({ phone });
  if (error) throw error;
  return data;
}

// Redirects: In components using Firebase, update imports
// e.g., import { supabase } from '@/lib/supabase'; // Instead of firebase
```
  - Search/Replace: `grep -r "import.*firebase" . | xargs sed -i 's/firebase/supabase/g'` (review manually).
  - Admin SDK: Update `lib/firebase-admin.ts` to Supabase server client with service key.
  - Feature Flag: Use `process.env.USE_SUPABASE === 'true'` to toggle; default to true post-migration.
- **Handle Legacy**: For agent repo mismatches, update `temp-agent-repo/services/firebase.ts` similarly.

### 4. Testing Plan (0.5 day)
- **Unit Tests (Jest)**: Test redirects and RLS.
```typescript
// __tests__/supabase-migration.test.ts
import { supabase } from '@/lib/supabase';

describe('Supabase Migration', () => {
  test('Realtime listener enforces RLS', async () => {
    // Mock supabase.channel
    const mockCallback = jest.fn();
    onRealtimeValue('chat_messages', mockCallback, 'instyle');
    // Verify filter includes tenant_id
    expect(mockCallback).not.toHaveBeenCalledWith(expect.objectContaining({ tenant_id: 'other' }));
  });

  test('Auth signInWithPhone works', async () => {
    const { data } = await signInWithPhone('+27123456789');
    expect(data).toHaveProperty('session');
  });

  test('Data import integrity', () => {
    // Compare counts: Supabase vs Firebase export
    const { data: count } = supabase.from('chat_messages').select('count').eq('tenant_id', 'instyle');
    expect(count[0].count).toBe(100);  // Expected from export
  });
});
```
Run: `npm test -- supabase-migration`.
- **Integration Tests**: Use MSW to mock Supabase; test booking flow with realtime updates.
- **E2E Tests (Playwright)**: Simulate user login/chat; verify no Firebase calls (`npx playwright test --grep "no firebase"`).
- **Load Tests**: Artillery on realtime subscriptions (50 users/tenant); ensure <1s latency.
- **Security Tests**: Attempt cross-tenant queries (should fail via RLS); scan for remaining Firebase keys (`grep -r "firebase" .`).
- **Rollback Tests**: Toggle flag to Firebase; confirm no data loss.
- **Coverage**: 90% for migrated code; include edge cases (e.g., phone auth OTP).

### 5. Rollout & Monitoring (0.5 day)
- **Staged Rollout**: Deploy to staging; test with Instyle tenant first.
- **Downtime Mitigation**: Dual-write during transition (Firebase + Supabase); sync via cron job.
- **Go-Live**: Set `USE_SUPABASE=true`; monitor with `scripts/post-deploy-monitor.sh` (add Supabase metrics).
- **Post-Migration**: Delete Firebase project; update docs (e.g., README.md); notify tenants.
- **Rollback**: Revert flag to false; restore from Firebase backups; re-export if needed.

## Risks & Mitigations
- **Data Loss**: Backups + transactions in import script.
- **Auth Breaks**: Clerk fallback; manual user reset if needed.
- **Realtime Lag**: Supabase subscriptions faster; test thoroughly.
- **Cost**: Monitor Supabase usage; free tier limits (500k rows).

This plan ensures a secure, isolated migration without disrupting production bookings or agents.