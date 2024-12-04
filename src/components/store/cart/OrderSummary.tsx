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
import { useKotekOrder } from "@/context/KotekOrderContext";
import { ArrowBigRight, ArrowRight } from "lucide-react";

interface OrderSummaryProps {
  className?: string;
  inCheckout?: boolean;
}

export default function OrderSummary({
  className,
  inCheckout = false,
}: OrderSummaryProps) {
  const { selectedAddress, loading: addressesLoading } = useAddress();
  const { kotekOrder, setKotekOrder } = useKotekOrder();
  const { cart, loading: cartLoading } = useCart();

  const router = useRouter();
  useEffect(() => {
    const calculateOrderItems = () => {
      return (
        cart?.items.map((item) => ({
          quantity: item.quantity,
          price: item.price,
          productId: item.productId,
        })) || []
      );
    };

    const calculateSubtotal = () => {
      return (
        cart?.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ) ?? 0
      );
    };

    const subtotal = calculateSubtotal();
    const shippingPrice = selectedAddress.shippingPrice ?? 0;
    const totalAmount = subtotal + shippingPrice;

    setKotekOrder((prevOrder) => ({
      ...prevOrder,
      items: calculateOrderItems(),
      subtotalAmount: subtotal,
      totalAmount,
    }));
  }, [cart?.items, selectedAddress, setKotekOrder]);

  useEffect(() => {
    if (kotekOrder.userId) {
      setKotekOrder((prev) => ({
        ...prev,
        addressId: selectedAddress.id,
        guestAddress: undefined,
      }));
    } else {
      setKotekOrder((prev) => ({
        ...prev,
        addressId: undefined,
        guestAddress: selectedAddress,
      }));
    }
  }, [kotekOrder.userId, selectedAddress, setKotekOrder]);

  const handleProceed = () => {
    router.push("/checkout/shipping");
  };

  if (cartLoading || addressesLoading) {
    return <OrderSummarySkeleton />;
  }

  // Check if cart is empty
  if (!cart || cart.items.length === 0) {
    return (
      <Card className={`${className} shadow-sm bg-gray-50 border-0`}>
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-center text-gray-600">
            Your cart is empty. Add some items to get started!
          </p>
        </CardContent>
        <CardFooter className="p-6">
          <Button
            className="w-full text-white font-semibold py-2 px-4 rounded transition duration-200 gap-2 flex"
            onClick={() => router.push("/")}
          >
            Continue Shopping{" "}
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className={`${className} shadow-sm bg-gray-50 border-0`}>
      <CardHeader className="border-b">
        <CardTitle className="text-2xl font-bold">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ScrollArea className="mb-4">
          {cart.items.map((item, index) => (
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
            <span>{kotekOrder.subtotalAmount} DA</span>
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
            {selectedAddress.shippingPrice !== 0 && inCheckout ? (
              <span>{kotekOrder.totalAmount} DA</span>
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
