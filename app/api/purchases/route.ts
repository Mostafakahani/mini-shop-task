import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    // Get the path to the data file
    const filePath = path.join(process.cwd(), "data", "file.json");

    // Read the JSON file
    const fileData = await fs.readFile(filePath, "utf-8");
    const purchases = JSON.parse(fileData);

    return NextResponse.json(purchases);
  } catch (error) {
    console.error("Error reading purchases:", error);
    return NextResponse.json(
      { error: "Failed to load purchases" },
      { status: 500 }
    );
  }
}
