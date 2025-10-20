'use client';

import Link from 'next/link';

interface TenantConfig {
  name: string;
  contact?: {
    phone: string;
    email: string;
    address: string;
  };
  socials: Record<string, string>;
}

interface ContactSectionProps {
  config: TenantConfig;
}

export default function ContactSection({ config }: ContactSectionProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Visit Us</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              <p>
                <strong>Address:</strong> {config.contact?.address || 'Soshanguve, Pretoria, South Africa'}
              </p>
              <p>
                <strong>Phone:</strong>{' '}
                <Link href={`tel:${config.contact?.phone || '+27123456789'}`}>
                  {config.contact?.phone || '+27123456789'}
                </Link>
              </p>
              <p>
                <strong>WhatsApp:</strong>{' '}
                <Link
                  href={`https://wa.me/${(config.contact?.phone || '+27123456789').replace('+', '')}`}
                >
                  {config.contact?.phone || '+27123456789'}
                </Link>
              </p>
              <p>
                <strong>Email:</strong>{' '}
                <Link href={`mailto:${config.contact?.email || 'bookings@' + config.name.toLowerCase().replace(/\s+/g, '') + '.co.za'}`}>
                  {config.contact?.email || 'bookings@' + config.name.toLowerCase().replace(/\s+/g, '') + '.co.za'}
                </Link>
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="space-y-2">
              {Object.entries(config.socials).map(([platform, url]) => (
                <Link
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-purple-600 hover:text-purple-800"
                >
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}