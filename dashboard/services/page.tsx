'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  buffer_before_minutes: number;
  buffer_after_minutes: number;
}

export default function ServicesPage() {
  const supabase = createClientComponentClient();
  const queryClient = useQueryClient();
  const [salonId, setSalonId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

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

  const fetchServices = useCallback(async () => {
    if (!salonId) return [];
    const response = await fetch(`/api/services?salon_id=${salonId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch services');
    }
    return response.json();
  }, [salonId]);

  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: ['services', salonId],
    queryFn: fetchServices,
    enabled: !!salonId,
  });

  const addServiceMutation = useMutation({
    mutationFn: async (newService: Omit<Service, 'id'>) => {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newService, salon_id: salonId }),
      });
      if (!response.ok) {
        throw new Error('Failed to add service');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services', salonId] });
      setIsModalOpen(false);
      setEditingService(null);
    },
    onError: (err) => {
      console.error("Error adding service:", err);
      alert("Failed to add service: " + err.message);
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: async (updatedService: Service) => {
      const response = await fetch('/api/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updatedService, salon_id: salonId }),
      });
      if (!response.ok) {
        throw new Error('Failed to update service');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services', salonId] });
      setIsModalOpen(false);
      setEditingService(null);
    },
    onError: (err) => {
      console.error("Error updating service:", err);
      alert("Failed to update service: " + err.message);
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (serviceIdToDelete: string) => {
      const response = await fetch(`/api/services?id=${serviceIdToDelete}&salon_id=${salonId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete service');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services', salonId] });
    },
    onError: (err) => {
      console.error("Error deleting service:", err);
      alert("Failed to delete service: " + err.message);
    },
  });

  const openAddModal = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleDelete = (serviceIdToDelete: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteServiceMutation.mutate(serviceIdToDelete);
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading services...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error: {error.message}</div>;
  if (!salonId) return <div className="text-center py-8">Please log in to manage services.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Services</h1>

      <button
        onClick={openAddModal}
        className="mb-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
      >
        <PlusIcon className="h-5 w-5 mr-2" /> Add New Service
      </button>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration (min)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (R)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buffers (min)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services?.map((service) => (
              <tr key={service.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.duration_minutes}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {service.is_active ? 'Yes' : 'No'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Before: {service.buffer_before_minutes}, After: {service.buffer_after_minutes}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openEditModal(service)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
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
                    {editingService ? 'Edit Service' : 'Add New Service'}
                  </DialogTitle>
                  <ServiceForm
                    initialData={editingService}
                    onSave={(serviceData) => {
                      if (editingService) {
                        updateServiceMutation.mutate({ ...editingService, ...serviceData });
                      } else {
                        addServiceMutation.mutate(serviceData);
                      }
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

interface ServiceFormProps {
  initialData?: Service | null;
  onSave: (service: Omit<Service, 'id'> | Service) => void;
  onCancel: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ initialData, onSave, onCancel }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [duration_minutes, setDurationMinutes] = useState(initialData?.duration_minutes || 30);
  const [price, setPrice] = useState(initialData?.price || 0);
  const [is_active, setIsActive] = useState(initialData?.is_active ?? true);
  const [buffer_before_minutes, setBufferBeforeMinutes] = useState(initialData?.buffer_before_minutes || 0);
  const [buffer_after_minutes, setBufferAfterMinutes] = useState(initialData?.buffer_after_minutes || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      description,
      duration_minutes: Number(duration_minutes),
      price: Number(price),
      is_active,
      buffer_before_minutes: Number(buffer_before_minutes),
      buffer_after_minutes: Number(buffer_after_minutes),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Service Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        ></textarea>
      </div>
      <div>
        <label htmlFor="duration_minutes" className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
        <input
          type="number"
          id="duration_minutes"
          value={duration_minutes}
          onChange={(e) => setDurationMinutes(Number(e.target.value))}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
          min="1"
        />
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (R)</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <label htmlFor="buffer_before_minutes" className="block text-sm font-medium text-gray-700">Buffer Before (minutes)</label>
        <input
          type="number"
          id="buffer_before_minutes"
          value={buffer_before_minutes}
          onChange={(e) => setBufferBeforeMinutes(Number(e.target.value))}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          min="0"
        />
      </div>
      <div>
        <label htmlFor="buffer_after_minutes" className="block text-sm font-medium text-gray-700">Buffer After (minutes)</label>
        <input
          type="number"
          id="buffer_after_minutes"
          value={buffer_after_minutes}
          onChange={(e) => setBufferAfterMinutes(Number(e.target.value))}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          min="0"
        />
      </div>
      <div className="flex items-center">
        <input
          id="is_active"
          name="is_active"
          type="checkbox"
          checked={is_active}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">Is Active</label>
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
          Save Service
        </button>
      </div>
    </form>
  );
};
