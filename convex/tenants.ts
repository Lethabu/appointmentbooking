import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db.query('tenants').filter(q => q.eq(q.field('slug'), slug)).first();
  },
});

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query('tenants').collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    paystackKey: v.string(),
    tier: v.optional(v.union(v.literal('starter'), v.literal('pro'), v.literal('scale'))),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('tenants', {
      ...args,
      theme: {},
      tier: args.tier || 'starter',
      trialDays: 14,
      isActive: true,
    });
  },
});

export const updateTier = mutation({
  args: {
    tenantId: v.id('tenants'),
    tier: v.union(v.literal('starter'), v.literal('pro'), v.literal('scale')),
    paid: v.boolean(),
  },
  handler: async (ctx, { tenantId, tier, paid }) => {
    await ctx.db.patch(tenantId, {
      tier,
      trialDays: paid ? undefined : 14,
    });
  },
});