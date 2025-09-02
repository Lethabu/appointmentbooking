import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

export const list = query({
  args: { tenantId: v.id('tenants') },
  handler: async (ctx, { tenantId }) => {
    return await ctx.db
      .query('services')
      .filter(q => q.eq(q.field('tenantId'), tenantId))
      .collect();
  },
});

export const get = query({
  args: { id: v.id('services') },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const create = mutation({
  args: {
    tenantId: v.id('tenants'),
    name: v.string(),
    price: v.number(),
    duration: v.number(),
    bundles: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('services', args);
  },
});

export const update = mutation({
  args: {
    id: v.id('services'),
    name: v.optional(v.string()),
    price: v.optional(v.number()),
    duration: v.optional(v.number()),
    bundles: v.optional(v.array(v.string())),
  },
  handler: async (ctx, { id, ...updates }) => {
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id('services') },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});