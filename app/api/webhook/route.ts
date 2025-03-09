import { NextResponse } from "next/server";
import { headers } from "next/headers";
import stripe from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = (await headers()).get("stripe-signature") as string;

    // اعتبارسنجی امضای Stripe
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );

    // واکنش به رویدادهای Stripe
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        // اینجا می‌توانید اطلاعات سفارش را در دیتابیس ذخیره کنید
        console.log("Checkout completed:", session);
        break;

      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log("Payment succeeded:", paymentIntent);
        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object;
        console.log("Payment failed:", failedPayment);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 400 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
