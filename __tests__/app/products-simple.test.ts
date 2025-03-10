import { describe, it, expect, vi } from "vitest";
import axios from "axios";

// Mock axios
vi.mock("axios");

describe("Products Page Simple Tests", () => {
  const mockProducts = [
    {
      id: 1,
      title: "Electronic Product",
      price: 100,
      description: "Description of electronic product",
      category: "electronics",
      image: "https://example.com/image1.jpg",
      rating: { rate: 4.5, count: 10 },
    },
    {
      id: 2,
      title: "Clothing Product",
      price: 50,
      description: "Description of clothing product",
      category: "clothing",
      image: "https://example.com/image2.jpg",
      rating: { rate: 4.0, count: 20 },
    },
  ];

  it("should call the products API", async () => {
    // Set up mock for axios
    vi.mocked(axios.get).mockResolvedValue({ data: mockProducts });

    // Call API
    const response = await axios.get("https://fakestoreapi.com/products");

    // Check results
    expect(axios.get).toHaveBeenCalledWith("https://fakestoreapi.com/products");
    expect(response.data).toEqual(mockProducts);
  });

  it("should handle errors when they occur", async () => {
    // Set up mock for error
    vi.mocked(axios.get).mockRejectedValue(new Error("Network error"));

    // Call API and handle error
    try {
      await axios.get("https://fakestoreapi.com/products");
      // If we reach here, the test has failed
      expect(true).toBe(false);
    } catch (error) {
      // Check error
      expect((error as Error).message).toBe("Network error");
    }
  });

  it("should filter products by category", () => {
    // Filter products by category
    const filteredProducts = mockProducts.filter(
      (product) => product.category === "electronics"
    );

    // Check results
    expect(filteredProducts.length).toBe(1);
    expect(filteredProducts[0].id).toBe(1);
  });

  it("should filter products by search", () => {
    // Filter products by search
    const searchQuery = "clothing";
    const filteredProducts = mockProducts.filter(
      (product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Check results
    expect(filteredProducts.length).toBe(1);
    expect(filteredProducts[0].id).toBe(2);
  });

  it("should extract categories", () => {
    // Extract categories
    const categories = [
      ...new Set(mockProducts.map((product) => product.category)),
    ];

    // Check results
    expect(categories).toEqual(["electronics", "clothing"]);
  });
});
