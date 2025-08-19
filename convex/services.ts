import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { tenantName: v.string() },
  handler: async (ctx, args) => {
    const tenant = await ctx.db
      .query("tenants")
      .withIndex("by_name", (q) => q.eq("name", args.tenantName))
      .first();

    if (!tenant) {
      return [];
    }

    return await ctx.db
      .query("services")
      .withIndex("by_tenantId", (q) => q.eq("tenantId", tenant._id))
      .collect();
  },
});
