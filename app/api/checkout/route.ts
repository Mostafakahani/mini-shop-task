import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";

interface CartItem {
  title: string;
  image: string;
  description: string;
  price: number;
  quantity: number;
}

interface CustomerInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { items, customerInfo } = body as {
      items: CartItem[];
      customerInfo: CustomerInfo;
    };

    // ایجاد آیتم‌های Stripe
    const lineItems = items.map((item: CartItem) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          images: [item.image],
          description: item.description.substring(0, 255),
        },
        unit_amount: Math.round(item.price * 100), // تبدیل به سنت
      },
      quantity: item.quantity,
    }));

    // ایجاد جلسه پرداخت Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${request.headers.get(
        "origin"
      )}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get("origin")}/checkout`,
      metadata: {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerAddress: customerInfo.address,
        customerCity: customerInfo.city,
        customerPostalCode: customerInfo.postalCode,
        customerPhone: customerInfo.phone,
      },
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
};
