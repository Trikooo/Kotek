import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";

export default function ShippingReview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" strokeWidth={1.5} />
          Shipping Address
        </CardTitle>
      </CardHeader>
      <CardContent>
        <address className="not-italic">
          Yacine Zendaoui
          <br />
          42 Boudjemaa Temime
          <br />
          Draria Algiers
          <br />
          Algeria
        </address>
      </CardContent>
    </Card>
  );
}
