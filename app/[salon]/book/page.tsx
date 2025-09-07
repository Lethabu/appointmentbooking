interface BookingPageProps {
  params: { salon: string };
}

export default function BookingPage({ params }: BookingPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Book an Appointment at {params.salon}</h1>
      <p>This is the start of the booking flow. More content to come.</p>
      {/* A full booking component would go here */}
    </div>
  );
}
