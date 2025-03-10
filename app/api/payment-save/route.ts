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
}

async function saveOrUpdatePayment(data: PaymentData) {
  const dataDir = path.join(process.cwd(), "data");
  const filePath = path.join(dataDir, "file.json");

  try {
    await fs.promises.mkdir(dataDir, { recursive: true });

    let currentData: PaymentData[] = [];
    const fileExists = await fs.promises
      .access(filePath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (fileExists) {
      const fileContent = await fs.promises.readFile(filePath, "utf-8");
      currentData = fileContent ? JSON.parse(fileContent) : [];

      // Update existing payment if found
      const existingPaymentIndex = currentData.findIndex(
        (payment) => payment.orderId === data.orderId
      );

      if (existingPaymentIndex !== -1) {
        currentData[existingPaymentIndex] = data;
      } else {
        currentData.push(data);
      }
    } else {
      currentData.push(data);
    }

    await fs.promises.writeFile(
      filePath,
      JSON.stringify(currentData, null, 2),
      "utf-8"
    );

    return true;
  } catch (error) {
    console.error("Error saving/updating payment data:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (
      !data.orderId ||
      !data.customerInfo ||
      !data.products ||
      !data.totalAmount ||
      !data.paymentStatus ||
      !data.paymentMethod
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment data",
        },
        { status: 400 }
      );
    }

    await saveOrUpdatePayment(data);

    return NextResponse.json({
      success: true,
      message: "Payment data saved successfully",
    });
  } catch (error) {
    console.error("Error processing payment data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save payment data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
