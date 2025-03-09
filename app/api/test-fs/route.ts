// api/test-fs/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface TestRecord {
  id: string;
  message: string;
  timestamp: string;
}

export async function GET() {
  const dataDir = path.join(process.cwd(), "data");
  const filePath = path.join(dataDir, "test-file.json");

  try {
    // Create the data directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log("Created data directory:", dataDir);
    }

    // Check if file exists and read current data, or create empty array
    let currentData: TestRecord[] = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      currentData = fileContent ? JSON.parse(fileContent) : [];
      console.log("Read existing data:", currentData.length, "records");
    }

    // Create a test record
    const testRecord: TestRecord = {
      id: Math.random().toString(36).substring(2, 15),
      message: "Test file system operation",
      timestamp: new Date().toISOString(),
    };

    // Append new record
    currentData.push(testRecord);

    // Write updated data back to file
    fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2), "utf-8");
    console.log("Wrote test record to file:", testRecord.id);

    // Check if the payment file exists
    const paymentFilePath = path.join(dataDir, "file.json");
    const paymentFileExists = fs.existsSync(paymentFilePath);

    return NextResponse.json({
      success: true,
      record: testRecord,
      totalRecords: currentData.length,
      dataDir,
      filePath,
      paymentFileExists,
      filePermissions: fs.statSync(dataDir).mode.toString(8),
    });
  } catch (error) {
    console.error("Test file system error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        dataDir,
        filePath,
        errorStack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
