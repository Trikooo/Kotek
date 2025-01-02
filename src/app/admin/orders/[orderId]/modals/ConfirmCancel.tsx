"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, Ban } from "lucide-react";
import { useRouter } from "next/navigation";
import { useKotekOrder } from "@/context/KotekOrderContext";
import { toast } from "@/hooks/use-toast";

import { AxiosError } from "axios";
import { useCancelOrder } from "@/hooks/orders/noest/useNoestOrders";
import { KotekOrder } from "@/types/types";

interface ConfirmCancelProps {
  orderId: string;
}

export function ConfirmCancel({ orderId }: ConfirmCancelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { allKotekOrders, setAllKotekOrders } = useKotekOrder();
  const cancelOrderMutation = useCancelOrder();

  const orderToCancel = allKotekOrders.find((order) => order.id === orderId);

  const handleCancelClick = async () => {
    if (!orderToCancel) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Order not found",
      });
      return;
    }

    try {
      const result = await cancelOrderMutation.mutateAsync(orderToCancel);

      if (result.failedAt) {
        toast({
          variant: "destructive",
          title: "Partial Cancellation",
          description: `Failed to delete Noest order ${result.failedAt}. ${result.deletedCount} orders were deleted before failure. Reason: ${result.failureReason}`,
        });
      } else {
        toast({
          title: "Success",
          description: `Order cancelled successfully. ${result.deletedCount} Noest orders were deleted.`,
        });

        setIsOpen(false);
        setAllKotekOrders([
          ...allKotekOrders.filter((o) => o.id !== orderId),
          result.order as unknown as KotekOrder,
        ]);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Cancellation Error",
        description:
          error instanceof AxiosError
            ? error.response?.data?.message || error.message
            : "An unexpected error occurred while cancelling the order.",
      });
    }
  };

  return (
    <AlertDialog
      open={isOpen || cancelOrderMutation.isPending}
      onOpenChange={setIsOpen}
    >
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="text-red-600 hover:text-red-500">
          <Ban className="h-4 w-4" strokeWidth={1.5} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Cancelling an order will delete all its associated Noest orders.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancelClick}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={cancelOrderMutation.isPending}
          >
            {cancelOrderMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              "Cancel Order"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
