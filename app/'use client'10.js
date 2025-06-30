'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      setMessage('Could not authenticate user: ' + error.message)
    } else {
      setMessage('Check your email to continue the sign-up process.')
    }
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground" onSubmit={handleSignUp}>
        <label className="text-md" htmlFor="email">Email</label>
        <input className="rounded-md px-4 py-2 bg-inherit border mb-6" name="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="you@example.com" required />
        <label className="text-md" htmlFor="password">Password</label>
        <input className="rounded-md px-4 py-2 bg-inherit border mb-6" type="password" name="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="••••••••" required />
        <button className="bg-indigo-600 rounded px-4 py-2 text-white mb-2">Sign Up</button>
        {message && <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">{message}</p>}
      </form>
    </div>
  )
}