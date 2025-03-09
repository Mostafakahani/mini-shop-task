// api/manual-save/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

async function savePaymentRecord(paymentRecord: PaymentRecord) {
  const dataDir = path.join(process.cwd(), "data");
  const filePath = path.join(dataDir, "file.json");

  try {
    // Create the data directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
        console.log("Created data directory:", dataDir);
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
        console.log(
          "Read existing payment data:",
          currentData.length,
          "records"
        );
      } catch (error) {
        console.error("Error reading payment file:", error);
        throw new Error(
          "Failed to read payment file. Please check permissions."
        );
      }
    }

    // Check if this session has already been recorded
    const existingRecord = currentData.find(
      (record) => record.id === paymentRecord.id
    );
    if (existingRecord) {
      console.log("Payment record already exists:", paymentRecord.id);
      return true;
    }

    // Append new record
    currentData.push(paymentRecord);

    // Write updated data back to file
    try {
      fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2), "utf-8");
      console.log("Wrote payment record to file:", paymentRecord.id);
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
    const body = await request.json();
    const { sessionId, sessionData } = body;

    if (!sessionId || !sessionData) {
      return NextResponse.json(
        { error: "Missing required data" },
        { status: 400 }
      );
    }

    // Extract customer info from metadata or customer object
    const customerInfo = {
      name: sessionData.metadata?.customerName || sessionData.customer?.name,
      email: sessionData.metadata?.customerEmail || sessionData.customer?.email,
      address: sessionData.metadata?.customerAddress,
      city: sessionData.metadata?.customerCity,
      postalCode: sessionData.metadata?.customerPostalCode,
      phone: sessionData.metadata?.customerPhone,
    };

    // Create payment record
    const paymentRecord: PaymentRecord = {
      id: sessionId,
      customerId: sessionData.customer || "guest",
      amount: sessionData.amount_total ? sessionData.amount_total / 100 : 0,
      currency: sessionData.currency || "usd",
      status: sessionData.payment_status || "succeeded",
      customerInfo,
      items: sessionData.line_items?.data || [],
      timestamp: new Date().toISOString(),
    };

    // Save to file
    await savePaymentRecord(paymentRecord);

    return NextResponse.json({
      success: true,
      message: "Payment record saved successfully",
    });
  } catch (error) {
    console.error("Manual save error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
