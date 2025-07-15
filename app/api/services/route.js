import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const serviceSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  duration: z.number().int().positive(),
  price: z.number().positive()
})

export async function POST(request) {
  try {
    const body = await request.json()
    const validation = serviceSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      )
    }

    const service = await prisma.service.create({
      data: validation.data
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Service creation failed:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      include: {
        staff: true
      },
      select: {
        id: true,
        name: true,
        duration: true,
        staff: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })
    return NextResponse.json(services)
  } catch (error) {
    console.error('Failed to fetch services:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
