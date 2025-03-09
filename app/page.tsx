import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Mini Shop Task</h1>
      <p className="text-xl mb-8 max-w-2xl">
        Explore a collection of the best products at reasonable prices in our
        store.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/products">View Products</Link>
        </Button>
      </div>
    </div>
  );
}
