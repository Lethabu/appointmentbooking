'use client';

import type { Service } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Clock, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onToggle: () => void;
}

export function ServiceCard({
  service,
  isSelected,
  onToggle,
}: ServiceCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md',
        isSelected
          ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200'
          : 'hover:border-gray-300',
      )}
      onClick={onToggle}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-semibold text-lg text-gray-900">
            {service.name}
          </h4>
          {isSelected && (
            <div className="bg-blue-500 rounded-full p-1">
              <Check className="h-4 w-4 text-white" />
            </div>
          )}
        </div>

        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {service.description}
        </p>

        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>{service.duration} min</span>
          </div>
          <div className="flex items-center font-semibold text-gray-900">
            <DollarSign className="h-4 w-4 mr-1" />
            <span>R {service.price}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
