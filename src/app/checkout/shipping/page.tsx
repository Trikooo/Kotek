"use client";
import Image from "next/image";
import ShippingForm from "@/components/store/checkout/shipping/ShippingForm";
import CheckoutLayout from "../CheckoutLayout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";

export default function Shipping() {
  // Define the current step and total steps
  const currentStep = 1;
  const totalSteps = 3;
  const router = useRouter();
  const handleContinue = () => {
    router.push("/checkout/payment");
  };

  return (
    <CheckoutLayout step={currentStep} totalSteps={totalSteps}>
      <h2 className="text-2xl font-bold">Shipping Information</h2>
      <p className="text-muted-foreground mb-4">
        Please enter your shipping details below.
      </p>
      <ShippingForm />
      <div className="flex justify-end mt-6">
        <Button onClick={handleContinue}>Continue</Button>
      </div>
    </CheckoutLayout>
  );
}
