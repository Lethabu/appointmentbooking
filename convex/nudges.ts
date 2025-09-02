import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// This function will be scheduled to run periodically
export const checkLowBookingActivity = internalAction({
  handler: async (ctx) => {
    const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;

    // Get all tenants
    const tenants = await ctx.runQuery(api.tenants.list);

    for (const tenant of tenants) {
      const bookings = await ctx.runQuery(api.bookings.getByTenantIdAndDateRange, {
        tenantId: tenant._id,
        startTime: twoWeeksAgo,
        endTime: Date.now(),
      });

      if (bookings.length < 3) {
        // Send Slack DM to customer success
        // This is a placeholder for the actual Slack API call
        console.log(`Low booking activity for tenant: ${tenant.name}. Bookings: ${bookings.length}`);
        // await sendSlackDM(tenant.name, bookings.length);
      }
    }
  },
});
