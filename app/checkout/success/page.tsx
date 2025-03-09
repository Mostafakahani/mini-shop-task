"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/lib/store";

export default function SuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);

  // پاک کردن سبد خرید بعد از خرید موفق
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-lg mx-auto text-center pt-12">
      <Card>
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col items-center space-y-6">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold">پرداخت موفقیت‌آمیز بود</h1>

            <p className="text-gray-500">
              سفارش شما با موفقیت ثبت شد و در اسرع وقت برای شما ارسال خواهد شد.
            </p>

            <Button asChild>
              <Link href="/products">بازگشت به فروشگاه</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
