import Link from 'next/link';

export default function Salons({ salons }) {
    return (
        <div className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Our Salons</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {salons.map((salon) => (
                        <div key={salon.id} className="bg-gray-50 rounded-lg shadow-md overflow-hidden">
                            <img src={salon.image_url} alt={salon.name} className="w-full h-48 object-cover" />
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-800">{salon.name}</h3>
                                <p className="text-gray-600 mt-2">{salon.address}</p>
                                <Link href={`/book/${salon.slug}`} legacyBehavior>
                                    <a className="text-indigo-600 hover:text-indigo-900 font-semibold mt-4 inline-block">Book Now</a>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}