"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useKotekOrderRequest } from "@/hooks/orders/useKotekOrder";
import { OrderStatus } from "@prisma/client";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, getStatusVariant } from "../utils/AdminOrderUtils";

interface StatusChangeModalProps {
  currentStatus: OrderStatus;
  orderId: string;
  onStatusChange: (newStatus: OrderStatus) => void;
}

export function StatusChangeModal({
  currentStatus,
  orderId,
  onStatusChange,
}: StatusChangeModalProps) {
  const { handleUpdateKotekOrder } = useKotekOrderRequest();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const statuses: OrderStatus[] = [
    "CANCELLED",
    "PENDING",
    "PROCESSING",
    "DISPATCHED",
    "DELIVERED",
  ];
  const currentIndex = statuses.indexOf(currentStatus);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      await handleUpdateKotekOrder(
        {
          status: newStatus,
        },
        orderId
      );
      onStatusChange(newStatus);
      setIsOpen(!open);
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="p-0 m-0 bg-transparent hover:bg-transparent w-min  h-min rounded-full"
        >
          <Badge
            variant={getStatusVariant(currentStatus)}
            className={`${getStatusColor(
              currentStatus
            )} hover:scale-110 transition-all duration-200 focus:scale-100 m-0`}
          >
            {currentStatus}
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription>
            Progress or revert state of the order.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-between items-center w-full py-5">
          <Button
            onClick={() =>
              handleStatusChange(statuses[Math.max(0, currentIndex - 1)])
            }
            disabled={currentIndex === 0 || isUpdating}
            variant="secondary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Revert
          </Button>
          <Badge
            variant={getStatusVariant(currentStatus)}
            className={getStatusColor(currentStatus)}
          >
            {currentStatus}
          </Badge>
          <Button
            onClick={() =>
              handleStatusChange(
                statuses[Math.min(statuses.length - 1, currentIndex + 1)]
              )
            }
            disabled={currentIndex === statuses.length - 1 || isUpdating}
          >
            Progress <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
