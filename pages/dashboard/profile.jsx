import { useState, useEffect } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import DashboardLayout from '@/components/Dashboard/Layout'

export default function ProfilePage() {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [loading, setLoading] = useState(true)
  const [fullName, setFullName] = useState(null)
  const [phone, setPhone] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true)
        if (!user) throw new Error('No user')

        let { data, error, status } = await supabase
          .from('profiles')
          .select(`full_name, phone`)
          .eq('id', user.id)
          .single()

        if (error && status !== 406) {
          throw error
        }

        if (data) {
          setFullName(data.full_name)
          setPhone(data.phone)
        }
      } catch (error) {
        setMessage({ type: 'error', content: error.message })
      } finally {
        setLoading(false)
      }
    }
    getProfile()
  }, [user, supabase])

  async function updateProfile(event) {
    event.preventDefault()
    try {
      setLoading(true)
      if (!user) throw new Error('No user')

      const updates = {
        id: user.id,
        full_name: fullName,
        phone,
        updated_at: new Date().toISOString(),
      }

      let { error } = await supabase.from('profiles').upsert(updates)
      if (error) throw error
      setMessage({ type: 'success', content: 'Profile updated successfully!' })
    } catch (error) {
      setMessage({ type: 'error', content: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-lg">
        <form onSubmit={updateProfile} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input id="email" type="text" value={user?.email} disabled className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm cursor-not-allowed" />
          </div>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input id="fullName" type="text" value={fullName || ''} onChange={(e) => setFullName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <input id="phone" type="text" value={phone || ''} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" disabled={loading}>
              {loading ? 'Saving...' : 'Update Profile'}
            </button>
          </div>
        </form>
        {message && (
          <div className={`mt-4 text-sm ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
            {message.content}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
