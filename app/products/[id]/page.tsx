import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Star } from "lucide-react";
import { Product } from "@/types";
import AddToCartButton from "./AddToCartButton";
import { notFound } from "next/navigation";
import ProductSkeleton from "./loading";

// Define the page props type
type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function getProduct(id: string): Promise<Product> {
  try {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

async function ProductDisplay({ id }: { id: string }) {
  try {
    const product = await getProduct(id);

    if (!product) {
      notFound();
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="overflow-hidden p-6 flex items-center justify-center bg-white">
          <div className="relative aspect-square w-full max-w-md">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </Card>

        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
            <div className="flex items-center mb-4">
              <div className="flex items-center text-yellow-500 mr-2">
                <Star className="h-5 w-5 fill-current" />
                <span className="ml-1 font-medium">{product.rating.rate}</span>
              </div>
              <span className="text-gray-500">
                ({product.rating.count} reviews)
              </span>
            </div>
            <p className="text-gray-500 mb-4">Category: {product.category}</p>
            <p className="text-3xl font-bold text-primary mb-6">
              {product.price.toLocaleString()} $
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Product Description</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    );
  } catch {
    return (
      <div className="text-center py-12 text-red-500">
        Error loading product data
      </div>
    );
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/products">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
      </Button>

      <Suspense fallback={<ProductSkeleton />}>
        <ProductDisplay id={id} />
      </Suspense>
    </div>
  );
}
