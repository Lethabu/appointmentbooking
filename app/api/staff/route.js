import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma';
import { z } from 'zod'

const staffSchema = z.object({
  name: z.string().min(2),
  email: z.string().email()
})

export async function POST(request) {
  try {
    const body = await request.json()
    const validation = staffSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      )
    }

    // Check for existing email
    const existingStaff = await prisma.staff.findUnique({
      where: { email: validation.data.email }
    })

    if (existingStaff) {
      return NextResponse.json(
        { error: "Staff email already exists" },
        { status: 409 }
      )
    }

    const newStaff = await prisma.staff.create({
      data: validation.data
    })

    return NextResponse.json(newStaff, { status: 201 })
  } catch (error) {
    console.error('Staff creation failed:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const staffMembers = await prisma.staff.findMany({
      include: { appointments: true }
    })
    return NextResponse.json(staffMembers)
  } catch (error) {
    console.error('Failed to fetch staff:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
