'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'

export default function CreateSalon() {
  const supabase = useSupabaseClient()
  const user = useUser()
  const router = useRouter()
  const [salonName, setSalonName] = useState('')
  const [subdomain, setSubdomain] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreateSalon = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase
      .from('salons')
      .insert({
        name: salonName,
        subdomain,
        owner_id: user.id,
        plan: 'trial', // As per our pricing model
        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      })
      .select()
      .single()

    if (error) {
      alert('Error creating salon: ' + error.message)
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <h1 className="text-2xl font-bold mb-4">Create Your Salon</h1>
      <form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground" onSubmit={handleCreateSalon}>
        <label className="text-md" htmlFor="name">Salon Name</label>
        <input className="rounded-md px-4 py-2 bg-inherit border mb-6" name="name" onChange={(e) => setSalonName(e.target.value)} value={salonName} placeholder="e.g., InStyle Hair Boutique" required />
        <label className="text-md" htmlFor="subdomain">Subdomain</label>
        <input className="rounded-md px-4 py-2 bg-inherit border mb-6" name="subdomain" onChange={(e) => setSubdomain(e.target.value)} value={subdomain} placeholder="e.g., instyle" required />
        <button className="bg-indigo-600 rounded px-4 py-2 text-white mb-2" disabled={loading}>
          {loading ? 'Creating...' : 'Create Salon'}
        </button>
      </form>
    </div>
  )
}