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
        create: vi.fn().mockResolvedValue({ id: "test_session_id" }),
      },
    },
  },
}));

describe("Checkout API", () => {
  it("should create a payment session", async () => {
    const { POST } = await import("@/app/api/checkout/route");

    const request = new Request("http://localhost:3000/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        origin: "http://localhost:3000",
      },
      body: JSON.stringify({
        items: [
          {
            id: 1,
            title: "Test Product",
            price: 100,
            description: "Product Description",
            category: "Test Category",
            image: "https://example.com/image.jpg",
            rating: {
              rate: 4.5,
              count: 10,
            },
            quantity: 2,
          },
        ],
        customerInfo: {
          name: "Test User",
          email: "test@example.com",
          address: "Test Address",
          city: "City",
          postalCode: "12345",
          phone: "09123456789",
        },
      }),
    });

    const response = await POST(request);

    expect(response).toBeDefined();
  });
});
