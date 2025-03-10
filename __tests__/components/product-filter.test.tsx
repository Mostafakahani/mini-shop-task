import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductFilter from "@/components/product-filter";

describe("ProductFilter", () => {
  const mockCategories = ["electronics", "clothing", "jewelry"];
  const mockOnCategoryChange = vi.fn();

  beforeEach(() => {
    mockOnCategoryChange.mockClear();
  });

  it("should render all categories", () => {
    render(
      <ProductFilter
        categories={mockCategories}
        selectedCategory=""
        onCategoryChange={mockOnCategoryChange}
      />
    );

    expect(screen.getByText("Categories")).toBeTruthy();
    expect(screen.getByText("All Products")).toBeTruthy();
    mockCategories.forEach((category) => {
      expect(screen.getByText(category)).toBeTruthy();
    });
  });

  it("should highlight the selected category", () => {
    const selectedCategory = "electronics";

    render(
      <ProductFilter
        categories={mockCategories}
        selectedCategory={selectedCategory}
        onCategoryChange={mockOnCategoryChange}
      />
    );
    const selectedButton = screen.getByText(selectedCategory);
    expect(selectedButton.getAttribute("data-slot")).not.toBeNull();
    expect(selectedButton.getAttribute("data-slot")).toBe("button");
    const otherButtons = mockCategories
      .filter((cat) => cat !== selectedCategory)
      .map((cat) => screen.getByText(cat));

    otherButtons.forEach((button) => {
      expect(button.className).toContain("outline");
    });
  });

  it("should call onCategoryChange when a category is clicked", () => {
    render(
      <ProductFilter
        categories={mockCategories}
        selectedCategory=""
        onCategoryChange={mockOnCategoryChange}
      />
    );

    const categoryButton = screen.getByText("electronics");
    fireEvent.click(categoryButton);

    expect(mockOnCategoryChange).toHaveBeenCalledTimes(1);
    expect(mockOnCategoryChange).toHaveBeenCalledWith("electronics");
  });

  it("should call onCategoryChange with empty string when 'All Products' is clicked", () => {
    render(
      <ProductFilter
        categories={mockCategories}
        selectedCategory="electronics"
        onCategoryChange={mockOnCategoryChange}
      />
    );

    const allProductsButton = screen.getByText("All Products");
    fireEvent.click(allProductsButton);

    expect(mockOnCategoryChange).toHaveBeenCalledTimes(1);
    expect(mockOnCategoryChange).toHaveBeenCalledWith("");
  });

  it("should render correctly with empty categories array", () => {
    render(
      <ProductFilter
        categories={[]}
        selectedCategory=""
        onCategoryChange={mockOnCategoryChange}
      />
    );

    expect(screen.getByText("Categories")).toBeTruthy();
    expect(screen.getByText("All Products")).toBeTruthy();
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("should have correct accessibility attributes", () => {
    render(
      <ProductFilter
        categories={mockCategories}
        selectedCategory=""
        onCategoryChange={mockOnCategoryChange}
      />
    );

    const allProductsButton = screen.getByRole("button", {
      name: "All Products",
    });
    expect(allProductsButton).toBeTruthy();

    mockCategories.forEach((category) => {
      const categoryButton = screen.getByRole("button", { name: category });
      expect(categoryButton).toBeTruthy();
    });
  });

  it("should have correct data-testid attributes", () => {
    render(
      <ProductFilter
        categories={mockCategories}
        selectedCategory=""
        onCategoryChange={mockOnCategoryChange}
      />
    );

    expect(screen.getByTestId("product-filter")).toBeTruthy();

    mockCategories.forEach((category) => {
      expect(screen.getByTestId(`category-${category}`)).toBeTruthy();
    });
  });
});
