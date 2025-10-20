#!/usr/bin/env node

const { Command } = require('commander');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const program = new Command();

// Check for required environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required.');
  process.exit(1);
}

// Create a Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Function to create CNAME record in Cloudflare
async function createCloudflareCname(subdomain, domain, cloudflareApiKey, cloudflareZoneId) {
  const cnameName = `${subdomain}-cdn`;
  const cnameTarget = 'cname.vercel-dns.com'; // As per the plan

  try {
    const response = await axios.post(
      `https://api.cloudflare.com/client/v4/zones/${cloudflareZoneId}/dns_records`,
      {
        type: 'CNAME',
        name: cnameName,
        content: cnameTarget,
        ttl: 120, // As per the plan
        proxied: true // Recommended for performance and security
      },
      {
        headers: {
          'Authorization': `Bearer ${cloudflareApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.success) {
      console.log(`Cloudflare CNAME record created: ${cnameName}.${domain} -> ${cnameTarget}`);
    } else {
      throw new Error(`Cloudflare API error: ${JSON.stringify(response.data.errors)}`);
    }
  } catch (error) {
    console.error('Error creating Cloudflare CNAME record:', error.message);
    throw error;
  }
}

program
  .name('onboard')
  .description('CLI to onboard a new tenant')
  .version('1.0.0');

program
  .command('new')
  .description('Onboard a new tenant')
  .requiredOption('-n, --name <name>', 'Name of the tenant')
  .requiredOption('-d, --domain <domain>', 'Custom domain of the tenant')
  .requiredOption('-s, --subdomain <subdomain>', 'Subdomain of the tenant')
  .action(async (options) => {
    console.log('Onboarding new tenant...');
    console.log('Options:', options);

    // Check for Cloudflare environment variables
    const cloudflareApiKey = process.env.CLOUDFLARE_API_KEY;
    const cloudflareZoneId = process.env.CLOUDFLARE_ZONE_ID;

    if (!cloudflareApiKey || !cloudflareZoneId) {
      console.warn('Warning: CLOUDFLARE_API_KEY and CLOUDFLARE_ZONE_ID not set. Skipping Cloudflare DNS setup.');
    }

    try {
      // 1. Insert new tenant into the salons table
      const { data: salon, error: salonError } = await supabase
        .from('salons')
        .insert([
          { name: options.name, subdomain: options.subdomain, custom_domain: options.domain },
        ])
        .select()
        .single();

      if (salonError) {
        throw salonError;
      }

      console.log('New salon created:', salon);

      // 2. Generate and insert header and footer components
      const { error: componentsError } = await supabase
        .from('tenant_components')
        .insert([
          {
            tenant_id: salon.id,
            comp_type: 'header',
            comp_name: `${options.name} Header`,
            html_chunk: `<header><h1>Welcome to ${options.name}</h1></header>`,
            css: ':root { --primary: #000; }',
          },
          {
            tenant_id: salon.id,
            comp_type: 'footer',
            comp_name: `${options.name} Footer`,
            html_chunk: `<footer><p>&copy; 2025 ${options.name}</p></footer>`,
            css: '{}',
          },
        ]);

      if (componentsError) {
        throw componentsError;
      }

      console.log('Header and footer components created.');

      // 3. Create Cloudflare CNAME record (if API keys are set)
      if (cloudflareApiKey && cloudflareZoneId) {
        await createCloudflareCname(options.subdomain, options.domain, cloudflareApiKey, cloudflareZoneId);
      } else {
        console.warn('Cloudflare DNS setup skipped due to missing API keys.');
      }

      console.log('Tenant onboarded successfully!');

    } catch (error) {
      console.error('Error onboarding tenant:', error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);