import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature");
  const body = await request.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook Error: ${err}` },
      { status: 400 }
    );
  }
  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const paymentIntent = event.data.object;
      try {
        console.log("Updating user credits");
        console.log({ metadata: paymentIntent.metadata });
        const updatedUsers = await prisma.user.updateManyAndReturn({
          where: { clerkId: paymentIntent.metadata?.clerkId },
          data: {
            credits: {
              increment: Number(paymentIntent.metadata?.credits),
            },
          },
        });
        console.log("User credits updated", {
          FullName: updatedUsers[0].FullName,
          credits: updatedUsers[0].credits,
        });
      } catch (error) {
        console.log("Error updating user credits");
        console.log(error);
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);

      break;
  }

  return NextResponse.json({ received: true });
}
