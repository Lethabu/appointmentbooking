import { headers } from 'next/headers';
import { InstyleNavbar } from '@/components/instyle/InstyleNavbar';
import { InstyleFooter } from '@/components/instyle/InstyleFooter';

export const metadata = {
  title: 'InStyle Hair Boutique - Premium Hair Salon in Johannesburg',
  description: 'Experience luxury hair services at InStyle Hair Boutique.',
};

export default async function InstyleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verify we're in tenant context
  const headersList = await headers();
  const tenant = headersList.get('x-tenant');

  console.log(`[InstyleLayout] Tenant: ${tenant}`);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-rose-50 to-white">
      {/* INSTYLE-SPECIFIC NAVBAR - NO PLATFORM BRANDING */}
      <InstyleNavbar />

      {/* MAIN CONTENT */}
      <main className="flex-grow">{children}</main>

      {/* INSTYLE-SPECIFIC FOOTER - NO PLATFORM BRANDING */}
      <InstyleFooter />
    </div>
  );
}
