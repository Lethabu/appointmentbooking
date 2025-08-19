'use client';

import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState } from 'react';

export default function AddSalonPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const createTenant = useMutation(api.tenants.createTenant);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTenant({ name, email });
      alert('Salon created successfully!');
      setName('');
      setEmail('');
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
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Salon</button>
      </form>
    </div>
  );
}
