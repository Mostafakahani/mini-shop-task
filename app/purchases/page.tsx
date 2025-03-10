"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

interface CustomerInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

interface Purchase {
  orderId: string;
  customerInfo: CustomerInfo;
  products: Product[];
  totalAmount: number;
  paymentStatus: "completed" | "pending";
  paymentMethod: string;
  timestamp: string;
  sessionId?: string;
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await fetch("/api/purchases");
        const data = await response.json();
        setPurchases(data);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Purchases List</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Purchases List</h1>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Product Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases.map((purchase) => (
              <TableRow key={purchase.orderId}>
                <TableCell className="font-medium">
                  {purchase.orderId}
                </TableCell>
                <TableCell>{purchase.customerInfo.name}</TableCell>
                <TableCell>${purchase.totalAmount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      purchase.paymentStatus === "completed"
                        ? "success"
                        : "destructive"
                    }
                  >
                    {purchase.paymentStatus === "completed"
                      ? "Paid"
                      : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(purchase.timestamp).toLocaleDateString("en-US")}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        View Products
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-4">
                          <div className="font-medium">
                            Customer Information:
                          </div>
                          <div className="text-sm grid grid-cols-2 gap-2">
                            <div>Name: {purchase.customerInfo.name}</div>
                            <div>City: {purchase.customerInfo.city}</div>
                            <div>Phone: {purchase.customerInfo.phone}</div>
                            <div>
                              Postal Code: {purchase.customerInfo.postalCode}
                            </div>
                          </div>
                          <div>Address: {purchase.customerInfo.address}</div>
                        </div>
                        <div className="space-y-4">
                          <div className="font-medium">Products:</div>
                          <div className="space-y-2">
                            {purchase.products.map((product) => (
                              <div
                                key={product.id}
                                className="flex justify-between items-center text-sm"
                              >
                                <span>{product.title}</span>
                                <div className="text-muted-foreground">
                                  <span>{product.quantity} units</span>
                                  <span className="mx-2">×</span>
                                  <span>${product.price.toLocaleString()}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between items-center font-medium pt-4 border-t">
                            <span>Total:</span>
                            <span>
                              ${purchase.totalAmount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
