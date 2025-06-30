'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSignIn = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
      router.refresh() // Ensure the layout is re-rendered with the new session
    }
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground" onSubmit={handleSignIn}>
        <label className="text-md" htmlFor="email">Email</label>
        <input className="rounded-md px-4 py-2 bg-inherit border mb-6" name="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="you@example.com" required />
        <label className="text-md" htmlFor="password">Password</label>
        <input className="rounded-md px-4 py-2 bg-inherit border mb-6" type="password" name="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="••••••••" required />
        <button className="bg-indigo-600 rounded px-4 py-2 text-white mb-2">Sign In</button>
        {error && <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">{error}</p>}
      </form>
    </div>
  )
}