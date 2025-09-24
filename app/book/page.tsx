import BookingForm from '@/components/BookingForm';

export default function BookPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">Book Your Appointment</h1>
          <BookingForm />
        </div>
      </section>
    </div>
  );
}
