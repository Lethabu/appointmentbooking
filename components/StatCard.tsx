import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-neutral-100 flex items-center space-x-4">
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        {icon}
      </div>
      <div>
        <p className="text-neutral-500 text-sm">{title}</p>
        <p className="text-2xl font-bold text-neutral-800">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;