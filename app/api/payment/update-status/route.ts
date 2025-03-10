import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface PaymentData {
  orderId: string;
  customerInfo: {
    name: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  products: {
    id: number;
    title: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  paymentStatus: "pending" | "completed" | "failed";
  paymentMethod: string;
  timestamp: string;
  sessionId?: string;
}

async function updatePaymentStatus(
  orderId: string,
  status: "pending" | "completed" | "failed",
  sessionId?: string
) {
  const filePath = path.join(process.cwd(), "data", "file.json");

  try {
    const fileExists = await fs.promises
      .access(filePath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (!fileExists) {
      throw new Error("Payment record not found");
    }

    const fileContent = await fs.promises.readFile(filePath, "utf-8");
    const payments: PaymentData[] = fileContent ? JSON.parse(fileContent) : [];

    const paymentIndex = payments.findIndex((p) => p.orderId === orderId);
    if (paymentIndex === -1) {
      throw new Error(`Payment with orderId ${orderId} not found`);
    }

    payments[paymentIndex] = {
      ...payments[paymentIndex],
      paymentStatus: status,
      sessionId,
      timestamp: new Date().toISOString(),
    };

    await fs.promises.writeFile(
      filePath,
      JSON.stringify(payments, null, 2),
      "utf-8"
    );
    return true;
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { orderId, status, sessionId } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    if (!["pending", "completed", "failed"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid status",
        },
        { status: 400 }
      );
    }

    await updatePaymentStatus(orderId, status, sessionId);

    return NextResponse.json({
      success: true,
      message: "Payment status updated successfully",
    });
  } catch (error) {
    console.error("Error processing status update:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update payment status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
