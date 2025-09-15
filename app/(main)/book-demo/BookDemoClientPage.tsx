'use client';

import { usePreloadedQuery, Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function BookDemoClientPage({ preloadedEvents }: { preloadedEvents: Preloaded<typeof api.events.list> }) {
  const events = usePreloadedQuery(preloadedEvents);

  if (events.length === 0) {
    return <div>No demo event found.</div>
  }
  const demoEvent = events[0];

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