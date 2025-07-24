import React from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSession } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { cookies } from 'next/headers';

export default function TestDashboardPage() {
  const supabase = createClientComponentClient();
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    const testMode = cookies().get('test_mode') === 'enabled';
    if (!testMode) {
      router.push('/');
    }
  }, [router]);

  return (
    <div>
      <h1>Test Dashboard</h1>
      <p>Test mode is enabled. You are logged in as a test user.</p>
      <button onClick={() => router.push('/dashboard/services')}>View Services</button>
    </div>
  );
}