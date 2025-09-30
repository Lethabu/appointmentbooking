'use client';

export default function DirectionsButton() {
  const handleDirections = () => {
    const query = encodeURIComponent(
      'InStyle Hair Boutique Soshanguve Pretoria',
    );
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${query}`,
      '_blank',
    );
  };

  return (
    <button
      onClick={handleDirections}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
    >
      Get Directions
    </button>
  );
}
