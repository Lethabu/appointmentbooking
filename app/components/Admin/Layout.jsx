'use client'

export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        {/* Admin navigation links can go here */}
      </aside>
      <main className="flex-grow p-6">
        {children}
      </main>
    </div>
  )
}