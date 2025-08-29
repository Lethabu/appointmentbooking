# Agents for AppointmentBooking

## Agent Roles

### 1. **Repo Guardian Agent**
- Monitors repo health (dependencies, TypeScript configs).
- Validates builds before deployment.

### 2. **Deployment Agent**
- Handles Vercel + AWS integration.
- Automates domain mapping for tenants.

### 3. **Database Agent**
- Manages Supabase + AWS RDS syncing.
- Ensures migrations and schema updates.

### 4. **AI Agent Ops**
- Runs from `appointmentbookings.agent` repo.
- Manages reminders, automations, analytics.

### 5. **Doc Agent**
- Keeps `.md` files up to date.
- Ensures consistent developer onboarding.

---

## Agent Mapping
- `appointmentbooking`: Repo Guardian Agent, Deployment Agent, Database Agent.
- `appointmentbookings.agent`: AI Agent Ops, Doc Agent.
