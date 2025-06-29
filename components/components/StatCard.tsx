import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement<{ className?: string }>; // Updated prop type
  color?: string; // Tailwind color class e.g., 'text-blue-500'
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color = 'text-primary' }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold text-neutral-800 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-opacity-20 ${color.replace('text-', 'bg-')}`}>
          {React.cloneElement(icon, { className: `h-7 w-7 ${color}` })}
        </div>
      </div>
    </div>
  );
};

export default StatCard;