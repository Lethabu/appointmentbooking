---
export default function ServiceCard({ service }) {
  return (
    <div className='p-4 border rounded-lg bg-white hover:shadow-md transition-shadow cursor-pointer'>
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-gray-800 flex-1 pr-4">{service.name}</h4>
        <p className="font-semibold text-primary whitespace-nowrap">R {service.price / 100}</p>
      </div>
      {service.description && <p className="text-sm text-gray-600 mt-2">{service.description}</p>}
      <p className="text-xs text-gray-400 mt-3">{service.duration_minutes} minutes</p>
    </div>
  );
}
---