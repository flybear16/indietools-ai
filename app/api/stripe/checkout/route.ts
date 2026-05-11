import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { toolId, planType } = await req.json();

    // planType: "boost" ($29) or "featured" ($99/week)
    const priceId = planType === "featured"
      ? process.env.STRIPE_PRICE_ID_FEATURED
      : process.env.STRIPE_PRICE_ID_BOOST;

    if (!priceId) {
      return NextResponse.json({ error: "Price not configured" }, { status: 500 });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id!,
        toolId: toolId || "",
        planType: planType || "boost",
      },
      success_url: `${process.env.NEXTAUTH_URL}/submit?success=true&tool=${toolId}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/submit?cancelled=true`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}