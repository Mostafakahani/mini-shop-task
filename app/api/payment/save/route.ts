import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// نوع داده برای پرداخت
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
  timestamp?: string;
}

async function savePaymentData(data: PaymentData) {
  const dataDir = path.join(process.cwd(), "data");
  const filePath = path.join(dataDir, "file.json");

  try {
    // ایجاد دایرکتوری داده در صورت عدم وجود
    await fs.promises.mkdir(dataDir, { recursive: true });
    console.log(`Directory verified/created at: ${dataDir}`);

    // خواندن داده‌های موجود یا ایجاد آرایه جدید
    let currentData: PaymentData[] = [];
    try {
      const fileExists = await fs.promises
        .access(filePath, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false);

      if (fileExists) {
        const fileContent = await fs.promises.readFile(filePath, "utf-8");
        currentData = fileContent ? JSON.parse(fileContent) : [];
      }
    } catch (error) {
      console.error("Error reading file:", error);
    }

    // افزودن زمان در صورت عدم ارائه
    const paymentWithTimestamp = {
      ...data,
      timestamp: data.timestamp || new Date().toISOString(),
    };

    // افزودن داده‌های جدید پرداخت
    currentData.push(paymentWithTimestamp);

    // نوشتن داده‌های به‌روز شده به فایل
    await fs.promises.writeFile(
      filePath,
      JSON.stringify(currentData, null, 2),
      "utf-8"
    );

    return true;
  } catch (error) {
    console.error("Error saving payment data:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // اعتبارسنجی داده‌ها
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

    // ذخیره داده‌ها
    await savePaymentData(data);

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
