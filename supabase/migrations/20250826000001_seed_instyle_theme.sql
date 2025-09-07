-- Seed the Instyle theme
INSERT INTO tenant_themes (tenant_id, logo_url, brand_name, primary_color, header_links, footer_html)
SELECT 
  t.id,
  'https://assets.instylehairboutique.co.za/logo-white.svg',
  'Instyle Hair Boutique',
  '#e1a455',
  '[{"label":"Home","href":"/"},{"label":"Shop","href":"/shop"},{"label":"Book","href":"/book"}]',
  '<p>© 2025 Instyle Hair Boutique – All rights reserved.</p>'
FROM tenants t
WHERE t.subdomain = 'instylehairboutique'
ON CONFLICT (tenant_id) 
DO UPDATE SET
  logo_url = EXCLUDED.logo_url,
  brand_name = EXCLUDED.brand_name,
  primary_color = EXCLUDED.primary_color,
  header_links = EXCLUDED.header_links,
  footer_html = EXCLUDED.footer_html;
