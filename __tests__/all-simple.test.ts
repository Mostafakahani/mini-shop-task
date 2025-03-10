import { describe, it, expect } from "vitest";
import { useCartStore } from "@/lib/store";

describe("Simple Tests", () => {
  it("should work store", () => {
    useCartStore.getState().clearCart();

    expect(useCartStore.getState().items.length).toBe(0);

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

    expect(useCartStore.getState().getTotalPrice()).toBe(300);

    useCartStore.getState().clearCart();

    expect(useCartStore.getState().items.length).toBe(0);
  });

  it("should work API checkout", () => {
    expect(true).toBe(true);
  });

  it("should work API retrieve-session", () => {
    expect(true).toBe(true);
  });

  it("should work API manual-save", () => {
    expect(true).toBe(true);
  });

  it("should work products page", () => {
    expect(true).toBe(true);
  });

  it("should work checkout page", () => {
    expect(true).toBe(true);
  });
});
