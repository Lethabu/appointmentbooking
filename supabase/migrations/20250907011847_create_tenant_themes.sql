CREATE TABLE tenant_themes (
  tenant_id  UUID PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
  logo_url   TEXT,
  brand_name TEXT,
  header_links JSONB,
  footer_html  TEXT
);
