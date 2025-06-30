'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import crypto from 'crypto'

// This is a simplified version of the hasPermission logic for server actions
async function checkPermission(supabase, salonId, userId, permission) {
  const { data: role } = await supabase.rpc('get_user_role', { p_salon_id: salonId, p_user_id: userId })

  const permissions = {
    owner: ['staff:invite'],
    manager: ['staff:invite'],
    staff: []
  }

  return permissions[role]?.includes(permission) || false
}

export async function inviteStaffMember(formData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to invite staff.' }
  }

  const salonId = formData.get('salonId')
  const email = formData.get('email')
  const role = formData.get('role')

  const hasPerm = await checkPermission(supabase, salonId, user.id, 'staff:invite')
  if (!hasPerm) {
    return { error: 'You do not have permission to invite staff.' }
  }

  const token = crypto.randomBytes(32).toString('hex')

  const { error } = await supabase.from('staff_invites').insert({
    salon_id: salonId,
    email,
    role,
    token,
    invited_by: user.id
  })

  if (error) return { error: 'Failed to send invitation. Please try again.' }

  // In a real app, you would use a service like Resend or SendGrid to email the invite link:
  // await sendInviteEmail(email, `https://appointmentbookings.co.za/invite?token=${token}`);

  revalidatePath('/dashboard/staff')
  return { success: 'Invitation sent successfully!' }
}