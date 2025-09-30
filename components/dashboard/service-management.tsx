// 3. DASHBOARD COMPONENT WITH ERROR HANDLING

// components/dashboard/ServicesManager.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, RefreshCw, Plus, Edit, Trash2 } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price_cents: number;
  category: string;
  is_active: boolean;
  created_at: string;
}

interface ApiResponse {
  success: boolean;
  services: Service[];
  count: number;
  error?: string;
  details?: string;
}

export const ServiceManagement: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetchServices = useCallback(
    async (isRetry = false) => {
      try {
        if (!isRetry) {
          setLoading(true);
        }
        setError(null);

        const salonId = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';
        const response = await fetch(
          `/api/dashboard/services?salon_id=${salonId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data: ApiResponse = await response.json();

        if (data.error) {
          throw new Error(
            data.error + (data.details ? ` - ${data.details}` : ''),
          );
        }

        setServices(data.services || []);
        setRetryCount(0);
        setLastFetch(new Date());

        console.log(
          `Successfully loaded ${data.services?.length || 0} services`,
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        console.error('Failed to fetch services:', errorMessage);
        setError(errorMessage);

        // Implement exponential backoff for retries
        if (retryCount < 3) {
          const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
          console.log(
            `Retrying in ${delay}ms... (attempt ${retryCount + 1}/3)`,
          );

          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            fetchServices(true);
          }, delay);
        }
      } finally {
        setLoading(false);
      }
    },
    [retryCount],
  );

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const formatPrice = (priceCents: number): string => {
    return `R${(priceCents / 100).toFixed(2)}`;
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`.trim();
    }
    return `${mins}m`;
  };

  const groupedServices = services.reduce(
    (acc, service) => {
      const category = service.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(service);
      return acc;
    },
    {} as Record<string, Service[]>,
  );

  if (loading && services.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Loading services...</span>
        </div>
      </div>
    );
  }

  if (error && services.length === 0) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800">
              Unable to load services
            </h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            {retryCount < 3 && (
              <p className="mt-1 text-xs text-red-600">
                Retrying automatically... (attempt {retryCount + 1}/3)
              </p>
            )}
            <button
              onClick={() => {
                setRetryCount(0);
                fetchServices();
              }}
              className="mt-3 inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your salon services and pricing
            {lastFetch && (
              <span className="ml-2 text-xs text-gray-400">
                Last updated: {lastFetch.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => fetchServices()}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
            />
            Refresh
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </button>
        </div>
      </div>

      {/* Error Banner (if there are services but also an error) */}
      {error && services.length > 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">Warning: {error}</span>
          </div>
        </div>
      )}

      {/* Services Grid */}
      {Object.keys(groupedServices).length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No services found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first service.
          </p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              {Object.entries(groupedServices).map(
                ([category, servicesInCategory]) => (
                  <div key={category} className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      {category}
                    </h2>
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              Name
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              Description
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              Duration
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              Price
                            </th>
                            <th
                              scope="col"
                              className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                            >
                              <span className="sr-only">Edit</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {servicesInCategory.map((service) => (
                            <tr key={service.id}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                {service.name}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {service.description}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {formatDuration(service.duration_minutes)}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {formatPrice(service.price_cents)}
                              </td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                                  <Edit className="h-4 w-4 inline" />
                                  <span className="ml-1">Edit</span>
                                </button>
                                <button className="text-red-600 hover:text-red-900">
                                  <Trash2 className="h-4 w-4 inline" />
                                  <span className="ml-1">Delete</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
