"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartStore } from "@/lib/store";
import CartItem from "@/components/cart-item";
// import { useToast } from '@/components/ui/use-toast';

// نکته: شناسه Stripe را از متغیرهای محیطی بارگیری می‌کنیم
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  //   const { toast } = useToast();

  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalPrice = useCartStore((state) => state.getTotalPrice());
  const clearCart = useCartStore((state) => state.clearCart);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  // اگر سبد خرید خالی باشد، کاربر به صفحه محصولات هدایت می‌شود
  if (items.length === 0) {
    router.push("/products");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      // ارسال درخواست به API پرداخت
      const response = await axios.post("/api/checkout", {
        items,
        customerInfo: formData,
      });

      const stripe = await stripePromise;

      // هدایت کاربر به صفحه پرداخت Stripe
      if (stripe) {
        const result = await stripe.redirectToCheckout({
          sessionId: response.data.id,
        });

        // if (error) {
        //   toast({
        //     title: "خطا در پرداخت",
        //     description: error.message,
        //     variant: "destructive"
        //   });
        // }
        if (result.error) {
          console.error(result.error);
          setLoading(false);
        } else {
          clearCart(); // پاک کردن سبد خرید در صورت موفقیت
        }
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      //   toast({
      //     title: "خطا در پرداخت",
      //     description: "متأسفانه در پردازش پرداخت خطایی رخ داد. لطفاً دوباره تلاش کنید.",
      //     variant: "destructive"
      //   });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">تکمیل سفارش</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات ارسال</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      نام و نام خانوادگی
                    </label>
                    <Input
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      ایمیل
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">
                    آدرس
                  </label>
                  <Input
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="city" className="text-sm font-medium">
                      شهر
                    </label>
                    <Input
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="postalCode" className="text-sm font-medium">
                      کد پستی
                    </label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    شماره تماس
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full mt-4"
                  disabled={loading}
                >
                  {loading ? "در حال پردازش..." : "پرداخت"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>خلاصه سفارش</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}

                <div className="border-t pt-4 mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>تعداد کالاها:</span>
                    <span>{totalItems} عدد</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>هزینه ارسال:</span>
                    <span>رایگان</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2">
                    <span>جمع کل:</span>
                    <span>{totalPrice.toLocaleString()} تومان</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
