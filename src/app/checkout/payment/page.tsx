"use client"
import { useRouter } from 'next/navigation';
import PaymentForm from "@/components/store/checkout/payment/PaymentForm";
import CheckoutLayout from "../CheckoutLayout";
import { Button } from "@/components/ui/button";

export default function Payment() {
  const router = useRouter();
  const currentStep = 2;
  const totalSteps = 3;

  const handleContinue = () => {
    router.push('/checkout/review');
  };

  const handleBack = () => {
    router.push('/checkout/shipping');
  };

  return (
    <CheckoutLayout step={currentStep} totalSteps={totalSteps}>
      <h2 className="text-2xl font-bold">Payment Information</h2>
      <p className="text-muted-foreground">
        Please enter your payment details below.
      </p>
      <PaymentForm />
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleBack}>Back</Button>
        <Button onClick={handleContinue}>Continue</Button>
      </div>
    </CheckoutLayout>
  );
}
