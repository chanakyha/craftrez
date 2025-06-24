import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(req: NextRequest) {
  const { session_id } = await req.json();

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    return NextResponse.json({ success: true, session });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch session", errorMessage: error },
      { status: 500 }
    );
  }
}
