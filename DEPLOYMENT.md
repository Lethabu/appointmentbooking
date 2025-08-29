# Deployment Guide

## Vercel
1. Connect repo to Vercel.
2. Configure env variables (Supabase, Convex, RDS, API keys).
3. Ensure `tsconfig.json` uses supported `lib` values (es2022/esnext).
4. Run `vercel build` to test.

## AWS
- RDS configured for persistence.
- Consider Lambda for AI agent execution.

## Multi-Tenant
- Each tenant has domain mapping (example: instylehairboutique.co.za).
- Ensure tenant configs are stored in Supabase.
