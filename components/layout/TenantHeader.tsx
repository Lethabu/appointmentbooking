<<<<<<< HEAD
import Link from 'next/link';
import Image from 'next/image';

// Define the type for a header link
interface HeaderLink {
=======

import Link from 'next/link';

interface NavLink {
>>>>>>> cf8a94a (feat: Implement full white-labeling for Instyle tenant)
  label: string;
  href: string;
}

<<<<<<< HEAD
// Define the type for the theme object
interface TenantTheme {
  logo_url: string;
  brand_name: string;
  header_links: HeaderLink[];
}

interface TenantHeaderProps {
  theme?: TenantTheme | null;
}

export default function TenantHeader({ theme }: TenantHeaderProps) {
  if (!theme) {
    // Render a default or fallback header if no theme is provided
    return (
      <header className="bg-gray-800 text-white">
        <nav className="container mx-auto flex items-center justify-between p-4">
          <div className="text-lg font-bold">My App</div>
          <ul className="flex gap-6">
            <li><Link href="/">Home</Link></li>
          </ul>
        </nav>
      </header>
    );
  }

  return (
    <header className="bg-black text-white">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <Link href="/">
          <Image
            src={theme.logo_url}
            alt={theme.brand_name}
            width={160}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>
        <ul className="hidden md:flex items-center gap-6">
          {theme.header_links && theme.header_links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-gray-300">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
=======
interface TenantHeaderProps {
  logoUrl?: string;
  brandName?: string;
  headerLinks?: NavLink[];
  primaryColor?: string;
  salonSlug: string;
}

export function TenantHeader({ 
  logoUrl, 
  brandName, 
  headerLinks = [], 
  primaryColor = '#1f2937', 
  salonSlug 
}: TenantHeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href={`/${salonSlug}`} className="flex items-center space-x-4">
          {logoUrl && (
            <img src={logoUrl} alt={brandName || 'Logo'} className="h-10 w-auto" />
          )}
          <span className="text-xl font-bold" style={{ color: primaryColor }}>
            {brandName}
          </span>
        </Link>
        <nav>
          <ul className="flex items-center gap-6">
            {headerLinks.map((link) => (
              <li key={link.href}>
                <Link href={`/${salonSlug}${link.href}`} className="text-gray-600 hover:text-gray-900">
                  {link.label}
                </Link>
              </li>
            ))}
             <li>
                <Link href="/login" className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700">
                  Member Login
                </Link>
              </li>
          </ul>
        </nav>
      </div>
>>>>>>> cf8a94a (feat: Implement full white-labeling for Instyle tenant)
    </header>
  );
}
