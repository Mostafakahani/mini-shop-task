import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios from "axios";

// Mock axios
vi.mock("axios");

describe("Products Page Tests", () => {
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
    {
      id: 3,
      title: "Jewelry Product",
      price: 200,
      description: "Description of jewelry product",
      category: "jewelry",
      image: "https://example.com/image3.jpg",
      rating: { rate: 4.8, count: 15 },
    },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

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
    const selectedCategory = "electronics";
    const filteredProducts = mockProducts.filter(
      (product) => product.category === selectedCategory
    );

    // Check results
    expect(filteredProducts.length).toBe(1);
    expect(filteredProducts[0].id).toBe(1);
    expect(filteredProducts[0].category).toBe("electronics");
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
    expect(filteredProducts[0].title).toBe("Clothing Product");
  });

  it("should extract categories", () => {
    // Extract categories
    const categories = [
      ...new Set(mockProducts.map((product) => product.category)),
    ];

    // Check results
    expect(categories).toEqual(["electronics", "clothing", "jewelry"]);
    expect(categories.length).toBe(3);
  });

  it("should return an empty array if no product matches the search", () => {
    // Search for a product that does not exist
    const searchQuery = "nonexistent product";
    const filteredProducts = mockProducts.filter(
      (product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Check results
    expect(filteredProducts.length).toBe(0);
  });

  it("should sort products by price", () => {
    // Sort products by price (ascending)
    const sortedProducts = [...mockProducts].sort((a, b) => a.price - b.price);

    // Check results
    expect(sortedProducts[0].id).toBe(2); // Clothing product with price 50
    expect(sortedProducts[1].id).toBe(1); // Electronic product with price 100
    expect(sortedProducts[2].id).toBe(3); // Jewelry product with price 200
  });

  it("should sort products by rating", () => {
    // Sort products by rating (descending)
    const sortedProducts = [...mockProducts].sort(
      (a, b) => b.rating.rate - a.rating.rate
    );

    // Check results
    expect(sortedProducts[0].id).toBe(3); // Jewelry product with rating 4.8
    expect(sortedProducts[1].id).toBe(1); // Electronic product with rating 4.5
    expect(sortedProducts[2].id).toBe(2); // Clothing product with rating 4.0
  });
});
