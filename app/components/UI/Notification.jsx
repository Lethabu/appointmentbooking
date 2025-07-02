'use client';

export default function Notification({ message, type = 'info', onDismiss }) {
  if (!message) return null;

  const baseClasses = 'p-4 rounded-md my-4 text-sm shadow';
  const typeClasses = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <div className="flex justify-between items-center">
        <span>{message}</span>
        {onDismiss && <button onClick={onDismiss} className="font-bold ml-4 text-lg leading-none">&times;</button>}
      </div>
    </div>
  );
}