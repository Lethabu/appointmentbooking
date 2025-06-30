import StatCard from './StatCard'
import {
  CalendarDaysIcon,
  ChatBubbleBottomCenterTextIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

// This would eventually come from a database call
const recentActivities = [
  { id: 1, text: "New booking: Jane Doe for 'Ladies Cut' - Tomorrow @ 2 PM" },
  { id: 2, text: "AI Agent 'Blaze' suggested a new promotion for winter." },
  { id: 3, text: "Client 'Mike R.' completed their 5th visit and is now a VIP." },
]

export default async function DashboardPage() {
  // The DashboardLayout already handles fetching user and salon data.
  // This page component renders inside that layout.

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Here's a quick overview of your salon's performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Upcoming Appointments"
          value="12"
          icon={CalendarDaysIcon}
          color="text-blue-500"
        />
        <StatCard
          title="AI Interactions Today"
          value="47"
          icon={ChatBubbleBottomCenterTextIcon}
          color="text-green-500"
        />
        <StatCard
          title="Growth Opportunities"
          value="3 New"
          icon={SparklesIcon}
          color="text-purple-500"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Activity
        </h2>
        <ul className="space-y-4">
          {recentActivities.map((activity) => (
            <li
              key={activity.id}
              className="text-sm text-gray-700 p-3 bg-gray-50 rounded-md border border-gray-200"
            >
              {activity.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}