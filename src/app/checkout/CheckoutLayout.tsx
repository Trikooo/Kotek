import React from "react";
import { Progress } from "@/components/ui/progress";
import StoreLayout from "../store/StoreLayout";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Truck } from "lucide-react";

interface CheckoutLayoutProps {
  children: React.ReactNode;
  step: number;
}

const CheckoutLayout: React.FC<CheckoutLayoutProps> = ({ children, step }) => {
  const progressValue = (step / 2) * 100;

  const getStepDescription = (step: number) => {
    switch (step) {
      case 1:
        return "Shipping";
      case 2:
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
            <Progress value={progressValue} parts={2} className="flex-1" />
            <div className="text-sm font-medium text-muted-foreground">
              Step {step}: {getStepDescription(step)}
            </div>
          </div>
          <div className="space-y-4">{children}</div>
        </div>
        <div className="space-y-6">
          <Card className="shadow-none bg-gray-50 border-none">
            <CardContent className="p-6 space-y-6">
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
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-bold mb-4">Shipping Provider</h3>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Image
                    src="/noest.png"
                    alt="Noest Express logo"
                    width={80}
                    height={40}
                    className="h-auto"
                  />
                </div>
                <div className="flex-grow">
                  <h4 className="text-sm font-semibold">Noest Express</h4>
                  <p className="text-sm text-muted-foreground">
                    Standard Delivery
                  </p>
                </div>
                <div className="flex-shrink-0 hover:bg-indigo-50 p-2 px-4 rounded-md transition-colors duration-200">
                  <Truck
                    className="h-6 w-6 text-muted-foreground"
                    strokeWidth="1.5"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </StoreLayout>
  );
};

export default CheckoutLayout;
