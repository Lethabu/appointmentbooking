import { createServerSupabaseClient, setTenantContext } from '@/lib/supabase';
import { RealTimeDashboard } from '@/components/dashboard/real-time-dashboard';
import { notFound } from 'next/navigation';

export default async function DashboardPage({ params }: any) {
  const supabase = createServerSupabaseClient();

  // Get tenant by slug
  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('subdomain', params.slug)
    .single();

  if (!tenant) {
    notFound();
  }

  await setTenantContext(tenant.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {tenant.name} - Dashboard
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <RealTimeDashboard tenantId={tenant.id} />

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Quick Book</h3>
            <p className="text-gray-600 mb-4">Create a new appointment</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              New Booking
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Manage Services</h3>
            <p className="text-gray-600 mb-4">Update your service offerings</p>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Edit Services
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">AI Assistant</h3>
            <p className="text-gray-600 mb-4">
              Get insights and recommendations
            </p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              Ask AI
            </button>
          </div>
        </div>

        {/* Typebot Analytics Widget */}
        <div className="mt-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">AI Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">85%</div>
                <div className="text-sm text-gray-600">
                  Chat Resolution Rate
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">12min</div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">94%</div>
                <div className="text-sm text-gray-600">
                  Customer Satisfaction
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
