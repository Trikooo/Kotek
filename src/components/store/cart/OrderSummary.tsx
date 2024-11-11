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
import { useCreateOrUpdateCart } from "@/hooks/cart/useCart";

interface OrderSummaryProps {
  className?: string;
}

export default function OrderSummary({ className }: OrderSummaryProps) {
  const { cart } = useCart();
  const { loading } = useCreateOrUpdateCart();
  const router = useRouter();

  // Calculate subtotal by summing up each item's price * quantity
  const subtotal =
    cart?.items.reduce((acc, item) => acc + item.price * item.quantity, 0) ?? 0;

  // Example flat rate shipping fee
  const shipping = 50; // Adjust as needed

  // Total is subtotal + shipping
  const total = subtotal + shipping;

  const handleProceed = () => {
    router.push("/checkout/shipping");
  };

  return (
    <Card
      className={`${className} shadow-none bg-gray-50 border-none transition-opacity ${
        loading ? "opacity-50" : "opacity-100"
      }`}
    >
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{subtotal} DA</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping} DA</span>
        </div>
        <Separator />
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>{total} DA</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-indigo-600 hover:bg-indigo-500"
          onClick={handleProceed}
          disabled={loading}
        >
          {loading ? "Loading..." : "Proceed to Checkout"}
        </Button>
      </CardFooter>
    </Card>
  );
}
