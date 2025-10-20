// ============================================================================
// COMPONENT 3: Data Subject Rights Request Form
// Spec: POPIA/GDPR Right to Access, Erasure, Portability
// ============================================================================

'use client';

import React, { useState } from 'react';
import { X, FileText, Shield, CheckCircle, AlertCircle, Users, Download, Trash, Edit } from 'lucide-react';

export default function DataRightsRequestForm() {
  const [formData, setFormData] = useState({
    requestType: 'access',
    fullName: '',
    email: '',
    phone: '',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const requestTypes = [
    {
      value: 'access',
      label: 'Access My Data',
      icon: FileText,
      description: 'Get a copy of all personal data we hold about you',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      value: 'rectify',
      label: 'Correct My Data',
      icon: Edit,
      description: 'Request correction of inaccurate or incomplete data',
      color: 'bg-yellow-100 text-yellow-700',
    },
    {
      value: 'delete',
      label: 'Delete My Data',
      icon: Trash,
      description: 'Request complete deletion of your data (right to be forgotten)',
      color: 'bg-red-100 text-red-700',
    },
    {
      value: 'export',
      label: 'Export My Data',
      icon: Download,
      description: 'Receive your data in a machine-readable format',
      color: 'bg-green-100 text-green-700',
    },
    {
      value: 'restrict',
      label: 'Limit Processing',
      icon: Shield,
      description: 'Restrict how we process your personal data',
      color: 'bg-purple-100 text-purple-700',
    },
    {
      value: 'object',
      label: 'Stop Marketing',
      icon: Users,
      description: 'Opt-out of marketing communications and profiling',
      color: 'bg-orange-100 text-orange-700',
    },
  ];

  const selectedRequest = requestTypes.find(type => type.value === formData.requestType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call - in production, this would send to your backend
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitted(true);
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewRequest = () => {
    setSubmitted(false);
    setFormData({
      requestType: 'access',
      fullName: '',
      email: '',
      phone: '',
      description: '',
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Request Submitted Successfully
          </h2>
          <p className="text-gray-600 mb-6">
            We&apos;ve received your data rights request and will process it within the required
            30-day timeframe. You will receive a confirmation email shortly with next steps.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-green-800 mb-2">What happens next?</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Email confirmation sent within 24 hours</li>
              <li>• Identity verification process may be required</li>
              <li>• Response within 30 days as required by POPIA/GDPR</li>
              <li>• Updates via email during processing</li>
            </ul>
          </div>

          <button
            onClick={handleNewRequest}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-12 h-12 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Data Rights Request
              </h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Exercise your rights under POPIA (South Africa) and GDPR (European Union).
              All requests are processed within 30 days as legally required.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Request Type Selection */}
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  1. Select Request Type
                </h2>
                <p className="text-gray-600">
                  Choose what you would like to do with your personal data
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {requestTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <label
                      key={type.value}
                      className={`relative flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.requestType === type.value
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="requestType"
                        value={type.value}
                        checked={formData.requestType === type.value}
                        onChange={(e) =>
                          setFormData({ ...formData, requestType: e.target.value })
                        }
                        className="sr-only"
                      />

                      <div className={`p-2 rounded-lg ${selectedRequest?.value === type.value ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <Icon className="w-6 h-6 text-gray-600" />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {type.label}
                        </h3>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>

                      {formData.requestType === type.value && (
                        <CheckCircle className="w-6 h-6 text-blue-600" />
                      )}
                    </label>
                  );
                })}
              </div>

              {/* Selected Request Details */}
              {selectedRequest && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <selectedRequest.icon className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-900">Selected: {selectedRequest.label}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedRequest.color}`}>
                      Active
                    </span>
                  </div>
                  <p className="text-gray-600">{selectedRequest.description}</p>
                </div>
              )}
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  2. Personal Information
                </h2>
                <p className="text-gray-600">
                  Provide your details for identity verification
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Enter your full legal name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="+27 61 XXX XXXX"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We&apos;ll use this for identity verification
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  3. Additional Details
                </h2>
                <p className="text-gray-600">
                  Provide any specific details about your request (optional)
                </p>
              </div>

              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Please provide any additional information that will help us process your request more efficiently. For example: specific time periods, particular types of data, or any issues you've encountered..."
              />

              {formData.description && (
                <p className="text-xs text-gray-500">
                  {formData.description.length}/2000 characters
                </p>
              )}
            </div>

            {/* Identity Verification Notice */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-800 font-semibold mb-1">
                    Identity Verification Required
                  </p>
                  <p className="text-sm text-yellow-800">
                    To protect your privacy and comply with data protection regulations, we are required to verify your identity before processing your request. We will contact you using the email address or phone number provided. This process helps ensure that your personal data is only shared with you.
                  </p>
                </div>
              </div>
            </div>

            {/* Legal Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <Shield className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Your Rights Under POPIA & GDPR
                  </h3>
                  <p className="text-sm text-blue-800 mb-3">
                    Neither POPIA nor GDPR require a fee for exercising your data rights. We will respond to your request within 30 days free of charge. If your request is complex or you have multiple requests, this may be extended by an additional 60 days, but we will inform you promptly.
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-blue-700">
                    <span>• 30-day response guarantee</span>
                    <span>• No processing fees</span>
                    <span>• Identity verification required</span>
                    <span>• Right to complain if unsatisfied</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col items-center gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-4 rounded-lg font-semibold text-white text-lg transition ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting Request...
                  </span>
                ) : (
                  'Submit Data Rights Request'
                )}
              </button>

              <p className="text-sm text-gray-600 text-center max-w-md">
                By submitting this request, you confirm that the information provided is accurate
                and authorize InStyle Hair Boutique to verify your identity to process your data rights request.
              </p>

              <p className="text-xs text-gray-500 text-center">
                This form is compliant with POPIA (South Africa) and GDPR (European Union) requirements.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
