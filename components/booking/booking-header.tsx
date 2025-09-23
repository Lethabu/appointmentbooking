import type { Tenant } from '@/types';
import Image from 'next/image';

interface BookingHeaderProps {
  tenant: Tenant;
}

export function BookingHeader({ tenant }: BookingHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {tenant.config?.branding?.logo_url && (
              <Image
                src={tenant.config.branding.logo_url || '/placeholder.svg'}
                alt={`${tenant.name} logo`}
                width={200}
                height={60}
                className="h-12 w-auto"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {tenant.name}
              </h1>
              <p className="text-gray-600">Book your premium hair experience</p>
            </div>
          </div>
          <div className="hidden md:block">
            <p className="text-sm text-gray-500">Professional Hair Services</p>
            <p className="text-sm text-gray-500">Call us: (021) 123-4567</p>
          </div>
        </div>
      </div>
    </header>
  );
}
