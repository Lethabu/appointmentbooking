'use client';

import { useState } from 'react';
import { useAuth } from '@/app/ConvexClientProvider';
import AiChat from '@/components/AiChat';

export default function ProfilePage() {
  const { user } = useAuth();
  const [tenantId, setTenantId] = useState('default-tenant');

  if (!user) return <div>Please sign in</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Profile Page</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        <p>Email: {user.email}</p>
        <p>Name: {user.displayName || 'Not set'}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
        <AiChat tenantId={tenantId} />
      </div>
    </div>
  );
}
