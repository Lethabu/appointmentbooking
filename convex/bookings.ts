import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api"; // Import api to call other mutations

export const byUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bookings")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const getByTenantIdAndDateRange = query({
  args: { tenantId: v.id("tenants"), startTime: v.number(), endTime: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bookings")
      .withIndex("by_tenantId_start", (q) =>
        q.eq("tenantId", args.tenantId).gte("start", args.startTime).lte("start", args.endTime)
      )
      .collect();
  },
});

export const createBooking = mutation({
  args: {
    tenantId: v.id("tenants"),
    userId: v.string(),
    serviceIds: v.array(v.id("services")),
    start: v.number(),
    amount: v.number(),
    referralCode: v.optional(v.string()), // Add optional referralCode
  },
  handler: async (ctx, args) => {
    const bookingId = await ctx.db.insert("bookings", {
      tenantId: args.tenantId,
      userId: args.userId,
      serviceIds: args.serviceIds,
      start: args.start,
      status: "booked",
      amount: args.amount,
      loyaltyEarned: 0, // Initialize to 0, update after calculation
    });

    // Calculate loyalty points (10% of amount)
    const loyaltyPoints = Math.floor(args.amount * 0.10);

    // Update or create loyalty record
    const existingLoyalty = await ctx.db
      .query("loyalty")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existingLoyalty) {
      await ctx.db.patch(existingLoyalty._id, {
        points: existingLoyalty.points + loyaltyPoints,
      });
    } else {
      await ctx.db.insert("loyalty", {
        tenantId: args.tenantId, // Assuming tenantId is also needed for loyalty
        userId: args.userId,
        points: loyaltyPoints,
      });
    }

    // Update the booking with earned loyalty
    await ctx.db.patch(bookingId, { loyaltyEarned: loyaltyPoints });

    // If referralCode is provided, redeem it
    if (args.referralCode) {
      try {
        await ctx.runMutation(api.loyalty.redeemReferralCode, {
          referralCode: args.referralCode,
          newUserId: args.userId,
        });
      } catch (error) {
        console.error("Error redeeming referral code:", error);
        // Optionally, handle this error (e.g., log it, but don't block booking)
      }
    }

    return bookingId;
  },
});