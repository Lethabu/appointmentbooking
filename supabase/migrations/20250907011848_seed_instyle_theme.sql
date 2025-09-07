-- Seed the theme for the Instyle tenant by looking up its ID via the slug
INSERT INTO tenant_themes(tenant_id, logo_url, brand_name, header_links, footer_html)
SELECT
  id,
  'https://assets.instylehairboutique.co.za/logo-white.svg',
  'Instyle Hair Boutique',
  '[{"label":"Home","href":"/"},{"label":"Shop","href":"/shop"},{"label":"Book","href":"/book"},{"label":"Login","href":"/login"}]',
  '<p>© 2025 Instyle Hair Boutique – All rights reserved.</p>'
FROM tenants
WHERE slug = 'instylehairboutique'
ON CONFLICT (tenant_id) DO UPDATE
SET
  logo_url = EXCLUDED.logo_url,
  brand_name = EXCLUDED.brand_name,
  header_links = EXCLUDED.header_links,
  footer_html = EXCLUDED.footer_html;
