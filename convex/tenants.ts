import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import Paystack from "paystack-node";
import { Clerk } from "@clerk/clerk-sdk-node";
import { Resend } from "resend";
import { api } from "./_generated/api"; // Import api to call other actions

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY!)
const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY! });

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tenants")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const listAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("tenants").collect();
  },
});

export const createTenant = mutation({
  args: { name: v.string(), email: v.string() },
  handler: async (ctx, args) => {
    const slug = args.name.toLowerCase().replace(/\s/g, "-");

    // 1. Create Paystack sub-account
    // This is a placeholder, the actual API call might be different
    const subaccount = await paystack.subaccount.create({
      business_name: args.name,
      settlement_bank: "Guaranty Trust Bank", // This needs to be configured
      account_number: "1234567890", // This needs to be configured
      percentage_charge: 0.1,
    });

    // 2. Create Clerk organization
    const organization = await clerk.organizations.createOrganization({
      name: args.name,
      slug: slug,
    });

    // 3. Create tenant in Convex
    const tenantId = await ctx.db.insert("tenants", {
      name: args.name,
      slug: slug,
      paystackKey: subaccount.data.subaccount_code,
      theme: {},
    });

    // 4. Send welcome email (Day 0 drip)
    await ctx.runAction(api.emails.sendDripEmail, {
      to: args.email,
      subject: "Welcome to AppointmentBooking.co.za",
      html: `<h1>Welcome, ${args.name}!</h1><p>Thank you for signing up. We are excited to have you on board!</p>`,
    });

    // 5. Send Sanity CMS invite email
    await ctx.runAction(api.emails.sendDripEmail, {
      to: args.email,
      subject: "Your Sanity CMS Invitation",
      html: `<h1>Sanity CMS Invitation for ${args.name}</h1><p>Here is your link to the Sanity CMS: ...</p>`,
    });

    return tenantId;
  },
});