# Agents for the Platform

## Agent Roles

### 1. **Repo Guardian Agent**
- Monitors repo health (dependencies, TypeScript configs).
- Validates builds before deployment.

### 2. **Deployment Agent**
- Handles AWS integration.
- Automates domain mapping for tenants.

### 3. **Database Agent**
- Manages Supabase + AWS RDS syncing.
- Ensures migrations and schema updates.

### 4. **AI Agent Ops**
- Runs from `your-platform-agent` repo.
- Manages reminders, automations, analytics.

### 5. **Doc Agent**
- Keeps `.md` files up to date.
- Ensures consistent developer onboarding.

---

## Agent Mapping
- `your-platform-repo`: Repo Guardian Agent, Deployment Agent, Database Agent.
- `your-platform-agent`: AI Agent Ops, Doc Agent.
