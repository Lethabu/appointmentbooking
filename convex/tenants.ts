import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    paystackKey: v.string(),
    tier: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    const id = await ctx.db.insert("tenants", {
      ...args,
      paid: false,
    });
    return id;
  },
});

export const updateTier = mutation({
  args: {
    tenantId: v.id("tenants"),
    tier: v.string(),
    paid: v.boolean(),
  },
  handler: async (ctx: any, args: any) => {
    await ctx.db.patch(args.tenantId, {
      tier: args.tier,
      paid: args.paid,
    });
    return { success: true };
  },
});
