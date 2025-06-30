"use client";
import Link from "next/link";
import { SessionContextProvider, useSession } from '@supabase/auth-helpers-react';
import { supabase } from "./utils/supabaseClient";
import { useEffect, useState } from "react";

export default function Navbar() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <NavbarContent />
    </SessionContextProvider>
  );
}

function NavbarContent() {
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const userRole = session?.user?.user_metadata?.role;

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  };

  return (
    <nav className="flex items-center justify-between p-4 border-b mb-6">
      <Link href="/" className="font-bold text-lg">SalonBook</Link>
      <div className="flex gap-4">
        {session ? (
          <>
            {userRole === 'admin' && <Link href="/admin">Admin</Link>}
            <Link href="/dashboard/services">Services</Link>
            <Link href="/dashboard/products">Products</Link>
            <Link href="/dashboard">Dashboard</Link>
            <button onClick={handleLogout} disabled={loading} className="text-red-600">{loading ? 'Logging out...' : 'Logout'}</button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
