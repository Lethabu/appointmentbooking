// components/Admin/LaunchDashboard.jsx
'use client'
import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import LaunchStage from './LaunchStage'

export default function LaunchDashboard() {
  const supabase = useSupabaseClient()
  const [stages, setStages] = useState([])
  const [metrics, setMetrics] = useState({})
  const [incidents, setIncidents] = useState([])

  useEffect(() => {
    const fetchStages = async () => {
      const { data } = await supabase
        .from('launch_stages')
        .select('*')
        .order('sequence', { ascending: true })
      setStages(data || [])
    }
    
    const fetchMetrics = async () => {
      const { data } = await supabase
        .rpc('get_launch_metrics')
        .single()
      setMetrics(data || {})
    }
    
    const fetchIncidents = async () => {
      const { data } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
      setIncidents(data || [])
    }
    
    fetchStages()
    fetchMetrics()
    fetchIncidents()
    
    const channel = supabase
      .channel('launch-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'launch_stages' }, fetchStages)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incidents' }, fetchIncidents)
      .subscribe()

    const metricsInterval = setInterval(fetchMetrics, 30000)
    
    return () => {
      channel.unsubscribe()
      clearInterval(metricsInterval)
    }
  }, [])

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Traffic</h3>
          <p className="text-3xl font-bold mt-2">
            {metrics.traffic_percent || 0}%
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="h-2 rounded-full bg-green-500" 
              style={{ width: `${metrics.traffic_percent || 0}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Requests</h3>
          <p className="text-3xl font-bold mt-2">
            {metrics.request_rate || 0}/s
          </p>
          <div className="text-sm text-gray-500 mt-1">
            {metrics.total_requests?.toLocaleString()} total
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Errors</h3>
          <p className="text-3xl font-bold mt-2">
            {metrics.error_rate || 0}%
          </p>
          <div className="text-sm text-gray-500 mt-1">
            {metrics.error_count} errors
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Latency</h3>
          <p className="text-3xl font-bold mt-2">
            {metrics.p95_latency || 0}ms
          </p>
          <div className="text-sm text-gray-500 mt-1">
            p95 across regions
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Launch Sequence</h2>
          <div className="space-y-4">
            {stages.map(stage => (
              <LaunchStage key={stage.id} stage={stage} />
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Active Incidents</h2>
          {incidents.length > 0 ? (
            <ul className="space-y-3">
              {incidents.map(incident => (
                <li key={incident.id} className="border-l-4 border-red-500 pl-3 py-1">
                  <div className="font-medium">{incident.title}</div>
                  <div className="text-sm text-gray-600">
                    {incident.service} • {incident.severity}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(incident.created_at).toLocaleTimeString()}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-green-600 font-medium">No active incidents</div>
          )}
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Deployment Regions</h3>
            <div className="space-y-2">
              {metrics.regions?.map(region => (
                <div key={region.name} className="flex justify-between">
                  <span>{region.name}</span>
                  <span className={`font-medium ${
                    region.status === 'operational' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {region.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}