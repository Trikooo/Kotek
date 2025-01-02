import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusChangeModal } from "../modals/StatusChangeModal";
import { formatCurrency } from "@/utils/generalUtils";
import { ConfirmCancel } from "../modals/ConfirmCancel";
import { EditOrder } from "../modals/EditOrder";
import NoestModal from "../modals/NoestModal";
import { SplitOrderModal } from "../modals/SplitOrderModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { KotekOrder } from "@/types/types";
import { useKotekOrder } from "@/context/KotekOrderContext";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, getStatusVariant } from "../utils/AdminOrderUtils";
import { Printer } from "lucide-react";
import { Order, OrderStatus } from "@prisma/client";
import { useGetOrderLabels } from "@/hooks/orders/noest/useNoestOrders";
import DispatchAllModal from "../modals/DispatchAll";

export default function OrderDetails({ order }: { order: KotekOrder }) {
  const { allKotekOrders, setAllKotekOrders } = useKotekOrder();

  // Group items by tracking number
  const groupedItems = order.items.reduce((acc, item) => {
    const trackingNumber = item.tracking?.trackingNumber || "no-tracking";
    if (!acc[trackingNumber]) {
      acc[trackingNumber] = {
        items: [],
        status: item.tracking?.trackingStatus || "NO_TRACKING",
      };
    }
    acc[trackingNumber].items.push(item);
    return acc;
  }, {} as Record<string, { items: typeof order.items; status: string }>);
  const labels = useGetOrderLabels(
    Object.keys(groupedItems).filter((tracking) => tracking !== "no-tracking")
  );
  const handlePrintLabel = (trackingNumber: string) => {
    const label = labels.find(
      (label) =>
        label.isSuccess && label.data?.trackingNumber === trackingNumber
    );

    if (label?.data) {
      const blobUrl = URL.createObjectURL(label.data.data);
      window.open(blobUrl); // open pdf in a new page
    } else {
      console.error("Label not found or still loading");
    }
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center justify-start gap-3">
            <div className="hidden md:block">Order Details</div>
            {order.id && (
              <StatusChangeModal
                currentStatus={order.status}
                orderId={order.id}
                onStatusChange={(newStatus: any) => {
                  setAllKotekOrders(
                    allKotekOrders.map((o) =>
                      o.id === order.id ? { ...o, status: newStatus } : o
                    )
                  );
                }}
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              {order.status === "PROCESSING" && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <DispatchAllModal
                        order={order}
                        onOrderUpdate={(newOrder) => {
                          setAllKotekOrders([
                            ...allKotekOrders.filter((o) => o.id !== order.id),
                            newOrder,
                          ]);
                        }}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Dispatch all</TooltipContent>
                </Tooltip>
              )}

              {order.status === "PENDING" && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <NoestModal
                          order={order}
                          onOrderUpdate={(newOrder) => {
                            setAllKotekOrders([
                              ...allKotekOrders.filter(
                                (o) => o.id !== order.id
                              ),
                              newOrder,
                            ]);
                          }}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      Approve and create Noest order
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <SplitOrderModal
                          order={order}
                          onOrderSplit={(newOrder: KotekOrder) => {
                            setAllKotekOrders([
                              ...allKotekOrders.filter(
                                (o) => o.id !== order.id
                              ),
                              newOrder,
                            ]);
                          }}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Split order</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <EditOrder
                          order={order}
                          onOrderUpdate={(updatedOrder) => {
                            setAllKotekOrders(
                              allKotekOrders.map((o) =>
                                o.id === updatedOrder.id ? updatedOrder : o
                              )
                            );
                          }}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit order</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              )}

              {order?.id &&
                order?.status !== "CANCELLED" &&
                order?.status !== "DELIVERED" && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <ConfirmCancel orderId={order.id} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Cancel order</p>
                    </TooltipContent>
                  </Tooltip>
                )}
            </TooltipProvider>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Order Items</h3>
            {Object.entries(groupedItems).map(
              ([trackingNumber, group], groupIndex) => (
                <div key={trackingNumber} className="mb-4">
                  {trackingNumber !== "no-tracking" ? (
                    <Card className="shadow-none">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <Badge
                            variant={getStatusVariant(
                              group.status as OrderStatus
                            )}
                            className={getStatusColor(
                              group.status as OrderStatus
                            )}
                          >
                            {group.status}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={() => handlePrintLabel(trackingNumber)}
                          >
                            <Printer className="h-4 w-4" strokeWidth={1.5} />
                            <span className="hidden sm:block">
                              Print Shipping Label
                            </span>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {group.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 py-4 border-b last:border-b-0"
                          >
                            <div className="h-16 w-16 flex-shrink-0">
                              {item.product?.imageUrls[0] && (
                                <Image
                                  src={item.product.imageUrls[0]}
                                  alt={item.product?.name || "Product image"}
                                  width={64}
                                  height={64}
                                  className="h-full w-full object-cover rounded-md"
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">
                                {`${item.quantity}× ${item.product?.name}` ||
                                  "Unknown Product"}
                              </h4>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {formatCurrency(item.price)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Total:{" "}
                                {formatCurrency(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ) : (
                    <div>
                      {group.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 py-4 border-b last:border-b-0"
                        >
                          <div className="h-16 w-16 flex-shrink-0">
                            {item.product?.imageUrls[0] && (
                              <Image
                                src={item.product.imageUrls[0]}
                                alt={item.product?.name || "Product image"}
                                width={64}
                                height={64}
                                className="h-full w-full object-cover rounded-md"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">
                              {`${item.quantity}× ${item.product?.name}` ||
                                "Unknown Product"}
                            </h4>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {formatCurrency(item.price)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Total:{" "}
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatCurrency(order.shippingPrice)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
