import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, HandCoins, Handshake } from "lucide-react";

export default function PaymentReview() {
  return (
    <Card className="">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Banknote className="h-5 w-5" strokeWidth={1.5} />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 rounded-full p-2">
            <Handshake className="h-6 w-6 text-primary" strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-medium">
              Cash on Delivery (Paiement à la livraison)
            </p>
            <p className="text-sm text-muted-foreground">
              Pay when you receive your order
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
