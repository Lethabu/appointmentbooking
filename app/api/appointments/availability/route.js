import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('service')
    const dateParam = searchParams.get('date')
    
    if (!serviceId || !dateParam) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      )
    }

    const date = new Date(dateParam)
    const startOfDay = new Date(date.setHours(0,0,0,0))
    const endOfDay = new Date(date.setHours(23,59,59,999))

    // Get service duration
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { duration: true }
    })

    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      )
    }

    // Get existing appointments
    const appointments = await prisma.appointment.findMany({
      where: {
        serviceId,
        datetime: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      select: {
        datetime: true,
        duration: true
      }
    })

    // Generate availability slots (simplified example)
    const slots = []
    let currentTime = new Date(startOfDay)
    
    while (currentTime < endOfDay) {
      const slotEnd = new Date(currentTime.getTime() + service.duration * 60000)
      
      const conflict = appointments.some(appt => {
        const apptEnd = new Date(appt.datetime.getTime() + appt.duration * 60000)
        return (
          currentTime < apptEnd &&
          slotEnd > appt.datetime
        )
      })

      if (!conflict) {
        slots.push({
          start: new Date(currentTime),
          end: slotEnd
        })
      }

      currentTime.setMinutes(currentTime.getMinutes() + 15)
    }

    return NextResponse.json(slots)
  } catch (error) {
    console.error('Availability check failed:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}