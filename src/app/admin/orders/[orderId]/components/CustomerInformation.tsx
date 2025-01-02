import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KotekOrder } from "@/types/types";
import { User, Mail, Phone } from "lucide-react";

export default function CustomerInformation({ order }: { order: KotekOrder }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" strokeWidth={1.5} />
          Customer Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />

            {order.user?.name || "Guest Customer"}
          </p>
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />

            {order.user?.email || "No email provided"}
          </p>
          <div className="">
            <p className="flex items-center gap-2">
              <Phone
                className="h-4 w-4 text-muted-foreground"
                strokeWidth={1.5}
              />

              {(order.address || order.guestAddress)?.phoneNumber ||
                "No phone number"}
            </p>
            {(order.address || order.guestAddress)?.secondPhoneNumber && (
              <p className="text-muted-foreground text-sm ml-6 mt-1">
                Secondary:
                {(order.address || order.guestAddress)?.secondPhoneNumber}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
