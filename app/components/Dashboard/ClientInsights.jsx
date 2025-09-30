'use client';
import { useState, useEffect } from 'react';

export default function ClientInsights() {
  const [insights, setInsights] = useState({
    topClients: [
      {
        name: 'Zanele Langa',
        visits: 12,
        lastVisit: '2025-01-17',
        service: 'Middle & Side',
      },
      {
        name: 'Lilly (Rapelang)',
        visits: 8,
        lastVisit: '2025-01-16',
        service: 'Middle & Side',
      },
      {
        name: 'Keatlaretse Makapela',
        visits: 7,
        lastVisit: '2025-01-15',
        service: 'Middle & Side',
      },
      {
        name: 'Rejoyce Hlongwane',
        visits: 6,
        lastVisit: '2025-01-14',
        service: 'Middle & Side',
      },
      {
        name: 'Yolanda',
        visits: 5,
        lastVisit: '2025-01-13',
        service: 'Middle & Side',
      },
    ],
    serviceStats: {
      'Middle & Side Installation': { count: 380, percentage: 85 },
      'Maphondo & Lines Installation': { count: 67, percentage: 15 },
    },
    monthlyTrends: {
      bookings: 45,
      revenue: 67500,
      newClients: 12,
      repeatRate: 78,
    },
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6">Client Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Top Clients</h3>
          <div className="space-y-3">
            {insights.topClients.map((client, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-3 bg-gray-50 rounded"
              >
                <div>
                  <p className="font-medium">{client.name}</p>
                  <p className="text-sm text-gray-600">
                    {client.visits} visits • {client.service}
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  {client.lastVisit}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Service Popularity</h3>
          <div className="space-y-4">
            {Object.entries(insights.serviceStats).map(([service, stats]) => (
              <div key={service}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{service}</span>
                  <span className="text-sm text-gray-600">
                    {stats.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${stats.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.count} bookings
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900">Monthly Summary</h4>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-blue-700">Bookings</p>
                <p className="font-bold text-blue-900">
                  {insights.monthlyTrends.bookings}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700">Revenue</p>
                <p className="font-bold text-blue-900">
                  R{(insights.monthlyTrends.revenue / 100).toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
