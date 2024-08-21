import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export default function PaymentReview() {
  return(
    <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" strokeWidth={1.5} />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Visa ending in 1234</p>
            <p>Expires 12/2025</p>
          </CardContent>
        </Card>
  )
};
