import { Card } from "@/components/ui/card";

export default function ProductSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="overflow-hidden p-6 flex items-center justify-center bg-white">
          <div className="relative aspect-square w-full max-w-md bg-gray-200 animate-pulse"></div>
        </Card>
        <div className="space-y-6">
          <div>
            <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-5 w-1/3 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-10 w-1/3 bg-gray-200 rounded animate-pulse mb-6"></div>
          </div>
          <div>
            <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-24 w-full bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-12 w-full bg-gray-200 rounded animate-pulse mt-6"></div>
        </div>
      </div>
    </div>
  );
}
