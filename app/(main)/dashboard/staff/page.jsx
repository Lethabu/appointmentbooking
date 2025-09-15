import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { inviteStaffMember } from './actions'

async function getSalonForUser(supabase, userId) {
  const { data: salon } = await supabase
    .from('salons')
    .select('id, name')
    .eq('owner_id', userId)
    .single()
  return salon
}

async function getStaffMembers(supabase, salonId) {
  const { data, error } = await supabase
    .from('staff_members')
    .select(`
      id,
      role,
      profiles ( full_name, email )
    `)
    .eq('salon_id', salonId)

  if (error) {
    console.error('Error fetching staff members:', error)
    return []
  }
  return data
}

export default async function StaffPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const salon = await getSalonForUser(supabase, user.id)
  if (!salon) redirect('/dashboard/create-salon')

  const staffMembers = await getStaffMembers(supabase, salon.id)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Invite and manage your team members.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Current Team</h2>
            {staffMembers.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {staffMembers.map(member => (
                  <li key={member.id} className="py-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{member.profiles.full_name}</p>
                      <p className="text-sm text-gray-500">{member.profiles.email}</p>
                    </div>
                    <span className="px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full capitalize">
                      {member.role}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">You haven't added any staff members yet.</p>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Invite New Staff</h2>
            <form action={inviteStaffMember} className="space-y-4">
              <input type="hidden" name="salonId" value={salon.id} />
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" name="email" id="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <select name="role" id="role" required className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <button type="submit" className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Send Invitation
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}