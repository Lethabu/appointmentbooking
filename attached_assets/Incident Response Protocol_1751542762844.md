1. **Identification**:
   - Check Datadog/Sentry alerts
   - Confirm in #incidents channel

2. **Containment**:
   - If database issue: Enable read-only mode
   - If traffic surge: Enable rate limiting
   - If payment failure: Switch to failover gateway

3. **Resolution**:
   - Use playbook: `/runbooks/<service>.md`
   - Maximum 30m troubleshooting before rollback

4. **Recovery**:
   - Verify fix with canary deployment
   - Gradually restore traffic
   - Post-mortem within 24 hours