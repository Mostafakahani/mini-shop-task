"use client";

import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem as CartItemType } from "@/types";
import { useCartStore } from "@/lib/store";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeItem(item.id);
    }
  };

  return (
    <div className="flex gap-4">
      <div className="bg-gray-100 rounded-md p-2 w-20 h-20 flex-shrink-0 relative">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-contain p-1"
        />
      </div>

      <div className="flex-grow">
        <div className="flex justify-between">
          <h4 className="text-sm font-medium line-clamp-1">{item.title}</h4>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => removeItem(item.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-sm text-muted-foreground mb-2">
          {item.price.toLocaleString()} $
        </div>

        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={handleDecrement}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-10 text-center">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={handleIncrement}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
