
import Link from 'next/link';

interface NavLink {
  label: string;
  href: string;
}

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
    </header>
  );
}
