// app/config/navigation.js
export const navLinks = {
  public: [
    { name: 'Home', href: '/' },
    { name: 'Login', href: '/login' },
    { name: 'Sign Up', href: '/signup' },
  ],
  authenticated: [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Appointments', href: '/dashboard/appointments' },
    { name: 'Orders', href: '/dashboard/orders' },
    { name: 'Products', href: '/dashboard/products' },
    { name: 'Clients', href: '/dashboard/clients' },
    { name: 'Staff', href: '/dashboard/staff' },
    { name: 'Billing', href: '/dashboard/billing' },
    { name: 'Settings', href: '/dashboard/settings' },
  ],
  // Add role-specific links here
};