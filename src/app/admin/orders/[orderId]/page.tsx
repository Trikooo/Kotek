"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";
import { Check, Home, Mail, MapPin, Phone, User } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useKotekOrder } from "@/context/KotekOrderContext";
import AdminLayout from "../../AdminLayout";
import { formatCurrency } from "@/utils/generalUtils";
import OrderDetailsSkeletonPage from "./OrderDetailsSkeleton";
import ErrorComponent from "@/components/error/error";
import { ConfirmDelete } from "./ConfirmDelete";
import { NoestOrderForm } from "@/types/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useNoestOrderCreation } from "@/hooks/orders/useCreateNoestOrder";
import { getStatusColor, getStatusVariant } from "./AdminOrderUtils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useKotekOrderRequest } from "@/hooks/orders/useKotekOrder";
import { useSession } from "next-auth/react";
import { AxiosError } from "axios";

export default function OrderDetailsPage() {
  const router = useRouter();
  const { orderId } = useParams();
  const [isCreateOrderDialogOpen, setIsCreateOrderDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { handleDeleteKotekOrder } = useKotekOrderRequest();
  const {
    allKotekOrders,
    allKotekOrdersLoading,
    setAllKotekOrders,
    allKotekOrdersError,
  } = useKotekOrder();

  const {
    createNoestOrder,
    isLoading: isNoestOrderLoading,
    error: noestOrderError,
  } = useNoestOrderCreation();

  if (allKotekOrdersLoading) {
    return <OrderDetailsSkeletonPage />;
  }

  if (allKotekOrdersError) {
    return <ErrorComponent />;
  }

  const order = allKotekOrders.find((order) => order.id === orderId);
  if (!order) {
    notFound();
  }
  const handleDeleteClick = async () => {
    setDeleteLoading(true);
    try {
      if (userId && order.id) {
        await handleDeleteKotekOrder(order.id, userId);
        toast({
          title: "Success",
          description: "Order deleted successfully.",
        });

        setIsDeleteDialogOpen(false);
        // Then update the state
        setAllKotekOrders(
          allKotekOrders.filter((order) => order.id !== orderId)
        );
        router.back();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Deletion Error",
        description:
          error instanceof AxiosError
            ? error.message
            : "An Error has occurred.",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCreateNoestOrder = async () => {
    // Prepare Noest order data from Kotek order
    const noestOrderData: Partial<NoestOrderForm> = {
      reference: order.id || null,
      client: order.address?.fullName || order.guestAddress?.fullName || "",
      phone: (order.address || order.guestAddress)?.phoneNumber || "",
      phone_2: (order.address || order.guestAddress)?.secondPhoneNumber,
      adresse: (order.address || order.guestAddress)?.address || "",
      wilaya_id: parseInt(
        (order.address || order.guestAddress)?.wilayaValue || "0",
        10
      ),
      commune: (order.address || order.guestAddress)?.commune || "",
      montant: order.totalAmount,
      produit: order.items
        .map((item) => item.product?.name || "Unknown Product")
        .join(", "),
      type_id: 1, // Default to Livraison
      poids: order.items.reduce(
        (total, item) => total + (item.product?.weight || 1),
        0
      ),
      stop_desk: (order.address || order.guestAddress)?.stopDesk ? 1 : 0,
      station_code: (order.address || order.guestAddress)?.stationCode,
      stock: 0, // Default to No stock
      can_open: 1, // Allow package opening
    };

    try {
      if (order.id) {
        const response = await createNoestOrder(noestOrderData, order.id);
        toast({
          title: "Noest Order Created",
          description: `Order created successfully with reference: ${response.reference}`,
        });
        setIsCreateOrderDialogOpen(false);
      }
      order.status = "PROCESSING";
    } catch (err) {
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred while creating the order",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold hidden lg:block">
            Order ID: {order.id}
          </h1>
          <h1 className="text-lg font-bold lg:hidden">{order.id}</h1>
        </div>

        <div className="text-sm text-muted-foreground mb-4">
          {order.createdAt
            ? format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")
            : "N/A"}
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center justify-start gap-3">
                  <div className="hidden md:block">Order Details</div>
                  <Badge
                    variant={getStatusVariant(order.status)}
                    className={getStatusColor(order.status)}
                  >
                    {order.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {order.status === "PENDING" && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            className="hover:text-green-600"
                            onClick={() => setIsCreateOrderDialogOpen(true)}
                          >
                            <Check className="h-4 w-4" strokeWidth={1.5} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Approve and create Noest order
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {order?.id && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <ConfirmDelete
                              orderId={order.id}
                              onDelete={handleDeleteClick}
                              isLoading={deleteLoading}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete order</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                  {order.items.map((item, index) => (
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
                          Total: {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
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
                      <span>
                        {formatCurrency(
                          order.totalAmount - order.subtotalAmount
                        )}
                      </span>
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

          <div className="grid gap-6 grid-cols-1">
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
                    <User className="h-4 w-4 text-muted-foreground" />

                    {order.user?.name || "Guest Customer"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />

                    {order.user?.email || "No email provided"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />

                    {(order.address || order.guestAddress)?.phoneNumber ||
                      "No phone number"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" strokeWidth={1.5} />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.address || order.guestAddress ? (
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {(order.address || order.guestAddress)?.fullName}
                    </p>
                    <p className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      {(order.address || order.guestAddress)?.address}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {(order.address || order.guestAddress)?.commune},{" "}
                      {(order.address || order.guestAddress)?.wilayaLabel}
                    </p>
                  </div>
                ) : (
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    No shipping address provided
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Noest Order Creation Dialog */}
      <Dialog
        open={isCreateOrderDialogOpen}
        onOpenChange={setIsCreateOrderDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Noest Order</DialogTitle>
            <DialogDescription>
              Create a Noest order from this Kotek order
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <p>
              Are you sure you want to create a Noest order for this Kotek
              order?
            </p>
            {noestOrderError && (
              <div className="text-red-500 text-sm">
                Error: {noestOrderError}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateOrderDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateNoestOrder}
              disabled={isNoestOrderLoading}
            >
              {isNoestOrderLoading ? "Creating..." : "Create Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
