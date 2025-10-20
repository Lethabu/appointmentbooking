import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function seed() {
  await convex.mutation(api.comparisonItems.create, {
    name: "Our Platform",
    features: [
      { name: "AI-Powered Scheduling", supported: true },
      { name: "Multi-Tenant Support", supported: true },
      { name: "Offline Mode (PWA)", supported: true },
      { name: "Integrated Payments", supported: true },
    ],
  });
  await convex.mutation(api.comparisonItems.create, {
    name: "Competitor A",
    features: [
      { name: "AI-Powered Scheduling", supported: false },
      { name: "Multi-Tenant Support", supported: true },
      { name: "Offline Mode (PWA)", supported: false },
      { name: "Integrated Payments", supported: true },
    ],
  });
  console.log("Comparison items seeded successfully!");
}

seed();
