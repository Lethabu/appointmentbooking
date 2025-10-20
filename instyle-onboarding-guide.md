# Instyle Onboarding Guide

This guide details the steps to onboard the Instyle Hair Boutique tenant to the new platform.

## 1. Create Firebase Tenant

1.  Navigate to the **Firebase Console** > **Authentication** > **Tenants**.
2.  Click **Add Tenant**.
3.  **Display Name**: `Instyle Hair Boutique`
4.  Click **Save**.
5.  Copy the **Tenant ID** for the newly created tenant.

## 2. Generate Custom Theme

1.  Open a terminal and use the following `curl` command to generate the Instyle theme. Replace `YOUR_AUTH_TOKEN` with a valid Firebase JWT for a user in the Instyle tenant.

```bash
curl -X POST \
  http://localhost:3000/api/generate-component \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "componentType": "theme",
    "brandInfo": {
      "name": "Instyle Hair Boutique",
      "colors": {
        "primary": "#D946EF",
        "secondary": "#FDF4FF",
        "accent": "#A855F7",
        "text": "#1F2937"
      },
      "font": "Poppins"
    }
  }'
```

2.  The API will return a JSON object with the HTML and CSS for the theme. Save this to a file named `instyle-theme.json`.

## 3. Sync Theme to Vercel Edge Config

1.  Follow the instructions in `stitch-setup.md` to set up the Stitch pipeline if you have not already done so.
2.  Manually trigger a sync of the `tenant_components` table in the Stitch UI.
3.  Alternatively, you can insert the new theme data directly into the `tenant_components` table in your Supabase database. This will automatically trigger the Stitch pipeline.

```sql
-- Replace with the actual tenant_id for Instyle
INSERT INTO tenant_components(tenant_id, comp_type, comp_name, html_chunk, css)
VALUES
('YOUR_INSTYLE_TENANT_ID', 'theme', 'InstyleTheme', '...', '...');
```

4.  Once the pipeline has completed, the new theme will be available in the Vercel Edge Config and will be applied to the Instyle tenant site.
