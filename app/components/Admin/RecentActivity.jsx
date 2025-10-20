'use client';

export default function RecentActivity() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Recent Activity</h3>
      <p className="text-sm text-gray-500">No recent activity to display.</p>
      {/* Logic to fetch and display recent signups, subscriptions, etc. will go here */}
    </div>
  );
}
