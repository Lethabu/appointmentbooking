'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function ROIWidget() {
  const roiStats = useQuery(api.roi.getROIStats);

  if (!roiStats) {
    return <div>Loading ROI stats...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Calculate Your ROI</h2>
      <p className="text-gray-600 mb-6">
        See how much time and money your salon can save with our platform.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-3xl font-bold text-blue-600">R{roiStats.averageSavingsPerSalon}</p>
          <p className="text-sm text-gray-500">Average Monthly Savings</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-3xl font-bold text-green-600">{roiStats.averageTimeSavedHours}h</p>
          <p className="text-sm text-gray-500">Average Time Saved</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <p className="text-3xl font-bold text-purple-600">{roiStats.averageNewClients}</p>
          <p className="text-sm text-gray-500">Average New Clients</p>
        </div>
      </div>
    </div>
  );
}
