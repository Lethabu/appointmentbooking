import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function seed() {
  await convex.mutation(api.posts.create, {
    title: "The Ultimate Guide to Salon Management",
    slug: "ultimate-guide-to-salon-management",
    author: "John Doe",
    content: "This is a comprehensive guide to managing your salon effectively...",
    ogImage: "https://example.com/og-image.png",
  });
  console.log("Blog post seeded successfully!");
}

seed();
