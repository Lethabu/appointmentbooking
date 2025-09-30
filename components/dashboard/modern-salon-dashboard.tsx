import { useState } from 'react';
import {
  Calendar,
  DollarSign,
  Users,
  Star,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  Edit3,
  MessageCircle,
  TrendingUp,
  Zap,
  Brain,
  Target,
} from 'lucide-react';

interface ModernAppointment {
  id: number;
  clientName: string;
  service: string;
  time: string;
  duration: string;
  status: 'confirmed' | 'pending';
  phone: string;
  price: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  trend?: string;
}

export default function ModernSalonDashboard() {
  const [appointments] = useState<ModernAppointment[]>([
    {
      id: 1,
      clientName: 'Sarah Johnson',
      service: 'Cut & Color',
      time: '10:00 AM',
      duration: '2h 30m',
      status: 'confirmed',
      phone: '+27 123 456 7890',
      price: 450,
    },
    {
      id: 2,
      clientName: 'Mike Chen',
      service: 'Haircut',
      time: '11:30 AM',
      duration: '45m',
      status: 'pending',
      phone: '+27 987 654 3210',
      price: 180,
    },
  ]);

  const [stats] = useState({
    todayAppointments: 8,
    weeklyRevenue: 2450,
    totalClients: 142,
    avgRating: 4.8,
  });

  const getStatusConfig = (status: ModernAppointment['status']) => {
    switch (status) {
      case 'confirmed':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          icon: CheckCircle,
        };
      case 'pending':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          icon: Clock,
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          icon: Clock,
        };
    }
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    trend,
  }: StatCardProps) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">
                {trend}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const AppointmentCard = ({
    appointment,
  }: {
    appointment: ModernAppointment;
  }) => {
    const statusConfig = getStatusConfig(appointment.status);
    const StatusIcon = statusConfig.icon;

    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-gray-900 text-lg">
                {appointment.clientName}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border`}
              >
                <StatusIcon className="w-3 h-3" />
                {appointment.status}
              </span>
            </div>
            <p className="text-purple-600 font-medium mb-1">
              {appointment.service}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {appointment.phone}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {appointment.duration}
              </div>
            </div>
          </div>
          <div className="text-right ml-4">
            <p className="font-bold text-gray-900 text-lg">
              {appointment.time}
            </p>
            <p className="text-green-600 font-semibold">R{appointment.price}</p>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <button className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center justify-center gap-2">
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
          <button className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Confirm
          </button>
          <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium flex items-center justify-center">
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                <span className="text-purple-600">Salon</span> Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back! Here&apos;s your salon overview
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
              S
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Today's Appointments"
            value={stats.todayAppointments}
            icon={Calendar}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            trend="+12% from yesterday"
          />
          <StatCard
            title="Weekly Revenue"
            value={`R${stats.weeklyRevenue.toLocaleString()}`}
            icon={DollarSign}
            color="bg-gradient-to-r from-green-500 to-green-600"
            trend="+8.2% from last week"
          />
          <StatCard
            title="Total Clients"
            value={stats.totalClients}
            icon={Users}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
            trend="+5 new this week"
          />
          <StatCard
            title="Average Rating"
            value={stats.avgRating}
            icon={Star}
            color="bg-gradient-to-r from-amber-500 to-amber-600"
            trend="↑ 0.2 this month"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    Today&apos;s Appointments
                  </h2>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    {appointments.length} active
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium">
                  <MessageCircle className="w-5 h-5" />
                  Send WhatsApp Reminders
                </button>
                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium">
                  <TrendingUp className="w-5 h-5" />
                  View Analytics
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-6 h-6" />
                <h3 className="text-lg font-bold">AI-Powered Features</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-3 bg-white bg-opacity-20 rounded-lg">
                  <Zap className="w-5 h-5 mt-0.5" />
                  <div>
                    <p className="font-medium">Smart Scheduling</p>
                    <p className="opacity-90">Optimal appointment placement</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white bg-opacity-20 rounded-lg">
                  <MessageCircle className="w-5 h-5 mt-0.5" />
                  <div>
                    <p className="font-medium">Auto Marketing</p>
                    <p className="opacity-90">WhatsApp campaigns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
