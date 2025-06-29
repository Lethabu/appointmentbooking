'use client'
import { useState, useEffect } from 'react'
import { format, addDays, startOfWeek, eachHourOfInterval } from 'date-fns'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function BookingCalendar({ salonId, serviceId }) {
  const supabase = useSupabaseClient()
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [availability, setAvailability] = useState({})
  const [selectedSlot, setSelectedSlot] = useState(null)

  // Calculate week days
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
  const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i))
  
  // Generate time slots (9am-5pm)
  const timeSlots = eachHourOfInterval({
    start: new Date().setHours(9, 0, 0, 0),
    end: new Date().setHours(17, 0, 0, 0)
  }).map(date => new Date(date))

  useEffect(() => {
    const fetchAvailability = async () => {
      const { data } = await supabase
        .rpc('get_availability', {
          salon_id: salonId,
          service_id: serviceId,
          start_date: format(weekStart, 'yyyy-MM-dd'),
          days: 7
        })
      
      setAvailability(data || {})
    }
    
    fetchAvailability()
  }, [salonId, serviceId, weekStart])

  const handleSlotSelect = (day, time) => {
    setSelectedSlot({
      datetime: new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
        time.getHours(),
        time.getMinutes()
      ).toISOString()
    })
  }

  // Placeholder for booking confirmation logic
  const confirmBooking = (slot) => {
    alert(`Booking confirmed for ${format(new Date(slot.datetime), 'EEEE, MMMM d, yyyy h:mm a')}`)
    // Implement actual booking logic here
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex">
        <div className="w-20 flex-shrink-0">
          <div className="h-12 border-b"></div>
          {timeSlots.map((time, idx) => (
            <div key={idx} className="h-16 border-b py-1 text-right pr-2">
              {format(time, 'HH:mm')}
            </div>
          ))}
        </div>
        
        {days.map((day, dayIdx) => (
          <div key={dayIdx} className="flex-1 min-w-32">
            <div className="h-12 border-b text-center font-medium">
              {format(day, 'EEE, MMM d')}
            </div>
            
            {timeSlots.map((time, timeIdx) => {
              const slotKey = `${format(day, 'yyyy-MM-dd')}-${format(time, 'HH:mm')}`
              const isAvailable = availability[slotKey]
              const isSelected = selectedSlot?.datetime === slotKey
              
              return (
                <div 
                  key={timeIdx}
                  className={`h-16 border-b p-1 cursor-pointer ${
                    isAvailable 
                      ? isSelected ? 'bg-primary text-white' : 'bg-green-50 hover:bg-green-100' 
                      : 'bg-gray-100 text-gray-400'
                  }`}
                  onClick={() => isAvailable && handleSlotSelect(day, time)}
                >
                  {isAvailable ? 'Available' : 'Booked'}
                </div>
              )
            })}
          </div>
        ))}
      </div>
      
      {selectedSlot && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Selected Time Slot</h3>
          <p>{format(new Date(selectedSlot.datetime), 'EEEE, MMMM d, yyyy h:mm a')}</p>
          <button 
            className="mt-4 bg-primary text-white px-4 py-2 rounded"
            onClick={() => confirmBooking(selectedSlot)}
          >
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  )
}
