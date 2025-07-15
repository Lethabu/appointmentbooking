import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { appointmentSchema } from '@/lib/validators'

export async function POST(request) {
  try {
    const body = await request.json()
    const validation = appointmentSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      )
    }

    return await prisma.$transaction(async (tx) => {
      // Check service and staff existence
      const [service, staff] = await Promise.all([
        tx.service.findUnique({
          where: { id: body.service },
          select: { id: true, duration: true }
        }),
        tx.staff.findUnique({
          where: { id: body.staff },
          select: { id: true }
        })
      ])

      if (!service || !staff) {
        return NextResponse.json(
          { error: "Service or staff not found" },
          { status: 404 }
        )
      }

      // Check for conflicting appointments
      const conflictingAppointment = await tx.appointment.findFirst({
        where: {
          staffId: body.staffId,
          datetime: {
            lte: new Date(new Date(body.datetime).getTime() + body.duration * 60000),
            gte: body.datetime
          }
        }
      })

      if (conflictingAppointment) {
        return NextResponse.json(
          { error: "Time conflict with existing appointment" },
          { status: 409 }
        )
      }

      // Create appointment
      const appointment = await tx.appointment.create({
        data: {
          ...validation.data,
          service: { connect: { id: service.id } },
          staff: { connect: { id: staff.id } }
        }
      })

      return NextResponse.json(appointment, { status: 201 })
    })
    
  } catch (error) {
    console.error('Appointment creation failed:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: { service: true, staff: true }
    })
    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Failed to fetch appointments:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
