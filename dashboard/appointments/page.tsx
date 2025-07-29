'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PlusIcon, PencilIcon, TrashIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';

interface Appointment {
  id: string;
  scheduled_time: string;
  client_name: string;
  client_phone: string | null;
  status: string;
  service_id: string;
  staff_id: string | null;
  recurrence_rule: string | null;
  services: { name: string } | null;
  staff: { name: string } | null;
}

interface Service {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
}

interface Staff {
  id: string;
  name: string;
}

export default function AppointmentsPage() {
  const supabase = createClientComponentClient();
  const queryClient = useQueryClient();
  const [salonId, setSalonId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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

  const fetchAppointments = useCallback(async () => {
    if (!salonId) return [];
    const formattedDate = selectedDate.toISOString().split('T')[0];
    const response = await fetch(`/api/appointments?salon_id=${salonId}&start_date=${formattedDate}&end_date=${formattedDate}`);
    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }
    return response.json();
  }, [salonId, selectedDate]);

  const { data: appointments, isLoading, error } = useQuery<Appointment[]>({
    queryKey: ['appointments', salonId, selectedDate.toDateString()],
    queryFn: fetchAppointments,
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

  const { data: servicesList, isLoading: isLoadingServices } = useQuery<Service[]>({
    queryKey: ['services', salonId],
    queryFn: fetchServices,
    enabled: !!salonId,
  });

  const fetchStaff = useCallback(async () => {
    if (!salonId) return [];
    const response = await fetch(`/api/staff?salon_id=${salonId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch staff');
    }
    return response.json();
  }, [salonId]);

  const { data: staffList, isLoading: isLoadingStaff } = useQuery<Staff[]>({
    queryKey: ['staff', salonId],
    queryFn: fetchStaff,
    enabled: !!salonId,
  });

  const addAppointmentMutation = useMutation({
    mutationFn: async (newAppointment: Omit<Appointment, 'id' | 'services' | 'staff'>) => {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newAppointment, salon_id: salonId }),
      });
      if (!response.ok) {
        throw new Error('Failed to add appointment');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', salonId, selectedDate.toDateString()] });
      setIsModalOpen(false);
      setEditingAppointment(null);
    },
    onError: (err) => {
      console.error("Error adding appointment:", err);
      alert("Failed to add appointment: " + err.message);
    },
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: async (updatedAppointment: Appointment) => {
      const response = await fetch('/api/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updatedAppointment, salon_id: salonId }),
      });
      if (!response.ok) {
        throw new Error('Failed to update appointment');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', salonId, selectedDate.toDateString()] });
      setIsModalOpen(false);
      setEditingAppointment(null);
    },
    onError: (err) => {
      console.error("Error updating appointment:", err);
      alert("Failed to update appointment: " + err.message);
    },
  });

  const deleteAppointmentMutation = useMutation({
    mutationFn: async (appointmentIdToDelete: string) => {
      const response = await fetch(`/api/appointments?id=${appointmentIdToDelete}&salon_id=${salonId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete appointment');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', salonId, selectedDate.toDateString()] });
    },
    onError: (err) => {
      console.error("Error deleting appointment:", err);
      alert("Failed to delete appointment: " + err.message);
    },
  });

  const openAddModal = () => {
    setEditingAppointment(null);
    setIsModalOpen(true);
  };

  const openEditModal = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleDelete = (appointmentIdToDelete: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      deleteAppointmentMutation.mutate(appointmentIdToDelete);
    }
  };

  if (isLoading || isLoadingServices || isLoadingStaff) return <div className="text-center py-8">Loading appointments...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error: {error.message}</div>;
  if (!salonId) return <div className="text-center py-8">Please log in to manage appointments.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Appointments for {selectedDate.toLocaleDateString()}</h1>

      <div className="mb-6 flex items-center space-x-4">
        <button
          onClick={() => {
            const newDate = new Date(selectedDate);
            newDate.setDate(newDate.getDate() - 1);
            setSelectedDate(newDate);
          }}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous Day
        </button>
        <button
          onClick={() => {
            const newDate = new Date(selectedDate);
            newDate.setDate(newDate.getDate() + 1);
            setSelectedDate(newDate);
          }}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next Day
        </button>
        <button
          onClick={openAddModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" /> Add New Appointment
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments?.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">No appointments for this day.</td>
              </tr>
            ) : (
              appointments?.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Date(appointment.scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.client_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.services?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.staff?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(appointment)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(appointment.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
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
                    {editingAppointment ? 'Edit Appointment' : 'Add New Appointment'}
                  </DialogTitle>
                  <AppointmentForm
                    initialData={editingAppointment}
                    servicesList={servicesList || []}
                    staffList={staffList || []}
                    onSave={(appointmentData) => {
                      if (editingAppointment) {
                        updateAppointmentMutation.mutate({ ...editingAppointment, ...appointmentData });
                      } else {
                        addAppointmentMutation.mutate(appointmentData);
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

interface AppointmentFormProps {
  initialData?: Appointment | null;
  servicesList: Service[];
  staffList: Staff[];
  onSave: (appointment: Omit<Appointment, 'id' | 'services' | 'staff'> | Appointment) => void;
  onCancel: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ initialData, servicesList, staffList, onSave, onCancel }) => {
  const [client_name, setClientName] = useState(initialData?.client_name || '');
  const [client_phone, setClientPhone] = useState(initialData?.client_phone || '');
  const [service_id, setServiceId] = useState(initialData?.service_id || '');
  const [staff_id, setStaffId] = useState(initialData?.staff_id || '');
  const [start_time, setStartTime] = useState(initialData?.start_time ? new Date(initialData.start_time).toISOString().substring(0, 16) : '');
  const [status, setStatus] = useState(initialData?.status || 'scheduled');
  const [recurrence_rule, setRecurrenceRule] = useState(initialData?.recurrence_rule || 'none');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      client_name,
      client_phone,
      service_id,
      staff_id,
      start_time,
      status,
      recurrence_rule: recurrence_rule === 'none' ? null : recurrence_rule,
    });
  };

  const appointmentStatuses = ['scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'];
  const recurrenceOptions = ['none', 'daily', 'weekly', 'monthly'];

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div>
        <label htmlFor="client_name" className="block text-sm font-medium text-gray-700">Client Name</label>
        <input
          type="text"
          id="client_name"
          value={client_name}
          onChange={(e) => setClientName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="client_phone" className="block text-sm font-medium text-gray-700">Client Phone</label>
        <input
          type="tel"
          id="client_phone"
          value={client_phone || ''}
          onChange={(e) => setClientPhone(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
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
        <label htmlFor="staff_id" className="block text-sm font-medium text-gray-700">Staff</label>
        <select
          id="staff_id"
          value={staff_id || ''}
          onChange={(e) => setStaffId(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select Staff</option>
          {staffList.map((staff) => (
            <option key={staff.id} value={staff.id}>{staff.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">Start Time</label>
        <input
          type="datetime-local"
          id="start_time"
          value={start_time}
          onChange={(e) => setStartTime(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        >
          {appointmentStatuses.map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="recurrence_rule" className="block text-sm font-medium text-gray-700">Recurrence Rule</label>
        <select
          id="recurrence_rule"
          value={recurrence_rule || 'none'}
          onChange={(e) => setRecurrenceRule(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {recurrenceOptions.map((rule) => (
            <option key={rule} value={rule}>{rule.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
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
          Save Appointment
        </button>
      </div>
    </form>
  );
};
