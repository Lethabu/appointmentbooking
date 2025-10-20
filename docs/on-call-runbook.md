# On-Call Runbook: Brand Leak Detected

**Alert:** "Brand leak detected"

**Objective:** Quickly confirm and mitigate brand leaks in production.

---

## Immediate Action Steps

1.  **Confirm Leak:**
    *   Run `npm run brand-gate -- --domain <vanity>` (replace `<vanity>` with the domain from the alert).
    *   **Expected Output:** `🚫 FAIL – X leak(s) detected`
    *   If output is `✅ OK`, investigate the alerting system for false positive.

2.  **Mitigate (Immediate Promote Previous Deployment):**
    *   If leak is confirmed, immediately promote the previous successful deployment.
    *   **Vercel (Example):** Go to Vercel Dashboard -> Project -> Deployments -> Find last successful deployment -> Click "Promote to Production".
    *   **Objective:** Restore a known good state as quickly as possible.

3.  **Open Incident:**
    *   Open a new incident in your incident management system (e.g., PagerDuty, Jira Service Management).
    *   Attach the output of the `npm run brand-gate` command to the incident.

---

## Post-Mitigation Steps (Handover to Development Team)

1.  **Root Cause Analysis:** Development team to investigate the root cause of the leak.
2.  **Fix in PR:** Implement the fix in a new Pull Request.
3.  **Brand-Gate Validation:** Ensure the PR passes the Brand-Gate check before merging.

---

## Target Recovery Time Objective (RTO)

*   **Target:** < 5 minutes (from alert to mitigation)
