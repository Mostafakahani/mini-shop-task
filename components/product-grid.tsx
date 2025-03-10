import { Product } from "@/types";
import ProductCard from "./product-card";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div
      data-testid="product-grid"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
    >
      <div className="col-span-full mb-4">
        {products.length} {products.length === 1 ? "product" : "products"}
      </div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
