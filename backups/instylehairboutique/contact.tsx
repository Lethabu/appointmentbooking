'use client';

import { inStyleConfig } from './config';

export default function ContactSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Visit Us</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              <p>
                <strong>Address:</strong> {inStyleConfig.address}
              </p>
              <p>
                <strong>Phone:</strong>{' '}
                <a href={`tel:${inStyleConfig.phone}`}>{inStyleConfig.phone}</a>
              </p>
              <p>
                <strong>WhatsApp:</strong>{' '}
                <a
                  href={`https://wa.me/${inStyleConfig.whatsapp.replace('+', '')}`}
                >
                  {inStyleConfig.whatsapp}
                </a>
              </p>
              <p>
                <strong>Email:</strong>{' '}
                <a href={`mailto:${inStyleConfig.email}`}>
                  {inStyleConfig.email}
                </a>
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="space-y-2">
              {Object.entries(inStyleConfig.socials).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-purple-600 hover:text-purple-800"
                >
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
