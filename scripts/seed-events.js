import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function seed() {
  await convex.mutation(api.events.create, {
    name: "Platform Demo",
    description: "A live demonstration of our platform's features.",
    startDate: "2025-09-01T10:00:00Z",
    endDate: "2025-09-01T11:00:00Z",
    location: "Online (Zoom)",
  });
  console.log("Events seeded successfully!");
}

seed();
