---
# InStyle Hair Boutique Onboarding Guide

This guide contains everything you need to onboard InStyle Hair Boutique onto our platform, replacing their old SuperSaaS system with a superior, branded experience.

There are two main steps:
1.  **Populate the Database:** Run the `instyle_seed.sql` script in your Supabase project to create all of InStyle's services and products.
2.  **Update the Frontend Application:** Replace the existing booking page with the new, enhanced components provided.

--- 

### **Step 1: Populate the Database**

**IMPORTANT:** Before you run this script, you must get the unique `id` for InStyle's salon from your `salons` table in Supabase. You'll get this after you create their salon profile in the dashboard.

1.  **Open the `instyle_seed.sql` file.**
2.  At the very top of the file, you will see a line: `-- SET @salon_id = 'YOUR_SALON_ID_HERE';`. 
3.  **Replace `'YOUR_SALON_ID_HERE'` with the actual UUID of the InStyle Hair Boutique salon.**
4.  Navigate to your Supabase dashboard, go to the **SQL Editor**, paste the entire, updated contents of `instyle_seed.sql`, and click **RUN**.

This will instantly populate their account with all the correct services and products.

### **Step 2: Update the Frontend Application**

The following files provide a vastly superior, branded booking and shopping experience. You need to add or replace these files in your `appointmentbooking` GitHub repository.

1.  **`pages/[subdomain]/index.jsx`:** 
    *   **Action:** Replace the entire content of the existing file with the code from the new `index.jsx` provided. 
    *   **Purpose:** This is the new, high-quality landing and booking page for InStyle.

2.  **`components/booking/ServiceCard.jsx`:**
    *   **Action:** Create a new folder named `booking` inside your `components` directory. Inside `booking`, create a new file named `ServiceCard.jsx` and paste the provided code.
    *   **Purpose:** This is a reusable component for displaying services in a more attractive way.

3.  **`components/booking/ProductCard.jsx`:**
    *   **Action:** In the same `components/booking` folder, create a new file named `ProductCard.jsx` and paste the provided code.
    *   **Purpose:** This component will showcase the retail products InStyle sells.

### **Step 3: Deploy & Go Live**

1.  Commit these file changes to your `main` branch on GitHub.
2.  Vercel will automatically trigger a new deployment.
3.  Once the deployment is complete, visit InStyle's subdomain (e.g., `instyle.appointmentbookings.co.za`) or their custom domain if you've mapped it.
4.  You should see the new, beautifully branded, and fully populated booking and product page, ready for their clients.

---