import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import ProductsPage from "@/app/products/page";

vi.mock("axios");

describe("Product Filtering Integration", () => {
  const mockProducts = [
    {
      id: 1,
      title: "iPhone",
      price: 999,
      description: "Apple smartphone",
      category: "electronics",
      image: "https://example.com/iphone.jpg",
      rating: { rate: 4.5, count: 120 },
    },
    {
      id: 2,
      title: "Samsung TV",
      price: 1299,
      description: "Smart TV",
      category: "electronics",
      image: "https://example.com/tv.jpg",
      rating: { rate: 4.3, count: 85 },
    },
    {
      id: 3,
      title: "T-shirt",
      price: 19.99,
      description: "Cotton t-shirt",
      category: "clothing",
      image: "https://example.com/tshirt.jpg",
      rating: { rate: 4.1, count: 70 },
    },
    {
      id: 4,
      title: "Jeans",
      price: 49.99,
      description: "Denim jeans",
      category: "clothing",
      image: "https://example.com/jeans.jpg",
      rating: { rate: 4.2, count: 65 },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(axios.get).mockResolvedValue({ data: mockProducts });
  });
  it("should load and display all products initially", async () => {
    render(<ProductsPage />);
    expect(screen.getByText("Loading products...")).toBeTruthy();

    await waitFor(() => {
      expect(screen.queryByText("Loading products...")).toBeNull();
    });

    const productGrid = screen.getByTestId("product-grid");
    expect(productGrid.textContent).toContain("4 products");
  });

  it("should filter products by category", async () => {
    render(<ProductsPage />);

    await waitFor(() => {
      expect(screen.queryByText("Loading products...")).toBeNull();
    });

    const electronicsButton = await screen.findByTestId("category-electronics");
    fireEvent.click(electronicsButton);

    const productGrid = screen.getByTestId("product-grid");
    expect(productGrid.textContent).toContain("2 products");
  });

  it("should filter products by search query", async () => {
    render(<ProductsPage />);

    await waitFor(() => {
      expect(screen.queryByText("Loading products...")).toBeNull();
    });

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "iPhone" } });

    const searchForm = searchInput.closest("form");
    fireEvent.submit(searchForm!);

    const productGrid = screen.getByTestId("product-grid");
    expect(productGrid.textContent).toContain("1 product");
  });

  it("should filter products by both category and search", async () => {
    render(<ProductsPage />);

    await waitFor(() => {
      expect(screen.queryByText("Loading products...")).toBeNull();
    });

    const clothingButton = await screen.findByTestId("category-clothing");
    fireEvent.click(clothingButton);

    let productGrid = screen.getByTestId("product-grid");
    expect(productGrid.textContent).toContain("2 products");

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "T-shirt" } });

    const searchForm = searchInput.closest("form");
    fireEvent.submit(searchForm!);

    productGrid = screen.getByTestId("product-grid");
    expect(productGrid.textContent).toContain("1 product");
  });

  it("should reset category filter when clicking 'All Products'", async () => {
    render(<ProductsPage />);

    await waitFor(() => {
      expect(screen.queryByText("Loading products...")).toBeNull();
    });

    const electronicsButton = await screen.findByTestId("category-electronics");
    fireEvent.click(electronicsButton);

    let productGrid = screen.getByTestId("product-grid");
    expect(productGrid.textContent).toContain("2 products");

    const allProductsButton = screen.getByRole("button", {
      name: "All Products",
    });
    fireEvent.click(allProductsButton);

    productGrid = screen.getByTestId("product-grid");
    expect(productGrid.textContent).toContain("4 products");
  });

  it("should show 'No products found' message when no products match filters", async () => {
    render(<ProductsPage />);

    await waitFor(() => {
      expect(screen.queryByText("Loading products...")).toBeNull();
    });

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "NonExistentProduct" } });

    const searchForm = searchInput.closest("form");
    fireEvent.submit(searchForm!);

    expect(screen.getByText("No products found!")).toBeTruthy();
  });
});
