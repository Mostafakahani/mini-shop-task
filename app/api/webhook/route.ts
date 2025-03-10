import { NextResponse } from "next/server";
import { headers } from "next/headers";
import stripe from "@/lib/stripe";
import axios from "axios";

// interface StripeError {
//   type: string;
//   message: string;
//   code?: string;
//   decline_code?: string;
// }

// interface PaymentRecord {
//   id: string;
//   customerId: string;
//   amount: number;
//   currency: string;
//   status: string;
//   customerInfo?: {
//     name?: string;
//     email?: string;
//     address?: string;
//     city?: string;
//     postalCode?: string;
//     phone?: string;
//   };
//   items?: any[];
//   timestamp: string;
// }

// interface PaymentData {
//   orderId: string;
//   customerInfo: {
//     name: string;
//     email: string;
//     address: string;
//     city: string;
//     postalCode: string;
//     phone: string;
//   };
//   products: {
//     id: number;
//     title: string;
//     price: number;
//     quantity: number;
//   }[];
//   totalAmount: number;
//   paymentStatus: "completed";
//   paymentMethod: string;
//   timestamp: string;
// }

// function validateStripeSession(session: any) {
//   const requiredFields = [
//     "id",
//     "customer",
//     "amount_total",
//     "currency",
//     "payment_status",
//   ];
//   const missingFields = requiredFields.filter((field) => !session[field]);

//   if (missingFields.length > 0) {
//     throw new Error(
//       `Invalid session data. Missing fields: ${missingFields.join(", ")}`
//     );
//   }

//   if (session.amount_total < 0) {
//     throw new Error("Invalid amount: Amount must be positive");
//   }

//   return true;
// }

// function validatePaymentIntent(paymentIntent: any) {
//   const requiredFields = ["id", "amount", "currency", "status"];
//   const missingFields = requiredFields.filter((field) => !paymentIntent[field]);

//   if (missingFields.length > 0) {
//     throw new Error(
//       `Invalid payment intent data. Missing fields: ${missingFields.join(", ")}`
//     );
//   }

//   if (paymentIntent.amount < 0) {
//     throw new Error("Invalid amount: Amount must be positive");
//   }

//   if (
//     !["succeeded", "failed", "processing", "requires_payment_method"].includes(
//       paymentIntent.status
//     )
//   ) {
//     throw new Error(`Invalid payment status: ${paymentIntent.status}`);
//   }

//   return true;
// }

// async function savePaymentRecord(paymentRecord: PaymentRecord) {
//   const dataDir = path.join(process.cwd(), "data");
//   const filePath = path.join(dataDir, "file.json");

//   try {
//     // Create the data directory if it doesn't exist
//     try {
//       await fs.promises.mkdir(dataDir, { recursive: true });
//       console.log(`Directory created or verified at: ${dataDir}`);
//     } catch (error) {
//       console.error("Error creating data directory:", error);
//       throw new Error(
//         `Failed to create data directory at ${dataDir}. Please check permissions. Error: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`
//       );
//     }

//     // Check if file exists and read current data, or create empty array
//     let currentData: PaymentRecord[] = [];
//     try {
//       // Check if file exists
//       const fileExists = await fs.promises
//         .access(filePath, fs.constants.F_OK)
//         .then(() => true)
//         .catch(() => false);

//       if (fileExists) {
//         // Check if we have read permissions
//         await fs.promises.access(
//           filePath,
//           fs.constants.R_OK | fs.constants.W_OK
//         );
//         const fileContent = await fs.promises.readFile(filePath, "utf-8");
//         currentData = fileContent ? JSON.parse(fileContent) : [];
//         console.log(`Successfully read existing data from ${filePath}`);
//       } else {
//         console.log(`File does not exist at ${filePath}, will create new file`);
//       }
//     } catch (error) {
//       console.error("Error reading payment file:", error);
//       throw new Error(
//         `Failed to read payment file at ${filePath}. Please check permissions. Error: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`
//       );
//     }

//     // Append new record
//     currentData.push(paymentRecord);
//     console.log(`Added new payment record with ID: ${paymentRecord.id}`);

//     // Write updated data back to file
//     try {
//       await fs.promises.writeFile(
//         filePath,
//         JSON.stringify(currentData, null, 2),
//         "utf-8"
//       );
//       console.log(`Successfully wrote data to ${filePath}`);
//     } catch (error) {
//       console.error("Error writing to payment file:", error);
//       throw new Error(
//         `Failed to write to payment file at ${filePath}. Please check permissions. Error: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`
//       );
//     }

//     return true;
//   } catch (error) {
//     console.error("Payment record save error:", error);
//     throw error;
//   }
// }

// async function savePaymentData(data: PaymentData) {
//   const dataDir = path.join(process.cwd(), "data");
//   const filePath = path.join(dataDir, "file.json");

//   try {
//     await fs.promises.mkdir(dataDir, { recursive: true });

//     let currentData: PaymentData[] = [];
//     const fileExists = await fs.promises
//       .access(filePath, fs.constants.F_OK)
//       .then(() => true)
//       .catch(() => false);

//     if (fileExists) {
//       const fileContent = await fs.promises.readFile(filePath, "utf-8");
//       currentData = fileContent ? JSON.parse(fileContent) : [];
//     }

//     currentData.push(data);
//     await fs.promises.writeFile(
//       filePath,
//       JSON.stringify(currentData, null, 2),
//       "utf-8"
//     );
//     return true;
//   } catch (error) {
//     console.error("Error saving payment data:", error);
//     throw error;
//   }
// }

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = (await headers()).get("stripe-signature");

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "Missing stripe signature or webhook secret" },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;

        // Update payment status to completed
        await axios.post(
          `${request.headers.get("origin")}/api/payment/update-status`,
          {
            orderId: session.metadata.orderId,
            status: "completed",
            sessionId: session.id,
          }
        );

        return NextResponse.json({ received: true });
      }

      case "payment_intent.payment_failed": {
        const session = event.data.object as any;

        // Update payment status to failed
        await axios.post(
          `${request.headers.get("origin")}/api/payment/update-status`,
          {
            orderId: session.metadata.orderId,
            status: "failed",
            sessionId: session.id,
          }
        );

        return NextResponse.json({ received: true });
      }

      default:
        return NextResponse.json({ received: true });
    }
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
