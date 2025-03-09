import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h1 className="text-4xl font-bold mb-6">
        به فروشگاه اینترنتی ما خوش آمدید
      </h1>
      <p className="text-xl mb-8 max-w-2xl">
        مجموعه‌ای از بهترین محصولات را با قیمت‌های مناسب در فروشگاه ما مشاهده
        کنید.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/products">مشاهده محصولات</Link>
        </Button>
      </div>
    </div>
  );
}
