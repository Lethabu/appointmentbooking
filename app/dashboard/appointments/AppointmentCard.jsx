'use client'

import {
  CalendarIcon,
  ClockIcon,
  TagIcon,
  CheckCircleIcon,
  XCircleIcon,
  QuestionMarkCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'

export default function AppointmentCard({ appointment }) {
  const appointmentDate = new Date(appointment.start_time)
  const isPast = appointmentDate < new Date()

  const statusStyles = {
    pending: { icon: QuestionMarkCircleIcon, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    confirmed: { icon: CheckCircleIcon, color: 'text-blue-600', bg: 'bg-blue-100' },
    in_progress: { icon: ArrowPathIcon, color: 'text-indigo-600', bg: 'bg-indigo-100', animate: 'animate-spin' },
    completed: { icon: CheckCircleIcon, color: 'text-green-600', bg: 'bg-green-100' },
    cancelled: { icon: XCircleIcon, color: 'text-red-600', bg: 'bg-red-100' },
    scheduled: { icon: CalendarIcon, color: 'text-gray-600', bg: 'bg-gray-100' },
  }

  const statusInfo = statusStyles[appointment.status] || statusStyles.pending

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${isPast ? 'border-gray-300 opacity-80' : 'border-indigo-500'}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-lg text-gray-800">{appointment.services?.name || 'Service not found'}</p>
          <p className="text-sm text-gray-600">{appointment.clients?.name || 'Client not found'}</p>
        </div>
        <div className={`flex items-center text-sm font-medium px-3 py-1 rounded-full ${statusInfo.bg} ${statusInfo.color}`}>
          <statusInfo.icon className={`h-4 w-4 mr-1.5 ${statusInfo.animate || ''}`} />
          {appointment.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </div>
      </div>
      <div className="mt-4 space-y-2 text-sm text-gray-700">
        <div className="flex items-center">
          <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
          <span>{appointmentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <div className="flex items-center">
          <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
          <span>{appointmentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
        </div>
        <div className="flex items-center">
          <TagIcon className="h-4 w-4 mr-2 text-gray-400" />
          <span>R{(appointment.services?.price / 100).toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}