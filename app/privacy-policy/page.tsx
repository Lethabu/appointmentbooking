// ============================================================================
// COMPONENT 2: Privacy Policy Page
// Spec: POPIA/GDPR Compliant Privacy Policy
// ============================================================================

import React from 'react';
import { Shield, Lock, FileText, Users, Database, Globe, Mail, Phone } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: '1. Information We Collect',
      content: [
        'Personal Information: Name, email address, phone number, physical address',
        'Appointment Data: Booking details, service preferences, appointment history',
        'Payment Information: Credit card details (processed securely by our payment provider)',
        'Technical Data: IP address, browser type, device information, cookies',
        'Usage Data: How you interact with our services',
      ],
    },
    {
      title: '2. Legal Basis for Processing (POPIA/GDPR)',
      content: [
        'Consent: When you opt-in to marketing communications',
        'Contract Performance: To provide booking services you requested',
        'Legal Obligation: To comply with tax and accounting requirements',
        'Legitimate Interest: To improve our services and prevent fraud',
      ],
    },
    {
      title: '3. How We Use Your Information',
      content: [
        'Process and manage your appointments',
        'Send booking confirmations and reminders via email/SMS/WhatsApp',
        'Provide customer support',
        'Improve our services and user experience',
        'Send marketing communications (with your consent)',
        'Comply with legal obligations',
      ],
    },
    {
      title: '4. Data Sharing and Third Parties',
      content: [
        'Payment Processors: Stripe/PayFast for secure payment processing',
        'Communication Services: Twilio/WhatsApp for appointment reminders',
        'Cloud Hosting: Vercel (USA), Supabase (USA) - with standard contractual clauses',
        'Analytics: Google Analytics (anonymized data only)',
        'We NEVER sell your personal data to third parties',
      ],
    },
    {
      title: '5. Your Rights Under POPIA/GDPR',
      content: [
        'Right to Access: Request a copy of your personal data',
        'Right to Rectification: Correct inaccurate information',
        'Right to Erasure: Request deletion of your data (&quot;right to be forgotten&quot;)',
        'Right to Restrict Processing: Limit how we use your data',
        'Right to Data Portability: Receive your data in a machine-readable format',
        'Right to Object: Opt-out of marketing communications',
        'Right to Withdraw Consent: At any time, without affecting prior processing',
      ],
    },
    {
      title: '6. Data Retention',
      content: [
        'Active Customers: For the duration of our relationship',
        'Inactive Customers: 7 years after last interaction (for legal/tax purposes)',
        'Marketing Lists: Until you unsubscribe',
        'Payment Records: 7 years as required by South African tax law',
      ],
    },
    {
      title: '7. Data Security',
      content: [
        'Encryption: All data encrypted in transit (TLS 1.3) and at rest (AES-256)',
        'Access Controls: Role-based access with multi-factor authentication',
        'Regular Audits: Quarterly security assessments and penetration testing',
        'Incident Response: 72-hour breach notification as required by POPIA/GDPR',
        'Staff Training: All employees trained on data protection',
      ],
    },
    {
      title: '8. International Data Transfers',
      content: [
        'Your data may be transferred to and processed in countries outside South Africa',
        'We use Standard Contractual Clauses (SCCs) approved by the EU Commission',
        'All third-party processors comply with GDPR adequacy requirements',
      ],
    },
    {
      title: '9. Children&apos;s Privacy',
      content: [
        'Our services are not intended for children under 18',
        'We do not knowingly collect data from minors',
        'Parental consent required for users under 18',
      ],
    },
    {
      title: '10. Contact Information',
      content: [
        'Data Controller: InStyle Hair Boutique (Pty) Ltd',
        'Registration Number: [INSERT_COMPANY_REG]',
        'Email: privacy@instylehairboutique.co.za',
        'Phone: +27 61 XXX XXXX',
        'Address: 123 Main Street, Pretoria, Gauteng, South Africa',
        'Information Regulator (SA): complaints@inforegulator.org.za',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Shield className="w-12 h-12" />
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-lg opacity-90 max-w-3xl">
            Last Updated: October 10, 2025
          </p>
          <p className="mt-4 text-sm opacity-80">
            Compliant with POPIA (Protection of Personal Information Act, 2013)
            and GDPR (General Data Protection Regulation)
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          {/* Introduction */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <p className="text-gray-700 leading-relaxed mb-4">
              At InStyle Hair Boutique, we are committed to protecting your privacy and
              ensuring the security of your personal information. This Privacy Policy
              explains how we collect, use, store, and protect your data in accordance
              with the Protection of Personal Information Act (POPIA) and the General
              Data Protection Regulation (GDPR).
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
              <p className="text-sm text-blue-900">
                <strong>Important:</strong> By using our services, you acknowledge that
                you have read and understood this Privacy Policy. If you do not agree,
                please do not use our services.
              </p>
            </div>
          </div>

          {/* Sections */}
          {sections.map((section, idx) => (
            <div key={idx} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {idx + 1}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {section.title}
                </h2>
              </div>
              <ul className="space-y-2 ml-6">
                {section.content.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Exercise Your Rights */}
          <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-900">
                How to Exercise Your Rights
              </h3>
            </div>
            <p className="text-gray-700 mb-4">
              To exercise any of your data protection rights, please contact us using the
              information provided below. We will respond within the timeframes required
              by POPIA and GDPR.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">privacy@instylehairboutique.co.za</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">+27 61 XXX XXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">Response within 30 days</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">Available 24/7 online</span>
              </div>
            </div>
          </div>

          {/* Data Subject Rights Request Link */}
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <FileText className="w-6 h-6 text-green-600 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Need to Access or Delete Your Data?
                </h3>
                <p className="text-gray-600 mb-3">
                  Use our automated data rights request form to easily submit access,
                  deletion, or other privacy-related requests.
                </p>
                <a
                  href="/data-rights"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold"
                >
                  Submit Data Rights Request
                </a>
              </div>
            </div>
          </div>

          {/* Changes to Policy */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Changes to This Policy
            </h3>
            <p className="text-gray-600 text-sm">
              We may update this Privacy Policy from time to time. We will notify you
              of any changes by posting the new policy on this page and updating the
              &quot;Last Updated&quot; date. We encourage you to review this policy periodically.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Version 1.0 - Effective October 10, 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
