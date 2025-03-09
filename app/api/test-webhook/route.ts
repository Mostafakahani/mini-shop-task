// api/test-webhook/route.ts
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
      fs.mkdirSync(dataDir, { recursive: true });
      console.log("Created data directory:", dataDir);
    }

    // Check if file exists and read current data, or create empty array
    let currentData: PaymentRecord[] = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      currentData = fileContent ? JSON.parse(fileContent) : [];
      console.log("Read existing payment data:", currentData.length, "records");
    }

    // Append new record
    currentData.push(paymentRecord);

    // Write updated data back to file
    fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2), "utf-8");
    console.log("Wrote payment record to file:", paymentRecord.id);

    return true;
  } catch (error) {
    console.error("Payment record save error:", error);
    throw error;
  }
}

export async function GET() {
  try {
    // Create sample payment record
    const paymentRecord: PaymentRecord = {
      id: `test_${Math.random().toString(36).substring(2, 10)}`,
      customerId: "test_customer",
      amount: 99.99,
      currency: "usd",
      status: "succeeded",
      customerInfo: {
        name: "Test Customer",
        email: "test@example.com",
        address: "123 Test St",
        city: "Test City",
        postalCode: "12345",
        phone: "123-456-7890",
      },
      timestamp: new Date().toISOString(),
    };

    // Save to file
    await savePaymentRecord(paymentRecord);

    return NextResponse.json({
      success: true,
      record: paymentRecord,
      message: "Test payment record saved successfully",
    });
  } catch (error) {
    console.error("Test webhook error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        errorStack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
