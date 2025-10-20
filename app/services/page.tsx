import { getStaticFirestoreData } from '@/lib/firebase-static';

export async function generateStaticParams() {
  // Return empty array to prevent build errors
  return [];
}

export async function generateMetadata() {
  return {
    title: 'Services',
    description: 'View our services',
  };
}

export default async function ServicesPage({ params }: { params?: { tenant?: string } }) {
  const tenant = params?.tenant;
  
  // Fetch services with error handling
  let services: Array<{ id: string; [key: string]: any }> = [];
  try {
    services = await getStaticFirestoreData('services', tenant);
  } catch (error) {
    console.warn('Failed to fetch services:', error);
  }

  return (
    <div>
      <h1>Services</h1>
      {services.length > 0 ? (
        <ul>
          {services.map(service => (
            <li key={service.id}>{service.name ?? '[No name found]'}</li>
          ))}
        </ul>
      ) : (
        <p>No services available at the moment.</p>
      )}
    </div>
  );
}
