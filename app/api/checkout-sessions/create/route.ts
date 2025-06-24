import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(req: NextRequest) {
  const { price, credits, email } = await req.json();

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      // customer_update: {
      //   address: "auto",
      //   name: "auto",
      // },
      // customer_creation: "always",
      billing_address_collection: "required",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Rez AI Credits - ${credits} credits`,
              description: `Get ${credits} AI credits to use with Rez AI. Each credit allows you to generate one AI response. Credits never expire and can be used anytime.`,
              metadata: {
                credits,
              },
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get(
        "origin"
      )}/payment?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get(
        "origin"
      )}/payment?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create checkout session", errorMessage: error },
      { status: 500 }
    );
  }
}
