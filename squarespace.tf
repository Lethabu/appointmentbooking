terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

variable "cloudflare_zone_id" {
  description = "The Cloudflare zone ID for the domain."
  type        = string
}

# TXT record for Firebase verification
resource "cloudflare_record" "firebase_verification" {
  zone_id = var.cloudflare_zone_id
  name    = "@"
  type    = "TXT"
  value   = "your-firebase-verification-value" # Replace with your actual Firebase verification value
  ttl     = 3600
}

# A record for the root domain
resource "cloudflare_record" "root_domain" {
  zone_id = var.cloudflare_zone_id
  name    = "@"
  type    = "A"
  value   = "199.36.158.100"
  proxied = true
}

# A record for the www subdomain
resource "cloudflare_record" "www_subdomain" {
  zone_id = var.cloudflare_zone_id
  name    = "www"
  type    = "A"
  value   = "199.36.158.100"
  proxied = true
}
