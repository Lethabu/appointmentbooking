import Link from 'next/link';

// Define the type for a header link
interface HeaderLink {
  label: string;
  href: string;
}

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
          <img src={theme.logo_url} alt={theme.brand_name} className="h-10" />
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
    </header>
  );
}
