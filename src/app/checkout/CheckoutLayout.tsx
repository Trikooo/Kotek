import React from "react";
import { Progress } from "@/components/ui/progress";
import StoreLayout from "../store/StoreLayout";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface CheckoutLayoutProps {
  children: React.ReactNode;
  step: number; // The current step
  totalSteps: number; // Total number of steps
}

const CheckoutLayout: React.FC<CheckoutLayoutProps> = ({ children, step, totalSteps }) => {
  const progressValue = (step / totalSteps) * 100;

  const getStepDescription = (step: number) => {
    switch (step) {
      case 1:
        return "Shipping";
      case 2:
        return "Payment";
      case 3:
        return "Review";
      default:
        return "Step";
    }
  };

  return (
    <StoreLayout>
      <div className="w-full mx-auto py-12 md:py-16 grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Progress value={progressValue} parts={totalSteps} className="flex-1" />
            <div className="text-sm font-medium text-muted-foreground">
              Step {step}: {getStepDescription(step)}
            </div>
          </div>
          <div className="space-y-4">
            {children}
          </div>
        </div>
        <div className="bg-muted/20 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-bold">Order Summary</h3>
          <div className="grid gap-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>$99.99</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>$5.99</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>$8.00</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>$113.98</span>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}

export default CheckoutLayout;
