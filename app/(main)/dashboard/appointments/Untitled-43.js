import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

async function getSalonForUser(supabase, userId) {
  const { data: salon } = await supabase
    .from('salons')
    .select('id, name')
    .eq('owner_id', userId)
    .single()
  return salon
}

const SignOut = () => {
  const signOutAction = async () => {
    'use server'
    const supabase = createClient()
    await supabase.auth.signOut()
    return redirect('/login')
  }
  return (
    <form action={signOutAction}>
      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
        Sign Out
      </button>
    </form>
  )
}

export default async function DashboardLayout({ children }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const salon = await getSalonForUser(supabase, user.id)

  if (!salon) {
    return redirect('/dashboard/create-salon')
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white shadow-r flex-shrink-0 flex flex-col">
        <div className="p-6 border-b">
          <Link href="/dashboard" className="text-2xl font-bold text-indigo-600 truncate">
            {salon.name}
          </Link>
        </div>
        <nav className="mt-6 flex-grow">
          <Link href="/dashboard" className="block px-6 py-3 text-gray-700 hover:bg-indigo-50">Overview</Link>
          <Link href="/dashboard/orders" className="block px-6 py-3 text-gray-700 hover:bg-indigo-50">Orders</Link>
        </nav>
        <div className="p-4 border-t">
          <p className="text-sm font-medium truncate mb-2">{user.email}</p>
          <SignOut />
        </div>
      </aside>
      <div className="flex-grow">{children}</div>
    </div>
  )
}