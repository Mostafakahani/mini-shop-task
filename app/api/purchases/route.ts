import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "data", "file.json");

  try {
    const fileExists = await fs.promises
      .access(filePath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (!fileExists) {
      console.log(`File does not exist at ${filePath}`);
      return NextResponse.json([], { status: 200 });
    }

    try {
      const fileData = await fs.promises.readFile(filePath, "utf-8");
      const purchases = JSON.parse(fileData);
      console.log(
        `Successfully read ${purchases.length} purchases from ${filePath}`
      );
      return NextResponse.json(purchases || [], {
        status: purchases ? 200 : 404,
      });
    } catch (readError) {
      console.error("Error reading purchases file:", readError);
      return NextResponse.json(
        {
          error: "Failed to read purchases file",
          details:
            readError instanceof Error ? readError.message : "Unknown error",
          path: filePath,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error accessing purchases file:", error);
    return NextResponse.json(
      {
        error: "Failed to access purchases file",
        details: error instanceof Error ? error.message : "Unknown error",
        path: filePath,
      },
      { status: 500 }
    );
  }
}
