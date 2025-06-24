import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(req: NextRequest) {
  const { session_id } = await req.json();

  try {
    const session = await stripe.checkout.sessions.expire(session_id);
    revalidateTag("session");

    return NextResponse.json({ success: true, session });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to expire session", errorMessage: error },
      { status: 500 }
    );
  }
}
