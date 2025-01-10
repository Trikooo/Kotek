"use client";

import { useRouter } from "next/navigation";
import ShippingReview from "@/components/store/checkout/review/ShippingReview";
import CheckoutLayout from "../CheckoutLayout";
import PaymentReview from "@/components/store/checkout/review/PaymentReview";
import { Button } from "@/components/ui/button";
import { useKotekOrder } from "@/context/KotekOrderContext";
import { useState } from "react";

import { useKotekOrderRequest } from "@/hooks/orders/useKotekOrder";
import { useAddress } from "@/context/AddressContext";
import { useEmptyCart } from "@/hooks/cart/useCart";
import { useCart } from "@/context/CartContext";
import { OrderSuccessModal } from "@/components/store/checkout/review/OrderSuccessModal";
import { Address } from "@/types/types";
import { toast } from "@/hooks/use-toast";
import { AlertCircle, Loader2 } from "lucide-react";

export default function Review() {
  const router = useRouter();
  const currentStep = 2;
  const { kotekOrder } = useKotekOrder();
  const { handleCreateKotekOrder } = useKotekOrderRequest();
  const { addresses, selectedAddress, setSelectedAddress } = useAddress();
  const { handleEmptyCart } = useEmptyCart();
  const { cart, setCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleBack = () => {
    router.push("/checkout/shipping");
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);

    try {
      if (!selectedAddress) {
        toast({
          title: (
            <>
              <AlertCircle className="w-5 h-5" strokeWidth={1.5} />
              No address selected, please go back.
            </>
          ),
          variant: "destructive",
        });
        return;
      }
      const createdOrder = await handleCreateKotekOrder(
        kotekOrder,
        kotekOrder.userId
      );
      if (kotekOrder.userId && cart) {
        try {
          await handleEmptyCart(kotekOrder.userId);
          setCart({ ...cart, items: [] });
        } catch (error) {
          console.error("error emptying cart.");
        }
      } else {
        if (cart) {
          localStorage.removeItem("guestCart");
          setCart({ ...cart, items: [] });
        }
      }

      setIsSuccessModalOpen(true);
    } catch (error) {
      toast({
        title: (
          <>
            <AlertCircle className="w-5 h-5" strokeWidth={1.5} />
            Uh oh, there was a problem
          </>
        ),
        description: "Failed to place your order, please try again.",
        variant: "destructive",
      });
      console.error("Order placement error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    router.push("/"); // Navigate to home page or order confirmation page
    setSelectedAddress(null);
  };

  return (
    <CheckoutLayout step={currentStep}>
      <div className="grid lg:grid-cols-1 gap-6 mb-6">
        <ShippingReview />
        <PaymentReview />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleBack} disabled={isLoading}>
          Back
        </Button>
        <Button
          onClick={handlePlaceOrder}
          disabled={isLoading || !selectedAddress}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2 justify-center">
              <Loader2 className="animate-spin w-4 h-4" strokeWidth={1.5} />
              <span>Placing Order...</span>
            </div>
          ) : (
            "Place Order"
          )}
        </Button>
      </div>
      <OrderSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseSuccessModal}
      />
    </CheckoutLayout>
  );
}
