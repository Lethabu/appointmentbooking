import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("comparisonItems").collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    features: v.array(v.object({
      name: v.string(),
      supported: v.boolean(),
    })),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("comparisonItems", args);
  },
});