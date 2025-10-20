'use client';

import { useState } from 'react';
import { useAuth } from '@/app/ConvexClientProvider';
import AiChat from '@/components/AiChat';

export default function ProfilePage() {
  const authResult = useAuth();
  const [tenantId, setTenantId] = useState('default-tenant');

  // Since Convex auth is not implemented, show login prompt
  // TODO: Implement proper auth with Clerk integration
  if (!authResult || authResult === null) {
    return <div>Please sign in to access your profile</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Profile Page</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        <p>Profile editing functionality is not yet implemented</p>
        <p>TODO: Implement user profile management with Clerk authentication</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
        <AiChat tenantId={tenantId} />
      </div>
    </div>
  );
}
