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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

interface PurchaseItem {
  id: string;
  description: string;
  amount_total: number;
  currency: string;
  quantity: number;
}

interface Purchase {
  id: string;
  customerId: string;
  amount: number;
  currency: string;
  status: string;
  customerInfo: {
    name: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  items: PurchaseItem[];
  timestamp: string;
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/purchases");
        if (!response.ok) {
          throw new Error("Failed to fetch purchases");
        }
        const data = await response.json();
        setPurchases(data);
      } catch (err) {
        setError("Failed to load purchases");
        console.error("Error loading purchases:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Purchase History</h1>

      {purchases.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">No purchases found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {purchases.map((purchase) => (
            <Card key={purchase.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{purchase.customerInfo.name}</CardTitle>
                    <CardDescription>
                      Order ID: {purchase.id.slice(-8)}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      purchase.status === "paid" ? "success" : "destructive"
                    }
                  >
                    {purchase.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="details">
                    <AccordionTrigger>Order Details</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-semibold mb-2">
                            Customer Information
                          </h4>
                          <div className="space-y-1 text-sm">
                            <p>Email: {purchase.customerInfo.email}</p>
                            <p>Phone: {purchase.customerInfo.phone}</p>
                            <p>Address: {purchase.customerInfo.address}</p>
                            <p>City: {purchase.customerInfo.city}</p>
                            <p>
                              Postal Code: {purchase.customerInfo.postalCode}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">
                            Order Information
                          </h4>
                          <div className="space-y-1 text-sm">
                            <p>
                              Date:{" "}
                              {format(new Date(purchase.timestamp), "PPP")}
                            </p>
                            <p>Total Amount: ${purchase.amount.toFixed(2)}</p>
                            <p>Currency: {purchase.currency.toUpperCase()}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 overflow-x-auto">
                        <h4 className="font-semibold mb-2">Items</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product</TableHead>
                              <TableHead className="text-right">
                                Quantity
                              </TableHead>
                              <TableHead className="text-right">
                                Price
                              </TableHead>
                              <TableHead className="text-right">
                                Total
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {purchase.items.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className="max-w-[300px] truncate">
                                  {item.description}
                                </TableCell>
                                <TableCell className="text-right">
                                  {item.quantity}
                                </TableCell>
                                <TableCell className="text-right">
                                  $
                                  {(
                                    item.amount_total /
                                    100 /
                                    item.quantity
                                  ).toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right">
                                  ${(item.amount_total / 100).toFixed(2)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
