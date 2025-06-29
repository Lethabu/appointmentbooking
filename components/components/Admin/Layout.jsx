'use client';
import { useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        if (error) {
          router.push('/login');
          return;
        }
        if (profile && profile.role === 'platform_admin') {
          setIsAdmin(true);
        } else {
          router.push('/');
        }
      } else if (user === null) {
        router.push('/login');
      }
      if (user !== undefined) setLoading(false);
    };
    checkAdminStatus();
  }, [user, supabase, router]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading admin area...</div>;
  if (!isAdmin) return <div className="flex justify-center items-center h-screen">Access Denied.</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4">
        <div className="container mx-auto">
          <p className="text-xl font-bold text-gray-700">SaaS Admin Panel</p>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
