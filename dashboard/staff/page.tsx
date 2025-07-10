'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';

interface Staff {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  is_active: boolean;
}

export default function StaffPage() {
  const supabase = createClientComponentClient();
  const queryClient = useQueryClient();
  const [salonId, setSalonId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

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

  const fetchStaff = useCallback(async () => {
    if (!salonId) return [];
    const response = await fetch(`/api/staff?salon_id=${salonId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch staff');
    }
    return response.json();
  }, [salonId]);

  const { data: staff, isLoading, error } = useQuery<Staff[]>({
    queryKey: ['staff', salonId],
    queryFn: fetchStaff,
    enabled: !!salonId,
  });

  const addStaffMutation = useMutation({
    mutationFn: async (newStaff: Omit<Staff, 'id'>) => {
      const response = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newStaff, salon_id: salonId }),
      });
      if (!response.ok) {
        throw new Error('Failed to add staff member');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', salonId] });
      setIsModalOpen(false);
      setEditingStaff(null);
    },
    onError: (err) => {
      console.error("Error adding staff member:", err);
      alert("Failed to add staff member: " + err.message);
    },
  });

  const updateStaffMutation = useMutation({
    mutationFn: async (updatedStaff: Staff) => {
      const response = await fetch('/api/staff', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updatedStaff, salon_id: salonId }),
      });
      if (!response.ok) {
        throw new Error('Failed to update staff member');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', salonId] });
      setIsModalOpen(false);
      setEditingStaff(null);
    },
    onError: (err) => {
      console.error("Error updating staff member:", err);
      alert("Failed to update staff member: " + err.message);
    },
  });

  const deleteStaffMutation = useMutation({
    mutationFn: async (staffIdToDelete: string) => {
      const response = await fetch(`/api/staff?id=${staffIdToDelete}&salon_id=${salonId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete staff member');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', salonId] });
    },
    onError: (err) => {
      console.error("Error deleting staff member:", err);
      alert("Failed to delete staff member: " + err.message);
    },
  });

  const openAddModal = () => {
    setEditingStaff(null);
    setIsModalOpen(true);
  };

  const openEditModal = (staff: Staff) => {
    setEditingStaff(staff);
    setIsModalOpen(true);
  };

  const handleDelete = (staffIdToDelete: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      deleteStaffMutation.mutate(staffIdToDelete);
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading staff...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error: {error.message}</div>;
  if (!salonId) return <div className="text-center py-8">Please log in to manage staff.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Staff</h1>

      <button
        onClick={openAddModal}
        className="mb-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
      >
        <PlusIcon className="h-5 w-5 mr-2" /> Add New Staff Member
      </button>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staff?.map((member) => (
              <tr key={member.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.is_active ? 'Yes' : 'No'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openEditModal(member)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
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
                    {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                  </DialogTitle>
                  <StaffForm
                    initialData={editingStaff}
                    onSave={(staffData) => {
                      if (editingStaff) {
                        updateStaffMutation.mutate({ ...editingStaff, ...staffData });
                      } else {
                        addStaffMutation.mutate(staffData);
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

interface StaffFormProps {
  initialData?: Staff | null;
  onSave: (staff: Omit<Staff, 'id'> | Staff) => void;
  onCancel: () => void;
}

const StaffForm: React.FC<StaffFormProps> = ({ initialData, onSave, onCancel }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [is_active, setIsActive] = useState(initialData?.is_active ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      email,
      phone,
      is_active,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
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
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
          Save Staff Member
        </button>
      </div>
    </form>
  );
};
