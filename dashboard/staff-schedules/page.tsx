'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';

interface StaffSchedule {
  id: string;
  staff_id: string;
  day_of_week: number | null; // 0-6 for Sunday-Saturday
  start_time: string | null; // HH:MM:SS
  end_time: string | null;   // HH:MM:SS
  schedule_type: 'working_hours' | 'break' | 'day_off';
  schedule_date: string | null; // YYYY-MM-DD for breaks/day_offs
  staff?: { name: string }; // Joined staff name
}

interface Staff {
  id: string;
  name: string;
}

export default function StaffSchedulesPage() {
  const supabase = createClientComponentClient();
  const queryClient = useQueryClient();
  const [salonId, setSalonId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<StaffSchedule | null>(null);

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

  const { data: staffList, isLoading: isLoadingStaff, error: staffError } = useQuery<Staff[]>({
    queryKey: ['staff', salonId],
    queryFn: fetchStaff,
    enabled: !!salonId,
  });

  const fetchSchedules = useCallback(async () => {
    if (!salonId) return [];
    const response = await fetch(`/api/staff-schedules?salon_id=${salonId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch staff schedules');
    }
    return response.json();
  }, [salonId]);

  const { data: schedules, isLoading: isLoadingSchedules, error: schedulesError } = useQuery<StaffSchedule[]>({
    queryKey: ['staff-schedules', salonId],
    queryFn: fetchSchedules,
    enabled: !!salonId,
  });

  const addScheduleMutation = useMutation({
    mutationFn: async (newSchedule: Omit<StaffSchedule, 'id'>) => {
      const response = await fetch('/api/staff-schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newSchedule, salon_id: salonId }),
      });
      if (!response.ok) {
        throw new Error('Failed to add schedule');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-schedules', salonId] });
      setIsModalOpen(false);
      setEditingSchedule(null);
    },
    onError: (err) => {
      console.error("Error adding schedule:", err);
      alert("Failed to add schedule: " + err.message);
    },
  });

  const updateScheduleMutation = useMutation({
    mutationFn: async (updatedSchedule: StaffSchedule) => {
      const response = await fetch('/api/staff-schedules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updatedSchedule, salon_id: salonId }),
      });
      if (!response.ok) {
        throw new Error('Failed to update schedule');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-schedules', salonId] });
      setIsModalOpen(false);
      setEditingSchedule(null);
    },
    onError: (err) => {
      console.error("Error updating schedule:", err);
      alert("Failed to update schedule: " + err.message);
    },
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: async (scheduleIdToDelete: string) => {
      const response = await fetch(`/api/staff-schedules?id=${scheduleIdToDelete}&salon_id=${salonId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete schedule');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-schedules', salonId] });
    },
    onError: (err) => {
      console.error("Error deleting schedule:", err);
      alert("Failed to delete schedule: " + err.message);
    },
  });

  const openAddModal = () => {
    setEditingSchedule(null);
    setIsModalOpen(true);
  };

  const openEditModal = (schedule: StaffSchedule) => {
    setEditingSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleDelete = (scheduleIdToDelete: string) => {
    if (window.confirm('Are you sure you want to delete this schedule entry?')) {
      deleteScheduleMutation.mutate(scheduleIdToDelete);
    }
  };

  if (isLoadingStaff || isLoadingSchedules) return <div className="text-center py-8">Loading schedules...</div>;
  if (staffError) return <div className="text-center py-8 text-red-600">Error loading staff: {staffError.message}</div>;
  if (schedulesError) return <div className="text-center py-8 text-red-600">Error loading schedules: {schedulesError.message}</div>;
  if (!salonId) return <div className="text-center py-8">Please log in to manage staff schedules.</div>;

  const getDayName = (dayOfWeek: number | null) => {
    if (dayOfWeek === null) return 'N/A';
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Staff Schedules</h1>

      <button
        onClick={openAddModal}
        className="mb-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
      >
        <PlusIcon className="h-5 w-5 mr-2" /> Add New Schedule
      </button>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Member</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day/Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schedules?.map((schedule) => (
              <tr key={schedule.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{schedule.staff?.name || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.schedule_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {schedule.schedule_type === 'working_hours' ? getDayName(schedule.day_of_week) : schedule.schedule_date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {schedule.start_time && schedule.end_time ? `${schedule.start_time.substring(0, 5)} - ${schedule.end_time.substring(0, 5)}` : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openEditModal(schedule)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(schedule.id)}
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
                    {editingSchedule ? 'Edit Staff Schedule' : 'Add New Staff Schedule'}
                  </DialogTitle>
                  <StaffScheduleForm
                    initialData={editingSchedule}
                    staffList={staffList || []}
                    onSave={(scheduleData) => {
                      if (editingSchedule) {
                        updateScheduleMutation.mutate({ ...editingSchedule, ...scheduleData });
                      } else {
                        addScheduleMutation.mutate(scheduleData);
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

interface StaffScheduleFormProps {
  initialData?: StaffSchedule | null;
  staffList: Staff[];
  onSave: (schedule: Omit<StaffSchedule, 'id'> | StaffSchedule) => void;
  onCancel: () => void;
}

const StaffScheduleForm: React.FC<StaffScheduleFormProps> = ({ initialData, staffList, onSave, onCancel }) => {
  const [staff_id, setStaffId] = useState(initialData?.staff_id || '');
  const [schedule_type, setScheduleType] = useState<'working_hours' | 'break' | 'day_off'>(initialData?.schedule_type || 'working_hours');
  const [day_of_week, setDayOfWeek] = useState<number | null>(initialData?.day_of_week || null);
  const [start_time, setStartTime] = useState(initialData?.start_time || '');
  const [end_time, setEndTime] = useState(initialData?.end_time || '');
  const [schedule_date, setScheduleDate] = useState(initialData?.schedule_date || '');

  useEffect(() => {
    if (initialData) {
      setStaffId(initialData.staff_id);
      setScheduleType(initialData.schedule_type);
      setDayOfWeek(initialData.day_of_week);
      setStartTime(initialData.start_time || '');
      setEndTime(initialData.end_time || '');
      setScheduleDate(initialData.schedule_date || '');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      staff_id,
      schedule_type,
      day_of_week: schedule_type === 'working_hours' ? day_of_week : null,
      start_time: (schedule_type === 'working_hours' || schedule_type === 'break') ? start_time : null,
      end_time: (schedule_type === 'working_hours' || schedule_type === 'break') ? end_time : null,
      schedule_date: schedule_type !== 'working_hours' ? schedule_date : null,
    });
  };

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div>
        <label htmlFor="staff_id" className="block text-sm font-medium text-gray-700">Staff Member</label>
        <select
          id="staff_id"
          value={staff_id}
          onChange={(e) => setStaffId(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        >
          <option value="">Select Staff</option>
          {staffList.map((staff) => (
            <option key={staff.id} value={staff.id}>{staff.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="schedule_type" className="block text-sm font-medium text-gray-700">Schedule Type</label>
        <select
          id="schedule_type"
          value={schedule_type}
          onChange={(e) => setScheduleType(e.target.value as 'working_hours' | 'break' | 'day_off')}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        >
          <option value="working_hours">Working Hours</option>
          <option value="break">Break</option>
          <option value="day_off">Day Off</option>
        </select>
      </div>

      {schedule_type === 'working_hours' && (
        <>
          <div>
            <label htmlFor="day_of_week" className="block text-sm font-medium text-gray-700">Day of Week</label>
            <select
              id="day_of_week"
              value={day_of_week === null ? '' : day_of_week}
              onChange={(e) => setDayOfWeek(Number(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="">Select Day</option>
              {daysOfWeek.map((day, index) => (
                <option key={index} value={index}>{day}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="time"
              id="start_time"
              value={start_time}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">End Time</label>
            <input
              type="time"
              id="end_time"
              value={end_time}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
        </>
      )}

      {(schedule_type === 'break' || schedule_type === 'day_off') && (
        <>
          <div>
            <label htmlFor="schedule_date" className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              id="schedule_date"
              value={schedule_date}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          {schedule_type === 'break' && (
            <>
              <div>
                <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  type="time"
                  id="start_time"
                  value={start_time}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">End Time</label>
                <input
                  type="time"
                  id="end_time"
                  value={end_time}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </>
          )}
        </>
      )}

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
          Save Schedule
        </button>
      </div>
    </form>
  );
};
