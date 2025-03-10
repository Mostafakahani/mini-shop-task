import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import axios from "axios";
import ProductsPage from "@/app/products/page";
import SearchInput from "@/components/search-input";
import ProductFilter from "@/components/product-filter";
vi.mock("axios");

vi.mock("@/components/product-grid", () => ({
  default: ({ products }: { products: any[] }) => (
    <div data-testid="product-grid">
      {products.length} {products.length === 1 ? "product" : "products"}
    </div>
  ),
}));

vi.mock("@/components/product-filter", () => ({
  default: ({ categories, selectedCategory, onCategoryChange }: any) => (
    <div data-testid="product-filter">
      <button
        data-testid="filter-button"
        onClick={() => onCategoryChange("electronics")}
      >
        Filter
      </button>
      {categories.map((cat: string) => (
        <button key={cat} onClick={() => onCategoryChange(cat)}>
          {cat}
        </button>
      ))}
    </div>
  ),
}));

describe("ProductsPage", () => {
  const mockProducts = [
    {
      id: 1,
      title: "Electronic Product",
      price: 100,
      description: "Product Description",
      category: "electronics",
      image: "https://example.com/image1.jpg",
      rating: { rate: 4.5, count: 10 },
    },
    {
      id: 2,
      title: "Clothing Product",
      price: 50,
      description: "Product Description",
      category: "clothing",
      image: "https://example.com/image2.jpg",
      rating: { rate: 4.0, count: 20 },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(axios.get).mockResolvedValue({ data: mockProducts });
  });

  it("should load products", async () => {
    render(<ProductsPage />);
    expect(screen.getByText("Loading products...")).toBeTruthy();
    const productGrid = await screen.findByTestId("product-grid");
    expect(productGrid.textContent).toContain("2 products");
  });

  it("should filter products by category", async () => {
    render(<ProductsPage />);
    const filterButton = await screen.findByTestId("filter-button");
    fireEvent.click(filterButton);
    const productGrid = await screen.findByTestId("product-grid");
    expect(productGrid.textContent).toContain("1 product");
  });

  it("should filter products by search", async () => {
    render(<ProductsPage />);
    await screen.findByTestId("product-grid");
    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "Electronic" } });
    const searchForm = searchInput.closest("form");
    fireEvent.submit(searchForm!);
    const productGrid = await screen.findByTestId("product-grid");
    expect(productGrid.textContent).toContain("1 product");
  });

  it("should filter products by category and search together", async () => {
    render(<ProductsPage />);
    await screen.findByTestId("product-grid");
    const categoryButton = await screen.findByRole("button", {
      name: "electronics",
    });
    fireEvent.click(categoryButton);
    let productGrid = await screen.findByTestId("product-grid");
    expect(productGrid.textContent).toContain("1 product");
    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "Electronic" } });
    const searchForm = searchInput.closest("form");
    fireEvent.submit(searchForm!);
    productGrid = await screen.findByTestId("product-grid");
    expect(productGrid.textContent).toContain("1 product");
  });

  it("should display an error message", async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error("Network error"));
    render(<ProductsPage />);
    const errorMessage = await screen.findByText("Error fetching products");
    expect(errorMessage).toBeTruthy();
  });
});
