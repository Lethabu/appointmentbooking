import { action } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendDripEmail = action({
  args: { to: v.string(), subject: v.string(), html: v.string() },
  handler: async (ctx, args) => {
    await resend.emails.send({
      from: "onboarding@your-platform-domain.com",
      to: args.to,
      subject: args.subject,
      html: args.html,
    });
    return true;
  },
});
