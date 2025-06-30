import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

async function getSalonForUser(supabase, userId) {
  const { data: salon } = await supabase
    .from('salons')
    .select('id, name')
    .eq('owner_id', userId)
    .single()
  return salon
}

export default async function Dashboard() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const salon = await getSalonForUser(supabase, user.id)

  if (!salon) {
    return redirect('/dashboard/create-salon')
  }

  const signOut = async () => {
    'use server'
    const supabase = createClient()
    await supabase.auth.signOut()
    return redirect('/login')
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full">Welcome to the {salon.name} dashboard!</div>
      <form action={signOut}><button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">Logout</button></form>
    </div>
  )
}