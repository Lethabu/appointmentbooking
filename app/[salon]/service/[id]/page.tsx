interface ServiceDetailPageProps {
  params: {
    salon: string;
    id: string;
  };
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Service Details</h1>
      <p>Showing details for service <strong>{params.id}</strong> at <strong>{params.salon}</strong>.</p>
      <p>More content to come.</p>
      {/* A component to display service details would go here */}
    </div>
  );
}
