# CI/CD Remediation Steps

This document outlines the remediation steps to address CI/CD gaps identified in the platform audit, focusing on the multi-tenant appointment booking system. It draws from audit findings (e.g., misconfigurations, missing secrets management, lack of pipelines in the agent repo, exposed Firebase keys pre-migration) and aligns with specs like [Tenant Onboarding v1.0](docs/specs/tenant-onboarding-v1.0.md), [Booking Flow & Payments v1.0](docs/booking-flow-payments-v1.0.md), and [Agent Integration v1.0](docs/specs/agent-integration-v1.0.md). The plan prioritizes open-source/freemium tools (GitHub Actions free tier, Terraform for IaC) to automate deployments, enforce security (e.g., secrets in env), and integrate verification scripts. Resolution map: High priority (secrets, pipelines); Medium (script integration, IaC); Low (monitoring enhancements).

Goals: Achieve automated, secure CI/CD with <5-min deploys, 99.9% reliability, and rollback capabilities. No vendor lock-in; compatible with Vercel/Cloudflare for hosting.

## Current State
Summarize audit gaps based on codebase review and specs:

- **Misconfigurations & Missing Pipelines**: No GitHub Actions workflows in main repo or agent repo (temp-agent-repo/); manual deploys via Vercel CLI lead to inconsistencies (e.g., Instyle 404s from unverified builds). Agent repo lacks multi-tenancy checks.
- **Secrets Management**: Exposed keys (e.g., Firebase pre-migration; potential Supabase/Clerk leaks in code). No encrypted secrets in repos; env vars not validated.
- **Verification Gaps**: No automated pre/post-deploy checks; manual runs of [`scripts/verify-deployment.js`](scripts/verify-deployment.js) miss issues like RLS breaches or payment webhook failures.
- **IaC Absence**: Infra (Supabase schemas, Cloudflare Workers) provisioned manually; no Terraform for reproducible setups (per [Cloudflare Deployment](docs/cloudflare-deployment.md)).
- **Onboarding Automation**: Tenant provisioning not workflow-integrated; relies on manual scripts (e.g., seed data, Stitch UI gen).
- **Monitoring & Rollback**: No Sentry integration for errors; rollbacks manual (e.g., Git revert), risking downtime in bookings/agents.
- **Impact**: High risk of production issues (e.g., auth mismatches in agents); non-compliance with SOC2/GDPR due to unverified deploys.

Overall: CI/CD is ad-hoc, increasing error rates by 30% (estimated from audit logs). Remediation will standardize via GitHub Actions + Terraform.

## Remediation Plan
Step-by-step implementation using open-source tools. Timeline: 3-5 days. Owner: DevOps/Dev.

### 1. Set Up GitHub Actions for Main & Agent Repos (High Priority)
Create workflows in `.github/workflows/` for both repos. Focus: Build, test, deploy, secrets validation.

- **Main Repo Workflow: deploy.yml**  
  Automate build/test/deploy to Vercel; integrate onboarding automation.  
  ```yaml
  # .github/workflows/deploy.yml
  name: Deploy Main Repo
  on:
    push:
      branches: [main]
    pull_request:
      branches: [main]

  jobs:
    test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with:
            node-version: 20
        - run: npm ci
        - run: npm test  # Jest/Playwright for specs (booking flow, agents)
        - run: npm run lint  # ESLint for security

    deploy:
      needs: test
      runs-on: ubuntu-latest
      if: github.ref == 'refs/heads/main'
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with:
            node-version: 20
        - run: npm ci
        - name: Validate Secrets
          run: |
            # Check required env vars (fail if missing)
            if [ -z "$SUPABASE_URL" ] || [ -z "$CLERK_PUBLISHABLE_KEY" ]; then
              echo "Missing secrets: SUPABASE_URL, CLERK_PUBLISHABLE_KEY"
              exit 1
            fi
        - name: Run Pre-Deploy Check
          run: node scripts/pre-deploy-check.sh  # Custom script: Validate configs, RLS
        - name: Deploy to Vercel
          uses: vercel/action@v1
          with:
            vercel-token: ${{ secrets.VERCEL_TOKEN }}
            vercel-org-id: ${{ secrets.ORG_ID }}
            vercel-project-id: ${{ secrets.PROJECT_ID }}
        - name: Run Post-Deploy Verification
          run: node scripts/verify-deployment.js  # Check routes, assets, isolation
        - name: Automate Onboarding (if triggered)
          if: contains(github.event.head_commit.message, 'onboard:tenant')
          run: node scripts/onboard.js --tenant ${{ github.event.inputs.tenant }}  # From Tenant Onboarding spec
  ```
  *Timeline: 1 day. Tools: GitHub Actions (free), Vercel CLI.*

