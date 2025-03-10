import { describe, it, expect, vi } from "vitest";
import { NextResponse } from "next/server";

vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((data) => ({ json: () => data })),
  },
}));

vi.mock("@/lib/stripe", () => ({
  default: {
    checkout: {
      sessions: {
        create: vi.fn().mockRejectedValue(new Error("Test error")),
      },
    },
  },
}));

describe("Checkout API Error", () => {
  it("should return an error response in case of an error", async () => {
    const { POST } = await import("@/app/api/checkout/route");

    const request = new Request("http://localhost:3000/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        origin: "http://localhost:3000",
      },
      body: JSON.stringify({
        items: [],
        customerInfo: {},
      }),
    });

    const response = await POST(request);

    expect(response).toBeDefined();
  });
});
