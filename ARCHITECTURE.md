# Multi-Tenant SaaS Platform - Architecture Plan

## 1. Tenant Identification System
### Approach
- **Hybrid Resolution**: 
  - Primary: Custom domain → Tenant mapping via `tenants` table
  - Fallback: Subdomain pattern (client-name.your-platform-domain.com)
  - Development: Path-based (/instylehairboutique/*)

### Implementation
```mermaid
sequenceDiagram
    participant Client
    participant Middleware
    participant DB
    
    Client->>Middleware: Request (Host: instyle.example.com)
    Middleware->>DB: Query tenants WHERE domain = 'instyle.example.com'
    alt Domain found
        DB-->>Middleware: Tenant config
        Middleware->>Client: Rewrite to /_tenant/[tenant_id]/...
    else No domain match
        Middleware->>Middleware: Extract subdomain
        Middleware->>DB: Query tenants WHERE subdomain = 'instyle'
        alt Subdomain found
            DB-->>Middleware: Tenant config
            Middleware->>Client: Rewrite to /_tenant/[tenant_id]/...
        else
            Middleware->>Client: 404 or default tenant
        end
    end
```

### Key Components
- `tenants` Table:
  ```sql
  CREATE TABLE tenants (
    id UUID PRIMARY KEY,
    subdomain TEXT UNIQUE,
    custom_domain TEXT UNIQUE,
    name TEXT,
    config JSONB
  );
  ```
- Enhanced Middleware (`app/middleware.js`):
  - Domain resolution with edge caching
  - Tenant context injection via Next.js rewrite headers

## 2. Data Isolation Strategy
### Supabase Schema Design
```mermaid
erDiagram
    tenants ||--o{ services : has
    tenants ||--o{ appointments : has
    tenants ||--o{ users : has
    
    tenants {
        UUID id
        TEXT subdomain
        TEXT custom_domain
        JSONB config
    }
    
    services {
        UUID id
        UUID tenant_id
        TEXT name
        INTEGER price
    }
    
    appointments {
        UUID id
        UUID tenant_id
        TIMESTAMP time
        UUID user_id
    }
    
    users {
        UUID id
        UUID tenant_id
        TEXT email
    }
```

### Security Implementation
- Row Level Security (RLS) Policies:
  ```sql
  -- Services table policy
  CREATE POLICY "Tenant Data Access" ON services
  AS PERMISSIVE FOR ALL
  USING (tenant_id = current_tenant_id())
  WITH CHECK (tenant_id = current_tenant_id());
  ```

- Custom SQL Function:
  ```sql
  CREATE OR REPLACE FUNCTION current_tenant_id()
  RETURNS UUID AS $$
  BEGIN
    RETURN nullif(current_setting('app.current_tenant_id', true), '')::UUID;
  EXCEPTION WHEN others THEN
    RETURN null;
  END;
  $$ LANGUAGE plpgsql;
  ```

## 3. Branding Configuration
### Theme Management
```mermaid
flowchart TD
    A[Tenant Admin] -->|Updates| B(Theme Editor UI)
    B --> C{Change Type}
    C -->|Colors| D[Update tenants.config]
    C -->|Logo| E[Upload to S3]
    C -->|CSS| F[Generate CSS Variables]
    D --> G[Server-side Context]
    E --> G
    F --> G
    G --> H[Client-side Injection]
```

### Storage Strategy
- **Database**: Theme colors, typography in `tenants.config`
- **S3 Bucket**: Tenant-specific assets path: `s3://branding/[tenant_id]/logo.png`
- **CSS Variables**:
  ```css
  :root {
    --primary: [tenant_primary];
    --secondary: [tenant_secondary];
  }
  ```

## 4. Tenant-Aware Authentication
### JWT Claims Structure
```json
{
  "sub": "user_uuid",
  "tenant_id": "tenant_uuid",
  "role": "customer|staff|admin",
  "tenant_role": "owner|manager|stylist"
}
```

### Auth Flow Enhancements
1. Signup: User must belong to a tenant (invite code or domain-bound)
2. Login: Session bound to tenant context
3. API Access: Middleware verifies user's tenant matches request context

### Supabase Client Wrapper
```javascript
// utils/supabase/tenant-client.js
export const createTenantClient = (tenantId) => {
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
  );
  
  return client.setAuthHeaders({
    headers: {
      'X-Tenant-ID': tenantId
    }
  });
};
```

## Implementation Roadmap
1. Phase 1: Tenant Identification & Base Schema (2 weeks)
2. Phase 2: Branding System & Theme Engine (1 week)
3. Phase 3: Auth System Overhaul (1.5 weeks)
4. Phase 4: Migration Strategy (1 week)