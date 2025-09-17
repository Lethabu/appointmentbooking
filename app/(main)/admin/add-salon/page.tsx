'use client';

import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState } from 'react';

export default function AddSalonPage() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const createTenant = useMutation(api.tenants.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTenant({
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        paystackKey: 'pk_test_default',
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
