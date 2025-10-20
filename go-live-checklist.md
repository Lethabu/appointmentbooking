# Go-Live Checklist & Retrospective

This document outlines the final steps to deploy the application to production, announce the go-live to the Instyle client, and conduct a sprint retrospective.

## 1. Pre-Deployment Checklist

- [ ] Verify that all environment variables are correctly set in the Vercel project settings for the production environment.
- [ ] Run all tests one final time (`npm test`).
- [ ] Perform a final end-to-end test of the onboarding flow and the Instyle tenant site.
- [ ] Ensure that the `schema.sql` changes have been applied to the production database.

## 2. Deploy to Vercel

1.  Merge all changes into the `main` branch.
2.  Push the `main` branch to the remote repository.
3.  Vercel will automatically trigger a new production deployment.
4.  Monitor the deployment in the Vercel dashboard and verify that it completes successfully.

## 3. Go-Live Announcement

**Subject: Your New Instyle Hair Boutique Website is Live!**

Hi Instyle Team,

We are thrilled to announce that your new and improved website is now live at [instylehairboutique.co.za](https://instylehairboutique.co.za)!

We have completed the planned upgrades to the platform, and your site is now running on the new, more resilient infrastructure. We have also implemented the new branding and theme that we discussed.

We are confident that you will love the new site, and we are excited to continue working with you to make it even better.

Best,

The AppointmentBooking Team

## 4. Sprint Retrospective

### What went well?

- ...

### What could be improved?

- ...

### Action Items

- ...
