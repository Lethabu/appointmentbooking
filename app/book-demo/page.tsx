import { convex } from "@/lib/convexClient";
import { api } from "@/convex/_generated/api";
import { jsonLd } from "@/lib/jsonLd";
import { Event, EventReservation } from 'schema-dts';

export async function generateMetadata() {
  const events = await convex.query(api.events.list);

  // Assuming the first event is the one for the demo
  const demoEvent = events[0];

  if (!demoEvent) {
    return {
      title: "Book a Demo - AppointmentBooking.co.za",
      description: "Schedule a demo to see our platform in action.",
    }
  }

  return {
    title: "Book a Demo - AppointmentBooking.co.za",
    description: "Schedule a demo to see our platform in action.",
    other: {
      'script[type="application/ld+json"]': jsonLd({
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: demoEvent.name,
        description: demoEvent.description,
        startDate: demoEvent.startDate,
        endDate: demoEvent.endDate,
        location: {
          '@type': 'Place',
          name: demoEvent.location,
        },
      } as Event),
    }
  };
}

async function BookDemoPage() {
  const events = await convex.query(api.events.list);

  const demoEvent = events[0];

  if (!demoEvent) {
    return <div>No demo event found.</div>
  }

  return (
    <div>
      <h1>{demoEvent.name}</h1>
      <p>{demoEvent.description}</p>
      <p>Date: {new Date(demoEvent.startDate).toLocaleDateString()}</p>
      <p>Time: {new Date(demoEvent.startDate).toLocaleTimeString()} - {new Date(demoEvent.endDate).toLocaleTimeString()}</p>
      <p>Location: {demoEvent.location}</p>
    </div>
  );
}

export default BookDemoPage;