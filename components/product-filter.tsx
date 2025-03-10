import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function ProductFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: ProductFilterProps) {
  return (
    <Card data-testid="product-filter">
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Button
            variant={selectedCategory === "" ? "default" : "outline"}
            className="w-full justify-start cursor-pointer"
            onClick={() => onCategoryChange("")}
            aria-label="All Products"
          >
            All Products
          </Button>

          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="w-full justify-start cursor-pointer"
              onClick={() => onCategoryChange(category)}
              aria-label={category}
              data-testid={`category-${category}`}
            >
              {category}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
