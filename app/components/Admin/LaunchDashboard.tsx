'use client';
'use client';
import { useState, useEffect } from 'react';
import { CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { LaunchMetrics, LaunchStage as LaunchStageType } from '@/types';

export default function LaunchDashboard() {
  const [metrics, setMetrics] = useState<LaunchMetrics>({
    traffic_percent: 0,
    request_rate: 0,
    total_requests: 0,
    error_rate: 0,
    error_count: 0,
    p95_latency: 0,
    regions: [],
  });

  const [stages] = useState<LaunchStageType[]>([
    {
      id: 1,
      name: 'Database Migration',
      status: 'completed',
      progress: 100,
      sequence: 1,
    },
    {
      id: 2,
      name: 'API Deployment',
      status: 'in_progress',
      progress: 75,
      sequence: 2,
    },
    {
      id: 3,
      name: 'Frontend Build',
      status: 'pending',
      progress: 0,
      sequence: 3,
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        traffic_percent: Math.min(
          100,
          prev.traffic_percent + Math.random() * 5,
        ),
        request_rate: Math.floor(Math.random() * 50) + 10,
        total_requests: prev.total_requests + Math.floor(Math.random() * 100),
        error_rate: Math.random() * 2,
        p95_latency: Math.floor(Math.random() * 200) + 50,
        regions: [
          { name: 'Cape Town', status: 'operational' },
          { name: 'Johannesburg', status: 'operational' },
        ],
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStageStatus = (
    status: 'completed' | 'in_progress' | 'pending' | 'failed',
  ) => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          icon: CheckCircle,
        };
      case 'in_progress':
        return { bg: 'bg-blue-100', text: 'text-blue-700', icon: Clock };
      case 'failed':
        return { bg: 'bg-red-100', text: 'text-red-700', icon: Clock };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: Clock };
    }
  };

  const LaunchStage = ({ stage }: { stage: LaunchStageType }) => {
    const statusConfig = getStageStatus(stage.status);
    const StatusIcon = statusConfig.icon;

    return (
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg border">
        <div className={`p-2 rounded-full ${statusConfig.bg}`}>
          <StatusIcon className={`w-5 h-5 ${statusConfig.text}`} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{stage.name}</h3>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="h-2 rounded-full bg-blue-500"
              style={{ width: `${stage.progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Launch Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Traffic</h3>
          <p className="text-3xl font-bold mt-2">
            {Math.round(metrics.traffic_percent)}%
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="h-2 rounded-full bg-green-500"
              style={{ width: `${metrics.traffic_percent}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Requests</h3>
          <p className="text-3xl font-bold mt-2">{metrics.request_rate}/s</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Errors</h3>
          <p className="text-3xl font-bold mt-2">
            {metrics.error_rate.toFixed(1)}%
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Latency</h3>
          <p className="text-3xl font-bold mt-2">{metrics.p95_latency}ms</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Launch Sequence</h2>
          <div className="space-y-4">
            {stages.map((stage) => (
              <LaunchStage key={stage.id} stage={stage} />
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">System Status</h2>
          <div className="text-green-600 font-medium">
            All systems operational
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Regions</h3>
            <div className="space-y-2">
              {metrics.regions.map((region) => (
                <div key={region.name} className="flex justify-between">
                  <span>{region.name}</span>
                  <span className="font-medium text-green-600">
                    {region.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
