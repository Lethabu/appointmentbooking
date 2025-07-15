'use client';
import { useEffect, useState } from 'react';
import { getTenantBySubdomain } from '../lib/services/tenant';
import BookingWidget from '../components/BookingWidget/index';

export default function SalonPage({ params }) {
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const tenantData = await getTenantBySubdomain(params.salon);
        setTenant(tenantData);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };
    fetchTenant();
  }, [params.salon]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>{tenant?.name}</h1>
      <BookingWidget businessId={tenant?.id} />
    </div>
  );
}
