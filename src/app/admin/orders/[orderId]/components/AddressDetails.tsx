import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { KotekOrder } from "@/types/types";
import { MapPin, User, Home, Truck } from "lucide-react";
import { EditAddress } from "../modals/EditAddress";
import { useKotekOrder } from "@/context/KotekOrderContext";

export default function AddressDetails({ order }: { order: KotekOrder }) {
  const { allKotekOrders, setAllKotekOrders } = useKotekOrder();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <div className="flex items-center justify-start">
            <MapPin className="h-5 w-5 mr-2" strokeWidth={1.5} />
            Shipping Address
          </div>

          {order.status === "PENDING" && (
            <EditAddress
              order={order}
              onAddressUpdate={(updatedAddress) => {
                // Update the order with the new address
                const updatedOrder = {
                  ...order,
                  address: updatedAddress,
                };
                setAllKotekOrders(
                  allKotekOrders.map((o) =>
                    o.id === updatedOrder.id ? updatedOrder : o
                  )
                );
              }}
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {order.address || order.guestAddress ? (
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <User
                className="h-4 w-4 text-muted-foreground"
                strokeWidth={1.5}
              />
              {(order.address || order.guestAddress)?.fullName}
            </p>
            <p className="flex items-center gap-2">
              <Home
                className="h-4 w-4 text-muted-foreground"
                strokeWidth={1.5}
              />
              {(order.address || order.guestAddress)?.address}
            </p>
            <p className="flex items-center gap-2">
              <MapPin
                className="h-4 w-4 text-muted-foreground"
                strokeWidth={1.5}
              />
              {(order.address || order.guestAddress)?.commune},{" "}
              {(order.address || order.guestAddress)?.wilayaLabel}
            </p>
            {(order.address || order.guestAddress)?.stopDesk && (
              <p className="flex items-center gap-2">
                <Truck
                  className="h-4 w-4 text-muted-foreground"
                  strokeWidth={1.5}
                />
                Station: {(order.address || order.guestAddress)?.stationName}
              </p>
            )}
          </div>
        ) : (
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            No shipping address provided
          </p>
        )}
      </CardContent>
    </Card>
  );
}
