"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAddress } from "@/context/AddressContext";
import { OrderSummarySkeleton } from "./CartSkeleton";
import { useEffect } from "react";

interface OrderSummaryProps {
  className?: string;
  inCheckout?: boolean;
}

export default function OrderSummary({
  className,
  inCheckout = false,
}: OrderSummaryProps) {
  const { selectedAddress, loading: addressesLoading } = useAddress();
  const { cart, loading: cartLoading } = useCart();
  const router = useRouter();

  const subtotal =
    cart?.items.reduce((acc, item) => acc + item.price * item.quantity, 0) ?? 0;
  const total = subtotal + (selectedAddress.shippingPrice ?? 0);

  const handleProceed = () => {
    router.push("/checkout/shipping");
  };
  useEffect(() => {
    console.log(selectedAddress.shippingPrice);
  }, [selectedAddress.shippingPrice]);

  if (cartLoading || addressesLoading) {
    return <OrderSummarySkeleton />;
  }

  return (
    <Card className={`${className} shadow-sm bg-gray-50 border-0`}>
      <CardHeader className="border-b">
        <CardTitle className="text-2xl font-bold">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ScrollArea className="mb-4">
          {cart?.items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center mb-2 text-sm"
            >
              <span className="font-medium">
                {item.quantity}× {item.product.name}
              </span>
              <span>{item.price * item.quantity} DA</span>
            </div>
          ))}
        </ScrollArea>
        <Separator className="my-4" />
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{subtotal} DA</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            {!inCheckout ? (
              <span className="text-yellow-600">Proceed to calculate</span>
            ) : selectedAddress.shippingPrice !== 0 ? (
              <span>{selectedAddress.shippingPrice} DA</span>
            ) : (
              <span className="text-yellow-600">Select a wilaya first</span>
            )}
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            {selectedAddress.shippingPrice !== 0 ? (
              <span>{total} DA</span>
            ) : (
              <span>--</span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6">
        {!inCheckout && (
          <Button
            className="w-full text-white font-semibold py-2 px-4 rounded transition duration-200"
            onClick={handleProceed}
          >
            Proceed to Checkout
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
