import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "@/lib/store";

const mockProduct = {
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
};

describe("Cart Store", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it("should calculate the total number of items", () => {
    useCartStore.setState({
      items: [
        {
          ...mockProduct,
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
          ...mockProduct,
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
          ...mockProduct,
          quantity: 1,
        },
      ],
    });

    expect(useCartStore.getState().items.length).toBe(1);

    useCartStore.getState().clearCart();

    expect(useCartStore.getState().items.length).toBe(0);
  });
});
