'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/app/ConvexClientProvider';

export default function AddSalonPage() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(db, 'tenants'), {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        ownerId: user.uid,
        paystackKey: 'pk_test_default',
        createdAt: serverTimestamp(),
        status: 'active',
      });
      alert('Salon created successfully!');
      setName('');
      setSlug('');
    } catch (error) {
      console.error(error);
      alert('Error creating salon');
    }
  };

  return (
    <div>
      <h1>Add Salon</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Salon Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="slug">Slug (optional)</label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Auto-generated from name if empty"
          />
        </div>
        <button type="submit">Add Salon</button>
      </form>
    </div>
  );
}
