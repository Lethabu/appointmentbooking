'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Service } from '@/types';

interface ServiceFormProps {
  service?: Service | null;
  onSubmit: (service: Partial<Service>) => void;
  onCancel: () => void;
}

export function ServiceForm({ service, onSubmit, onCancel }: ServiceFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    duration: 0,
    price: 0,
  });

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        description: service.description || '',
        category: service.category || '',
        duration: service.duration,
        price: service.price,
      });
    }
  }, [service]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Service Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g., Signature Cut & Style"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Describe your service..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value: string) => handleChange('category', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Styling">Styling</SelectItem>
            <SelectItem value="Colour">Colour</SelectItem>
            <SelectItem value="Treatments">Treatments</SelectItem>
            <SelectItem value="Extensions">Extensions</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) =>
              handleChange('duration', Number.parseInt(e.target.value))
            }
            placeholder="90"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (R)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) =>
              handleChange('price', Number.parseInt(e.target.value))
            }
            placeholder="450"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {service ? 'Update Service' : 'Add Service'}
        </Button>
      </div>
    </form>
  );
}
