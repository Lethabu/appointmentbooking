import { preloadQuery, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { jsonLd } from "@/lib/jsonLd";
import { Event } from 'schema-dts';
import BookDemoClientPage from "./BookDemoClientPage";

export async function generateMetadata() {
  try {
    const events = await fetchQuery(api.events.list);

    if (events.length === 0) {
      return {
        title: "Book a Demo - AppointmentBooking.co.za",
        description: "Schedule a demo to see our platform in action.",
      }
    }
    const demoEvent = events[0];

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
  } catch (error) {
    console.error("Error generating metadata for book-demo page:", error);
    return {
      title: "Book a Demo - AppointmentBooking.co.za",
      description: "Schedule a demo to see our platform in action.",
    }
  }
}

export default async function BookDemoPage() {
  const preloadedEvents = await preloadQuery(api.events.list);
  return <BookDemoClientPage preloadedEvents={preloadedEvents} />;
}