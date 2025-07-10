import { createServerClient } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link';
import {
  HomeIcon,
  CalendarDaysIcon,
  ShoppingBagIcon,
  UsersIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  CreditCardIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';
import ThemeInjector from '../components/Branding/ThemeInjector';

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
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value
          },
          set(name, value, options) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name, options) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )
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
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

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

  const headersList = headers();
  const logoUrl = headersList.get('X-Tenant-Logo-Url');
  const themeHeader = headersList.get('X-Tenant-Theme');

  let cssVariables = '';
  if (themeHeader) {
    try {
      const theme = JSON.parse(themeHeader);
      cssVariables = Object.entries(theme)
        .map(([key, value]) => `--${key}: ${value};`)
        .join('\n');
    } catch (error) {
      console.error('Failed to parse tenant theme in layout:', error);
    }
  }

  return (
    <>
      <ThemeInjector cssVariables={cssVariables} />
      <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-white shadow-md flex-shrink-0 flex flex-col">
        <div className="p-6 border-b flex items-center space-x-4">
          {logoUrl && <img src={logoUrl} alt="Salon Logo" className="h-10 w-auto" />}
          <Link href="/dashboard" className="text-2xl font-bold text-indigo-600 truncate">
            {salon.name}
          </Link>
        </div>
        <nav className="mt-6 flex-grow px-4 space-y-2">
          <NavLink href="/dashboard" icon={HomeIcon}>Overview</NavLink>
          <NavLink href="/dashboard/appointments" icon={CalendarDaysIcon}>Appointments</NavLink>
          <NavLink href="/dashboard/services" icon={Cog6ToothIcon}>Services</NavLink>
          <NavLink href="/dashboard/staff" icon={UserGroupIcon}>Staff</NavLink>
          <NavLink href="/dashboard/staff-schedules" icon={CalendarDaysIcon}>Staff Schedules</NavLink>
          <NavLink href="/dashboard/resources" icon={CubeIcon}>Resources</NavLink>
          <NavLink href="/dashboard/service-resources" icon={Cog6ToothIcon}>Service Resources</NavLink>
          <NavLink href="/dashboard/clients" icon={UsersIcon}>Clients</NavLink>
          <NavLink href="/dashboard/orders" icon={ShoppingBagIcon}>Orders</NavLink>
          <NavLink href="/dashboard/products" icon={CubeIcon}>Products</NavLink>
          <NavLink href="/dashboard/billing" icon={CreditCardIcon}>Billing</NavLink>
          <NavLink href="/dashboard/settings" icon={Cog6ToothIcon}>Settings</NavLink>
        </nav>
        <div className="p-4 border-t">
          <p className="text-sm font-medium truncate mb-2">{user.email}</p>
          <SignOut />
        </div>
      </aside>
      <main className="flex-1 p-6 sm:p-8">
        {children}
      </main>
    </div>
    </>
  )
}