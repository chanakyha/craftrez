import { Stripe, loadStripe } from "@stripe/stripe-js";
import StripeServer from "stripe";

let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

export default getStripe;

export const stripe = new StripeServer(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});
