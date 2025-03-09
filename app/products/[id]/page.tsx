"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// import { useToast } from '@/components/ui/use-toast';
import { useCartStore } from "@/lib/store";
import { ArrowLeft, ShoppingCart, Star } from "lucide-react";
// interface ProductPage {
//   id: string;
// }
interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params: id }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //   const { toast } = useToast();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Product>(
          `https://fakestoreapi.com/products/${id}`
        );
        setProduct(response.data);
        setLoading(false);
      } catch {
        setError("Error fetching product data");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      //   toast({
      //     title: "Product added to cart",
      //     description: product.title,
      //   });
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading product data...</div>;
  }

  if (error || !product) {
    return (
      <div className="text-center py-12 text-red-500">
        {error || "Product not found"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/products">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="overflow-hidden p-6 flex items-center justify-center bg-white">
          <div className="relative aspect-square w-full max-w-md">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain"
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

          <Button size="lg" onClick={handleAddToCart} className="w-full mt-6">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
