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
import { useEffect, useState } from "react";
import { useKotekOrder } from "@/context/KotekOrderContext";
import { ArrowRight, Info } from "lucide-react";
import { EMPTY_ADDRESS } from "@/lib/constants";
import { formatCurrency } from "@/utils/generalUtils";
import { LoginModal } from "./loginModal";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";

interface OrderSummaryProps {
  className?: string;
  inCheckout?: boolean;
}

export default function OrderSummary({
  className,
  inCheckout = false,
}: OrderSummaryProps) {
  const {
    loading: addressesLoading,
    selectedAddress,
    addresses,
  } = useAddress();
  const { kotekOrder, setKotekOrder } = useKotekOrder();
  const { cart, loading: cartLoading, subtotal } = useCart();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const calculateOrderItems = () => {
      return (
        cart?.items.map((item) => ({
          quantity: item.quantity,
          price: item.price,
          productId: item.productId,
          noestReady: false,
        })) || []
      );
    };
    const totalAmount = subtotal + kotekOrder.shippingPrice;

    setKotekOrder((prevOrder) => ({
      ...prevOrder,
      items: calculateOrderItems(),
      subtotalAmount: subtotal,
      totalAmount,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart?.items, kotekOrder.shippingPrice, setKotekOrder]);

  useEffect(() => {
    if (kotekOrder.userId) {
      setKotekOrder((prev) => ({
        ...prev,
        addressId: selectedAddress?.id,
        guestAddress: undefined,
      }));
    } else {
      setKotekOrder((prev) => ({
        ...prev,
        addressId: undefined,
        guestAddress: selectedAddress || EMPTY_ADDRESS,
      }));
    }
  }, [kotekOrder.userId, selectedAddress, setKotekOrder, addresses]);

  const handleProceed = () => {
    if (isAuthenticated) {
      router.push("/checkout/shipping");
    } else {
      setIsLoginModalOpen(true);
    }
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
    <>
      <Card className={`${className} shadow-sm bg-gray-50 border-0`}>
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ScrollArea className="mb-4">
            {cart.items.map((item, index) => {
              // Skip rendering if product details are missing
              if (!item.product) {
                console.warn(
                  "Order summary item missing product details:",
                  item
                );
                return null;
              }

              return (
                <div
                  key={index}
                  className="flex justify-between items-center mb-2 text-sm"
                >
                  <span className="font-medium">
                    {item.quantity}×{item.product.name}
                  </span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              );
            })}
          </ScrollArea>
          <Separator className="my-4" />
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(kotekOrder.subtotalAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping ≈</span>
              {!inCheckout ? (
                <span className="text-yellow-600">Proceed to calculate</span>
              ) : kotekOrder.shippingPrice > 0 ? (
                <span>{formatCurrency(kotekOrder.shippingPrice)}</span>
              ) : (
                <span className="text-yellow-600">Select a wilaya first</span>
              )}
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              {kotekOrder.shippingPrice > 0 && inCheckout ? (
                <span>{formatCurrency(kotekOrder.totalAmount)}</span>
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
          {inCheckout && (
            <span className="text-sm flex items-center justify-start gap-2 text-muted-foreground">
              <Info className="w-4 h-4" /> We will contact you if the shipping
              price changes.{" "}
            </span>
          )}
        </CardFooter>
      </Card>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
