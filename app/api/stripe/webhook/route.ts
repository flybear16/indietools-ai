import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { tools, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: ReturnType<typeof stripe.webhooks.constructEvent>;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const { toolId, planType, userId } = session.metadata || {};

      if (toolId && planType === "boost") {
        // Mark tool as featured for 30 days
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        await db
          .update(tools)
          .set({
            isFeatured: true,
            featuredExpiresAt: expiresAt,
            status: "approved",
          })
          .where(eq(tools.id, toolId));
      }
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as any;
      const userId = subscription.metadata?.userId;
      if (!userId) break;

      const isActive = subscription.status === "active";
      const expiresAt = new Date(subscription.current_period_end * 1000);
      await db
        .update(users)
        .set({
          subscriptionStatus: isActive ? "active" : "inactive",
          subscriptionExpiresAt: expiresAt,
          role: isActive ? "pro" : "user",
        })
        .where(eq(users.id, userId));
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as any;
      const userId = subscription.metadata?.userId;
      if (!userId) break;

      await db
        .update(users)
        .set({
          subscriptionStatus: "cancelled",
          subscriptionExpiresAt: null,
          role: "user",
        })
        .where(eq(users.id, userId));
      break;
    }

    case "payment_intent.payment_failed": {
      console.log("Payment failed:", event.data.object);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}