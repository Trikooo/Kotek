"use client"
import { useRouter } from "next/navigation";
import ShippingReview from "@/components/store/checkout/review/ShippingReview";
import CheckoutLayout from "../CheckoutLayout";
import PaymentReview from "@/components/store/checkout/review/PaymentReview";
import { Button } from "@/components/ui/button";

export default function Review() {
  const router = useRouter(); // Using the useRouter hook from next/navigation
  const currentStep = 2;


  const handleBack = () => {
    router.push("/checkout/shipping"); // Navigate to the previous step
  };

  const handleContinue = () => {
    router.push("/"); // Navigate to the next step
  };

  return (
    <CheckoutLayout step={currentStep}>
      <div className="grid lg:grid-cols-1 gap-6 mb-6">
        <ShippingReview />
        <PaymentReview />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleBack}>Back</Button>
        <Button onClick={handleContinue}>Place Order</Button>
      </div>
    </CheckoutLayout>
  );
}
