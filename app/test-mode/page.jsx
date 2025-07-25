'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';

export default function TestModePage() {
  const [testMode, setTestMode] = useState(false);
  const [salonId, setSalonId] = useState('');

  useEffect(() => {
    const currentTestMode = Cookies.get('test_mode') === 'enabled';
    const currentSalonId = Cookies.get('test_salon_id') || '';
    setTestMode(currentTestMode);
    setSalonId(currentSalonId);
  }, []);

  const handleToggle = () => {
    const newTestMode = !testMode;
    if (newTestMode) {
      Cookies.set('test_mode', 'enabled', { expires: 7 });
      Cookies.set('test_salon_id', salonId, { expires: 7 });
    } else {
      Cookies.remove('test_mode');
      Cookies.remove('test_salon_id');
    }
    setTestMode(newTestMode);
    alert(`Test mode ${newTestMode ? 'enabled' : 'disabled'} for salon ID: ${salonId}`);
    window.location.reload();
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Dashboard Test Mode</h1>
      <p>
        This page allows you to enable a test mode to bypass authentication and view the dashboard for a specific tenant.
      </p>
      <div style={{ margin: '1rem 0' }}>
        <label htmlFor="salonId" style={{ marginRight: '0.5rem' }}>
          Tenant Salon ID:
        </label>
        <input
          id="salonId"
          type="text"
          value={salonId}
          onChange={(e) => setSalonId(e.target.value)}
          placeholder="Enter Salon ID to test"
          style={{ padding: '0.5rem', minWidth: '300px' }}
        />
      </div>
      <button onClick={handleToggle} style={{ padding: '0.5rem 1rem' }}>
        {testMode ? 'Disable Test Mode' : 'Enable Test Mode'}
      </button>
      <p style={{ marginTop: '1rem' }}>
        <strong>Current Status:</strong> {testMode ? `Enabled for Salon ID: ${Cookies.get('test_salon_id')}` : 'Disabled'}
      </p>
      {testMode && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Dashboard Links</h2>
          <ul>
            <li><Link href="/dashboard/services">Services</Link></li>
            <li><Link href="/dashboard/clients">Clients</Link></li>
            <li><Link href="/dashboard/marketing">Marketing</Link></li>
            <li><Link href="/dashboard/settings">Settings</Link></li>
            <li><Link href="/dashboard/products">Products</Link></li>
          </ul>
        </div>
      )}
    </div>
  );
}