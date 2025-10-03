CREATE TABLE tenant_themes (
  tenant_id  UUID PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
  logo_url   TEXT,
  brand_name TEXT,
  primary_color TEXT,
  header_links JSONB,   -- [{ "label":"Home","href":"/" }, …]
  footer_html  TEXT
);
