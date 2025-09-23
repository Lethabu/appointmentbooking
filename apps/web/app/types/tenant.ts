export interface TenantConfig {
  id: number;
  tenant_id: string;
  primaryColor: string;
  created_at: string;
}

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  created_at: string;
  config: TenantConfig[];
}