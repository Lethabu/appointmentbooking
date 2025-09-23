'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';

interface Resource {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
}

export default function ResourcesPage() {
  const supabase = createClientComponentClient();
  const queryClient = useQueryClient();
  const [salonId, setSalonId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

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

  const fetchResources = useCallback(async () => {
    if (!salonId) return [];
    const response = await fetch(`/api/resources?salon_id=${salonId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch resources');
    }
    return response.json();
  }, [salonId]);

  const { data: resources, isLoading, error } = useQuery<Resource[]>({
    queryKey: ['resources', salonId],
    queryFn: fetchResources,
    enabled: !!salonId,
  });

  const addResourceMutation = useMutation({
    mutationFn: async (newResource: Omit<Resource, 'id'>) => {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newResource, salon_id: salonId }),
      });
      if (!response.ok) {
        throw new Error('Failed to add resource');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources', salonId] });
      setIsModalOpen(false);
      setEditingResource(null);
    },
    onError: (err) => {
      console.error("Error adding resource:", err);
      alert("Failed to add resource: " + err.message);
    },
  });

  const updateResourceMutation = useMutation({
    mutationFn: async (updatedResource: Resource) => {
      const response = await fetch('/api/resources', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updatedResource, salon_id: salonId }),
      });
      if (!response.ok) {
        throw new Error('Failed to update resource');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources', salonId] });
      setIsModalOpen(false);
      setEditingResource(null);
    },
    onError: (err) => {
      console.error("Error updating resource:", err);
      alert("Failed to update resource: " + err.message);
    },
  });

  const deleteResourceMutation = useMutation({
    mutationFn: async (resourceIdToDelete: string) => {
      const response = await fetch(`/api/resources?id=${resourceIdToDelete}&salon_id=${salonId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete resource');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources', salonId] });
    },
    onError: (err) => {
      console.error("Error deleting resource:", err);
      alert("Failed to delete resource: " + err.message);
    },
  });

  const openAddModal = () => {
    setEditingResource(null);
    setIsModalOpen(true);
  };

  const openEditModal = (resource: Resource) => {
    setEditingResource(resource);
    setIsModalOpen(true);
  };

  const handleDelete = (resourceIdToDelete: string) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      deleteResourceMutation.mutate(resourceIdToDelete);
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading resources...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error: {error.message}</div>;
  if (!salonId) return <div className="text-center py-8">Please log in to manage resources.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Resources</h1>

      <button
        onClick={openAddModal}
        className="mb-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
      >
        <PlusIcon className="h-5 w-5 mr-2" /> Add New Resource
      </button>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {resources?.map((resource) => (
              <tr key={resource.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{resource.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{resource.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {resource.is_active ? 'Yes' : 'No'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openEditModal(resource)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(resource.id)}
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
                    {editingResource ? 'Edit Resource' : 'Add New Resource'}
                  </DialogTitle>
                  <ResourceForm
                    initialData={editingResource}
                    onSave={(resourceData) => {
                      if (editingResource) {
                        updateResourceMutation.mutate({ ...editingResource, ...resourceData });
                      } else {
                        addResourceMutation.mutate(resourceData);
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

interface ResourceFormProps {
  initialData?: Resource | null;
  onSave: (resource: Omit<Resource, 'id'> | Resource) => void;
  onCancel: () => void;
}

const ResourceForm: React.FC<ResourceFormProps> = ({ initialData, onSave, onCancel }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [is_active, setIsActive] = useState(initialData?.is_active ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      description,
      is_active,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Resource Name</label>
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
          Save Resource
        </button>
      </div>
    </form>
  );
};
