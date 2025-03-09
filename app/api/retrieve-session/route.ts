// api/retrieve-session/route.ts
import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";

export async function GET(request: Request) {
  // Extract the session_id from the URL
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "Missing session_id parameter" },
      { status: 400 }
    );
  }

  try {
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer"],
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error retrieving Stripe session:", error);

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
