'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createSalon(formData) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: { message: 'You must be logged in to create a salon.' } }
  }

  const salonName = formData.get('name')
  const subdomain = formData.get('subdomain')

  if (!salonName || !subdomain) {
    return { error: { message: 'Salon name and subdomain are required.' } }
  }

  const { error } = await supabase.from('salons').insert({
    name: salonName,
    subdomain: subdomain,
    owner_id: user.id,
    plan: 'trial',
    trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14-day trial
  })

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      return { error: { message: 'This subdomain is already taken.' } }
    }
    console.error('Error creating salon:', error)
    return { error: { message: 'Could not create salon. Please try again.' } }
  }

  revalidatePath('/dashboard', 'layout') // Revalidate the layout to reflect the new salon
  redirect('/dashboard')
}

export async function checkSubdomainAvailability(subdomain) {
  if (!subdomain || subdomain.length < 3) {
    return { available: false, message: 'Subdomain must be at least 3 characters.' }
  }
  if (!/^[a-z0-9-]+$/.test(subdomain)) {
    return { available: false, message: 'Only lowercase letters, numbers, and hyphens allowed.' }
  }

  const supabase = createClient()
  const { count } = await supabase.from('salons').select('subdomain', { count: 'exact', head: true }).eq('subdomain', subdomain)

  return count === 0 ? { available: true, message: 'Subdomain is available!' } : { available: false, message: 'This subdomain is already taken.' }
}