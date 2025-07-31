import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma';
import { z } from 'zod'

const serviceSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  duration: z.number().int().positive(),
  price: z.number().positive()
})

export async function POST(request) {
  try {
    const body = await request.json();
    const validation = serviceSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      );
    }

    // Map incoming fields to match Prisma schema
    const { name, description, duration, price } = validation.data;
    const service = await prisma.service.create({
      data: {
        name,
        description,
        duration_minutes: duration, // map duration to duration_minutes
        price_cents: price,         // map price to price_cents
      }
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Service creation failed:', error?.message || error, error?.stack);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        duration_minutes: true,
        price_cents: true,
        category: true,
        is_active: true,
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
