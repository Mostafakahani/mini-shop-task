import { NextResponse } from "next/server";
import { headers } from "next/headers";
import stripe from "@/lib/stripe";
import fs from "fs";
import path from "path";

interface StripeError {
  type: string;
  message: string;
  code?: string;
  decline_code?: string;
}

interface PaymentRecord {
  id: string;
  customerId: string;
  amount: number;
  currency: string;
  status: string;
  customerInfo?: {
    name?: string;
    email?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    phone?: string;
  };
  items?: any[];
  timestamp: string;
}

function validateStripeSession(session: any) {
  const requiredFields = [
    "id",
    "customer",
    "amount_total",
    "currency",
    "payment_status",
  ];
  const missingFields = requiredFields.filter((field) => !session[field]);

  if (missingFields.length > 0) {
    throw new Error(
      `Invalid session data. Missing fields: ${missingFields.join(", ")}`
    );
  }

  if (session.amount_total < 0) {
    throw new Error("Invalid amount: Amount must be positive");
  }

  return true;
}

function validatePaymentIntent(paymentIntent: any) {
  const requiredFields = ["id", "amount", "currency", "status"];
  const missingFields = requiredFields.filter((field) => !paymentIntent[field]);

  if (missingFields.length > 0) {
    throw new Error(
      `Invalid payment intent data. Missing fields: ${missingFields.join(", ")}`
    );
  }

  if (paymentIntent.amount < 0) {
    throw new Error("Invalid amount: Amount must be positive");
  }

  if (
    !["succeeded", "failed", "processing", "requires_payment_method"].includes(
      paymentIntent.status
    )
  ) {
    throw new Error(`Invalid payment status: ${paymentIntent.status}`);
  }

  return true;
}

async function savePaymentRecord(paymentRecord: PaymentRecord) {
  const dataDir = path.join(process.cwd(), "data");
  const filePath = path.join(dataDir, "file.json");

  try {
    // Create the data directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch (error) {
        console.error("Error creating data directory:", error);
        throw new Error(
          "Failed to create data directory. Please check permissions."
        );
      }
    }

    // Check if file exists and read current data, or create empty array
    let currentData: PaymentRecord[] = [];
    if (fs.existsSync(filePath)) {
      try {
        // Check if we have read permissions
        fs.accessSync(filePath, fs.constants.R_OK | fs.constants.W_OK);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        currentData = fileContent ? JSON.parse(fileContent) : [];
      } catch (error) {
        console.error("Error reading payment file:", error);
        throw new Error(
          "Failed to read payment file. Please check permissions."
        );
      }
    }

    // Append new record
    currentData.push(paymentRecord);

    // Write updated data back to file
    try {
      fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2), "utf-8");
    } catch (error) {
      console.error("Error writing to payment file:", error);
      throw new Error(
        "Failed to write to payment file. Please check permissions."
      );
    }

    return true;
  } catch (error) {
    console.error("Payment record save error:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = (await headers()).get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "Missing Stripe webhook secret" },
        { status: 500 }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        try {
          validateStripeSession(session);

          // Extract customer info from metadata
          const customerInfo = {
            name: session.metadata?.customerName,
            email: session.metadata?.customerEmail,
            address: session.metadata?.customerAddress,
            city: session.metadata?.customerCity,
            postalCode: session.metadata?.customerPostalCode,
            phone: session.metadata?.customerPhone,
          };

          // Create payment record
          const paymentRecord: PaymentRecord = {
            id: session.id,
            customerId: session.customer as string,
            amount: session.amount_total ? session.amount_total / 100 : 0, // Convert from cents to dollars
            currency: session.currency as string,
            status: session.payment_status,
            customerInfo,
            timestamp: new Date().toISOString(),
          };

          // Save to file
          await savePaymentRecord(paymentRecord);

          return NextResponse.json({
            received: true,
            type: "checkout_completed",
            status: session.payment_status,
          });
        } catch (error) {
          throw new Error(
            `Checkout validation failed: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }

      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        try {
          validatePaymentIntent(paymentIntent);

          // Create payment record
          const paymentRecord: PaymentRecord = {
            id: paymentIntent.id,
            customerId:
              typeof paymentIntent.customer === "string"
                ? paymentIntent.customer
                : paymentIntent.customer?.id || "unknown", // Ensure customerId is a string
            amount: paymentIntent.amount / 100, // Convert from cents to dollars
            currency: paymentIntent.currency,
            status: paymentIntent.status,
            timestamp: new Date().toISOString(),
          };

          // Save to file
          await savePaymentRecord(paymentRecord);

          return NextResponse.json({
            received: true,
            type: "payment_succeeded",
            status: paymentIntent.status,
          });
        } catch (error) {
          throw new Error(
            `Payment validation failed: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object;
        const stripeError = failedPayment.last_payment_error as StripeError;
        try {
          validatePaymentIntent(failedPayment);

          // Create payment record for failed payment
          const paymentRecord: PaymentRecord = {
            id: failedPayment.id,
            customerId:
              typeof failedPayment.customer === "string"
                ? failedPayment.customer
                : failedPayment.customer?.id || "unknown", // Ensure customerId is a string
            amount: failedPayment.amount / 100, // Convert from cents to dollars
            currency: failedPayment.currency,
            status: failedPayment.status,
            timestamp: new Date().toISOString(),
          };

          // Save to file (we still want to record failed payments)
          await savePaymentRecord(paymentRecord);

          return NextResponse.json({
            received: true,
            type: "payment_failed",
            status: failedPayment.status,
            error: {
              code: stripeError?.code,
              decline_code: stripeError?.decline_code,
              message: stripeError?.message,
            },
          });
        } catch (error) {
          throw new Error(
            `Failed payment validation failed: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }

      default:
        return NextResponse.json(
          { error: `Unhandled event type: ${event.type}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Webhook error:", error);

    if (error instanceof stripe.errors.StripeSignatureVerificationError) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
