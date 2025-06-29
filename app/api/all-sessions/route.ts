import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(req: NextRequest) {
  const { email, clerkId } = await req.json();
  try {
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      expand: ["data.line_items"],

      customer_details: {
        email,
      },
    });

    return NextResponse.json({
      success: true,
      sessions: {
        ...sessions,
        data: sessions.data.filter(
          (session) => session.metadata?.clerkId === clerkId
        ),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get sessions", errorMessage: error },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      expand: ["data.line_items"],
    });

    return NextResponse.json({ success: true, sessions });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get sessions", errorMessage: error },
      { status: 500 }
    );
  }
}
