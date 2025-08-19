import { query } from "./_generated/server";

export const getROIStats = query({
  handler: async (ctx) => {
    // Placeholder for actual ROI calculation
    // In a real scenario, this would fetch data from bookings, services, etc.
    return {
      averageSavingsPerSalon: 1500, // Monthly savings in ZAR
      averageTimeSavedHours: 20, // Hours saved per month
      averageNewClients: 5, // New clients per month
    };
  },
});
