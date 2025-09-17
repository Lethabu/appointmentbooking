'use client';

'use client';

import { useState, useEffect } from 'react';

const activeCampaigns = [
  {
    id: 1,
    name: 'Birthday Discount Campaign',
    type: 'email',
    status: 'active',
    trigger: 'Client birthday',
    message: 'Happy Birthday! Enjoy 20% off your next hair service 🎉',
    sent: 156,
    opened: 89,
    clicked: 23,
    revenue: 'R12,600',
  },
  {
    id: 2,
    name: 'Win-Back Campaign',
    type: 'sms',
    status: 'active',
    trigger: 'No visit in 3 months',
    message: 'We miss you! Come back for 25% off any treatment',
    sent: 89,
    opened: 78,
    clicked: 34,
    revenue: 'R8,950',
  },
  {
    id: 3,
    name: 'Service Reminder',
    type: 'whatsapp',
    status: 'active',
    trigger: '6 weeks after color service',
    message: 'Time for a touch-up? Book your color refresh now!',
    sent: 234,
    opened: 198,
    clicked: 67,
    revenue: 'R15,400',
  },
];

export default function AutomatedMarketing() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    setCampaigns(activeCampaigns);
  }, []);

  const upcomingAutomations = [
    {
      time: 'Today 2:00 PM',
      action: 'Send appointment reminders',
      count: '23 clients',
    },
    {
      time: 'Tomorrow 9:00 AM',
      action: 'Birthday discount emails',
      count: '5 clients',
    },
    {
      time: 'Tomorrow 3:00 PM',
      action: 'Follow-up review requests',
      count: '12 clients',
    },
    {
      time: 'This Weekend',
      action: 'Win-back SMS campaign',
      count: '34 dormant clients',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Active Campaigns Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Automated Marketing
          </h2>
          <button className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600">
            Create Campaign
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    campaign.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {campaign.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-3">{campaign.trigger}</p>
              <p className="text-sm text-gray-800 mb-4 bg-gray-50 p-2 rounded italic">
                "{campaign.message}"
              </p>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Sent:</span>
                  <span className="font-semibold ml-1">{campaign.sent}</span>
                </div>
                <div>
                  <span className="text-gray-500">Opened:</span>
                  <span className="font-semibold ml-1">{campaign.opened}</span>
                </div>
                <div>
                  <span className="text-gray-500">Clicked:</span>
                  <span className="font-semibold ml-1">{campaign.clicked}</span>
                </div>
                <div>
                  <span className="text-gray-500">Revenue:</span>
                  <span className="font-semibold ml-1 text-green-600">
                    {campaign.revenue}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Summary */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            This Month's Performance
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">479</div>
              <div className="text-sm text-gray-600">Messages Sent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">365</div>
              <div className="text-sm text-gray-600">Messages Opened</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">124</div>
              <div className="text-sm text-gray-600">Bookings Made</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">R36,950</div>
              <div className="text-sm text-gray-600">Revenue Generated</div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Automated Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Upcoming Automated Actions
        </h3>
        <div className="space-y-3">
          {upcomingAutomations.map((automation, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <div className="font-medium text-gray-900">
                  {automation.action}
                </div>
                <div className="text-sm text-gray-500">{automation.time}</div>
              </div>
              <div className="text-sm font-medium text-gray-700">
                {automation.count}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          AI Marketing Insights
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900">Optimal Send Times</h4>
            <p className="text-sm text-blue-700">
              Your clients are most likely to open messages on Tuesday-Thursday
              between 2-4 PM
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900">High-Value Clients</h4>
            <p className="text-sm text-green-700">
              23 clients are due for their regular service - automated reminders
              scheduled
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-900">At-Risk Clients</h4>
            <p className="text-sm text-yellow-700">
              15 regular clients haven't booked in 6+ weeks - win-back campaign
              recommended
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
