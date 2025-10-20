import { ROIWidget } from '@/components/marketing/ROIWidget';
import { ExitIntentModal } from '@/components/marketing/ExitIntentModal';
import Link from 'next/link';
import {
  WithContext,
  WebSite,
  FAQPage,
} from 'schema-dts';
import { jsonLd } from '@/lib/jsonLd';

const faqQuestions = [
  {
    question: 'What is The Platform?',
    answer:
      "It's an AI-powered SaaS platform for South African salons and spas to manage their bookings, clients, and grow their business.",
  },
  {
    question: 'Is there a free trial?',
    answer:
      "Yes, you can start a free trial to explore the platform's features.",
  },
];

export function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'The Platform',
            url: 'https://your-platform-domain.com',
          } as WithContext<WebSite>),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqQuestions.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          } as WithContext<FAQPage>),
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              <span className="text-blue-600">The Platform</span>.com
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              AI-Powered SaaS Platform for South African Salons & Spas
            </p>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">For Salon Owners</h2>
                <p className="text-gray-600 mb-6">
                  Manage bookings, clients, and grow your business with AI
                </p>
                <Link
                  href="/dashboard"
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Start Free Trial
                </Link>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Live Demo</h2>
                <p className="text-gray-600 mb-6">
                  See our platform in action with InStyle Hair Boutique
                </p>
                <Link
                  href="/instyle"
                  className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
                >
                  View Demo
                </Link>
              </div>
            </div>

            {/* ROI Widget */}
            <div className="mt-16">
              <ROIWidget />
            </div>

            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Smart Booking</h3>
                <p className="text-gray-600">
                  AI-powered scheduling optimization
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Analytics</h3>
                <p className="text-gray-600">Real-time business insights</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">AI Assistant</h3>
                <p className="text-gray-600">
                  24/7 customer support automation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ExitIntentModal />
    </>
  );
}
