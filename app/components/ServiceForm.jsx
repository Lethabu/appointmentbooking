'use client'

export default function ServiceForm({ onServiceAdded }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold mb-2">Add a New Service</h3>
      <form className="space-y-4">
        {/* Form fields for service name, price, duration etc. will go here */}
        <p className="text-sm text-gray-500">Service creation form will be implemented here.</p>
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700" disabled>Save Service</button>
      </form>
    </div>
  )
}