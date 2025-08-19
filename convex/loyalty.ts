import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("loyalty")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  },
});

export const redeemLoyaltyPoints = mutation({
  args: { userId: v.string(), pointsToRedeem: v.number() },
  handler: async (ctx, args) => {
    const existingLoyalty = await ctx.db
      .query("loyalty")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!existingLoyalty || existingLoyalty.points < args.pointsToRedeem) {
      throw new Error("Insufficient loyalty points.");
    }

    // Assuming a simple conversion: 1 point = 1 unit of currency (e.g., 1 ZAR)
    const discountAmount = args.pointsToRedeem;

    await ctx.db.patch(existingLoyalty._id, {
      points: existingLoyalty.points - args.pointsToRedeem,
    });

    return discountAmount;
  },
});

export const redeemReferralCode = mutation({
  args: { referralCode: v.string(), newUserId: v.string() },
  handler: async (ctx, args) => {
    const referral = await ctx.db
      .query("referrals")
      .withIndex("by_code", (q) => q.eq("code", args.referralCode))
      .first();

    if (!referral) {
      throw new Error("Invalid referral code.");
    }

    if (referral.redeemedBy && referral.redeemedBy.includes(args.newUserId)) {
      throw new Error("Referral code already redeemed by this user.");
    }

    // Add 500 points to the inviter's loyalty
    const inviterLoyalty = await ctx.db
      .query("loyalty")
      .withIndex("by_userId", (q) => q.eq("userId", referral.inviterId))
      .first();

    if (inviterLoyalty) {
      await ctx.db.patch(inviterLoyalty._id, {
        points: inviterLoyalty.points + 500,
      });
    } else {
      // Create new loyalty record for inviter if it doesn't exist
      await ctx.db.insert("loyalty", {
        tenantId: "instyle", // Placeholder, needs to be dynamic
        userId: referral.inviterId,
        points: 500,
      });
    }

    // Mark the referral code as used by the new user
    await ctx.db.patch(referral._id, {
      redeemedBy: [...(referral.redeemedBy || []), args.newUserId],
    });

    return true;
  },
});
