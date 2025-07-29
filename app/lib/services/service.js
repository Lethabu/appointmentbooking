import prisma from '../../../lib/prisma';
import { serviceSchema } from '@/lib/validators';

export async function createService(data) {
  const validation = serviceSchema.safeParse(data);
  if (!validation.success) {
    throw new Error(validation.error.format());
  }

  const service = await prisma.service.create({
    data: validation.data,
  });

  return service;
}

export async function getServices() {
  const strapiUrl = process.env.STRAPI_API_URL;
  const strapiToken = process.env.STRAPI_API_TOKEN;

  if (!strapiUrl || !strapiToken) {
    throw new Error('Strapi API URL or token is not configured.');
  }

  try {
    const response = await fetch(`${strapiUrl}/api/products`, {
      headers: {
        Authorization: `Bearer ${strapiToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch services from Strapi: ${response.statusText}`);
    }

    const { data } = await response.json();
    return data.map((item) => item.attributes);
  } catch (error) {
    console.error('Error fetching services from Strapi:', error);
    throw new Error('Could not fetch services.');
  }
}

export async function getServiceById(id) {
  return await prisma.service.findUnique({
    where: { id },
  });
}

export async function updateService(id, data) {
  const validation = serviceSchema.safeParse(data);
  if (!validation.success) {
    throw new Error(validation.error.format());
  }

  return await prisma.service.update({
    where: { id },
    data: validation.data,
  });
}

export async function deleteService(id) {
  return await prisma.service.delete({
    where: { id },
  });
}
