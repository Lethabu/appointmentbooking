import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import QueryProvider from '@/components/QueryProvider'
import Link from 'next/link'
import {
  HomeIcon,
  CalendarDaysIcon,
  ShoppingBagIcon,
  UsersIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  CreditCardIcon,
  CubeIcon,
} from '@heroicons/react/24/outline'

async function getSalonForUser(supabase, userId) {
  const { data: salon, error } = await supabase
    .from('salons')
    .select('id, name')
    .eq('owner_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
    console.error('Error fetching salon:', error)
  }
  return salon
}

const SignOut = () => {
  const signOutAction = async () => {
    'use server'
    const supabase = createClient()
    await supabase.auth.signOut()
    return redirect('/')
  }
  return (
    <form action={signOutAction}>
      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
        Sign Out
      </button>
    </form>
  )
}

const NavLink = ({ href, icon: Icon, children }) => (
  <Link
    href={href}
    className="flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition-colors"
  >
    <Icon className="h-6 w-6 mr-3" />
    {children}
  </Link>
)

export default async function DashboardLayout({ children }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const salon = await getSalonForUser(supabase, user.id)

  // If the user is logged in but hasn't created a salon yet,
  // redirect them to the salon creation page.
  if (!salon) {
    return redirect('/dashboard/create-salon')
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-white shadow-md flex-shrink-0 flex flex-col">
        <div className="p-6 border-b">
          <Link href="/dashboard" className="text-2xl font-bold text-indigo-600 truncate">
            {salon.name}
          </Link>
        </div>
        <nav className="mt-6 flex-grow px-4 space-y-2">
          <NavLink href="/dashboard" icon={HomeIcon}>Overview</NavLink>
          <NavLink href="/dashboard/appointments" icon={CalendarDaysIcon}>Appointments</NavLink>
          <NavLink href="/dashboard/orders" icon={ShoppingBagIcon}>Orders</NavLink>
          <NavLink href="/dashboard/products" icon={CubeIcon}>Products</NavLink>
          <NavLink href="/dashboard/clients" icon={UsersIcon}>Clients</NavLink>
          <NavLink href="/dashboard/staff" icon={UserGroupIcon}>Staff</NavLink>
          <NavLink href="/dashboard/billing" icon={CreditCardIcon}>Billing</NavLink>
          <NavLink href="/dashboard/settings" icon={Cog6ToothIcon}>Settings</NavLink>
        </nav>
        <div className="p-4 border-t">
          <p className="text-sm font-medium truncate mb-2">{user.email}</p>
          <SignOut />
        </div>
      </aside>
      <main className="flex-grow p-6 sm:p-8">
        <QueryProvider>
          {children}
        </QueryProvider>
      </main>
    </div>
  )
}