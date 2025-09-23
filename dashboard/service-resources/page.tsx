'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';

interface ServiceResource {
  service_id: string;
  resource_id: string;
  services: { name: string };
  resources: { name: string };
}

interface Service {
  id: string;
  name: string;
}

interface Resource {
  id: string;
  name: string;
}

export default function ServiceResourcesPage() {
  const supabase = createClientComponentClient();
  const queryClient = useQueryClient();
  const [salonId, setSalonId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getSalonId = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: salon, error } = await supabase
          .from('salons')
          .select('id')
          .eq('owner_id', session.user.id)
          .single();

        if (error) {
          console.error("Error fetching salon ID:", error);
        } else if (salon) {
          setSalonId(salon.id);
        }
      }
    };
    getSalonId();
  }, [supabase]);

  const fetchServiceResources = useCallback(async () => {
    if (!salonId) return [];
    const response = await fetch(`/api/service-resources?salon_id=${salonId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch service-resource links');
    }
    return response.json();
  }, [salonId]);

  const { data: serviceResources, isLoading, error } = useQuery<ServiceResource[]>({
    queryKey: ['service-resources', salonId],
    queryFn: fetchServiceResources,
    enabled: !!salonId,
  });

  const fetchServices = useCallback(async () => {
    if (!salonId) return [];
    const response = await fetch(`/api/services?salon_id=${salonId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch services');
    }
    return response.json();
  }, [salonId]);

  const { data: servicesList, isLoading: isLoadingServices, error: servicesError } = useQuery<Service[]>({
    queryKey: ['services', salonId],
    queryFn: fetchServices,
    enabled: !!salonId,
  });

  const fetchResources = useCallback(async () => {
    if (!salonId) return [];
    const response = await fetch(`/api/resources?salon_id=${salonId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch resources');
    }
    return response.json();
  }, [salonId]);

  const { data: resourcesList, isLoading: isLoadingResources, error: resourcesError } = useQuery<Resource[]>({
    queryKey: ['resources', salonId],
    queryFn: fetchResources,
    enabled: !!salonId,
  });

  const addServiceResourceMutation = useMutation({
    mutationFn: async (linkData: { service_id: string; resource_id: string }) => {
      const response = await fetch('/api/service-resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...linkData, salon_id: salonId }),
      });
      if (!response.ok) {
        throw new Error('Failed to link service and resource');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-resources', salonId] });
      setIsModalOpen(false);
    },
    onError: (err) => {
      console.error("Error linking service and resource:", err);
      alert("Failed to link service and resource: " + err.message);
    },
  });

  const deleteServiceResourceMutation = useMutation({
    mutationFn: async (linkData: { service_id: string; resource_id: string }) => {
      const response = await fetch(`/api/service-resources?service_id=${linkData.service_id}&resource_id=${linkData.resource_id}&salon_id=${salonId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to unlink service and resource');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-resources', salonId] });
    },
    onError: (err) => {
      console.error("Error unlinking service and resource:", err);
      alert("Failed to unlink service and resource: " + err.message);
    },
  });

  const openAddModal = () => {
    setIsModalOpen(true);
  };

  const handleDelete = (serviceId: string, resourceId: string) => {
    if (window.confirm('Are you sure you want to unlink this service and resource?')) {
      deleteServiceResourceMutation.mutate({ service_id: serviceId, resource_id: resourceId });
    }
  };

  if (isLoading || isLoadingServices || isLoadingResources) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error: {error.message}</div>;
  if (servicesError) return <div className="text-center py-8 text-red-600">Error loading services: {servicesError.message}</div>;
  if (resourcesError) return <div className="text-center py-8 text-red-600">Error loading resources: {resourcesError.message}</div>;
  if (!salonId) return <div className="text-center py-8">Please log in to manage service resources.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Service Resources</h1>

      <button
        onClick={openAddModal}
        className="mb-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
      >
        <PlusIcon className="h-5 w-5 mr-2" /> Link Service to Resource
      </button>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {serviceResources?.map((link) => (
              <tr key={`${link.service_id}-${link.resource_id}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{link.services.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{link.resources.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDelete(link.service_id, link.resource_id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Link Service to Resource
                  </DialogTitle>
                  <ServiceResourceForm
                    servicesList={servicesList || []}
                    resourcesList={resourcesList || []}
                    onSave={(linkData) => {
                      addServiceResourceMutation.mutate(linkData);
                    }}
                    onCancel={() => setIsModalOpen(false)}
                  />
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

interface ServiceResourceFormProps {
  servicesList: Service[];
  resourcesList: Resource[];
  onSave: (link: { service_id: string; resource_id: string }) => void;
  onCancel: () => void;
}

const ServiceResourceForm: React.FC<ServiceResourceFormProps> = ({ servicesList, resourcesList, onSave, onCancel }) => {
  const [service_id, setServiceId] = useState('');
  const [resource_id, setResourceId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!service_id || !resource_id) {
      alert('Please select both a service and a resource.');
      return;
    }
    onSave({ service_id, resource_id });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div>
        <label htmlFor="service_id" className="block text-sm font-medium text-gray-700">Service</label>
        <select
          id="service_id"
          value={service_id}
          onChange={(e) => setServiceId(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        >
          <option value="">Select Service</option>
          {servicesList.map((service) => (
            <option key={service.id} value={service.id}>{service.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="resource_id" className="block text-sm font-medium text-gray-700">Resource</label>
        <select
          id="resource_id"
          value={resource_id}
          onChange={(e) => setResourceId(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        >
          <option value="">Select Resource</option>
          {resourcesList.map((resource) => (
            <option key={resource.id} value={resource.id}>{resource.name}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Link Resources
        </button>
      </div>
    </form>
  );
};
