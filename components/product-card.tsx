"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { useToast } from "@/components/ui/use-toast";
import { useCartStore } from "@/lib/store";
import { toast } from "react-toastify";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  //   const { toast } = useToast();
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product);
    toast.success("Product added to cart");
  };

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="pt-4 flex-grow">
        <Link href={`/products/${product.id}`} className="group block">
          <div className="relative aspect-square overflow-hidden rounded-md mb-3 bg-gray-100 flex items-center justify-center p-4">
            <Image
              src={product.image}
              alt={product.title}
              width={200}
              height={200}
              className="object-contain transition-transform group-hover:scale-105 mx-auto"
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
          </div>
          <h3 className="font-medium text-lg line-clamp-1 mb-2">
            {product.title}
          </h3>
          <div className="flex items-center justify-between">
            <p className="font-bold">{product.price.toLocaleString()} $</p>
            <div className="flex items-center">
              <span className="text-yellow-500 ml-1">&#9733;</span>
              <span className="text-sm text-gray-600">
                {product.rating.rate}
              </span>
            </div>
          </div>
        </Link>
      </CardContent>
      <CardFooter className="pt-0">
        <Button onClick={handleAddToCart} className="w-full">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
