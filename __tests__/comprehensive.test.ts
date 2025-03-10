import { describe, it, expect, beforeEach, vi } from "vitest";
import { useCartStore } from "@/lib/store";

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
        retrieve: vi.fn().mockResolvedValue({ id: "test_session_id" }),
      },
    },
  },
}));

describe("Comprehensive Tests", () => {
  describe("Cart Store", () => {
    beforeEach(() => {
      useCartStore.getState().clearCart();
    });

    it("should calculate the total number of items", () => {
      useCartStore.setState({
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
            quantity: 3,
          },
        ],
      });

      expect(useCartStore.getState().getTotalItems()).toBe(3);
    });

    it("should calculate the total price", () => {
      useCartStore.setState({
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
      });

      expect(useCartStore.getState().getTotalPrice()).toBe(200);
    });

    it("should clear the cart", () => {
      useCartStore.setState({
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
            quantity: 1,
          },
        ],
      });

      expect(useCartStore.getState().items.length).toBe(1);

      useCartStore.getState().clearCart();

      expect(useCartStore.getState().items.length).toBe(0);
    });
  });

  describe("API Tests", () => {
    it("should work API checkout", async () => {
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

    // it("should work API retrieve-session", async () => {
    //   const { GET } = await import("@/app/api/retrieve-session/route");

    //   const request = new Request(
    //     "http://localhost:3000/api/retrieve-session?session_id=test_session_id"
    //   );

    //   const response = await GET(request);

    //   expect(response).toBeDefined();
    // });
  });
});
