'use client';

const StatCard = ({ title, value, formatAsCurrency = false }) => {
  const displayValue = formatAsCurrency
    ? new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format((value ?? 0) / 100)
    : value ?? 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold mt-2 truncate">{displayValue}</p>
    </div>
  );
};

export default StatCard;