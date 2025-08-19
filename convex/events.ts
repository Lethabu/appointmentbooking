import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("events").collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    location: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("events", args);
  },
});