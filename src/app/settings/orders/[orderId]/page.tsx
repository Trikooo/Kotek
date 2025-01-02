"use client";

import {
  ArrowLeft,
  CalendarIcon,
  Copy,
  Check,
  User,
  MapPin,
  Phone,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SettingsLayout from "../../SettingsLayout";
import { useParams } from "next/navigation";
import { useGetKotekOrderById } from "@/hooks/orders/useKotekOrder";
import { formatCurrency } from "@/utils/generalUtils";
import { FaTruck, FaCopy } from "react-icons/fa";
import ErrorComponent from "@/components/error/error";

export default function OrderDetails() {
  const { orderId } = useParams();
  const orderIdString = Array.isArray(orderId) ? orderId[0] : orderId;

  const { order, loading, error } = useGetKotekOrderById(orderIdString);
  const [isCopied, setIsCopied] = useState(false);
  const address = order?.address;

  if (error) {
    return (
      <SettingsLayout>
        <ErrorComponent />
      </SettingsLayout>
    );
  }

  const copyOrderIdToClipboard = () => {
    if (order) {
      navigator.clipboard.writeText(order.id || "");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (order && address)
    return (
      <SettingsLayout>
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between px-6 py-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold">
                  Order ID
                  <span className="hidden lg:inline">
                    : {order.id || "N/A"}
                  </span>
                </h1>

                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={copyOrderIdToClipboard}
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 transition-all duration-200 ease-in-out bg-transparent hover:bg-gray-50/50"
                      >
                        <div className="relative w-4 h-4">
                          <Copy
                            strokeWidth={1.5}
                            className={`absolute inset-0 transition-all duration-200 w-4 h-4 ${
                              isCopied
                                ? "opacity-0 scale-50"
                                : "opacity-100 scale-100"
                            }`}
                          />
                          <Check
                            strokeWidth={1.5}
                            className={`absolute inset-0 text-green-700 transition-all duration-2 w-4 h-4 ${
                              isCopied
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-50"
                            }`}
                          />
                        </div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy ID</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center text-sm text-muted-foreground mt-2">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {order.createdAt?.split("T")[0] || "Unknown Date"}
                <span className="inline-flex items-center ml-2">
                  <div
                    className={`w-2 h-2 mr-2 rounded-full ${
                      order.status === "CANCELLED"
                        ? "bg-red-500"
                        : order.status === "DELIVERED"
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }`}
                  />
                  {order.status === "PENDING" && "Order Received"}
                  {order.status === "PROCESSING" && "Order Approved"}
                  {order.status === "DISPATCHED" && "Order Shipped"}
                  {order.status === "DELIVERED" && "Order Delivered"}
                  {order.status === "CANCELLED" && "Order Cancelled"}
                </span>
              </div>
            </div>

            <Button variant="link" asChild className="gap-1">
              <Link href="/settings/orders">
                <ArrowLeft className="w-4 h-4" />
                Back to Orders
              </Link>
            </Button>
          </header>

          <div className="px-6 py-6 space-y-8">
            {/* Items Section */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between"
                  >
                    <div className="flex gap-4">
                      {item.product?.imageUrls?.[0] ? (
                        <Image
                          src={item.product.imageUrls[0]}
                          alt={item.product.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-muted/50" />
                      )}
                      <div>
                        <h3 className="font-medium">
                          {item.product?.name || "Product"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">{formatCurrency(item.price)}</p>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between pt-2">
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-semibold">
                    {formatCurrency(order.totalAmount)}
                  </p>
                </div>
              </div>
            </section>

            {/* Shipping Section */}
            <section>
              <h3 className="font-semibold text-xl mb-3"> Shipping Address</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{address.fullName}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div className="text-sm space-y-1">
                    <p>{address.address}</p>
                    <p>
                      {address.commune}, {address.wilayaLabel}
                    </p>
                    <p>Algeria</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{address.phoneNumber}</span>
                  </div>
                  {address.secondPhoneNumber && (
                    <div className="flex items-center gap-2 pl-6">
                      <span className="text-sm text-muted-foreground">
                        Secondary: {address.secondPhoneNumber}
                      </span>
                    </div>
                  )}
                </div>
                {address.stopDesk && (
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Stop Desk Station: {address.stationName}
                    </span>
                  </div>
                )}
              </div>
            </section>
            {/* Tracking Section */}
            <section>
              <h3 className="text-xl font-semibold mb-3">Order Status</h3>
              {order.status === "CANCELLED" ? (
                <div className="text-red-500 font-medium">
                  This order has been cancelled.
                </div>
              ) : (
                <div className="space-y-4">
                  {["PENDING", "PROCESSING", "DISPATCHED", "DELIVERED"].map(
                    (status, index) => (
                      <div key={status} className="flex gap-4">
                        <div className="relative flex items-center justify-center w-4">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              index <=
                              [
                                "PENDING",
                                "PROCESSING",
                                "DISPATCHED",
                                "DELIVERED",
                              ].indexOf(order.status)
                                ? "bg-green-500"
                                : "bg-muted"
                            } ring-4 ${
                              index <=
                              [
                                "PENDING",
                                "PROCESSING",
                                "DISPATCHED",
                                "DELIVERED",
                              ].indexOf(order.status)
                                ? "ring-green-50"
                                : "ring-muted/20"
                            }`}
                          />
                          {index < 3 && (
                            <div className="absolute w-px h-full bg-muted-foreground/20 top-5" />
                          )}
                        </div>
                        <div>
                          <div
                            className={`font-medium ${
                              status === order.status ? "text-green-500" : ""
                            }`}
                          >
                            {status === "PENDING" && "Order Received"}
                            {status === "PROCESSING" && "Order Approved"}
                            {status === "DISPATCHED" && "Order Shipped"}
                            {status === "DELIVERED" && "Order Delivered"}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {status === "PENDING" &&
                              "Your order is being reviewed for processing."}
                            {status === "PROCESSING" &&
                              "Your order has been approved and is being prepared."}
                            {status === "DISPATCHED" &&
                              "Your order has arrived at shipping facility."}
                            {status === "DELIVERED" &&
                              "Your order has been successfully delivered."}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </SettingsLayout>
    );
}
