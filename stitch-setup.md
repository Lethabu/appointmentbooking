# Stitch ETL Setup for Tenant Theme Synchronization

This document outlines the steps to configure a Stitch data pipeline to synchronize tenant theme data from Supabase to BigQuery and trigger Vercel deployments.

## 1. Create a New Stitch Connection

1.  Log in to your Stitch account.
2.  Click on **Add Integration**.
3.  Select **Supabase** as the data source.

## 2. Configure Supabase Source

1.  **Integration Name**: `supabase_tenant_data`
2.  **Host**: Your Supabase project host.
3.  **Port**: `5432`
4.  **Username**: Your Supabase database username.
5.  **Password**: Your Supabase database password.
6.  **Database**: `postgres`
7.  **SSL Mode**: `require`

## 3. Configure BigQuery Destination

1.  Select **BigQuery** as the destination.
2.  Follow the on-screen instructions to authorize Stitch to access your BigQuery project.
3.  **Dataset Name**: `tenant_data`

## 4. Configure the Pipeline

1.  In the Stitch UI, select the `supabase_tenant_data` integration.
2.  Navigate to the **Tables to Replicate** section.
3.  Select the `tenant_components` table.
4.  **Replication Method**: `Full Table Replication`
5.  **Replication Frequency**: Choose a suitable frequency (e.g., every 5 minutes).

## 5. Set up Vercel Webhook

1.  In your Vercel project settings, create a new **Deploy Hook**.
2.  Copy the generated webhook URL.
3.  In Stitch, navigate to the **Webhooks** section of your integration.
4.  Create a new webhook and paste the Vercel Deploy Hook URL.
5.  **Trigger**: `On Successful Replication`

This setup will ensure that whenever the `tenant_components` table is updated in Supabase, the changes are replicated to BigQuery, and a new Vercel deployment is triggered, ensuring that the tenant themes are always up-to-date.
