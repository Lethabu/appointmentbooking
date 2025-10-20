import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tenants: defineTable({
    name: v.string(),
    slug: v.string(),
    paystackKey: v.string(),
    tier: v.string(),
    paid: v.boolean(),
  }),
});
