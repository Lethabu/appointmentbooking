'use client';

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold">Total Salons</h3>
        <p className="text-2xl">0</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold">Total Users</h3>
        <p className="text-2xl">0</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold">Revenue</h3>
        <p className="text-2xl">R0.00</p>
      </div>
    </div>
  );
}
