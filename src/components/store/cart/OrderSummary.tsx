"use client"
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Import the variables from the CartItem component file
import { cartItems, subtotal, discounts, fees, total } from "./CartItemCard"; // adjust the path

export default function OrderSummary() {
  const router = useRouter();

  const handleProceed = () => {
    router.push('/checkout/shipping');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Discounts</span>
          <span>-${discounts.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Fees</span>
          <span>+${fees.toFixed(2)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-indigo-600 hover:bg-indigo-500" onClick={handleProceed}>
          Proceed to Checkout
        </Button>
      </CardFooter>
    </Card>
  );
}
