'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTenantContext } from '@/contexts/tenant-context';
import { useTheme } from '@/contexts/theme-context';
import { BookingHeader } from './booking-header';
import { ServiceList } from './service-list';
import { ProductShowcase } from './product-showcase';
import { AppointmentSummary } from './appointment-summary';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { api } from '@/lib/api';
import type { Service, Product, BookingFormData } from '@/types';

export function BookingPageContent() {
  const {
    tenant,
    loading: tenantLoading,
    error: tenantError,
  } = useTenantContext();
  const { primaryColor } = useTheme();
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<
    Omit<BookingFormData, 'selected_services'>
  >({
    full_name: '',
    phone_number: '',
    email: '',
    preferred_date: '',
    preferred_time: '',
    notes: '',
  });

  const loadData = useCallback(async () => {
    if (!tenant) return;

    try {
      setLoading(true);
      const [servicesData, productsData] = await Promise.all([
        api.getServices(tenant.id),
        api.getProducts(tenant.id),
      ]);

      setServices(servicesData);
      setProducts(productsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [tenant]);

  useEffect(() => {
    if (tenant) {
      loadData();
    }
  }, [tenant, loadData]);

  const handleServiceToggle = (service: Service) => {
    setSelectedServices((prev) => {
      const isSelected = prev.find((s) => s.id === service.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBookingSubmit = async () => {
    if (!tenant) return;

    try {
      const bookingData: BookingFormData & { tenantId: string } = {
        ...formData,
        selected_services: selectedServices,
        tenantId: tenant.id,
      };

      await api.createBooking(bookingData);

      // Reset form
      setSelectedServices([]);
      setFormData({
        full_name: '',
        phone_number: '',
        email: '',
        preferred_date: '',
        preferred_time: '',
        notes: '',
      });

      // Show success message (you could use a toast here)
      alert('Booking request submitted successfully!');
    } catch (err) {
      alert('Failed to submit booking. Please try again.');
    }
  };

  if (tenantLoading) {
    return <LoadingSpinner />;
  }

  if (tenantError || !tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Salon Not Found
          </h1>
          <p className="text-gray-600">
            The salon you&apos;re looking for doesn&apos;t exist or is no longer
            available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <BookingHeader tenant={tenant} />

        <div className="container mx-auto px-4 py-8">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadData}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Services and Products */}
              <div className="lg:col-span-2 space-y-8">
                <ServiceList
                  services={services}
                  selectedServices={selectedServices}
                  onServiceToggle={handleServiceToggle}
                />
                {products.length > 0 && <ProductShowcase products={products} />}
              </div>

              {/* Right Column - Appointment Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <AppointmentSummary
                    selectedServices={selectedServices}
                    formData={formData}
                    onFormChange={handleFormChange}
                    onSubmit={handleBookingSubmit}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
