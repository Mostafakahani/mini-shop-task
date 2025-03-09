"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const session_id = searchParams.get("session_id");
    setSessionId(session_id);

    if (!session_id) {
      router.push("/products");
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Thank you for your purchase. Your order has been processed
            successfully.
          </p>
          {sessionId && (
            <p className="text-center text-sm text-muted-foreground">
              Order ID: {sessionId.slice(-8)}
            </p>
          )}
          <div className="flex justify-center pt-4">
            <Button onClick={() => router.push("/products")}>
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gray-200 animate-pulse mb-4" />
              <div className="h-8 w-48 mx-auto bg-gray-200 animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-4 w-3/4 mx-auto bg-gray-200 animate-pulse" />
              <div className="h-4 w-1/2 mx-auto bg-gray-200 animate-pulse" />
              <div className="flex justify-center pt-4">
                <div className="h-10 w-32 bg-gray-200 animate-pulse rounded" />
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
