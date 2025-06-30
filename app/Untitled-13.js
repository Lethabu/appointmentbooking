import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const signOut = async () => {
    'use server'
    const supabase = createClient()
    await supabase.auth.signOut()
    return redirect('/')
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full">Welcome, {user.email}! This is your dashboard.</div>
      <form action={signOut}><button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">Logout</button></form>
    </div>
  )
}