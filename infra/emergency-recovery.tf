terraform {
  required_providers {
    vercel = {
      source = "vercel/vercel"
      version = "~> 0.4"
    }
    cloudflare = {
      source = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

# Vercel project configuration
resource "vercel_project" "tenant_wrapper" {
  name      = "appointmentbooking-tenant-wrapper"
  framework = "nextjs"
  
  environment = [
    {
      key    = "NEXT_PUBLIC_SUPABASE_URL"
      value  = var.supabase_url
      target = ["production", "preview"]
    },
    {
      key    = "SUPABASE_SERVICE_ROLE_KEY"
      value  = var.supabase_service_role_key
      target = ["production", "preview"]
    }
  ]
}

# Domain assignments
resource "vercel_project_domain" "instyle_vanity" {
  project_id = vercel_project.tenant_wrapper.id
  domain     = "www.instylehairboutique.co.za"
}

resource "vercel_project_domain" "instyle_subdomain" {
  project_id = vercel_project.tenant_wrapper.id
  domain     = "instylehairboutique.appointmentbooking.co.za"
}

# Cloudflare DNS records
resource "cloudflare_record" "instyle_cname" {
  zone_id = var.cloudflare_zone_id
  name    = "instylehairboutique"
  value   = "cname.vercel-dns.com"
  type    = "CNAME"
  proxied = true
}

# Cloudflare page rules for caching
resource "cloudflare_page_rule" "tenant_cache" {
  zone_id  = var.cloudflare_zone_id
  target   = "*.appointmentbooking.co.za/*"
  priority = 1

  actions {
    cache_level = "cache_everything"
    edge_cache_ttl = 300 # 5 minutes
    browser_cache_ttl = 300
  }
}
