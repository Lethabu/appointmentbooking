"use client"

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function ProfilePage() {
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fullName, setFullName] = useState(null)
  const [phone, setPhone] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('No user')
        setUser(user)

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
  }, [supabase])

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
    <>
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      {/* The rest of your JSX remains the same, just wrapped in a fragment */}
    </>
  )
}