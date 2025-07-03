-- Security Audit Queries
-- 1. Verify RLS Policies
SELECT * FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 2. Check Service Roles
SELECT rolname, rolbypassrls, rolconnlimit 
FROM pg_roles 
WHERE rolname LIKE 'anon%' OR rolname LIKE 'service%';

-- 3. Audit Sensitive Data Access
SELECT * FROM audit_logs 
WHERE path LIKE '%/client/%' OR path LIKE '%/payment/%'
ORDER BY created_at DESC 
LIMIT 100;

-- 4. Verify Encryption Status
SELECT * FROM pg_encrypted_columns;

-- 5. Check Vulnerability Status
SELECT * FROM dependency_vulnerabilities 
WHERE severity IN ('high', 'critical') 
AND status != 'resolved';

-- 6. API Key Validation
SELECT * FROM api_keys 
WHERE expires_at < NOW() 
OR revoked = true;

-- 7. User Session Audit
SELECT COUNT(*) AS active_sessions, user_id 
FROM active_sessions 
GROUP BY user_id 
HAVING COUNT(*) > 5;

-- 8. Financial Transaction Integrity
SELECT * FROM transactions 
WHERE status = 'failed' 
AND created_at > NOW() - INTERVAL '1 day';