import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  tenants: defineTable({
    name: v.string(),
    slug: v.string(),
    paystackKey: v.string(),
    theme: v.any(),
    rating: v.optional(v.number()),
    reviewCount: v.optional(v.number()),
    ogImage: v.optional(v.string()),
    logo: v.optional(v.string()),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    openingHours: v.optional(v.array(v.object({
      schema: v.any(),
    }))),
  }).index("by_name", ["name"]).index("by_slug", ["slug"]),
  services: defineTable({ tenantId: v.id('tenants'), name: v.string(), price: v.number(), duration: v.number(), bundles: v.optional(v.array(v.string())) }).index("by_tenantId", ["tenantId"]),
  bookings: defineTable({ tenantId: v.id('tenants'), userId: v.string(), serviceIds: v.array(v.id('services')), start: v.number(), status: v.union(v.literal('booked'), v.literal('cancelled'), v.literal('completed')), amount: v.number(), loyaltyEarned: v.number() }).index("by_userId", ["userId"]).index("by_tenantId_start", ["tenantId", "start"]),
  loyalty: defineTable({ tenantId: v.id('tenants'), userId: v.string(), points: v.number() }).index("by_userId", ["userId"]),
  pricingTiers: defineTable({
    name: v.string(),
    price: v.number(),
    features: v.array(v.string()),
  }),
  posts: defineTable({
    title: v.string(),
    slug: v.string(),
    author: v.string(),
    content: v.string(),
    ogImage: v.optional(v.string()),
  }).index("by_slug", ["slug"]),
  comparisonItems: defineTable({
    name: v.string(),
    features: v.array(v.object({
      name: v.string(),
      supported: v.boolean(),
    })),
  }),
  events: defineTable({
    name: v.string(),
    description: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    location: v.string(),
  }),
  referrals: defineTable({
    code: v.string(),
    inviterId: v.string(),
    redeemedBy: v.optional(v.array(v.string())),
  }).index("by_code", ["code"]),
});