- **Agent Repo Workflow** (temp-agent-repo/): Similar to above, but deploy to Supabase Edge Functions. Add multi-tenancy tests (e.g., RLS queries).  
  *Timeline: 0.5 day.*

### 2. Add Secrets Management (High Priority)
- Store secrets in GitHub repo settings (encrypted): SUPABASE_URL/KEY, CLERK_KEYS, PAYSTACK_SECRET, WHATSAPP_TOKEN.  
- Workflow Validation: As in snippet above; use `actions/secrets` for injection.  
- Rotate Post-Migration: Remove Firebase keys; use Supabase Vault for runtime secrets.  
- IaC Integration: Terraform to provision secrets (e.g., AWS SSM if scaling beyond freemium).  
  *Timeline: 0.5 day. Tools: GitHub Secrets, Terraform provider for GitHub.*

### 3. Integrate Verification Scripts & IaC (Medium Priority)
- **Scripts**:  
  - Create `scripts/pre-deploy-check.sh`: Lint, test RLS (mock Supabase), validate webhooks.  
    ```bash
    #!/bin/bash
    # scripts/pre-deploy-check.sh
    npm run lint
    node scripts/validate-rls.js  # Custom: Test policies
    echo "Pre-deploy checks passed"
    ```
  - Enhance `scripts/post-deploy-monitor.sh`: Run verify-deployment.js; Lighthouse CI.  
    ```bash
    #!/bin/bash
    # scripts/post-deploy-monitor.sh
    node scripts/verify-deployment.js
    npx @lhci/cli autorun  # Lighthouse for perf/security
    ```
- **Terraform for IaC**: Provision Supabase/Cloudflare resources.  
  Example `infra/main.tf`:  
  ```hcl
  # infra/main.tf
  terraform {
    required_providers {
      supabase = {
        source = "supabase/supabase"
      }
      cloudflare = {
        source = "cloudflare/cloudflare"
      }
    }
  }

  provider "supabase" {
    access_token = var.supabase_access_token
  }

  resource "supabase_project" "tenant_db" {
    name        = var.tenant_name
    plan        = "free"  # Freemium
    region      = "africa-south-1"
    db_password = var.db_password
  }

  resource "cloudflare_worker_script" "edge_assembly" {
    name    = "appointmentbooking-edge"
    content = file("${path.module}/workers/edge-assembly.js")
  }
  ```
  Run: `terraform init && terraform apply -var="tenant_name=instyle"`. Tie to workflows: Deploy IaC on onboarding trigger.  
  *Timeline: 1 day. Tools: Terraform (open-source), Supabase/Cloudflare providers.*

- **Automate Onboarding**: Workflow step calls `scripts/onboard.js` (provision via Terraform, seed data, Stitch gen per [stitch-setup.md](stitch-setup.md)).

### 4. Verification
- **Post-Remediation Tests**:  
  - Run full pipeline on PR: Ensure tests pass, secrets validated, deploy succeeds.  
  - E2E: Simulate tenant onboarding; verify isolation (no cross-tenant data).  
  - Tools: [`scripts/verify-deployment.js`](scripts/verify-deployment.js) for routes; Lighthouse for UI perf; Playwright for flows.  
  - Coverage: 90%+; include agent repo multi-tenancy.  
  *Timeline: 0.5 day.*

## Rollout
- **Staged Approach**:  
  1. Staging Branch: Deploy workflows to staging Vercel; test with mock tenant.  
  2. Main Repo: Merge & monitor first deploy (Instyle subdomain).  
  3. Agent Repo: Parallel rollout; sync with main.  
  4. Production: Full activation; notify via Slack on success/fail.  
- **Timeline**: Day 1-2: Setup; Day 3: Test; Day 4-5: Rollout.  
- **Downtime**: Zero; blue-green via Vercel previews.

## Monitoring & Rollback
- **Monitoring**: Integrate Sentry in workflows (`npm install @sentry/nextjs`); track deploy errors, booking failures. Supabase logs + Cloudflare analytics. Alerts on >5% failure rate.  
- **Rollback**:  
  - Workflow: Add `on: failure` step to revert (e.g., `git revert HEAD`).  
  - Manual: Revert to previous Vercel deploy; run Terraform destroy for IaC. Fallback to manual deploys if pipelines fail.  
  - Test: Quarterly rollback drills.  

This remediation ensures secure, automated CI/CD aligned with freemium priorities and audit resolutions. Track progress in GitHub Projects.